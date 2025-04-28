'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
interface SearchResult {
    postId: number
    title: string
    content: string
    author: string
    createdAt: string
    viewCount: number
    imageUrl?: string
}

export default function SearchPage() {
    const params = useSearchParams()
    const router = useRouter() // ← 추가
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
                    url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/posts/search/all?q=${encodeURIComponent(
                        query,
                    )}&page=1&size=20`
                } else {
                    url = `${
                        process.env.NEXT_PUBLIC_API_BASE_URL
                    }/api/v1/posts/search?type=${type}&keyword=${encodeURIComponent(query)}&page=1&size=20`
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
                            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => router.push(`/post/${r.postId}/detail/get`)} // ← 클릭 시 이동
                        >
                            <div className="flex border border-gray-100 rounded-lg p-4 gap-4 hover:shadow-md transition-shadow cursor-pointer">
                                {/* 이미지 섹션 */}
                                <div className="w-24 h-32 relative flex-shrink-0">
                                    <Image
                                        src={
                                            r.imageUrl && r.imageUrl.trim() !== ''
                                                ? r.imageUrl
                                                : 'https://booktree-s3-bucket.s3.ap-northeast-2.amazonaws.com/BookTree+%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB+%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5+%E1%84%8E%E1%85%AC%E1%84%8C%E1%85%A9%E1%86%BC%E1%84%87%E1%85%A9%E1%86%AB.png'
                                        }
                                        alt={r.title || '기본 이미지'}
                                        fill
                                        className="object-cover rounded"
                                    />
                                </div>
                                {/* 텍스트 섹션 */}
                                <div>
                                    <h3 className="text-lg font-medium mb-2">{r.title}</h3>
                                    <p className="text-sm text-gray-500 mb-1">조회수: {r.viewCount}</p>
                                    <p className="text-sm text-gray-500">
                                        작성일: {new Date(r.createdAt).toLocaleDateString('ko-KR').replace(/\.$/, '')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
