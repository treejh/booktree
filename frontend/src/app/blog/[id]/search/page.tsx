'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface Post {
    postId: number
    title: string
    viewCount: number
    createdAt: string
    modifiedAt: string
    imageUrl: string
}

export default function SearchPage() {
    const { id: blogId } = useParams<{ id: string }>() // URL에서 blogId 가져오기
    const searchParams = useSearchParams()
    const query = searchParams.get('query') || '' // 검색어 가져오기
    const page = parseInt(searchParams.get('page') || '1', 10) // 현재 페이지 가져오기
    const router = useRouter()

    const [searchInput, setSearchInput] = useState(query) // 검색 입력 상태
    const [posts, setPosts] = useState<Post[]>([]) // 검색 결과 상태
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [totalPages, setTotalPages] = useState(1) // 총 페이지 수

    useEffect(() => {
        const fetchSearchResults = async () => {
            setIsLoading(true)
            try {
                const response = await fetch(
                    `${
                        process.env.NEXT_PUBLIC_API_BASE_URL
                    }/api/v1/posts/search/${blogId}/post?search=${encodeURIComponent(query)}&page=${page}&size=4`,
                )
                if (!response.ok) {
                    throw new Error('검색 결과를 가져오는 데 실패했습니다.')
                }
                const data = await response.json()
                setPosts(data.content) // 검색 결과 저장
                setTotalPages(data.totalPages) // 총 페이지 수 저장
            } catch (err) {
                setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
            } finally {
                setIsLoading(false)
            }
        }

        if (query) {
            fetchSearchResults()
        }
    }, [query, page, blogId])

    const handleSearch = () => {
        if (!searchInput.trim()) {
            alert('검색어를 입력해주세요.')
            return
        }
        // 검색 결과 페이지로 이동
        router.push(`/blog/${blogId}/search?query=${encodeURIComponent(searchInput)}&page=1`)
    }

    const handlePageChange = (newPage: number) => {
        router.push(`/blog/${blogId}/search?query=${encodeURIComponent(query)}&page=${newPage}`)
    }

    return (
        <div className="w-full">
            <h1 className="text-3xl font-bold mb-8 mt-6">검색 결과</h1>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* 검색 결과 리스트 */}
                <div className="flex-grow lg:w-2/3">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-semibold mb-6">최신순</h2>

                        {isLoading ? (
                            <p className="text-center text-gray-500">검색 중...</p>
                        ) : error ? (
                            <p className="text-center text-red-500">{error}</p>
                        ) : posts.length === 0 ? (
                            <p className="text-center text-gray-500">검색 결과가 없습니다.</p>
                        ) : (
                            <div className="grid grid-cols-1 gap-6">
                                {posts.map((post) => (
                                    <Link href={`/post/${post.postId}/detail/get`} key={post.postId} className="block">
                                        <div className="flex border border-gray-100 rounded-lg p-4 gap-4 hover:shadow-md transition-shadow cursor-pointer">
                                            {/* 이미지 섹션 */}
                                            <div className="w-24 h-32 relative flex-shrink-0">
                                                <Image
                                                    src={
                                                        post.imageUrl && post.imageUrl.trim() !== ''
                                                            ? post.imageUrl
                                                            : 'https://booktree-s3-bucket.s3.ap-northeast-2.amazonaws.com/BookTree+%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB+%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5+%E1%84%8E%E1%85%AC%E1%84%8C%E1%85%A9%E1%86%BC%E1%84%87%E1%85%A9%E1%86%AB.png'
                                                    }
                                                    alt={post.title || '기본 이미지'}
                                                    fill
                                                    className="object-cover rounded"
                                                />
                                            </div>
                                            {/* 텍스트 섹션 */}
                                            <div>
                                                <h3 className="text-lg font-medium mb-2">{post.title}</h3>
                                                <p className="text-sm text-gray-500 mb-1">조회수: {post.viewCount}</p>
                                                <p className="text-sm text-gray-500">
                                                    작성일:{' '}
                                                    {new Date(post.createdAt)
                                                        .toLocaleDateString('ko-KR')
                                                        .replace(/\.$/, '')}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 페이징 버튼 */}
                    <div className="flex justify-center mt-8">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => handlePageChange(i + 1)}
                                className={`w-10 h-10 border border-gray-200 rounded flex items-center justify-center mx-1 ${
                                    page === i + 1 ? 'bg-[#247040] text-white' : 'hover:bg-gray-100'
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 검색 컨테이너 */}
                <div className="lg:w-1/3">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-lg font-medium mb-4">게시글 검색</h2>
                        <div className="flex flex-col">
                            <input
                                type="text"
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="검색어를 입력하세요"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
                            />
                            <button
                                onClick={handleSearch}
                                className="w-full px-4 py-2 bg-[#247040] text-white rounded-md hover:bg-[#1f6034]"
                            >
                                검색
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
