'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import React from 'react'
import { useGlobalLoginUser } from '@/stores/auth/loginMember'

interface PostDetail {
    postId: number
    title: string
    content: string
    username: string
    imageUrls: string[]
    viewCount: number
    likeCount: number
    createdAt: string
    modifiedAt: string
    // 추가되는 필드들
    author: string
    mainCategory: string
    blogId?: number
    category: string
    book: string
    images?: string[]
}

export default function DetailPage() {
    // 2. 모든 hooks를 최상단에 배치
    const { loginUser } = useGlobalLoginUser()
    const router = useRouter()
    const { postId } = useParams()

    // 3. 작성자 확인 상태 추가
    const [isAuthor, setIsAuthor] = useState(false)

    // 4. 기존 상태들
    const [post, setPost] = useState<PostDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isPostEditing, setIsPostEditing] = useState(false)
    const [editedPost, setEditedPost] = useState({ title: '', content: '' })
    const [postLiked, setPostLiked] = useState(false)

    // 2. 댓글 관련 상태
    const [comments, setComments] = useState<Comment[]>([])
    const [commentInput, setCommentInput] = useState('')
    const [likedComments, setLikedComments] = useState<{ [key: number]: boolean }>({})
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
    const [editedCommentContent, setEditedCommentContent] = useState('')

    // 3. 답글 관련 상태
    const [replyInputs, setReplyInputs] = useState<{ [key: number]: string }>({})
    const [activeReplyId, setActiveReplyId] = useState<number | null>(null)
    const [editingReplyId, setEditingReplyId] = useState<number | null>(null)
    const [editedReplyContent, setEditedReplyContent] = useState('')
    const [hasReplied, setHasReplied] = useState<{ [key: number]: boolean }>({})
    const [likedReplies, setLikedReplies] = useState<{ [key: number]: boolean }>({})

    // 4. UI 관련 상태
    const [showPopover, setShowPopover] = useState(false)
    const [isFollowing, setIsFollowing] = useState(false)
    const [activePopoverAuthor, setActivePopoverAuthor] = useState<string | null>(null)
    const [commentFollowStatus, setCommentFollowStatus] = useState<{ [key: string]: boolean }>({})
    const [isListVisible, setIsListVisible] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)

    // 5. 카테고리 상태
    const [categories, setCategories] = useState<Category[]>([
        /* 기존 카테고리 데이터 유지 */
    ])

    // 6. 관련 게시물 상태
    const [relatedPosts] = useState<RelatedPost[]>([
        /* 기존 관련 게시물 데이터 유지 */
    ])

    // PostList 데이터 수정
    const [allPosts] = useState<{ [key: number]: PostList[] }>({
        /* 기존 게시물 목록 데이터 유지 */
    })

    // 현재 페이지의 게시글을 가져오는 함수
    const getCurrentPagePosts = () => {
        return allPosts[currentPage] || []
    }

    // 게시물 좋아요 토글 함수
    const togglePostLike = () => {
        setPostLiked(!postLiked)
        setPost((prev) => ({
            ...prev,
            likes: postLiked ? Math.max(0, prev.likes - 1) : prev.likes + 1,
        }))
    }

    // 좋아요 토글 함수
    const toggleLike = (commentId: number) => {
        setLikedComments((prev) => {
            const newLikedComments = { ...prev }
            newLikedComments[commentId] = !prev[commentId]

            // 댓글 좋아요 수 업데이트
            setComments(
                comments.map((comment) => {
                    if (comment.id === commentId) {
                        return {
                            ...comment,
                            likes: newLikedComments[commentId] ? comment.likes + 1 : Math.max(0, comment.likes - 1),
                        }
                    }
                    return comment
                }),
            )

            return newLikedComments
        })
    }

    // 답글 좋아요 토글 함수 추가
    const toggleReplyLike = (commentId: number, replyId: number) => {
        setLikedReplies((prev) => {
            const newLikedReplies = { ...prev }
            newLikedReplies[replyId] = !prev[replyId]

            // 답글 좋아요 수 업데이트
            setComments(
                comments.map((comment) => {
                    if (comment.id === commentId) {
                        return {
                            ...comment,
                            replies: comment.replies.map((reply) => {
                                if (reply.id === replyId) {
                                    return {
                                        ...reply,
                                        likes: newLikedReplies[replyId]
                                            ? reply.likes + 1
                                            : Math.max(0, reply.likes - 1),
                                    }
                                }
                                return reply
                            }),
                        }
                    }
                    return comment
                }),
            )

            return newLikedReplies
        })
    }

    // 댓글 제출 핸들러
    const handleCommentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (commentInput.trim() === '') return

        const newComment = {
            id: comments.length + 1,
            author: '김민수', // 현재 로그인한 사용자 이름
            date: new Date()
                .toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                })
                .replace(/\. /g, '.')
                .replace(/\.$/, ''),
            content: commentInput,
            likes: 0,
            replies: [],
        }

        setComments([...comments, newComment])
        setCommentInput('')
    }

    // 답글 작성 창 토글 함수
    const toggleReplyForm = (commentId: number) => {
        if (activeReplyId === commentId) {
            setActiveReplyId(null)
        } else {
            setActiveReplyId(commentId)
            if (!replyInputs[commentId]) {
                setReplyInputs({
                    ...replyInputs,
                    [commentId]: '',
                })
            }
        }
    }

    // 답글 입력 핸들러
    const handleReplyInputChange = (commentId: number, value: string) => {
        setReplyInputs({
            ...replyInputs,
            [commentId]: value,
        })
    }

    // 답글 수정 함수
    const handleReplyEdit = (commentId: number, replyId: number, content: string) => {
        setEditingReplyId(replyId)
        setEditedReplyContent(content)
    }

    // 답글 수정 저장 함수
    const handleReplyEditSave = (commentId: number, replyId: number) => {
        setComments(
            comments.map((comment) => {
                if (comment.id === commentId) {
                    return {
                        ...comment,
                        replies: comment.replies.map((reply) => {
                            if (reply.id === replyId) {
                                return {
                                    ...reply,
                                    content: editedReplyContent,
                                }
                            }
                            return reply
                        }),
                    }
                }
                return comment
            }),
        )
        setEditingReplyId(null)
    }

    // 답글 삭제 함수
    const handleReplyDelete = (commentId: number, replyId: number) => {
        setComments(
            comments.map((comment) => {
                if (comment.id === commentId) {
                    return {
                        ...comment,
                        replies: comment.replies.filter((reply) => reply.id !== replyId),
                    }
                }
                return comment
            }),
        )
        setHasReplied({
            ...hasReplied,
            [commentId]: false,
        })
    }

    // 댓글 수정/삭제 함수 추가
    const handleCommentEdit = (commentId: number, content: string) => {
        setEditingCommentId(commentId)
        setEditedCommentContent(content)
    }

    const handleCommentEditSave = (commentId: number) => {
        setComments(
            comments.map((comment) => {
                if (comment.id === commentId) {
                    return {
                        ...comment,
                        content: editedCommentContent,
                    }
                }
                return comment
            }),
        )
        setEditingCommentId(null)
    }

    const handleCommentDelete = (commentId: number) => {
        setComments(comments.filter((comment) => comment.id !== commentId))
    }

    // 답글 제출 핸들러
    const handleReplySubmit = (commentId: number) => {
        if (!replyInputs[commentId] || replyInputs[commentId].trim() === '') return
        if (hasReplied[commentId]) return // 이미 답글을 작성한 경우 return

        const newReply: Reply = {
            id: Date.now(), // 유니크한 ID 생성
            author: '김민수', // 현재 로그인한 사용자 이름
            date: new Date()
                .toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                })
                .replace(/\. /g, '.')
                .replace(/\.$/, ''),
            content: replyInputs[commentId],
            likes: 0,
        }

        setComments(
            comments.map((comment) => {
                if (comment.id === commentId) {
                    return {
                        ...comment,
                        replies: [...comment.replies, newReply],
                    }
                }
                return comment
            }),
        )

        // 입력창 초기화
        setReplyInputs({
            ...replyInputs,
            [commentId]: '',
        })
        setActiveReplyId(null)
        setHasReplied({
            ...hasReplied,
            [commentId]: true,
        })
    }

    // 답글 작성 취소 핸들러
    const handleReplyCancel = () => {
        setActiveReplyId(null)
    }

    // 카테고리 클릭 핸들러
    const handleCategoryClick = (path: string) => {
        router.push(path)
    }

    // 카테고리 토글 함수 추가
    const toggleCategory = (index: number) => {
        setCategories(categories.map((cat, i) => (i === index ? { ...cat, isOpen: !cat.isOpen } : cat)))
    }

    // 상태 추가

    // 댓글 작성자 팝오버 토글 함수
    const toggleCommentPopover = (author: string) => {
        if (activePopoverAuthor === author) {
            setActivePopoverAuthor(null)
        } else {
            setActivePopoverAuthor(author)
        }
    }

    // 댓글 작성자 팔로우 토글 함수
    const toggleCommentFollow = (author: string) => {
        setCommentFollowStatus((prev) => ({
            ...prev,
            [author]: !prev[author],
        }))
    }

    // 프로필 이동 핸들러 추가
    const handleProfileClick = (username: string) => {
        router.push('/mypage')
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if ((showPopover || activePopoverAuthor) && !(event.target as HTMLElement).closest('.relative')) {
                setShowPopover(false)
                setActivePopoverAuthor(null)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [showPopover, activePopoverAuthor])

    // 게시글을 불러오는 함수
    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true)
                const response = await fetch(`http://localhost:8090/api/v1/posts/get/${postId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })

                if (!response.ok) {
                    throw new Error('게시글을 불러오는 데 실패했습니다.')
                }

                const data = await response.json()
                console.log('API Response:', data) // 응답 확인용

                const formattedPost: PostDetail = {
                    postId: data.postId,
                    title: data.title,
                    content: data.content,
                    username: data.username,
                    imageUrls: data.imageUrls || [],
                    viewCount: data.viewCount,
                    likeCount: data.likeCount,
                    createdAt: new Date(data.createdAt).toLocaleDateString(),
                    modifiedAt: new Date(data.modifiedAt).toLocaleDateString(),
                    author: data.author || '', // author는 기본값으로 빈 문자열 설정
                    mainCategory: data.mainCategory || '', // mainCategory 값 처리
                    category: data.category || '', // category 값 처리
                    book: data.book || '', // book 값 처리
                }

                setPost(formattedPost)
                setEditedPost({
                    title: formattedPost.title,
                    content: formattedPost.content,
                })
            } catch (err) {
                console.error('Error fetching post:', err)
                setError(err instanceof Error ? err.message : '게시글을 불러오지 못했습니다')
            } finally {
                setLoading(false)
            }
        }

        if (postId) {
            fetchPost()
        }
    }, [postId])

    // 작성자 확인 useEffect 추가 (다른 useEffect보다 앞에 배치)
    useEffect(() => {
        if (post && loginUser) {
            const isMatch = post.username === loginUser.username
            setIsAuthor(isMatch)
            console.log('작성자 확인:', {
                postAuthor: post.username,
                loginUser: loginUser.username,
                isMatch,
            })
        }
    }, [post, loginUser])

    // postId가 변경될 때마다 useEffect 실행
    // postId가 변경될 때마다 useEffect 실행

    // 로딩 중이나 오류가 있으면 렌더링을 잠시 멈추고 메시지를 표시
    if (loading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error: {error}</div>
    }

    if (!post) {
        return <div>게시글을 찾을 수 없습니다.</div>
    }

    // 목록 토글 함수 추가
    const toggleList = () => {
        setIsListVisible(!isListVisible)
    }

    // 상태 추가

    const postsPerPage = 5 // 페이지당 게시글 수

    // 페이지 변경 핸들러 추가
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber)
        // 여기에서 실제 데이터를 불러오는 API 호출이 있을 수 있습니다
        // 현재는 더미 데이터이므로 페이지만 변경합니다
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl bg-gray-50">
            <div className="flex gap-8">
                {/* 메인 컨텐츠 영역 */}
                <div className="flex-1">
                    {/* 게시글과 댓글 컨테이너 */}
                    <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
                        {/* 헤더 */}
                        <div className="mb-10">
                            <div className="flex justify-between items-center mb-4">
                                {/* 제목 부분 */}
                                {isPostEditing ? (
                                    <input
                                        type="text"
                                        value={editedPost.title}
                                        onChange={(e) => setEditedPost({ ...editedPost, title: e.target.value })}
                                        className="text-2xl font-bold w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                ) : (
                                    <h1 className="text-2xl font-bold">{post.title}</h1>
                                )}
                                {isAuthor && ( // 작성자인 경우에만 버튼 표시
                                    <div className="flex space-x-2">
                                        {isPostEditing ? (
                                            <>
                                                <button
                                                    onClick={() => {
                                                        setPost((prev) => ({
                                                            ...prev!,
                                                            title: editedPost.title,
                                                            content: editedPost.content,
                                                        }))
                                                        setIsPostEditing(false)
                                                    }}
                                                    className="px-4 py-1 text-sm text-white bg-[#2E804E] rounded-md hover:bg-[#246A40] min-w-[60px]"
                                                >
                                                    저장
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setIsPostEditing(false)
                                                        setEditedPost({
                                                            title: post!.title,
                                                            content: post!.content,
                                                        })
                                                    }}
                                                    className="px-4 py-1 text-sm text-gray-600 border rounded-md hover:bg-gray-100 min-w-[60px]"
                                                >
                                                    취소
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 cursor-pointer"
                                                    onClick={() => setIsPostEditing(true)}
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
                                                <button
                                                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 cursor-pointer"
                                                    onClick={() => {
                                                        if (confirm('정말 삭제하시겠습니까?')) {
                                                            // 삭제 로직 구현
                                                        }
                                                    }}
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
                                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                        />
                                                    </svg>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* 프로필 정보 */}
                            <div className="flex items-center mb-6">
                                <div className="w-8 h-8 rounded-full bg-gray-300 mr-2 overflow-hidden">
                                    <img
                                        src="https://randomuser.me/api/portraits/women/44.jpg"
                                        alt="프로필"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="relative">
                                    <button
                                        onClick={() => setShowPopover(!showPopover)}
                                        className="focus:outline-none group"
                                    >
                                        <p className="text-sm font-medium hover:text-[#2E804E] transition-colors duration-200">
                                            {post.username}
                                        </p>
                                    </button>

                                    {/* 팝오버 미니창 수정 */}
                                    {showPopover && (
                                        <div className="absolute z-10 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
                                            <div className="p-4">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center">
                                                        <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 overflow-hidden">
                                                            <img
                                                                src="https://randomuser.me/api/portraits/women/44.jpg"
                                                                alt="프로필"
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <button
                                                            onClick={() => handleProfileClick(post.author)}
                                                            className="font-medium hover:text-[#2E804E] transition-colors duration-200"
                                                        >
                                                            {post.author}
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={() => router.push('/mypage')}
                                                        className="text-gray-500 hover:text-[#2E804E] transition-colors duration-200"
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
                                                <button
                                                    onClick={() => {
                                                        setIsFollowing(!isFollowing)
                                                    }}
                                                    className={`w-full px-4 py-2 text-sm rounded-md transition-colors duration-200 ${
                                                        isFollowing
                                                            ? 'text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300'
                                                            : 'text-white bg-[#2E804E] hover:bg-[#246A40]'
                                                    }`}
                                                >
                                                    {isFollowing ? '팔로우 취소' : '팔로우 하기'}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex text-xs text-gray-500">
                                        <span className="mx-2">•</span>
                                        <span>조회수 {post.createdAt}</span>
                                        <span className="mx-2">•</span>
                                        <span>조회수 {post.viewCount}</span>
                                        <span className="mx-2">•</span>
                                        <span>좋아요 {post.likeCount}</span>
                                    </div>
                                </div>
                            </div>

                            {/* 책 */}
                            <div className="flex text-sm text-gray-700 mb-4">
                                <span className="font-medium">책 이름 : </span>
                                <span className="ml-2 text-gray-600">{post.book}</span>
                            </div>

                            {/* 책 작가 */}
                            <div className="flex text-sm text-gray-700 mb-4">
                                <span className="font-medium">책 작가 : </span>
                                <span className="ml-2 text-gray-600">{post.author}</span>
                            </div>

                            {/* 게시글 내용 */}
                            <div className="mb-8">
                                {/* 이미지를 컨텐츠 위로 이동 */}

                                {/* 이미지 목록 */}
                                {post.imageUrls.length > 0 && (
                                    <div className="flex flex-col gap-4 mb-8">
                                        {post.imageUrls.map((url, index) => (
                                            <div key={index} className="w-full rounded-lg overflow-hidden">
                                                <img
                                                    src={url}
                                                    alt={`게시글 이미지 ${index + 1}`}
                                                    className="w-full h-auto object-contain max-h-[600px]"
                                                    onError={(e) => {
                                                        // console.error(`이미지 로드 실패: ${url}`)
                                                        e.currentTarget.src =
                                                            'https://booktree-s3-bucket.s3.ap-northeast-2.amazonaws.com/BookTree+%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB+%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5+%E1%84%8E%E1%85%AC%E1%84%8C%E1%85%A9%E1%86%BC%E1%84%87%E1%85%A9%E1%86%AB.png' // 로드 실패시 기본 이미지
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* 컨텐츠 표시 */}
                                {isPostEditing ? (
                                    <textarea
                                        value={editedPost.content}
                                        onChange={(e) => setEditedPost({ ...editedPost, content: e.target.value })}
                                        className="w-full p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 mb-6"
                                        rows={15}
                                    />
                                ) : (
                                    <div className="mb-6 whitespace-pre-line">{post.content}</div>
                                )}
                            </div>

                            {/* 좋아요 버튼 */}
                            <div className="flex justify-center mb-8">
                                <button
                                    onClick={togglePostLike}
                                    className={`flex items-center justify-center px-4 py-2 bg-green-50 hover:bg-green-100 transition rounded-md ${
                                        postLiked ? 'text-red-500' : 'text-green-600'
                                    }`}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 mr-1"
                                        fill={postLiked ? 'currentColor' : 'none'}
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4.318 6.318a4 4 0 015.656 0L10 6.343l-1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                        />
                                    </svg>
                                    좋아요 {post.likes}
                                </button>
                            </div>

                            {/* 구분선 추가 */}
                            <div className="border-b border-gray-200 mb-8"></div>

                            {/* 댓글 섹션 */}
                            <div>
                                <h2 className="text-xl font-bold mb-4">댓글 {comments.length}</h2>

                                <form onSubmit={handleCommentSubmit} className="mb-6 border-b border-gray-200 pb-6">
                                    <textarea
                                        className="w-full p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                                        rows={3}
                                        placeholder="댓글을 작성해주세요."
                                        value={commentInput}
                                        onChange={(e) => setCommentInput(e.target.value)}
                                    ></textarea>
                                    <div className="flex justify-end mt-2">
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-[#2E804E] text-white rounded-md hover:bg-[#246A40]"
                                        >
                                            댓글 작성
                                        </button>
                                    </div>
                                </form>

                                <div className="space-y-6">
                                    {comments.map((comment) => (
                                        <div key={comment.id} className="border-b border-gray-200 pb-6">
                                            <div className="flex items-start mb-2">
                                                <div className="w-8 h-8 rounded-full bg-gray-300 mr-2 overflow-hidden">
                                                    <img
                                                        src={`https://randomuser.me/api/portraits/${
                                                            comment.author === '이지은' ? 'women/44.jpg' : 'men/32.jpg'
                                                        }`}
                                                        alt="프로필"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <div className="flex items-center">
                                                                <div className="relative">
                                                                    <button
                                                                        onClick={() =>
                                                                            toggleCommentPopover(comment.author)
                                                                        }
                                                                        className="font-medium hover:text-[#2E804E] transition-colors duration-200"
                                                                    >
                                                                        {comment.author}
                                                                    </button>

                                                                    {/* 댓글 작성자 팝오버 미니창 */}
                                                                    {activePopoverAuthor === comment.author && (
                                                                        <div className="absolute z-10 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
                                                                            <div className="p-4">
                                                                                <div className="flex items-center justify-between mb-3">
                                                                                    <div className="flex items-center">
                                                                                        <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 overflow-hidden">
                                                                                            <img
                                                                                                src={`https://randomuser.me/api/portraits/${
                                                                                                    comment.author ===
                                                                                                    '이지은'
                                                                                                        ? 'women/44.jpg'
                                                                                                        : 'men/32.jpg'
                                                                                                }`}
                                                                                                alt="프로필"
                                                                                                className="w-full h-full object-cover"
                                                                                            />
                                                                                        </div>
                                                                                        <button
                                                                                            onClick={() =>
                                                                                                handleProfileClick(
                                                                                                    comment.author,
                                                                                                )
                                                                                            }
                                                                                            className="font-medium hover:text-[#2E804E] transition-colors duration-200"
                                                                                        >
                                                                                            {comment.author}
                                                                                        </button>
                                                                                    </div>
                                                                                    <button
                                                                                        onClick={() =>
                                                                                            router.push('/mypage')
                                                                                        }
                                                                                        className="text-gray-500 hover:text-[#2E804E] transition-colors duration-200"
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
                                                                                <button
                                                                                    onClick={() =>
                                                                                        toggleCommentFollow(
                                                                                            comment.author,
                                                                                        )
                                                                                    }
                                                                                    className={`w-full px-4 py-2 text-sm rounded-md transition-colors duration-200 ${
                                                                                        commentFollowStatus[
                                                                                            comment.author
                                                                                        ]
                                                                                            ? 'text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300'
                                                                                            : 'text-white bg-[#2E804E] hover:bg-[#246A40]'
                                                                                    }`}
                                                                                >
                                                                                    {commentFollowStatus[comment.author]
                                                                                        ? '팔로우 취소'
                                                                                        : '팔로우 하기'}
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <span className="mx-2 text-xs text-gray-500">•</span>
                                                                <p className="text-xs text-gray-500">{comment.date}</p>
                                                            </div>
                                                            {editingCommentId === comment.id ? (
                                                                <div className="mt-2 w-full">
                                                                    <textarea
                                                                        value={editedCommentContent}
                                                                        onChange={(e) =>
                                                                            setEditedCommentContent(e.target.value)
                                                                        }
                                                                        className="w-full p-3 border rounded-md min-h-[80px] focus:outline-none focus:ring-2 focus:ring-green-500"
                                                                        rows={3}
                                                                    />
                                                                    <div className="flex justify-end mt-2 space-x-2 min-w-[200px]">
                                                                        <button
                                                                            onClick={() => setEditingCommentId(null)}
                                                                            className="px-4 py-1.5 text-sm text-gray-600 border rounded-md hover:bg-gray-100 w-[80px]"
                                                                        >
                                                                            취소
                                                                        </button>
                                                                        <button
                                                                            onClick={() =>
                                                                                handleCommentEditSave(comment.id)
                                                                            }
                                                                            className="px-4 py-1.5 text-sm text-white bg-[#2E804E] rounded-md hover:bg-[#246A40] w-[80px]"
                                                                        >
                                                                            저장
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <p className="mt-1">{comment.content}</p>
                                                                    <div className="flex items-center mt-2 text-sm text-gray-500">
                                                                        <button
                                                                            className="flex items-center mr-4"
                                                                            onClick={() => toggleLike(comment.id)}
                                                                        >
                                                                            {/* 기존 좋아요 버튼 내용 */}
                                                                        </button>
                                                                        {!hasReplied[comment.id] && (
                                                                            <button
                                                                                className="flex items-center"
                                                                                onClick={() =>
                                                                                    toggleReplyForm(comment.id)
                                                                                }
                                                                            >
                                                                                {/* 기존 답글 버튼 내용 */}
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                        {!editingCommentId && (
                                                            <div className="flex space-x-2">
                                                                <button
                                                                    onClick={() =>
                                                                        handleCommentEdit(comment.id, comment.content)
                                                                    }
                                                                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className="h-4 w-4"
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
                                                                <button
                                                                    onClick={() => handleCommentDelete(comment.id)}
                                                                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className="h-4 w-4"
                                                                        fill="none"
                                                                        viewBox="0 0 24 24"
                                                                        stroke="currentColor"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth={2}
                                                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                                        />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center mt-2 text-sm text-gray-500">
                                                        <button
                                                            className="flex items-center mr-4"
                                                            onClick={() => toggleLike(comment.id)}
                                                        >
                                                            {likedComments[comment.id] ? (
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="h-4 w-4 mr-1 text-red-500"
                                                                    viewBox="0 0 20 20"
                                                                    fill="currentColor"
                                                                >
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l-1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                                                        clipRule="evenodd"
                                                                    />
                                                                </svg>
                                                            ) : (
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="h-4 w-4 mr-1"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                                                    />
                                                                </svg>
                                                            )}
                                                            좋아요 {comment.likes}
                                                        </button>
                                                        {!hasReplied[comment.id] && (
                                                            <button
                                                                className="flex items-center"
                                                                onClick={() => toggleReplyForm(comment.id)}
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="h-4 w-4 mr-1"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                                                                    />
                                                                </svg>
                                                                답글
                                                            </button>
                                                        )}
                                                    </div>

                                                    {/* 답글 입력 폼 */}
                                                    {activeReplyId === comment.id && (
                                                        <div className="mt-4 pl-5 border-l-2 border-gray-200">
                                                            <textarea
                                                                className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                                                                rows={2}
                                                                placeholder="답글을 작성해주세요."
                                                                value={replyInputs[comment.id] || ''}
                                                                onChange={(e) =>
                                                                    handleReplyInputChange(comment.id, e.target.value)
                                                                }
                                                            ></textarea>
                                                            <div className="flex justify-end mt-2 space-x-2">
                                                                <button
                                                                    onClick={handleReplyCancel}
                                                                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                                                                >
                                                                    취소
                                                                </button>
                                                                <button
                                                                    onClick={() => handleReplySubmit(comment.id)}
                                                                    className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                                                                >
                                                                    등록
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* 답글 목록 */}
                                                    {comment.replies.length > 0 && (
                                                        <div className="mt-4 pl-5 border-l-2 border-gray-200 space-y-4">
                                                            {comment.replies.map((reply) => (
                                                                <div key={reply.id} className="pt-2">
                                                                    <div className="flex items-start">
                                                                        <div className="w-6 h-6 rounded-full bg-gray-300 mr-2 overflow-hidden">
                                                                            <img
                                                                                src={`https://randomuser.me/api/portraits/men/${
                                                                                    reply.id % 50
                                                                                }.jpg`}
                                                                                alt="프로필"
                                                                                className="w-full h-full object-cover"
                                                                            />
                                                                        </div>
                                                                        <div className="flex-1">
                                                                            <div className="flex items-center justify-between">
                                                                                <div>
                                                                                    {/* 답글 작성자 부분 수정 */}
                                                                                    <div className="flex items-center">
                                                                                        <div className="relative">
                                                                                            <button
                                                                                                onClick={() =>
                                                                                                    toggleCommentPopover(
                                                                                                        reply.author,
                                                                                                    )
                                                                                                }
                                                                                                className="font-medium text-sm hover:text-[#2E804E] transition-colors duration-200"
                                                                                            >
                                                                                                {reply.author}
                                                                                            </button>

                                                                                            {/* 답글 작성자 팝오버 미니창 */}
                                                                                            {activePopoverAuthor ===
                                                                                                reply.author && (
                                                                                                <div className="absolute z-10 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
                                                                                                    <div className="p-4">
                                                                                                        <div className="flex items-center mb-3">
                                                                                                            <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 overflow-hidden">
                                                                                                                <img
                                                                                                                    src={`https://randomuser.me/api/portraits/men/${
                                                                                                                        reply.id %
                                                                                                                        50
                                                                                                                    }.jpg`}
                                                                                                                    alt="프로필"
                                                                                                                    className="w-full h-full object-cover"
                                                                                                                />
                                                                                                            </div>
                                                                                                            <button
                                                                                                                onClick={() =>
                                                                                                                    handleProfileClick(
                                                                                                                        reply.author,
                                                                                                                    )
                                                                                                                }
                                                                                                                className="font-medium hover:text-[#2E804E] transition-colors duration-200"
                                                                                                            >
                                                                                                                {
                                                                                                                    reply.author
                                                                                                                }
                                                                                                            </button>
                                                                                                        </div>
                                                                                                        <button
                                                                                                            onClick={() => {
                                                                                                                toggleCommentFollow(
                                                                                                                    reply.author,
                                                                                                                )
                                                                                                            }}
                                                                                                            className={`w-full px-4 py-2 text-sm rounded-md transition-colors duration-200 ${
                                                                                                                commentFollowStatus[
                                                                                                                    reply
                                                                                                                        .author
                                                                                                                ]
                                                                                                                    ? 'text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300'
                                                                                                                    : 'text-white bg-[#2E804E] hover:bg-[#246A40]'
                                                                                                            }`}
                                                                                                        >
                                                                                                            {commentFollowStatus[
                                                                                                                reply
                                                                                                                    .author
                                                                                                            ]
                                                                                                                ? '팔로우 취소'
                                                                                                                : '팔로우 하기'}
                                                                                                        </button>
                                                                                                    </div>
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                        <span className="mx-2 text-xs text-gray-500">
                                                                                            •
                                                                                        </span>
                                                                                        <p className="text-xs text-gray-500">
                                                                                            {reply.date}
                                                                                        </p>
                                                                                    </div>
                                                                                    {editingReplyId === reply.id ? (
                                                                                        <div className="mt-2 w-full">
                                                                                            <textarea
                                                                                                value={
                                                                                                    editedReplyContent
                                                                                                }
                                                                                                onChange={(e) =>
                                                                                                    setEditedReplyContent(
                                                                                                        e.target.value,
                                                                                                    )
                                                                                                }
                                                                                                className="w-full p-3 border rounded-md min-h-[80px] focus:outline-none focus:ring-2 focus:ring-green-500"
                                                                                                rows={3}
                                                                                            />
                                                                                            <div className="flex justify-end mt-2 space-x-2">
                                                                                                <button
                                                                                                    onClick={() =>
                                                                                                        setEditingReplyId(
                                                                                                            null,
                                                                                                        )
                                                                                                    }
                                                                                                    className="px-4 py-1.5 text-sm text-gray-600 border rounded-md hover:bg-gray-100"
                                                                                                >
                                                                                                    취소
                                                                                                </button>
                                                                                                <button
                                                                                                    onClick={() =>
                                                                                                        handleReplyEditSave(
                                                                                                            comment.id,
                                                                                                            reply.id,
                                                                                                        )
                                                                                                    }
                                                                                                    className="px-4 py-1.5 text-sm text-white bg-[#2E804E] rounded-md hover:bg-[#246A40]"
                                                                                                >
                                                                                                    저장
                                                                                                </button>
                                                                                            </div>
                                                                                        </div>
                                                                                    ) : (
                                                                                        <p className="mt-1 text-sm">
                                                                                            {reply.content}
                                                                                        </p>
                                                                                    )}
                                                                                </div>
                                                                                {!editingReplyId && (
                                                                                    <div className="flex space-x-2">
                                                                                        <button
                                                                                            onClick={() =>
                                                                                                handleReplyEdit(
                                                                                                    comment.id,
                                                                                                    reply.id,
                                                                                                    reply.content,
                                                                                                )
                                                                                            }
                                                                                            className="text-gray-400 hover:text-gray-600"
                                                                                        >
                                                                                            <svg
                                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                                className="h-4 w-4"
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
                                                                                        <button
                                                                                            onClick={() =>
                                                                                                handleReplyDelete(
                                                                                                    comment.id,
                                                                                                    reply.id,
                                                                                                )
                                                                                            }
                                                                                            className="text-gray-400 hover:text-gray-600"
                                                                                        >
                                                                                            <svg
                                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                                className="h-4 w-4"
                                                                                                fill="none"
                                                                                                viewBox="0 0 24 24"
                                                                                                stroke="currentColor"
                                                                                            >
                                                                                                <path
                                                                                                    strokeLinecap="round"
                                                                                                    strokeLinejoin="round"
                                                                                                    strokeWidth={2}
                                                                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                                                                />
                                                                                            </svg>
                                                                                        </button>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                            {/* 답글 좋아요 버튼 추가 */}
                                                                            <div className="flex items-center mt-2 text-sm text-gray-500">
                                                                                <button
                                                                                    className="flex items-center mr-4"
                                                                                    onClick={() =>
                                                                                        toggleReplyLike(
                                                                                            comment.id,
                                                                                            reply.id,
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    {likedReplies[reply.id] ? (
                                                                                        <svg
                                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                                            className="h-4 w-4 mr-1 text-red-500"
                                                                                            viewBox="0 0 20 20"
                                                                                            fill="currentColor"
                                                                                        >
                                                                                            <path
                                                                                                fillRule="evenodd"
                                                                                                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l-1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                                                                                clipRule="evenodd"
                                                                                            />
                                                                                        </svg>
                                                                                    ) : (
                                                                                        <svg
                                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                                            className="h-4 w-4 mr-1"
                                                                                            fill="none"
                                                                                            viewBox="0 0 24 24"
                                                                                            stroke="currentColor"
                                                                                        >
                                                                                            <path
                                                                                                strokeLinecap="round"
                                                                                                strokeLinejoin="round"
                                                                                                strokeWidth={2}
                                                                                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                                                                            />
                                                                                        </svg>
                                                                                    )}
                                                                                    좋아요 {reply.likes}
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 목록 컨테이너 - 별도로 분리 */}
                    <div className="bg-white rounded-lg shadow-sm p-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold">
                                후기글 ({categories.find((cat) => cat.name === '후기글')?.count || 0})
                            </h2>
                            <button onClick={toggleList} className="text-gray-600 hover:text-gray-800">
                                {isListVisible ? '목록접기' : '목록보기'}
                            </button>
                        </div>

                        {isListVisible && (
                            <>
                                <div className="space-y-4">
                                    {getCurrentPagePosts().map((post) => (
                                        <div
                                            key={post.id}
                                            className="flex justify-between items-center py-2 hover:bg-gray-50 cursor-pointer"
                                            onClick={() => router.push(`/detail/${post.id}`)}
                                        >
                                            <div className="flex-1">
                                                <h3 className="text-base mb-1">
                                                    {post.title}
                                                    {post.replies && (
                                                        <span className="text-[#2E804E] ml-2">({post.replies})</span>
                                                    )}
                                                </h3>
                                                <p className="text-sm text-gray-500">{post.date}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* 페이지네이션 */}
                                <div className="flex justify-center mt-8 space-x-2">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                        <button
                                            key={num}
                                            onClick={() => handlePageChange(num)}
                                            className={`w-8 h-8 flex items-center justify-center rounded transition-colors duration-200 ${
                                                num === currentPage
                                                    ? 'text-white bg-[#2E804E]'
                                                    : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* 카테고리 사이드바 */}
                <div className="w-64 flex-shrink-0">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div>
                            <ul className="space-y-2">
                                {/* 메인 카테고리 */}
                                <li className="text-gray-700">
                                    <span className="font-semibold block">메인 카테고리</span>
                                    <span>{post.mainCategory}</span> {/* 메인 카테고리 이름 */}
                                </li>
                                {/* 서브 카테고리 */}
                                <li className="text-gray-700">
                                    <span className="font-semibold block">서브 카테고리</span>
                                    <span>{post.category}</span> {/* 서브 카테고리 이름 */}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
