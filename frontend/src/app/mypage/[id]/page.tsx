'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation' // useRouter import 추가
import { useGlobalLoginUser } from '@/stores/auth/loginMember'
import { useParams } from 'next/navigation'

interface Category {
    id: number
    name: string
    create_at: string
    update_at: string
}

export default function MyPage() {
    const router = useRouter() // router 추가
    const [categories, setCategories] = useState<Category[]>([]) // 초기값 빈 배열
    const [isLoading, setIsLoading] = useState(true) // 로딩 상태 추가
    const [error, setError] = useState<string | null>(null) // 에러 상태 추가
    const { isLogin, loginUser, logoutAndHome } = useGlobalLoginUser()
    const [isAuthorized, setIsAuthorized] = useState(false)
    const { id: userId } = useParams<{ id: string }>() // URL에서 userId

    useEffect(() => {
        const checkAuthorization = () => {
            if (!isLogin) {
                alert('로그인이 필요합니다.')
                router.push('/account/login')
                return
            }

            // URL의 id와 로그인된 사용자의 id 비교
            if (loginUser.id === parseInt(userId)) {
                setIsAuthorized(true)
            } else {
                alert('접근 권한이 없습니다.')
                router.push('/') // 메인 페이지로 리다이렉트
            }
        }

        checkAuthorization()
    }, [isLogin, loginUser, userId, router])

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:8090/api/v1/categories/get/allcategory', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        // 추가적인 헤더가 필요하면 여기에 추가
                    },
                    credentials: 'include', // 쿠키를 포함시키기 위한 설정
                })
                if (!response.ok) {
                    throw new Error('카테고리 데이터를 가져오는 데 실패했습니다.')
                }
                const data = await response.json()
                setCategories(data) // 가져온 데이터를 상태에 저장
            } catch (err: unknown) {
                if (err instanceof Error) {
                    // err가 Error 인스턴스인지 확인
                    setError(err.message) // 에러 메시지 접근
                } else {
                    setError('알 수 없는 오류가 발생했습니다.')
                }
            } finally {
                setIsLoading(false)
            }
        }

        fetchCategories()
    }, [])

    const [isEditing, setIsEditing] = useState(false)
    const [introduction, setIntroduction] = useState(
        '안녕하세요! 제 블로그에 오신 것을 환영합니다. 여기서는 일상과 관심사를 공유하고 있습니다.',
    )
    const [isFollowing, setIsFollowing] = useState(false)
    const [followerCount, setFollowerCount] = useState(128) // 상태 추가

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

    // toggleFollow 함수 제거
    // const toggleFollow = () => {
    //     setIsFollowing(!isFollowing)
    //     setFollowerCount((prev) => (isFollowing ? prev - 1 : prev + 1))
    // }

    // 카테고리 아이템 클릭 핸들러 추가
    const handleCategoryClick = (postId: number, title: string) => {
        if (title === '독서후기') {
            router.push('/category')
        }
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
                                    onClick={async () => {
                                        try {
                                            const res = await fetch('http://localhost:8090/api/v1/blogs/get/token', {
                                                method: 'GET',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                },
                                                credentials: 'include', // 쿠키 인증 정보 포함
                                            })

                                            const data = await res.json()

                                            if (data && data.blogId) {
                                                router.push(`/blog/${data.blogId}`)
                                            } else {
                                                router.push('/blog/create')
                                            }
                                        } catch (err) {
                                            console.error(err)
                                            router.push('/blog/create') // 예외 발생 시도 /blog/create로 이동
                                        }
                                    }}
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
                            </div>

                            <p className="text-gray-500 text-sm">가입일: 2024년 1월 15일</p>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 cursor-pointer"
                            onClick={() => setIsEditing(!isEditing)}
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
                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                />
                            </svg>
                        </button>
                        {/* 톱니바퀴 버튼 추가 */}
                        <button
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 cursor-pointer"
                            onClick={() => router.push('/account/edit')}
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
                                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* 소개글 */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                    {isEditing ? (
                        <div className="flex flex-col gap-2">
                            <textarea
                                value={introduction}
                                onChange={(e) => setIntroduction(e.target.value)}
                                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                rows={3}
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-3 py-1 text-sm text-gray-600 border rounded-md hover:bg-gray-100"
                                >
                                    취소
                                </button>
                                <button
                                    onClick={() => {
                                        setIsEditing(false)
                                    }}
                                    className="px-3 py-1 text-sm text-white bg-green-600 rounded-md hover:bg-green-700"
                                >
                                    저장
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-600">{introduction}</p>
                    )}
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
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="p-6 hover:bg-gray-50 transition cursor-pointer"
                            onClick={() => handleCategoryClick(category.id, category.name)}
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="font-medium">{category.name}</h3>
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
                            {/* <div className="flex items-center text-sm text-gray-500 mt-2">
                                <span>{post.date}</span>
                                <span className="mx-2">•</span>
                                <span>조회 {post.views}</span>
                                <span className="mx-2">•</span>
                                <span>댓글 {post.comments}</span>
                            </div> */}
                        </div>
                    ))}
                </div>
            </div>

            {/* 푸터 */}
            <footer className="text-center text-gray-500 text-sm">© 2025 북트리 서비스. All rights reserved.</footer>
        </div>
    )
}
