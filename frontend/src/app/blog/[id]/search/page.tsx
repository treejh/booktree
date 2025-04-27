'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'

interface Post {
    postId: number
    title: string
    viewCount: number
    createdAt: string
    modifiedAt: string
}

export default function SearchPage() {
    const { id: blogId } = useParams<{ id: string }>() // URL에서 blogId 가져오기
    const searchParams = useSearchParams()
    const query = searchParams.get('query') || '' // 검색어 가져오기
    const router = useRouter()

    const [searchInput, setSearchInput] = useState(query) // 검색 입력 상태
    const [posts, setPosts] = useState<Post[]>([]) // 검색 결과 상태
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchSearchResults = async () => {
            setIsLoading(true)
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/search/${blogId}/post?search=${encodeURIComponent(
                        query,
                    )}&page=1&size=10`,
                )
                if (!response.ok) {
                    throw new Error('검색 결과를 가져오는 데 실패했습니다.')
                }
                const data = await response.json()
                setPosts(data.content) // 검색 결과 저장
            } catch (err) {
                setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
            } finally {
                setIsLoading(false)
            }
        }

        if (query) {
            fetchSearchResults()
        }
    }, [query, blogId])

    const handleSearch = () => {
        if (!searchInput.trim()) {
            alert('검색어를 입력해주세요.')
            return
        }
        // 검색 결과 페이지로 이동
        router.push(`/blog/${blogId}/search?query=${encodeURIComponent(searchInput)}`)
    }

    return (
        <div className="flex gap-8 max-w-8xl mx-auto px-4 py-8">
            {/* 검색 결과 */}
            <main className="flex-1">
                <h1 className="text-2xl font-bold mb-6">검색 결과</h1>
                {isLoading ? (
                    <p>검색 중...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : posts.length === 0 ? (
                    <p>검색 결과가 없습니다.</p>
                ) : (
                    <ul className="space-y-4">
                        {posts.map((post) => (
                            <li key={post.postId} className="border border-gray-200 rounded-lg p-4">
                                <h2 className="text-xl font-bold">{post.title}</h2>
                                <p className="text-gray-500">조회수: {post.viewCount}</p>
                                <p className="text-gray-500">작성일: {post.createdAt}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </main>

            {/* 검색 컨테이너 */}
            <aside className="w-64 flex-shrink-0">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-bold mb-4">게시글 검색</h2>
                    <div className="flex items-center">
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="검색어를 입력하세요"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <button
                            onClick={handleSearch}
                            className="px-4 py-2 bg-green-500 text-white rounded-r-md hover:bg-green-600"
                        >
                            검색
                        </button>
                    </div>
                </div>
            </aside>
        </div>
    )
}
