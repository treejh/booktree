'use client'

import CategoryGrid from './components/CategoryGrid'
import Link from 'next/link'
import CategoryNav from './components/CategoryNav'
import { useEffect } from 'react'
import { useState } from 'react'

export default function Home() {
    console.log(process.env.NEXT_PUBLIC_API_BASE_URL)

    const [posts, setPosts] = useState([])

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/posts/get/top3/post`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include', // 쿠키를 포함시키기 위한 설정
                })

                if (!response.ok) {
                    throw new Error('유저 ID를 불러오는데 실패했습니다다.')
                }

                const data = await response.json()
                console.log('post : ', data)
                setPosts(data)
            } catch (err) {
                console.error('Error fetching post:', err)
            }
        }
        fetchPosts()
    }, [])

    return (
        <>
            <div className="my-2">
                <CategoryNav currentSlug="" />
            </div>
            <div className="w-full px-0 py-4">
                <div className="w-full h-96 rounded-lg overflow-hidden mb-12">
                    <img
                        src="https://images.unsplash.com/photo-1507842217343-583bb7270b66"
                        alt="도서관 이미지"
                        className="w-full h-full object-cover"
                    />
                </div>

                <section className="mb-12">
                    <h2 className="text-xl font-semibold mb-6">인기 게시물</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {posts.length > 0 ? (
                            posts.map((post) => (
                                <Link
                                    key={post.id}
                                    href={`/post/${post.id}/detail/get`}
                                    className="rounded-lg overflow-hidden shadow-sm block"
                                >
                                    <div className="relative h-48 bg-gray-200">
                                        <img
                                            src={post.imageUrl}
                                            alt={post.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="p-3 bg-white">
                                        <span className="text-xs bg-[#2E804E] text-white px-2 py-1 rounded-md">
                                            {post.mainCategory}
                                        </span>
                                        <h3 className="font-medium mt-2 text-sm">{post.title}</h3>
                                        <p className="text-xs text-gray-500 mt-1">
                                            조회수 {post.viewCount.toLocaleString()}
                                        </p>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p>인기 게시물이 없습니다.</p>
                        )}
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-6">카테고리별 월간 실기간 인기 게시물</h2>

                    <CategoryGrid />
                </section>
            </div>
        </>
    )
}
