'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AnnouncementModal from '../../components/AnnouncementModal'
import { LoginUserContext, useGlobalLoginUser, useLoginUser } from '@/stores/auth/loginMember'

interface Post {
    id: number
    category: string
    title: string
    description: string
    date: string
    views: number
    comments: number
    isBookmarked?: boolean
}

interface Category {
    id: number
    name: string
    postCount: number
}

interface BlogInfo {
    name: string
    profile: string
    notice: string
    blogId: number
}

const posts: Post[] = [
    {
        id: 1,
        category: 'React',
        title: 'React Query로 상태관리 최적화하기',
        description:
            'React Query를 활용한 서버 상태 관리와 캐싱 전략, 실시간 데이터 동기화 방법에 대해 설명해 드립니다.',
        date: '2024년 3월 15일',
        views: 1234,
        comments: 23,
        isBookmarked: true,
    },
    {
        id: 2,
        category: 'TypeScript',
        title: '타입스크립트로 안전한 API 개발',
        description: '타입스크립트를 활용하여 백엔드 API와 프론트엔드 통신을 타입 안전하게 구현하는 방법을 공유합니다.',
        date: '2024년 3월 12일',
        views: 987,
        comments: 15,
        isBookmarked: false,
    },
    {
        id: 3,
        category: 'NextJS',
        title: 'Next.js와 GraphQL 통합하기',
        description:
            'Next.js 프로젝트에서 GraphQL을 효율적으로 통합하고 활용하는 방법에 대한 실전 가이드를 제공합니다.',
        date: '2024년 3월 10일',
        views: 856,
        comments: 19,
        isBookmarked: true,
    },
]

type TabType = 'latest' | 'popular' | 'bookmarks' | 'scraps'

export default function BlogPage() {
    const { isLogin, loginUser, logoutAndHome } = useGlobalLoginUser()
    const [currentPage, setCurrentPage] = useState(1)
    const [activeTab, setActiveTab] = useState<TabType>('latest')
    const [isFollowing, setIsFollowing] = useState(false)
    const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()
    const [userId, setUserId] = useState<number | null>(null)
    const [categories, setCategories] = useState<Category>([])
    const [followCount, setFollowCount] = useState([])

    //블로그 정보 가져오기

    const { id: blogId } = useParams<{ id: string }>() // URL에서 blogId 가져오기
    const [blog, setBlog] = useState<BlogInfo | null>(null)
    const [userBlogId, setUserBlogId] = useState<string | null>(null) // 로그인 유저의 블로그 ID

    useEffect(() => {
        const fetchFollowCount = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/follow/get/followcount/${userId}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            // 추가적인 헤더가 필요하면 여기에 추가
                        },
                        credentials: 'include', // 쿠키를 포함시키기 위한 설정
                    },
                )
                if (!response.ok) {
                    throw new Error('팔로우 수를 가져오는 데 실패했습니다.')
                }
                const data = await response.json()
                setFollowCount(data) // 가져온 데이터를 상태에 저장
                console.log('FollowCount : ', data)
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
        if (userId) {
            fetchFollowCount()
        }
    }, [userId])

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/blogs/get/findUserId/${blogId}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        // credentials: 'include', // 쿠키를 포함시키기 위한 설정
                    },
                )

                if (!response.ok) {
                    throw new Error('유저 ID를 불러오는데 실패했습니다다.')
                }

                const data = await response.json()
                console.log('UserId : ', data)
                setUserId(data)
            } catch (err) {
                console.error('Error fetching post:', err)
                setError(err instanceof Error ? err.message : '유저 ID를 불러오지 못했습니다')
            }
        }
        fetchUserId()
    }, [blogId])

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/categories/get/${userId}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    },
                )

                if (!response.ok) {
                    throw new Error('유저 카테고리를 불러오는데 실패했습니다.')
                }

                const data = await response.json()
                console.log('카테고리 : ', data)
                setCategories(data)
                console.log(categories)
            } catch (err) {
                console.error('Error fetching post:', err)
                setError(err instanceof Error ? err.message : '유저 카테고리를 불러오지 못했습니다')
            }
        }

        // ✅ userId가 존재할 때만 호출되도록 조건 추가
        if (userId) {
            fetchCategories()
        }
    }, [userId])

    useEffect(() => {
        if (!blogId) {
            console.error('blogId is missing or undefined')
            return
        }

        const fetchBlogInfo = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/blogs/get?blogId=${blogId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                })

                if (!res.ok) {
                    throw new Error('블로그 정보를 가져오지 못했습니다.')
                }

                const data = await res.json()
                setBlog(data)
            } catch (error) {
                setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.')
            } finally {
                setIsLoading(false)
            }
        }

        const fetchUserBlogId = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/blogs/get/token`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                })

                if (!res.ok) {
                    throw new Error('유저 블로그 ID를 가져오지 못했습니다.(유저가 블로그를 가지지 않았을 수 있음)')
                }

                const data = await res.json()
                setUserBlogId(data.blogId) // 유저의 블로그 ID 저장
            } catch (error) {
                console.error(error)
            } finally {
                setIsLoading(false)
            }
        }

        if (isLogin) {
            fetchUserBlogId()
        }

        fetchBlogInfo()
    }, [blogId, isLogin])

    console.log('blogId:', blogId)
    console.log('userBlogId:', userBlogId)

    const [posts, setPosts] = useState<Post[]>([
        {
            id: 1,
            category: 'React',
            title: 'React Query로 상태관리 최적화하기',
            description:
                'React Query를 활용한 서버 상태 관리와 캐싱 전략, 실시간 데이터 동기화 방법에 대해 설명해 드립니다.',
            date: '2024년 3월 15일',
            views: 1234,
            comments: 23,
            isBookmarked: true,
        },
        {
            id: 2,
            category: 'TypeScript',
            title: '타입스크립트로 안전한 API 개발',
            description:
                '타입스크립트를 활용하여 백엔드 API와 프론트엔드 통신을 타입 안전하게 구현하는 방법을 공유합니다.',
            date: '2024년 3월 12일',
            views: 987,
            comments: 15,
            isBookmarked: false,
        },
        {
            id: 3,
            category: 'NextJS',
            title: 'Next.js와 GraphQL 통합하기',
            description:
                'Next.js 프로젝트에서 GraphQL을 효율적으로 통합하고 활용하는 방법에 대한 실전 가이드를 제공합니다.',
            date: '2024년 3월 10일',
            views: 856,
            comments: 19,
            isBookmarked: true,
        },
    ])
    const postsPerPage = 5

    // Filter posts based on active tab
    const getFilteredPosts = () => {
        switch (activeTab) {
            case 'latest':
                return [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            case 'popular':
                return [...posts].sort((a, b) => b.views - a.views)
            case 'bookmarks':
                return posts.filter((post) => post.isBookmarked)
            case 'scraps':
                return posts.filter((post) => post.isBookmarked) // 스크랩된 게시물 필터링 (임시로 bookmarked와 동일하게 처리)
            default:
                return posts
        }
    }

    const filteredPosts = getFilteredPosts()

    // Calculate pagination values
    const indexOfLastPost = currentPage * postsPerPage
    const indexOfFirstPost = indexOfLastPost - postsPerPage
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost)
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage)

    // Generate page numbers array
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber)
        window.scrollTo(0, 0)
    }

    const handleTabChange = (tab: TabType) => {
        setActiveTab(tab)
        setCurrentPage(1)
    }

    const handleDelete = (postId: number) => {
        if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
            setPosts(posts.filter((post) => post.id !== postId))
        }
    }

    return (
        <div className="flex gap-8 max-w-8xl mx-auto px-4 py-8">
            {/* 메인 컨텐츠 */}
            <main className="flex-1 pl-100">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    {/* 프로필 섹션 */}
                    <div>
                        {/* 프로필 섹션 */}
                        <section className="text-center mb-12">
                            <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
                                {blog?.name || `${loginUser.username} 블로그`}
                                {isLogin && userBlogId && blogId && String(userBlogId) === String(blogId) && (
                                    <button
                                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 cursor-pointer"
                                        onClick={() => router.push('/blog/edit')}
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
                                )}
                            </h1>
                            <p className="text-gray-600 mb-6">{blog?.profile || ' '}</p>
                        </section>
                    </div>
                    <section className="text-center mb-12">
                        <div className="flex justify-center gap-8">
                            <Link href={`/follow/${userId}`} className="text-center hover:opacity-80">
                                <div className="text-xl font-bold">{followCount.followerCount}</div>
                                <div className="text-gray-600">팔로잉</div>
                            </Link>
                            <Link href={`/follow/${userId}`} className="text-center hover:opacity-80">
                                <div className="text-xl font-bold">{followCount.followingCount}</div>
                                <div className="text-gray-600">팔로워</div>
                            </Link>
                            <div className="text-center">
                                <div className="text-xl font-bold">42</div>
                                <div className="text-gray-600">포스트</div>
                            </div>
                        </div>

                        <div className="mt-6 flex gap-4 justify-center items-center">
                            <button
                                className={`px-4 py-2 rounded-md transition-colors ${
                                    isFollowing
                                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        : 'bg-[#2E804E] text-white hover:bg-[#247040]'
                                }`}
                                onClick={() => setIsFollowing(!isFollowing)}
                            >
                                {isFollowing ? '팔로잉' : '팔로우'}
                            </button>
                            <button
                                onClick={() => setIsAnnouncementOpen(true)}
                                className="bg-[#2E804E] text-white p-2 rounded-md hover:bg-[#247040] transition-colors flex items-center justify-center"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-6 h-6 ml-2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66a23.847 23.847 0 0 0 8.835-2.535m0 0A23.74 23.74 0 0 0 18.795 3m.38 1.125a23.91 23.91 0 0 1 1.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 0 0 1.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 0 1 0 3.46"
                                    />
                                </svg>
                            </button>
                            {blog && (
                                <AnnouncementModal
                                    isOpen={isAnnouncementOpen}
                                    onClose={() => setIsAnnouncementOpen(false)}
                                    notice={blog.notice} // 모달에 공지사항 전달
                                    name={blog.name} // 블로그 이름 전달
                                />
                            )}
                        </div>
                    </section>
                    {/* 네비게이션 */}
                    <nav className="border-b border-gray-200 mb-8">
                        <ul className="flex gap-8">
                            <li
                                className={`pb-2 border-b-2 ${
                                    activeTab === 'latest' ? 'border-gray-900' : 'border-transparent'
                                } cursor-pointer`}
                                onClick={() => handleTabChange('latest')}
                            >
                                <span className={activeTab === 'latest' ? 'text-gray-900' : 'text-gray-600'}>
                                    최신순
                                </span>
                            </li>
                            <li
                                className={`pb-2 border-b-2 ${
                                    activeTab === 'popular' ? 'border-gray-900' : 'border-transparent'
                                } cursor-pointer`}
                                onClick={() => handleTabChange('popular')}
                            >
                                <span className={activeTab === 'popular' ? 'text-gray-900' : 'text-gray-600'}>
                                    인기순
                                </span>
                            </li>
                            <li
                                className={`pb-2 border-b-2 ${
                                    activeTab === 'bookmarks' ? 'border-gray-900' : 'border-transparent'
                                } cursor-pointer`}
                                onClick={() => handleTabChange('bookmarks')}
                            >
                                <span className={activeTab === 'bookmarks' ? 'text-gray-900' : 'text-gray-600'}>
                                    팔로잉
                                </span>
                            </li>
                            <li
                                className={`pb-2 border-b-2 ${
                                    activeTab === 'scraps' ? 'border-gray-900' : 'border-transparent'
                                } cursor-pointer`}
                                onClick={() => handleTabChange('scraps')}
                            >
                                <span className={activeTab === 'scraps' ? 'text-gray-900' : 'text-gray-600'}>
                                    스크랩
                                </span>
                            </li>
                        </ul>
                    </nav>
                    {isLogin && userBlogId && blogId && String(userBlogId) === String(blogId) && (
                        <div className="flex justify-end mb-8">
                            <Link href="/post/write">
                                <button className="bg-[#2E804E] text-white px-4 py-2 rounded-md hover:bg-[#247040] transition-colors flex items-center gap-2">
                                    <span>새 글 작성하기</span>
                                </button>
                            </Link>
                        </div>
                    )}
                    {/* 블로그 포스트 목록 */}
                    <div className="space-y-8">
                        <h2 className="text-2xl font-bold mb-6">
                            {activeTab === 'latest' && '최신 게시물'}
                            {activeTab === 'popular' && '인기 게시물'}
                            {activeTab === 'bookmarks' && '팔로잉 게시글'}
                        </h2>
                        {currentPosts.map((post) => (
                            <article
                                key={post.id}
                                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                            >
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="bg-gray-100 px-2 py-1 rounded text-sm">{post.category}</span>
                                        <span className="text-gray-500 text-sm">{post.date}</span>
                                    </div>
                                    <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                                    <p className="text-gray-600 mb-4">{post.description}</p>
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-4 text-gray-500">
                                            <span>조회 {post.views}</span>
                                            <span>댓글 {post.comments}</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-gray-500">
                                            <Link href={`/post/edit/${post.id}`}>
                                                <span className="hover:text-gray-900 cursor-pointer">수정</span>
                                            </Link>

                                            <span
                                                onClick={() => handleDelete(post.id)}
                                                className="hover:text-gray-900 cursor-pointer"
                                            >
                                                삭제
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                    {/* 페이지네이션 */}
                    <div className="flex justify-center gap-2 mt-8">
                        <button
                            className="px-4 py-2 border rounded hover:bg-gray-50"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        {pageNumbers.map((number) => (
                            <button
                                key={number}
                                className={`px-4 py-2 border rounded ${
                                    currentPage === number ? 'bg-gray-900 text-white' : 'hover:bg-gray-50'
                                }`}
                                onClick={() => handlePageChange(number)}
                            >
                                {number}
                            </button>
                        ))}
                        <button
                            className="px-4 py-2 border rounded hover:bg-gray-50"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </main>

            {/* 카테고리 사이드바 */}
            <aside className="w-64 flex-shrink-0 mt-100">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-bold mb-4">카테고리 목록</h2>
                    <div className="border-b border-gray-200 mb-4"></div>
                    <ul className="space-y-2">
                        {categories.map((category) => (
                            <li key={category.id}>
                                <Link
                                    href={`/blog/category/${category.name}`}
                                    className="flex justify-between items-center text-gray-700 hover:text-gray-900"
                                >
                                    <span>{category.name}</span>
                                    <span className="text-gray-500">({category.postCount})</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>

            <AnnouncementModal
                isOpen={isAnnouncementOpen}
                onClose={() => setIsAnnouncementOpen(false)}
                notice={blog?.notice || ''} // blog가 없으면 빈 문자열로 대체
                name={blog?.name || `${loginUser.username} 블로그`} // blog가 없으면 loginUser의 username을 사용
            />
        </div>
    )
}
