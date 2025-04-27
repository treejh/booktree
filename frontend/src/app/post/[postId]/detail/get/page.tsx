'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import React from 'react'
import { useGlobalLoginUser } from '@/stores/auth/loginMember'


// 1. 카테고리 관련 인터페이스 추가
interface Category {
    id: number
    name: string
}

interface MainCategory {
    id: number
    name: string
}

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
    mainCategoryId: number // 추가
    categoryId: number // 추가
    blogId?: number
    category: string
    book: string
    images?: string[]
}



interface Comment {
    id: number
    author: string
    date: string
    content: string
    likes: number
    replies: Reply[]
}

interface Reply {
    id: number
    author: string
    date: string
    content: string
    likes: number
}

interface Category {
    name: string
    count: number
    path: string
    isParent?: boolean
    isOpen?: boolean
    subCategories?: Category[]
}

interface RelatedPost {
    id: number
    title: string
    date: string
    replies?: number
}

interface PostList {
    id: number
    title: string
    date: string
    replies?: number
}


export default function DetailPage() {
    // 2. 모든 hooks를 최상단에 배치
    const router = useRouter()
    const { postId } = useParams()
    // 로그인 상태와 토큰 정보 함께 꺼내기
    const { isLoginUserPending, isLogin, loginUser } = useGlobalLoginUser()

    // 3. 작성자 확인 상태 추가
    const [isAuthor, setIsAuthor] = useState(false)

    // 4. 기존 상태들
    const [post, setPost] = useState<PostDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isPostEditing, setIsPostEditing] = useState(false)
    const [editedPost, setEditedPost] = useState({
        title: '',
        content: '',
        author: '',
        book: '',
        mainCategoryId: 0,
        categoryId: 0,
        imageUrls: [] as string[],
        images: [] as File[],
    })
    const [postLiked, setPostLiked] = useState(false)

    // API 엔드포인트
    const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8090'

    // 2. 댓글 관련 상태
    const [comments, setComments] = useState<Comment[]>([])
    const [commentInput, setCommentInput] = useState('')
    const [likedComments, setLikedComments] = useState<{ [k: number]: boolean }>({})
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
    const [editedCommentContent, setEditedCommentContent] = useState('')
    const [commentError, setCommentError] = useState<string | null>(null) // → 댓글 로드 에러

    // 3. 답글 관련 상태
    const [replyInputs, setReplyInputs] = useState<{ [parentKey: string]: string }>({})

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
    const [categories, setCategories] = useState<Category[]>([])
    const [mainCategories, setMainCategories] = useState<MainCategory[]>([])
    const [userId, setUserId] = useState()


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

    // --- 댓글 불러오기 ---
    const fetchComments = async () => {
        if (!postId) return
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/comments/get?postId=${postId}&page=1&size=10`,
                {
                    credentials: 'include',
                },
            )
            if (!res.ok) throw new Error('댓글을 불러오는데 실패했습니다.')
            const json = await res.json()

            // 백엔드 DTO → 프론트 인터페이스로 변환
            const mapped: Comment[] = json.content.map((c: any) => ({
                id: c.commentId,
                author: c.userEmail,
                date: new Date(c.createdAt).toLocaleDateString(),
                content: c.content,
                likes: (c as any).likeCount ?? 0,
                replies: c.replies.content.map((r: any) => ({
                    id: r.replyId,
                    author: r.userEmail,
                    date: new Date(r.createdAt).toLocaleDateString(),
                    content: r.content,
                    likes: (r as any).likeCount ?? 0,
                })),
            }))

            setComments(mapped)
            setCommentError(null)
        } catch (e: any) {
            setCommentError(e.message)
        }
    }

    useEffect(() => {
        fetchComments()
    }, [postId])

    // 게시물 좋아요 토글 함수
    const togglePostLike = () => {
        setPostLiked(!postLiked)
        setPost((prev) => ({
            ...prev!,
            likeCount: postLiked ? Math.max(0, prev!.likeCount - 1) : prev!.likeCount + 1,
        }))
    }

    // --- 댓글 작성 (로그인 필요) ---
    // --- 댓글 작성 핸들러 (절대경로로 수정) ---
    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!isLogin) {
            alert('로그인 후 댓글을 작성할 수 있습니다.')
            router.push('/login')
            return
        }
        if (!commentInput.trim()) return

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/comments/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    postId: Number(postId),
                    content: commentInput.trim(),
                }),
            })
            if (!res.ok) {
                const err = await res.json().catch(() => ({} as any))
                throw new Error(err.message || '댓글 생성에 실패했습니다.')
            }

            // 백엔드 원본 DTO
            const raw = await res.json()

            // 프론트 Comment 형태로 매핑
            const newComment: Comment = {
                id: raw.commentId,
                author: raw.userEmail,
                date: new Date(raw.createdAt).toLocaleDateString(),
                content: raw.content,
                likes: raw.likeCount || 0,
                replies: raw.replies.content.map((r: any) => ({
                    id: r.replyId,
                    author: r.userEmail,
                    date: new Date(r.createdAt).toLocaleDateString(),
                    content: r.content,
                    likes: r.likeCount || 0,
                })),
            }

            setComments([newComment, ...comments])
            setCommentInput('')
            setCommentError(null)
        } catch (e: any) {
            setCommentError(e.message)
        }
    }

    // --- 좋아요 토글 예시 ---
    const toggleLike = async (commentId: number) => {
        try {
            // 1-1) 서버에 좋아요 요청 (토글)
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/comments/${commentId}/like`, {
                method: 'POST', // 또는 PUT/PATCH, 백엔드 명세에 맞춰
                credentials: 'include',
            })
            if (!res.ok) throw new Error('좋아요 요청 실패')
            // 1-2) 응답으로 현재 좋아요 카운트를 받아온다고 가정
            const { likeCount } = await res.json()

            // 1-3) 로컬 state 업데이트
            setComments((cs) => cs.map((c) => (c.id === commentId ? { ...c, likes: likeCount } : c)))
        } catch (e: any) {
            setCommentError(e.message)
        }
    }

    // 답글 좋아요 토글 함수
    const toggleReplyLike = (commentId: number, replyId: number) => {
        setLikedReplies((prev) => {
            const newLiked = { ...prev, [replyId]: !prev[replyId] }
            setComments(
                comments.map((c) =>
                    c.id === commentId
                        ? {
                              ...c,
                              replies: c.replies.map((r) =>
                                  r.id === replyId
                                      ? { ...r, likes: newLiked[replyId] ? r.likes + 1 : Math.max(0, r.likes - 1) }
                                      : r,
                              ),
                          }
                        : c,
                ),
            )
            return newLiked
        })
    }

    // 답글 작성 창 토글
    const toggleReplyForm = (commentId: number) => {
        setActiveReplyId(activeReplyId === commentId ? null : commentId)
        if (!replyInputs[commentId]) {
            setReplyInputs({ ...replyInputs, [commentId]: '' })
        }
    }

    const followUser = async (followeeId: number) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/follow/create/follow`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ followeeId }),
            })

            if (!res.ok) throw new Error('팔로우 요청 실패')
            console.log(`팔로우 완료: ${followeeId}`)
        } catch (err) {
            console.error(err)
        }
    }

    const unfollowUser = async (followeeId: number) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/follow/delete/unfollow`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ followeeId }),
            })

            if (!res.ok) throw new Error('언팔로우 요청 실패')
            console.log(`언팔로우 완료: ${followeeId}`)
        } catch (err) {
            console.error(err)
        }
    }

    const handleFollowClick = async () => {
        if (!isLogin) {
            alert('로그인이 필요합니다.')
            router.push('/account/login')
            return
        }

        try {
            if (isFollowing) {
                // ✅ 팔로우 상태면 → 언팔로우 요청
                await unfollowUser(userId)
                setIsFollowing(false)
            } else {
                // ✅ 아직 팔로우 안 했으면 → 팔로우 요청
                await followUser(userId)
                setIsFollowing(true)
            }
        } catch (error) {
            console.error('팔로우/언팔로우 실패:', error)
        }
    }

    // 답글 입력 핸들러
    const handleReplyInputChange = (commentId: number, value: string) => {
        setReplyInputs({ ...replyInputs, [commentId]: value })
    }

    // 답글 수정 시작
    const handleReplyEdit = (commentId: number, replyId: number, content: string) => {
        setEditingReplyId(replyId)
        setEditedReplyContent(content)
    }

    // 답글 수정 저장
    const handleReplyEditSave = (commentId: number, replyId: number) => {
        setComments(
            comments.map((c) =>
                c.id === commentId
                    ? {
                          ...c,
                          replies: c.replies.map((r) => (r.id === replyId ? { ...r, content: editedReplyContent } : r)),
                      }
                    : c,
            ),
        )
        setEditingReplyId(null)
    }

    // 답글 삭제
    const handleReplyDelete = (commentId: number, replyId: number) => {
        setComments(
            comments.map((c) =>
                c.id === commentId ? { ...c, replies: c.replies.filter((r) => r.id !== replyId) } : c,
            ),
        )
        setHasReplied({ ...hasReplied, [commentId]: false })
    }

    // 댓글 수정 시작
    const handleCommentEdit = (commentId: number, content: string) => {
        setEditingCommentId(commentId)
        setEditedCommentContent(content)
    }

    // 댓글 수정 저장
    const handleCommentEditSave = async (commentId: number) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/comments/update/${commentId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    commentId, // ★ 이 라인을 추가
                    content: editedCommentContent, // 수정된 내용
                }),
            })

            if (!res.ok) {
                // 서버가 보낸 메시지도 살펴보려면 아래처럼:
                const err = await res.json().catch(() => ({} as any))
                throw new Error(err.message ?? '댓글 수정에 실패했습니다.')
            }

            // 서버가 반환하는 CommentDto.Response
            const updated = await res.json()

            // 프론트 state 업데이트
            setComments((cs) => cs.map((c) => (c.id === updated.commentId ? { ...c, content: updated.content } : c)))

            // 편집 모드 종료
            setEditingCommentId(null)
            setCommentError(null)
        } catch (e: any) {
            setCommentError(e.message)
        }
    }

    // 댓글 삭제 (API 호출 추가)
    const handleCommentDelete = async (commentId: number) => {
        if (!confirm('정말 이 댓글을 삭제하시겠습니까?')) return
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/comments/delete/${commentId}`, {
                method: 'DELETE',
                credentials: 'include',
            })
            if (!res.ok) throw new Error('댓글 삭제에 실패했습니다.')
            // 정상 삭제시 state 에서 제거
            setComments((cs) => cs.filter((c) => c.id !== commentId))
            // 혹시 떠 있는 에러 메시지도 지워주면 좋습니다.
            setCommentError(null)
        } catch (e: any) {
            setCommentError(e.message)
        }
    }

    // 답글 제출
    const handleReplySubmit = (commentId: number) => {
        if (!replyInputs[commentId]?.trim()) return
        if (hasReplied[commentId]) return

        const newReply: Reply = {
            id: Date.now(),
            author: loginUser.username,
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

        setComments(comments.map((c) => (c.id === commentId ? { ...c, replies: [...c.replies, newReply] } : c)))
        setReplyInputs({ ...replyInputs, [commentId]: '' })
        setActiveReplyId(null)
        setHasReplied({ ...hasReplied, [commentId]: true })
    }

    const handleReplyCancel = () => setActiveReplyId(null)

    const handleCategoryClick = (path: string) => router.push(path)
    const toggleCategory = (idx: number) =>
        setCategories(categories.map((cat, i) => (i === idx ? { ...cat, isOpen: !cat.isOpen } : cat)))

    const toggleCommentPopover = (author: string) =>
        setActivePopoverAuthor(activePopoverAuthor === author ? null : author)
    const toggleCommentFollow = (author: string) =>
        setCommentFollowStatus({
            ...commentFollowStatus,
            [author]: !commentFollowStatus[author],
        })

    const handleProfileClick = (username: string) => router.push('/mypage')

    useEffect(() => {
        const handleOutside = (e: MouseEvent) => {
            if ((showPopover || activePopoverAuthor) && !(e.target as HTMLElement).closest('.relative')) {
                setShowPopover(false)
                setActivePopoverAuthor(null)
            }
        }
        document.addEventListener('mousedown', handleOutside)
        return () => document.removeEventListener('mousedown', handleOutside)
    }, [showPopover, activePopoverAuthor])



    // 게시글 불러오기
    useEffect(() => {
        const fetchUserId = async () => {
            try {
                setLoading(true)
                const response = await fetch(`http://localhost:8090/api/v1/posts/get/userid/${postId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })

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
    }, [postId])

    useEffect(() => {
        const fetchIsFollowing = async () => {
            if (!userId || !isLogin) return // userId가 아직 없으면 요청 안 보냄

            try {
                setLoading(true)
                const response = await fetch(`http://localhost:8090/api/v1/follow/get/isfollowing/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                })

                if (!response.ok) {
                    throw new Error('팔로우 현황을 불러오는 데 실패했습니다.')
                }

                const data = await response.json()
                console.log('팔로우 여부:', data)
                setIsFollowing(data)
            } catch (err) {
                console.error('Error fetching isFollowing:', err)
                setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
            } finally {
                setLoading(false)
            }
        }

        fetchIsFollowing()
    }, [userId])

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true)
                const response = await fetch(`http://localhost:8090/api/v1/categories/get/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })

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


    // 게시글을 불러오는 함수
    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true)

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/posts/get/${postId}`, {
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

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/posts/get/${postId}`)
                if (!res.ok) throw new Error('게시글 불러오기 실패')
                const data = await res.json()
                const formatted: PostDetail = {
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
                    mainCategoryId: data.mainCategoryId || 0, // 수정
                    categoryId: data.categoryId || 0, // 수정
                    category: data.category || '', // category 값 처리
                    book: data.book || '', // book 값 처리
                    author: data.author,
                    mainCategoryId: data.mainCategoryId,
                    blogId: data.blogId,
                    categoryId: data.categoryId,
                    book: data.book,
                    images: data.images,

                }
                setPost(formatted)
                setEditedPost({

                    title: formattedPost.title,
                    content: formattedPost.content,
                    author: formattedPost.author,
                    book: formattedPost.book,
                    mainCategoryId: formattedPost.mainCategoryId, // 수정
                    categoryId: formattedPost.categoryId, // 수정
                    //mainCategoryId: parseInt(formattedPost.mainCategory) || 0,
                    //categoryId: parseInt(formattedPost.category) || 0,
                    imageUrls: [...formattedPost.imageUrls],
                    images: [],
                    title: formatted.title,
                    content: formatted.content,

                })
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        if (postId) fetchPost()
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

    // 카테고리 데이터 불러오기 useEffect 수정
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // 메인 카테고리 가져오기
                const mainResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/maincategories/get`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include', // 이 부분 추가
                })

                if (!mainResponse.ok) {
                    throw new Error('메인 카테고리를 불러오는데 실패했습니다.')
                }

                const mainData = await mainResponse.json()
                console.log('메인 카테고리 데이터:', mainData)
                setMainCategories(mainData)

                // 유저의 카테고리 가져오기
                const categoryResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/categories/get/allcategory`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                    },
                )

                if (!categoryResponse.ok) {
                    throw new Error('카테고리를 불러오는데 실패했습니다.')
                }

                const categoryData = await categoryResponse.json()
                console.log('카테고리 데이터:', categoryData)
                setCategories(categoryData)
            } catch (error) {
                console.error('카테고리 로드 에러:', error)
                setMainCategories([])
                setCategories([])
            }
        }

        fetchCategories()
    }, [])

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

    if (loading) return <div>Loading...</div>
    if (error) return <div className="text-red-500">게시글 로드 에러: {error}</div>
    if (!post) return <div>게시글을 찾을 수 없습니다.</div>


    const toggleList = () => setIsListVisible(!isListVisible)
    const handlePageChange = (n: number) => setCurrentPage(n)

    // handlePostEdit 함수 수정
    const handlePostEdit = async () => {
        if (!post || !loginUser) return

        try {
            const blogResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/blogs/get/token`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            })

            if (!blogResponse.ok) {
                throw new Error('블로그 정보를 가져오는데 실패했습니다.')
            }

            const blogData = await blogResponse.json()

            // FormData 생성
            const formData = new FormData()

            // 필수 필드들
            formData.append('blogId', blogData.blogId.toString())
            formData.append('title', editedPost.title)
            formData.append('content', editedPost.content)

            // 카테고리 ID 처리 수정
            const mainCategoryId = parseInt(editedPost.mainCategoryId.toString())
            const categoryId = parseInt(editedPost.categoryId.toString())

            // 카테고리 ID들 추가 - 명시적으로 숫자로 변환 후 문자열로 변환
            formData.append('mainCategoryId', Number(editedPost.mainCategoryId).toString())
            formData.append('categoryId', Number(editedPost.categoryId).toString())

            console.log('전송되는 카테고리 정보:', {
                mainCategoryId: editedPost.mainCategoryId,
                categoryId: editedPost.categoryId,
            })

            // 기타 필드들
            if (editedPost.author) formData.append('author', editedPost.author)
            if (editedPost.book) formData.append('book', editedPost.book)

            // 이미지 파일 추가
            editedPost.images.forEach((file) => {
                formData.append('images', file)
            })

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/posts/patch/${post.postId}`, {
                method: 'PATCH',
                credentials: 'include',
                body: formData,
            })

            if (!response.ok) {
                const errorData = await response.text()
                console.error('서버 응답:', errorData)
                throw new Error('게시글 수정에 실패했습니다.')
            }

            alert('게시글이 성공적으로 수정되었습니다.')
            setIsPostEditing(false)
            window.location.reload()
        } catch (error) {
            console.error('게시글 수정 실패:', error)
            alert('게시글 수정에 실패했습니다.')
        }
    }

    // 이미지 파일 선택 핸들러 추가
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files) {
            setEditedPost((prev) => ({
                ...prev,
                images: [...Array.from(files)],
            }))
        }
    }

    // 수정 모드 진입 시 초기값 설정
    const startEditing = () => {
        setEditedPost({
            title: post!.title,
            content: post!.content,
            author: post!.author,
            book: post!.book,
            mainCategoryId: post!.mainCategoryId, // parseInt 제거하고 직접 ID 사용
            categoryId: post!.categoryId, // parseInt 제거하고 직접 ID 사용
            imageUrls: [...post!.imageUrls],
            images: [],
        })
        setIsPostEditing(true)
    }

    // 수정 취소 핸들러
    const cancelEditing = () => {
        setIsPostEditing(false)
        setEditedPost({
            title: post!.title,
            content: post!.content,
            author: post!.author,
            book: post!.book,
            mainCategoryId: post!.mainCategoryId, // parseInt 제거하고 직접 ID 사용
            categoryId: post!.categoryId, // parseInt 제거하고 직접 ID 사용
            imageUrls: [...post!.imageUrls],
            images: [],
        })
    }

    // handlePostDelete 함수 추가
    const handlePostDelete = async () => {
        if (!post || !loginUser) return

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/posts/delete/${post.postId}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) {
                throw new Error('게시글 삭제에 실패했습니다.')
            }

            alert('게시글이 성공적으로 삭제되었습니다.')
            router.push('/') // 홈페이지로 리다이렉트
        } catch (error) {
            console.error('게시글 삭제 실패:', error)
            alert('게시글 삭제에 실패했습니다.')
        }
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl bg-gray-50">
            <div className="flex gap-8">
                {/* 메인 컨텐츠 */}
                <div className="flex-1">

                    {isPostEditing ? (
                        // 수정 모드
                        <div className="bg-white rounded-lg shadow-sm p-8">
                            <div className="max-w-4xl mx-auto">
                                {/* Title Input */}
                                <div className="mb-8">

                    {/* 게시글 */}
                    <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
                        {/* 헤더 */}
                        <div className="mb-10">
                            <div className="flex justify-between items-center mb-4">
                                {isPostEditing ? (
                                    <input
                                        type="text"
                                        value={editedPost.title}
                                        onChange={(e) =>
                                            setEditedPost({
                                                ...editedPost,
                                                title: e.target.value,
                                            })
                                        }

                                        placeholder="제목"
                                        className="w-full py-3 text-4xl font-light border-0 border-b border-gray-200 focus:outline-none focus:border-gray-300 focus:ring-0 placeholder-gray-400"
                                    />
                                </div>

                                {/* Author & Book Info */}
                                <div className="space-y-6 mb-8">
                                    <div>
                                        {/* <label className="block text-sm font-medium text-gray-700 mb-2">작가</label> */}
                                        <input
                                            type="text"
                                            value={editedPost.author}
                                            onChange={(e) =>
                                                setEditedPost({
                                                    ...editedPost,
                                                    author: e.target.value,
                                                })
                                            }
                                            placeholder="작가를 입력하세요"
                                            className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black-500"
                                        />
                                    </div>
                                    <div>
                                        {/* <label className="block text-sm font-medium text-gray-700 mb-2">책 제목</label> */}
                                        <input
                                            type="text"
                                            value={editedPost.book}
                                            onChange={(e) =>
                                                setEditedPost({
                                                    ...editedPost,
                                                    book: e.target.value,
                                                })
                                            }
                                            placeholder="책 제목을 입력하세요"
                                            className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black-500"
                                        />
                                    </div>

                                        className="text-2xl font-bold w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                ) : (
                                    <h1 className="text-2xl font-bold">{post.title}</h1>
                                )}
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
                                                        title: post.title,
                                                        content: post.content,
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
                                                onClick={() => setIsPostEditing(true)}
                                                className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 cursor-pointer"
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
                                            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 cursor-pointer">
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

                                {/* Image Upload */}
                                <div className="mb-8">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">이미지 첨부</label>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageSelect}
                                        className="block w-full text-sm text-gray-500
                                            file:mr-4 file:py-2.5 file:px-4
                                            file:rounded-md file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-green-50 file:text-green-700
                                            hover:file:bg-green-100
                                            cursor-pointer"
                                    />
                                </div>

                                {/* Text Formatting Toolbar */}
                                <div className="border border-gray-200 rounded-t-lg p-2 bg-gray-50 flex space-x-2">
                                    <button className="p-2 hover:bg-gray-200 rounded" title="굵게">
                                        <svg
                                            className="w-4 h-4"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6V4z"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6V12z"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </button>
                                    <button className="p-2 hover:bg-gray-200 rounded" title="기울임">
                                        <svg
                                            className="w-4 h-4"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M19 4h-9M14 20H5M15 4L9 20"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </button>
                                    <button className="p-2 hover:bg-gray-200 rounded" title="밑줄">
                                        <svg
                                            className="w-4 h-4"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M6 3v7a6 6 0 006 6 6 6 0 006-6V3M4 21h16"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </button>
                                    <div className="w-px h-6 bg-gray-300 mx-2"></div>
                                    <button className="p-2 hover:bg-gray-200 rounded" title="왼쪽 정렬">
                                        <svg
                                            className="w-4 h-4"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M4 6h16M4 12h10M4 18h14"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </button>
                                    <button className="p-2 hover:bg-gray-200 rounded" title="가운데 정렬">
                                        <svg
                                            className="w-4 h-4"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M4 6h16M7 12h10M5 18h14"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </button>
                                </div>

                                {/* Content Area */}
                                <div className="mb-8">
                                    <textarea
                                        value={editedPost.content}
                                        onChange={(e) =>
                                            setEditedPost({
                                                ...editedPost,
                                                content: e.target.value,
                                            })
                                        }
                                        placeholder="내용을 입력하세요"
                                        className="w-full min-h-[500px] p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-green-500"
                                    />
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={cancelEditing}
                                        className="px-6 py-2.5 bg-white text-gray-700 rounded-md border border-gray-300 hover:bg-gray-50 text-sm font-medium"
                                    >
                                        취소
                                    </button>
                                    <button
                                        onClick={handlePostEdit}
                                        className="px-6 py-2.5 bg-[#2E804E] text-white rounded-md hover:bg-[#246A40] text-sm font-medium"
                                    >
                                        수정완료
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
                            {/* 헤더 */}
                            <div className="mb-10">
                                <div className="flex justify-between items-center mb-4">
                                    <h1 className="text-2xl font-bold">{post.title}</h1>
                                    {isAuthor && (
                                        <div className="flex space-x-2">
                                            <button
                                                className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 cursor-pointer"
                                                onClick={startEditing}
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
                                                        handlePostDelete()
                                                    }
                                                }}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5"
                                                    fill="none"
                                                    viewBox="0 24 24"
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

                                                <button
                                                    onClick={handleFollowClick}
                                                    className={`w-full px-4 py-2 text-sm rounded-md transition-colors duration-200 ${
                                                        isFollowing
                                                            ? 'text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300'
                                                            : 'text-white bg-[#2E804E] hover:bg-[#246A40]'
                                                    }`}
                                                >
                                                    {isFollowing ? '팔로우 취소' : '팔로우 하기'}
                                                </button>

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

                                    <div className="flex text-xs text-gray-500">
                                        <span className="mx-2">•</span>
                                        <span>작성일 {post.createdAt}</span>
                                        <span className="mx-2">•</span>
                                        <span>조회수 {post.viewCount}</span>
                                        <span className="mx-2">•</span>
                                        <span>좋아요 {post.likeCount}</span>

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
                                {post.imageUrls.length > 0 && (
                                    <div className="flex flex-col gap-4 mb-8">
                                        {post.imageUrls.map((url, idx) => (
                                            <div key={idx} className="w-full rounded-lg overflow-hidden">
                                                <img
                                                    src={url}
                                                    alt={`게시글 이미지 ${idx + 1}`}
                                                    className="w-full h-auto object-contain max-h-[600px]"
                                                    onError={(e) => {
                                                        e.currentTarget.src =
                                                            'https://booktree-s3-bucket.s3.ap-northeast-2.amazonaws.com/BookTree+%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB+%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5+%E1%84%8E%E1%85%AC%E1%84%8C%E1%85%A9%E1%86%BC%E1%84%87%E1%85%A9%E1%86%AB.png'
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {isPostEditing ? (
                                    <textarea
                                        value={editedPost.content}
                                        onChange={(e) =>
                                            setEditedPost({
                                                ...editedPost,
                                                content: e.target.value,
                                            })
                                        }
                                        className="w-full p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 mb-6"
                                        rows={15}
                                    />
                                ) : (
                                    <div className="mb-6 whitespace-pre-line">{post.content}</div>
                                )}
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

                                    </svg>
                                    좋아요 {post.likeCount}
                                </button>
                            </div>

                            {/* 구분선 */}
                            <div className="border-b border-gray-200 mb-8"></div>


                                {/* 구분선 추가 */}
                                <div className="border-b border-gray-200 mb-8"></div>
                            </div>
                        </div>
                    )}

                    {/* 댓글 섹션은 수정 모드가 아닐 때만 표시 */}
                    {!isPostEditing && (
                        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
                            {/* 댓글 섹션 */}
                            <div>
                                <h2 className="text-xl font-bold mb-4">댓글 {comments.length}</h2>
                                {commentError && <p className="text-red-500 mb-4">댓글 로드 에러: {commentError}</p>}

                                {/* 댓글 입력 폼: 로그인한 사용자만 */}
                                {isLogin ? (
                                    <form onSubmit={handleCommentSubmit} className="mb-6">
                                        <textarea
                                            className="w-full p-2 border rounded mb-2"
                                            rows={3}
                                            placeholder="댓글을 작성하세요."
                                            value={commentInput}
                                            onChange={(e) => setCommentInput(e.target.value)}
                                        />
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                        >
                                            등록
                                        </button>
                                    </form>
                                ) : (
                                    <div className="mb-6 text-center text-gray-600">
                                        <p>댓글 작성은 로그인 후 가능합니다.</p>
                                    </div>
                                )}

                                <div className="space-y-6">
                                    {comments.map((comment) => (
                                        <div key={comment.id} className="border-b pb-6">
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

                                                            {/* 편집 모드 */}
                                                            {editingCommentId === comment.id ? (
                                                                <div className="mt-2">
                                                                    <textarea
                                                                        value={editedCommentContent}
                                                                        onChange={(e) =>
                                                                            setEditedCommentContent(e.target.value)
                                                                        }
                                                                        className="w-full p-2 border rounded mb-2"
                                                                        rows={3}
                                                                    />
                                                                    <div className="flex justify-end space-x-2">
                                                                        <button
                                                                            onClick={() => setEditingCommentId(null)}
                                                                            className="px-3 py-1 text-gray-600 border rounded"
                                                                        >
                                                                            취소
                                                                        </button>
                                                                        <button
                                                                            onClick={() =>
                                                                                handleCommentEditSave(comment.id)
                                                                            }
                                                                            className="px-3 py-1 bg-green-600 text-white rounded"
                                                                        >
                                                                            저장
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <p className="mt-1">{comment.content}</p>
                                                                    <div className="flex space-x-2">
                                                                        {/* 연필 아이콘: 수정 모드로 전환 */}
                                                                        <button
                                                                            onClick={() => {
                                                                                setEditingCommentId(comment.id)
                                                                                setEditedCommentContent(comment.content)
                                                                            }}
                                                                            className="text-gray-400 hover:text-gray-600"
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
                                                                                onClick={() =>
                                                                                    toggleReplyForm(comment.id)
                                                                                }
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
                                                                </>
                                                            )}
                                                        </div>
                                                        {!editingCommentId && (
                                                            <div className="flex space-x-2">
                                                                {/* 연필 아이콘: 수정 모드로 전환 */}
                                                                <button
                                                                    onClick={() =>
                                                                        handleCommentEdit(comment.id, comment.content)
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
                                                                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5
                     2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                                                        />
                                                                    </svg>
                                                                </button>
                                                                {/* 휴지통 아이콘: 삭제 */}
                                                                <button
                                                                    onClick={() => handleCommentDelete(comment.id)}
                                                                    className="text-gray-400 hover:text-gray-600"
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className="h-4 w-4"
                                                                        fill="none"
                                                                        viewBox="0 24 24"
                                                                        stroke="currentColor"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth={2}
                                                                            d="M19 7l-.867
                     12.142A2 2 0 0116.138 21H7.862a2 2
                     0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1
                     1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                                        />
                                                                    </svg>
                                                                </button>
                                                            </div>
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
                                                                    {' '}
                                                                    {/* ← key 에 reply.id */}
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
                                                                                                viewBox="0 24 24"
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

                    )}
                </div>

                {/* 카테고리 사이드바 */}
                <div className="w-64 flex-shrink-0">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        {isPostEditing ? (
                            // 수정 모드일 때 보여줄 카테고리 선택 폼
                            <div className="space-y-6">
                                {/* Regular Category */}
                                <div>
                                    <h3 className="text-lg font-medium mb-4">카테고리 선택3</h3>
                                    <div className="relative mb-4">
                                        <select
                                            value={editedPost.categoryId}
                                            onChange={(e) =>
                                                setEditedPost({
                                                    ...editedPost,
                                                    categoryId: parseInt(e.target.value),
                                                })
                                            }
                                            className="w-full p-2 border border-gray-300 rounded appearance-none"
                                        >
                                            <option value={0}>전체</option>
                                            {categories.map((cat) => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                            </svg>
                    </div>

                    {/* 목록 컨테이너 */}
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
                                    {getCurrentPagePosts().map((p) => (
                                        <div
                                            key={p.id}
                                            className="flex justify-between items-center py-2 hover:bg-gray-50 cursor-pointer"
                                            onClick={() => router.push(`/detail/${p.id}`)}
                                        >
                                            <div className="flex-1">
                                                <h3 className="text-base mb-1">
                                                    {p.title}
                                                    {p.replies && (
                                                        <span className="text-[#2E804E] ml-2">({p.replies})</span>
                                                    )}
                                                </h3>
                                                <p className="text-sm text-gray-500">{p.date}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Main Category */}
                                <div>
                                    <h3 className="text-lg font-medium mb-4">메인 카테고리 선택2</h3>
                                    <div className="relative mb-4">
                                        <select
                                            value={editedPost.mainCategoryId}
                                            onChange={(e) =>
                                                setEditedPost({
                                                    ...editedPost,
                                                    mainCategoryId: parseInt(e.target.value),
                                                })
                                            }
                                            className="w-full p-2 border border-gray-300 rounded appearance-none"
                                        >
                                            <option value={0}>전체</option>
                                            {mainCategories.map((cat) => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // 일반 모드일 때 보여줄 카테고리 정보
                            <div>
                                <ul className="space-y-2">
                                    {/* 카테고리 */}
                                    <li className="text-gray-700">
                                        <span className="font-semibold block">카테고리</span>
                                        <span>{post.category}</span>
                            </>
                        )}
                    </div>
                </div>

                {/* 카테고리 사이드바 */}
                <div className="w-64 flex-shrink-0">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-bold mb-4">카테고리</h2>
                        <div>
                            <ul className="space-y-2">
                                {categories.map((category, index) => (
                                    <li key={category.name}>
                                        {category.isParent ? (
                                            <>
                                                <div className="flex items-center justify-between">
                                                    <button
                                                        onClick={() => toggleCategory(index)}
                                                        className="flex items-center justify-between w-full text-left text-gray-700 hover:text-[#2E804E] transition-colors duration-200"
                                                    >
                                                        <span>
                                                            {category.name}({category.postCount})
                                                        </span>
                                                        <svg
                                                            className={`w-4 h-4 transform transition-transform ${
                                                                category.isOpen ? 'rotate-180' : ''
                                                            }`}
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M19 9l-7 7-7-7"
                                                            />
                                                        </svg>
                                                    </button>
                                                </div>
                                                {category.isOpen && category.subCategories && (
                                                    <ul className="mt-2 ml-4 space-y-2">
                                                        {category.subCategories.map((subCategory) => (
                                                            <li key={subCategory.name}>
                                                                <button
                                                                    onClick={() => router.push(subCategory.path)}
                                                                    className="w-full text-left text-gray-700 hover:text-[#2E804E] transition-colors duration-200"
                                                                >
                                                                    {subCategory.name} ({subCategory.count})
                                                                </button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => router.push(category.path)}
                                                className="w-full text-left text-gray-700 hover:text-[#2E804E] transition-colors duration-200"
                                            >
                                                {category.name} ({category.postCount})
                                            </button>
                                        )}
                                    </li>
                                    {/* 메인 카테고리 */}
                                    <li className="text-gray-700">
                                        <span className="font-semibold block">메인 카테고리</span>
                                        <span>{post.mainCategory}</span>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
