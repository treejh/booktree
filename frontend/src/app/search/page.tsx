'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

interface SearchResult {
    postId: number
    title: string
    content: string
    author: string
    createdAt: string
    viewCount: number
}

export default function SearchPage() {
    const params = useSearchParams()
    const query = params.get('q') ?? ''
    const type = params.get('type') ?? 'all'
    const [results, setResults] = useState<SearchResult[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!query.trim()) return

        const fetchResults = async () => {
            setIsLoading(true)
            setError(null)

            try {
                let url: string

                if (type === 'all') {
                    url = `http://localhost:8090/api/v1/posts/search/all?q=${encodeURIComponent(query)}&page=1&size=20`
                } else {
                    // 'content' 대신 'book' 처리
                    url = `http://localhost:8090/api/v1/posts/search?type=${type}&keyword=${encodeURIComponent(
                        query,
                    )}&page=1&size=20`
                }

                const res = await fetch(url, {
                    method: 'GET',
                    credentials: 'include',
                })
                if (!res.ok) {
                    throw new Error(`검색 요청 실패: ${res.status}`)
                }
                const page = (await res.json()) as { content: SearchResult[] }
                setResults(page.content)
            } catch (err) {
                setError(err instanceof Error ? err.message : '알 수 없는 오류')
            } finally {
                setIsLoading(false)
            }
        }

        fetchResults()
    }, [query, type])

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">
                &quot;{query}&quot;
                {type === 'all' ? ' 전체' : type === 'title' ? ' 제목' : type === 'book' ? ' 책' : ' 작성자'} 검색 결과
                ({results.length})
            </h1>

            {isLoading ? (
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
                </div>
            ) : error ? (
                <div className="text-red-500 text-center">{error}</div>
            ) : results.length === 0 ? (
                <div className="text-center text-gray-500">
                    <p>검색 결과가 없습니다.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {results.map((r) => (
                        <div
                            key={r.postId}
                            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                        >
                            <h2 className="text-xl font-semibold mb-2">{r.title}</h2>
                            <p className="text-gray-600 mb-4 line-clamp-2">{r.content}</p>
                            <div className="flex items-center text-sm text-gray-500">
                                <span>{r.author}</span>
                                <span className="mx-2">•</span>
                                <span>{new Date(r.createdAt).toLocaleDateString('ko-KR')}</span>
                                <span className="mx-2">•</span>
                                <span>조회 {r.viewCount}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
