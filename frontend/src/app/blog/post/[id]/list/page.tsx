'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link'
// ...existing imports...

interface Post {
    postId: number
    title: string
    viewCount: number
    createdAt: string
    modifiedAt: string
}

interface PageResponse {
    content: Post[]
    totalPages: number
    totalElements: number
    number: number // 현재 페이지
    size: number // 페이지 크기

    sorted: boolean // 정렬 여부 추가
    direction: string
}

type SortType = 'latest' | 'popular'

export default function BlogPostListPage() {
    const params = useParams()
    const blogId = params.id as string
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [sortType, setSortType] = useState<SortType>('latest')

    // 상태 추가
    const [currentPage, setCurrentPage] = useState(0) // 백엔드는 0부터 시작
    const [totalPages, setTotalPages] = useState(0)
    const [totalElements, setTotalElements] = useState(0)

    useEffect(() => {
        if (blogId) {
            setLoading(true)
            const endpoint =
                sortType === 'latest'
                    ? `http://localhost:8090/api/v1/posts/get/blog/${blogId}?page=${currentPage}&size=8`
                    : `http://localhost:8090/api/v1/posts/get/blog/popular/${blogId}?page=${currentPage}&size=8`

            console.log('요청 URL:', endpoint) // 요청 URL 확인

            axios
                .get<PageResponse>(endpoint)
                .then((res) => {
                    setPosts(res.data.content)
                    setTotalPages(res.data.totalPages)
                    setTotalElements(res.data.totalElements)
                    setLoading(false)
                })
                .catch((err) => {
                    console.error('게시글 리스트 조회 실패:', err)
                    setError('게시글을 불러오는 데 실패했습니다.')
                    setLoading(false)
                })
        }
    }, [blogId, sortType, currentPage]) // currentPage 의존성 추가

    // 페이지 변경 핸들러 추가
    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        window.scrollTo(0, 0) // 페이지 상단으로 스크롤
    }

    if (loading) return <div>불러오는 중...</div>
    if (error) return <div>{error}</div>

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* 메인 컨텐츠 */}
            <main>
                <div className="bg-white rounded-xl shadow-lg p-8">
                    {/* 프로필 섹션 */}
                    <div>{/* 프로필 섹션 */}</div>

                    {/* 네비게이션 */}

                    <nav className="border-b border-gray-200 mb-8">
                        <ul className="flex gap-8">
                            <li
                                className={`pb-2 border-b-2 ${
                                    sortType === 'latest' ? 'border-gray-900' : 'border-transparent'
                                } cursor-pointer`}
                                onClick={() => setSortType('latest')}
                            >
                                <span className={sortType === 'latest' ? 'text-gray-900' : 'text-gray-600'}>
                                    최신순
                                </span>
                            </li>
                            <li
                                className={`pb-2 border-b-2 ${
                                    sortType === 'popular' ? 'border-gray-900' : 'border-transparent'
                                } cursor-pointer`}
                                onClick={() => setSortType('popular')}
                            >
                                <span className={sortType === 'popular' ? 'text-gray-900' : 'text-gray-600'}>
                                    인기순
                                </span>
                            </li>
                        </ul>
                    </nav>

                    {/* {isLogin && userBlogId && blogId && String(userBlogId) === String(blogId) && (
                        <div className="flex justify-end mb-8">
                            <Link href="/post/write">
                                <button className="bg-[#2E804E] text-white px-4 py-2 rounded-md hover:bg-[#247040] transition-colors flex items-center gap-2">
                                    <span>새 글 작성하기</span>
                                </button>
                            </Link>
                        </div>
                    )} */}
                    {/* 블로그 포스트 목록 */}
                    <div className="space-y-8">
                        {/* <h2 className="text-2xl font-bold mb-6">
                            {activeTab === 'latest' && '최신 게시물'}
                            {activeTab === 'popular' && '인기 게시물'}
                            {activeTab === 'bookmarks' && '팔로잉 게시글'}dddddddddd
                        </h2> */}

                        <h2 className="text-2xl font-bold mb-6">
                            {sortType === 'latest' ? '최신 게시물' : '인기 게시물'}
                        </h2>
                        {posts.map((post) => (
                            <Link href={`/post/${post.postId}/detail/get`} key={post.postId} className="block">
                                <article
                                    key={post.postId}
                                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                                >
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="bg-gray-100 px-2 py-1 rounded text-sm">
                                                {post.category}
                                            </span>
                                            {/* <span className="text-gray-500 text-sm">{post.date}</span> */}
                                        </div>
                                        <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                                        {/* <p className="text-gray-600 mb-4">{post.description}</p> */}
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-4 text-gray-500">
                                                <span>조회 {post.viewCount}</span>
                                                {/* <span>댓글 {post.comments}</span> */}
                                            </div>
                                            <div className="flex items-center gap-4 text-gray-500">
                                                {/* <Link href={`/post/edit/${post.id}`}>
                                                <span className="hover:text-gray-900 cursor-pointer">수정</span>
                                            </Link>
 */}
                                                {/* <span
                                                onClick={() => handleDelete(post.id)}
                                                className="hover:text-gray-900 cursor-pointer"
                                            >
                                                삭제
                                            </span> */}
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                    {/* 페이지네이션 */}
                    <div className="flex justify-center items-center gap-2 mt-8">
                        {/* 이전 페이지 버튼 */}
                        {currentPage > 0 && (
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                className="px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
                            >
                                이전
                            </button>
                        )}

                        {/* 페이지 번호 버튼들 */}
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => handlePageChange(i)}
                                className={`w-10 h-10 flex items-center justify-center rounded-md
                                    ${
                                        currentPage === i
                                            ? 'bg-gray-900 text-white'
                                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        {/* 다음 페이지 버튼 */}
                        {currentPage < totalPages - 1 && (
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                className="px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
                            >
                                다음
                            </button>
                        )}
                    </div>
                </div>
            </main>

            {/* 카테고리 사이드바 */}
            {/* <aside className="w-64 flex-shrink-0 mt-100">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-bold mb-4">태그 목록</h2>
                    <div className="border-b border-gray-200 mb-4"></div>
                    <ul className="space-y-2">
                        {categories.map((category) => (
                            <li key={category.name}>
                                <Link
                                    href={`/blog/category/${category.name}`}
                                    className="flex justify-between items-center text-gray-700 hover:text-gray-900"
                                >
                                    <span>{category.name}</span>
                                    <span className="text-gray-500">({category.count})</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside> */}

            {/* <AnnouncementModal
                isOpen={isAnnouncementOpen}
                onClose={() => setIsAnnouncementOpen(false)}
                notice={blog?.notice || ''} // blog가 없으면 빈 문자열로 대체
                name={blog?.name || `${loginUser.username} 블로그`} // blog가 없으면 loginUser의 username을 사용
            /> */}
        </div>
    )
}
