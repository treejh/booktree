'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link' // Link 추가

interface ScrapPost {
    postId: number
    username: string
    title: string
    viewCount: number
    imageUrl?: string
    createdAt: string
    modifiedAt: string
}

interface ScrapPostsProps {
    userId: number
}

export default function ScrapPosts({ userId }: ScrapPostsProps) {
    const [scrapPosts, setScrapPosts] = useState<ScrapPost[]>([]) // 스크랩 게시글 상태
    const [currentPage, setCurrentPage] = useState(1) // 현재 페이지
    const [totalPages, setTotalPages] = useState(1) // 총 페이지 수
    const [isLoading, setIsLoading] = useState(false)

    const postsPerPage = 4 // 페이지당 게시글 수

    useEffect(() => {
        const fetchScrapPosts = async () => {
            setIsLoading(true)
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/posts/get/likePost?page=${currentPage}&size=${postsPerPage}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include', // 쿠키 포함
                    },
                )

                if (!response.ok) {
                    throw new Error('스크랩 게시글을 가져오는 데 실패했습니다.')
                }

                const data = await response.json()
                setScrapPosts(data.content) // 현재 페이지의 스크랩 게시글 저장
                setTotalPages(data.totalPages) // 총 페이지 수 저장
            } catch (err) {
                console.error('Error fetching scrap posts:', err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchScrapPosts()
    }, [currentPage])

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber)
        window.scrollTo(0, 0) // 페이지 변경 시 스크롤을 맨 위로 이동
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">스크랩 게시글</h2>
            {isLoading ? (
                <p className="text-center text-gray-500">로딩 중...</p>
            ) : scrapPosts.length === 0 ? (
                <p className="text-center text-gray-500">스크랩된 게시글이 없습니다.</p>
            ) : (
                <div className="space-y-8">
                    {scrapPosts.map((post) => (
                        <Link
                            href={`/post/${post.postId}/detail/get`} // 게시글 클릭 시 이동할 경로
                            key={post.postId}
                            className="block"
                        >
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
                                        {new Date(post.createdAt).toLocaleDateString('ko-KR').replace(/\.$/, '')}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* 페이지네이션 */}
            <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i + 1}
                        className={`px-4 py-2 border rounded ${
                            currentPage === i + 1 ? 'bg-gray-900 text-white' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => handlePageChange(i + 1)}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    )
}
