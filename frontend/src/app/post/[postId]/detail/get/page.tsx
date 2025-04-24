'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useGlobalLoginUser } from '@/stores/auth/loginMember'

interface Reply {
    id: number
    commentId: number
    content: string
    createdAt: string
    modifiedAt: string
    userEmail: string
}

interface Comment {
    commentId: number
    content: string
    postId: number
    createdAt: string
    modifiedAt: string
    userEmail: string
    replies: Reply[]
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
    author: string
    mainCategoryId: number
    blogId: number
    categoryId?: number
    book?: string
    images?: string[]
}

export default function DetailPage() {
    const router = useRouter()
    const { postId } = useParams()
    const { loginUser } = useGlobalLoginUser()

    const [post, setPost] = useState<PostDetail | null>(null)
    const [loadingPost, setLoadingPost] = useState(true)
    const [errorPost, setErrorPost] = useState<string | null>(null)

    const [comments, setComments] = useState<Comment[]>([])
    const [loadingComments, setLoadingComments] = useState(false)
    const [errorComments, setErrorComments] = useState<string | null>(null)

    const [commentInput, setCommentInput] = useState('')

    // --- 게시글 로드 (인증 필요 없음) ---
    useEffect(() => {
        if (!postId) return
        setLoadingPost(true)
        fetch(`http://localhost:8090/api/v1/posts/get/${postId}`, { credentials: 'include' })
            .then((res) => {
                if (!res.ok) throw new Error(`게시글 조회 실패: ${res.status}`)
                return res.json()
            })
            .then((data) => {
                setPost({
                    postId: data.postId,
                    title: data.title,
                    content: data.content,
                    username: data.username,
                    imageUrls: data.imageUrls || [],
                    viewCount: data.viewCount,
                    likeCount: data.likeCount,
                    createdAt: data.createdAt,
                    modifiedAt: data.modifiedAt,
                    author: data.username,
                    mainCategoryId: data.mainCategoryId,
                    blogId: data.blogId,
                    categoryId: data.categoryId,
                    book: data.book,
                    images: data.imageUrls,
                })
            })
            .catch((err) => {
                console.error(err)
                setErrorPost(err.message)
            })
            .finally(() => {
                setLoadingPost(false)
            })
    }, [postId])

    // --- 댓글 로드 (로그인된 사용자만) ---
    useEffect(() => {
        if (!postId) return
        if (!loginUser) return

        setLoadingComments(true)
        fetch(`http://localhost:8090/api/v1/comments/get?postId=${postId}&page=1&size=100`, {
            credentials: 'include',
        })
            .then((res) => {
                if (!res.ok) throw new Error(`댓글 조회 실패: ${res.status}`)
                return res.json()
            })
            .then((pageData: { content: Comment[] }) => {
                setComments(pageData.content)
            })
            .catch((err) => {
                console.error(err)
                setErrorComments(err.message)
            })
            .finally(() => {
                setLoadingComments(false)
            })
    }, [postId, loginUser])

    // 댓글 목록 새로고침 함수
    const refreshComments = async () => {
        if (!postId || !loginUser) return

        setLoadingComments(true)
        try {
            const res = await fetch(`http://localhost:8090/api/v1/comments/get?postId=${postId}&page=1&size=100`, {
                credentials: 'include',
            })
            if (!res.ok) throw new Error(`댓글 조회 실패: ${res.status}`)
            const pageData = await res.json()
            setComments(pageData.content)
        } catch (err) {
            console.error('댓글 목록 새로고침 중 오류:', err)
            setErrorComments(err instanceof Error ? err.message : '알 수 없는 오류')
        } finally {
            setLoadingComments(false)
        }
    }

    // --- 댓글 작성 핸들러 ---
    const handleCommentSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!loginUser) {
            alert('로그인 후 작성 가능합니다.')
            return
        }
        if (!commentInput.trim()) {
            alert('댓글 내용을 입력해주세요.')
            return
        }

        try {
            if (!postId || isNaN(Number(postId))) {
                throw new Error('잘못된 게시글 ID입니다.')
            }

            const res = await fetch('http://localhost:8090/api/v1/comments/create', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    postId: Number(postId),
                    content: commentInput.trim(),
                }),
            })

            // 응답 상태 코드별 처리
            if (res.status === 401) {
                alert('로그인이 필요합니다.')
                return
            }
            if (res.status === 403) {
                alert('댓글 작성 권한이 없습니다.')
                return
            }
            if (!res.ok) {
                const errorData = await res.json().catch(() => null)
                throw new Error(errorData?.message || `댓글 작성 실패: ${res.status}`)
            }

            const created = await res.json()

            // 새로운 댓글을 목록에 추가
            setComments((prev) => [
                ...prev,
                {
                    ...created,
                    userEmail: loginUser.email,
                    replies: [],
                },
            ])

            setCommentInput('')
            alert('댓글이 작성되었습니다.')

            // handleCommentSubmit 성공 시 댓글 목록 새로고침
            await refreshComments()
        } catch (err) {
            console.error('댓글 작성 중 오류:', err)
            alert(err instanceof Error ? err.message : '댓글 작성 중 오류가 발생했습니다.')
        }
    }

    if (loadingPost) return <div className="p-8 text-center">Loading post...</div>
    if (errorPost) return <div className="p-8 text-red-500">Error: {errorPost}</div>
    if (!post) return <div className="p-8">게시글을 찾을 수 없습니다.</div>

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* 게시글 */}
            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
            <div className="flex items-center text-sm text-gray-500 mb-6">
                <span>{post.username}</span>
                <span className="mx-2">•</span>
                <span>{new Date(post.createdAt).toLocaleString()}</span>
                <span className="mx-2">•</span>
                <span>조회 {post.viewCount}</span>
                <span className="mx-2">•</span>
                <span>좋아요 {post.likeCount}</span>
            </div>
            <div className="prose mb-8">{post.content}</div>
            {post.imageUrls.map((url, i) => (
                <img key={i} src={url} alt={`이미지 ${i}`} className="w-full rounded mb-4" />
            ))}

            {/* 댓글 섹션 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4">댓글 {loadingComments ? '...' : `(${comments.length})`}</h2>
                {errorComments && <div className="text-red-500 mb-4">댓글 로드 오류: {errorComments}</div>}

                <form onSubmit={handleCommentSubmit} className="mb-6">
                    <textarea
                        className="w-full border rounded p-3 mb-2 focus:ring focus:outline-none"
                        rows={3}
                        placeholder="댓글을 작성해주세요."
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                    />
                    <div className="text-right">
                        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                            댓글 작성
                        </button>
                    </div>
                </form>

                <div className="space-y-6">
                    {comments.map((c) => (
                        <div key={c.commentId} className="border-b pb-4">
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-medium">{c.userEmail}</span>
                                <span className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleString()}</span>
                            </div>
                            <p className="mb-2">{c.content}</p>

                            {c.replies.length > 0 && (
                                <div className="pl-4 border-l border-gray-200 space-y-4">
                                    {c.replies.map((r) => (
                                        <div key={r.id}>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-sm font-medium">{r.userEmail}</span>
                                                <span className="text-xs text-gray-400">
                                                    {new Date(r.createdAt).toLocaleString()}
                                                </span>
                                            </div>
                                            <p className="text-sm">{r.content}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
