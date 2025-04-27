'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Post {
    postId: number
    title: string
    content: string
    username: string
    categoryId: number
    category: string
    viewCount: number
    createdAt: string
    imageUrl?: string
}

interface PopularPostsProps {
    blogId: string
}

export default function PopularPosts({ blogId }: PopularPostsProps) {
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)

    useEffect(() => {
        const fetchPopularPosts = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/posts/get/blog/popular/${blogId}?page=${currentPage}&size=8`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                    },
                )

                if (!response.ok) throw new Error('게시글을 불러오는데 실패했습니다.')

                const data = await response.json()
                setPosts(data.content)
                setTotalPages(data.totalPages)
            } catch (error) {
                console.error('Error fetching posts:', error)
                setError('게시글을 불러오는데 실패했습니다.')
            } finally {
                setLoading(false)
            }
        }

        fetchPopularPosts()
    }, [blogId, currentPage])

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">인기 게시글</h2>
            {loading ? (
                <p className="text-center text-gray-500">로딩 중...</p>
            ) : posts.length === 0 ? (
                <p className="text-center text-gray-500">게시글이 없습니다.</p>
            ) : (
                <div className="space-y-8">
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
