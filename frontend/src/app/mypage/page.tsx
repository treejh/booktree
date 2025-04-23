'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation' // useRouter import 추가

interface Post {
    id: number
    title: string
    date: string
    views: number
    comments: number
}

export default function MyPage() {
    const router = useRouter() // router 추가
    const [isLiked, setIsLiked] = useState(false) // 하트 버튼 상태 추가
    const [followerCount, setFollowerCount] = useState(128) // 상태 추가

    const [posts] = useState<Post[]>([
        {
            id: 1,
            title: '독서후기',
            date: '2024.02.20',
            views: 156,
            comments: 8,
        },
        {
            id: 2,
            title: '자격증 책 추천',
            date: '2024.02.18',
            views: 234,
            comments: 12,
        },
        {
            id: 3,
            title: '소설 추천',
            date: '2024.02.15',
            views: 189,
            comments: 5,
        },
    ])

    const [introduction, setIntroduction] = useState(
        '안녕하세요! 제 블로그에 오신 것을 환영합니다. 여기서는 일상과 관심사를 공유하고 있습니다.',
    )
    const [isFollowing, setIsFollowing] = useState(false)

    // 게시물 클릭 핸들러 추가
    const handlePostsClick = () => {
        router.push('/blog/detail')
    }

    // 팔로잉 클릭 핸들러 추가
    const handleFollowingClick = () => {
        router.push('/follow')
    }

    // 팔로워 클릭 핸들러 추가
    const handleFollowerClick = () => {
        router.push('/follow?tab=followers') // followers 탭으로 이동
    }

    // toggleFollow 함수 수정
    const toggleFollow = () => {
        setIsFollowing(!isFollowing)
        setFollowerCount((prev) => (isFollowing ? prev - 1 : prev + 1))
    }

    // 카테고리 아이템 클릭 핸들러 추가
    const handleCategoryClick = (postId: number, title: string) => {
        if (title === '독서후기') {
            router.push('/category')
        }
    }

    // 하트 버튼 클릭 핸들러 수정
    const handleLikeClick = () => {
        setIsLiked(!isLiked)
        setFollowerCount((prev) => (isLiked ? prev - 1 : prev + 1))
    }

    return (
        <div className="container mx-auto px-4 py-4 max-w-5xl">
            {/* 프로필과 통계를 포함하는 섹션 */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
                    <div className="flex items-center">
                        <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden mr-4">
                            <img
                                src="https://randomuser.me/api/portraits/women/44.jpg"
                                alt="프로필"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <div className="flex items-center">
                                <h1 className="text-xl font-bold">김블로그</h1>
                                <span className="text-gray-500 text-sm ml-2">@blog_kim</span>
                                <button
                                    onClick={() => router.push('/blog')}
                                    className="ml-2 text-gray-500 hover:text-[#2E804E] transition-colors duration-200"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                        />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => router.push('/mypage')}
                                    className="ml-2 text-gray-500 hover:text-[#2E804E] transition-colors duration-200"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 9.75L12 4.5l9 5.25v7.5L12 19.5l-9-5.25V9.75z"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <p className="text-gray-500 text-sm">가입일: 2024년 1월 15일</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLikeClick}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                        aria-label={isLiked ? '팔로우 취소' : '팔로우하기'}
                    >
                        <svg
                            className={`w-6 h-6 ${
                                isLiked ? 'text-red-500 fill-current' : 'text-gray-400 hover:text-gray-600'
                            } transition-colors duration-200`}
                            xmlns="http://www.w3.org/2000/svg"
                            fill={isLiked ? 'currentColor' : 'none'}
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                            />
                        </svg>
                    </button>
                </div>

                {/* 소개글 */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                    <p className="text-gray-600">{introduction}</p>
                </div>

                {/* 통계 섹션 수정 */}
                <div className="grid grid-cols-3 divide-x divide-gray-200">
                    <div
                        className="text-center px-4 cursor-pointer hover:bg-gray-50 transition"
                        onClick={handlePostsClick}
                    >
                        <h3 className="text-gray-500 mb-2">게시물</h3>
                        <p className="text-2xl font-bold">42</p>
                    </div>
                    <div
                        className="text-center px-4 cursor-pointer hover:bg-gray-50 transition"
                        onClick={handleFollowingClick}
                    >
                        <h3 className="text-gray-500 mb-2">팔로잉</h3>
                        <p className="text-2xl font-bold">128</p>
                    </div>
                    <div
                        className="text-center px-4 cursor-pointer hover:bg-gray-50 transition"
                        onClick={handleFollowerClick}
                    >
                        <h3 className="text-gray-500 mb-2">팔로워</h3>
                        <p className="text-2xl font-bold">{followerCount}</p>
                    </div>
                </div>
            </div>

            {/* 카테고리 섹션 */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
                <h2 className="text-lg font-bold p-6 border-b border-gray-200">카테고리</h2>
                <div>
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            className="p-6 hover:bg-gray-50 transition cursor-pointer"
                            onClick={() => handleCategoryClick(post.id, post.title)}
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="font-medium">{post.title}</h3>
                                <svg
                                    className="w-5 h-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </div>
                            <div className="flex items-center text-sm text-gray-500 mt-2">
                                <span>{post.date}</span>
                                <span className="mx-2">•</span>
                                <span>조회 {post.views}</span>
                                <span className="mx-2">•</span>
                                <span>댓글 {post.comments}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 푸터 */}
            <footer className="text-center text-gray-500 text-sm">© 2025 북트리 서비스. All rights reserved.</footer>
        </div>
    )
}
