'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'

// 검색 결과 타입 정의
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
    const router = useRouter()
    const query = params.get('q') ?? ''
    const type = params.get('type') ?? 'all'

    // 검색 결과, 페이지 상태
    const [results, setResults] = useState<SearchResult[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)

    // 총 페이지 수 및 총 결과 수
    const [totalPages, setTotalPages] = useState(1)
    const [totalResults, setTotalResults] = useState(0)

    // 페이지당 표시 개수 고정
    const pageSize = 8

    useEffect(() => {
        if (!query.trim()) return

        async function fetchResults() {
            setIsLoading(true)
            setError(null)
            try {
                // API URL 구성
                const base = process.env.NEXT_PUBLIC_API_BASE_URL
                let url: string
                const commonParams = `&page=${currentPage}&size=${pageSize}`
                if (type === 'all') {
                    url = `${base}/api/v1/posts/search/all?q=${encodeURIComponent(query)}${commonParams}`
                } else {
                    url = `${base}/api/v1/posts/search?type=${type}&keyword=${encodeURIComponent(query)}${commonParams}`
                }

                const res = await fetch(url, { method: 'GET', credentials: 'include' })
                if (!res.ok) throw new Error(`검색 요청 실패: ${res.status}`)

                const page = (await res.json()) as {
                    content: SearchResult[]
                    totalPages: number
                    totalElements: number
                }

                setResults(page.content)
                setTotalPages(page.totalPages)
                setTotalResults(page.totalElements)
            } catch (err) {
                setError(err instanceof Error ? err.message : '알 수 없는 오류')
            } finally {
                setIsLoading(false)
            }
        }

        fetchResults()
    }, [query, type, currentPage])

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">
                &quot;{query}&quot;
                {type === 'all' ? ' 전체' : type === 'title' ? ' 제목' : type === 'book' ? ' 책' : ' 작성자'} 검색 결과
                <span className="ml-2 text-gray-600">(전체 {totalResults}건)</span>
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
                <>
                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6 mb-6">
                        {results.map((r) => (
                            <div
                                key={r.postId}
                                className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition"
                                onClick={() => router.push(`/post/${r.postId}/detail/get`)}
                            >
                                <div className="flex mb-2">
                                    <div className="w-24 h-32 relative flex-shrink-0">
                                        <Image
                                            src={
                                                r.imageUrl && r.imageUrl.trim() !== ''
                                                    ? r.imageUrl
                                                    : 'https://booktree-s3-bucket.s3.ap-northeast-2.amazonaws.com/BookTree+%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB+%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5+%E1%84%8E%E1%85%AC%E1%84%8C%E1%85%A9%E1%86%BC%E1%84%87%E1%85%A9%E1%86%AB.png'
                                            }
                                            alt={r.title}
                                            fill
                                            className="object-cover rounded"
                                        />
                                    </div>
                                    <div className="ml-4 flex-1">
                                        <h3 className="text-lg font-medium mb-1 truncate">{r.title}</h3>
                                        <p className="text-xs text-gray-500">조회수: {r.viewCount}</p>
                                        <p className="text-xs text-gray-500">
                                            작성일: {new Date(r.createdAt).toLocaleDateString('ko-KR')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 페이지 네비게이션을 결과 목록 하단으로 이동 */}
                    <div className="flex justify-center items-center space-x-2 mt-6">
                        {/* 첫 페이지로 이동 */}
                        <button
                            className="px-3 py-2 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-white"
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                        >
                            &lt;&lt;
                        </button>

                        {/* 이전 페이지로 이동 */}
                        <button
                            className="px-3 py-2 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-white"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            &lt;
                        </button>

                        {/* 페이지 숫자 버튼들 */}
                        {[...Array(totalPages)].map((_, i) => {
                            const pageNum = i + 1
                            // 현재 페이지 주변 5개의 페이지만 보여주기
                            if (
                                pageNum === 1 ||
                                pageNum === totalPages ||
                                (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)
                            ) {
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`px-3 py-2 rounded ${
                                            currentPage === pageNum
                                                ? 'bg-[#2E804E] text-white'
                                                : 'border hover:bg-gray-100'
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                )
                            }
                            // 줄임표 표시
                            if (pageNum === currentPage - 3 || pageNum === currentPage + 3) {
                                return (
                                    <span key={pageNum} className="px-2">
                                        ...
                                    </span>
                                )
                            }
                            return null
                        })}

                        {/* 다음 페이지로 이동 */}
                        <button
                            className="px-3 py-2 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-white"
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            &gt;
                        </button>

                        {/* 마지막 페이지로 이동 */}
                        <button
                            className="px-3 py-2 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-white"
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                        >
                            &gt;&gt;
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}
