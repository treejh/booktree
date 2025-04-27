'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface PostByCategoryResponseDto {
    postId: number
    postTitle: string
    view: number
    imageUrl?: string
    create_at: string
    update_at: string
}

export default function CategoryPage() {
    const { id: blogId, categoryId } = useParams<{ id: string; categoryId: string }>() // URL에서 blogId와 categoryId 가져오기
    const router = useRouter()

    const [posts, setPosts] = useState<PostByCategoryResponseDto[]>([]) // 카테고리 게시글 상태
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchPostsByCategory = async () => {
            setIsLoading(true)
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/categories/get/category/${categoryId}/posts`,
                )
                if (!response.ok) {
                    throw new Error('카테고리 게시글을 가져오는 데 실패했습니다.')
                }
                const data = await response.json()
                setPosts(data) // 카테고리 게시글 저장
            } catch (err) {
                setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
            } finally {
                setIsLoading(false)
            }
        }

        if (categoryId) {
            fetchPostsByCategory()
        }
    }, [categoryId])

    return (
        <div className="w-full px-8">
            <h1 className="text-3xl font-bold mb-8 mt-6">카테고리 게시글</h1>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* 게시글 리스트 */}
                <div className="flex-grow lg:w-2/3">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-semibold mb-6">최신순</h2>

                        {isLoading ? (
                            <p className="text-center text-gray-500">로딩 중...</p>
                        ) : error ? (
                            <p className="text-center text-red-500">{error}</p>
                        ) : posts.length === 0 ? (
                            <p className="text-center text-gray-500">게시글이 없습니다.</p>
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
                                                    alt={post.postTitle || '기본 이미지'}
                                                    fill
                                                    className="object-cover rounded"
                                                />
                                            </div>
                                            {/* 텍스트 섹션 */}
                                            <div>
                                                <h3 className="text-lg font-medium mb-2">{post.postTitle}</h3>
                                                <p className="text-sm text-gray-500 mb-1">조회수: {post.view}</p>
                                                <p className="text-sm text-gray-500">
                                                    작성일:{' '}
                                                    {new Date(post.create_at)
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
                </div>
            </div>
        </div>
    )
}
