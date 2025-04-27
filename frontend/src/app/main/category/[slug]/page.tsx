'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import CategoryNav from '@/app/components/CategoryNav'

const categoryIdMap: Record<string, number> = {
    novel: 1,
    'self-development': 2,
    study: 3,
    essay: 4,
    hobby: 5,
    it: 6,
}

const CategoryDetailPage = () => {
    const params = useParams()
    const slug = params.slug as string

    const [posts, setPosts] = useState([])
    const [popPosts, setPopPosts] = useState([])

    const getCategoryId = () => {
        switch (slug) {
            case 'novel':
                return 1
            case 'self-development':
                return 2
            case 'study':
                return 3
            case 'essay':
                return 4
            case 'hobby':
                return 5
            case 'it':
                return 6
            default:
                return null
        }
    }

    useEffect(() => {
        const categoryId = getCategoryId()
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/posts/get/maincategory/${categoryId}/1`, {
            method: 'GET',
        })
            .then((result) => {
                if (!result.ok) {
                    setPosts([])
                    throw new Error('Network response was not ok')
                }
                return result.json()
            })
            .then((result) => {
                // 서버에서 받은 데이터 변환
                const transformedPosts = result.content.map((post) => ({
                    id: post.postId,
                    title: post.title,
                    // description: post.content, // 필요에 따라 추가
                    url: post.imageUrl, // 필요에 따라 추가
                    createAt: post.createdAt,
                    viewCount: post.viewCount,
                }))
                console.log('결과 : ', result)

                setPosts(transformedPosts)
            })
            .catch((error) => {
                console.error('Error fetching data:', error)
            })
    }, [])

    useEffect(() => {
        const categoryId = getCategoryId()
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/posts/get/maincategory/${categoryId}/view`)
            .then((result) => {
                if (!result.ok) {
                    setPopPosts([])
                    throw new Error('Network response was not ok')
                }
                return result.json()
            })
            .then((result) => {
                const transformedPopPosts = result.content.map((post) => ({
                    id: post.postId,
                    title: post.title,
                    viewCount: post.viewCount,
                    ranking: post.ranking,
                }))

                setPopPosts(transformedPopPosts) // 여기에 추가
                console.log(transformedPopPosts)
            })
            .catch((error) => {
                console.error('Error fetching popular posts:', error)
            })
    }, [])

    // 페이지네이션 상태
    const [currentPage, setCurrentPage] = useState(1)
    const booksPerPage = 4 // 한 페이지당 표시할 게시물 수

    // 카테고리에 따른 타이틀 설정
    const getCategoryTitle = () => {
        switch (slug) {
            case 'novel':
                return '소설'
            case 'self-development':
                return '자기계발서'
            case 'study':
                return '공부/자격'
            case 'essay':
                return '에세이/일상'
            case 'hobby':
                return '실용/취미'
            case 'it':
                return 'IT/컴퓨터'
            default:
                return '모든 게시물'
        }
    }

    // 전체 게시물 데이터

    // 현재 페이지에 표시할 게시물
    const indexOfLastBook = currentPage * booksPerPage
    const indexOfFirstBook = indexOfLastBook - booksPerPage
    const currentBooks = posts.slice(indexOfFirstBook, indexOfLastBook)

    // 페이지 변경 핸들러
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

    // 인기 게시글 데이터
    const popularPosts = popPosts

    return (
        <div className="w-full">
            <CategoryNav currentSlug={slug} />

            <h1 className="text-3xl font-bold mb-8 mt-6">{getCategoryTitle()}</h1>

            <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-grow lg:w-2/3">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-semibold mb-6">최신순</h2>

                        <div className="grid grid-cols-1 gap-6">
                            {currentBooks.map((post) => (
                                <Link href={`/post/${post.id}/detail/get`} key={post.id} className="block">
                                    <div className="flex border border-gray-100 rounded-lg p-4 gap-4 hover:shadow-md transition-shadow cursor-pointer">
                                        <div className="w-24 h-32 relative flex-shrink-0">
                                            <Image
                                                src={post.url}
                                                alt={post.title}
                                                fill
                                                className="object-cover rounded"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium mb-2">{post.title}</h3>
                                            <br></br>
                                            <p className="text-sm text-gray-500 mb-1">조회수: {post.viewCount}</p>
                                            <p className="text-sm text-gray-500">
                                                작성일:{' '}
                                                {new Date(post.createAt).toLocaleDateString('ko-KR').replace(/\.$/, '')}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-center mt-8 mb-8">
                        {Array.from({ length: Math.ceil(posts.length / booksPerPage) }, (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => paginate(i + 1)}
                                className={`w-10 h-10 border border-gray-200 rounded flex items-center justify-center mr-2 ${
                                    currentPage === i + 1 ? 'bg-[#2E804E] text-white' : 'hover:bg-gray-100'
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="lg:w-1/3">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-lg font-medium mb-4">인기 {getCategoryTitle()} 게시글 조회수 TOP 5</h2>

                        <div className="space-y-0">
                            {popularPosts.slice(0, 5).map((post, index) => (
                                <Link href={`/post/${post.id}/detail/get`} key={index} className="block">
                                    <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer border-b border-gray-100">
                                        <div className="w-6 h-6 rounded-full bg-[#2E804E] text-white flex items-center justify-center text-sm">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <span className="block text-sm font-medium">{post.title}</span>
                                            <span className="text-xs text-gray-500">조회수 {post.viewCount}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default CategoryDetailPage
