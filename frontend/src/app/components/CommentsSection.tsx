'use client'

import React, { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useGlobalLoginUser } from '@/stores/auth/loginMember'

export interface Reply {
    id: number
    userId: number
    author: string
    date: string
    content: string
    likes: number
}

export interface Comment {
    id: number
    userId: number
    author: string
    date: string
    content: string
    likes: number
    replies: Reply[]
}

export function CommentsSection({ postId }: { postId: number }) {
    const router = useRouter()
    const { isLogin, loginUser } = useGlobalLoginUser()
    const API = process.env.NEXT_PUBLIC_API_BASE_URL

    // ─── 1) 로딩/에러 상태 ─────────────────────────────────────────────
    const [loading, setLoading] = useState(false)
    const [commentError, setCommentError] = useState<string | null>(null)

    // ─── 2) 댓글·대댓글 상태 ─────────────────────────────────────────
    const [comments, setComments] = useState<Comment[]>([])
    const [commentInput, setCommentInput] = useState('')
    const [replyInputs, setReplyInputs] = useState<Record<number, string>>({})
    const [likedComments, setLikedComments] = useState<Record<number, boolean>>({})
    const [likedReplies, setLikedReplies] = useState<Record<number, boolean>>({})
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
    const [editedCommentContent, setEditedCommentContent] = useState('')
    const [activeReplyId, setActiveReplyId] = useState<number | null>(null)
    const [editingReplyId, setEditingReplyId] = useState<number | null>(null)
    const [editedReplyContent, setEditedReplyContent] = useState('')
    const [hasReplied, setHasReplied] = useState<Record<number, boolean>>({})

    // ─── 2.1) 팝오버 상태 ───────────────────────────────────────────────
    const [activeCommentId, setActiveCommentId] = useState<number | null>(null)
    const [isFollowing, setIsFollowing] = useState<{ [username: string]: boolean }>({})

    // ─── 공통 헬퍼
    const ensureLogin = () => {
        if (!isLogin) router.push('/login')
    }

    // ─── 3) 댓글 불러오기 ────────────────────────────────────────────
    useEffect(() => {
        async function fetchComments() {
            try {
                setLoading(true)
                const res = await fetch(`${API}/api/v1/comments/get?postId=${postId}&page=1&size=10`, {
                    credentials: 'include',
                })
                if (!res.ok) throw new Error('댓글을 불러오지 못했습니다.')
                const json = await res.json()
                const mapped: Comment[] = json.content.map((c: any) => ({
                    id: c.commentId,
                    userId: c.userId,
                    author: c.username ?? c.userEmail,
                    date: new Date(c.createdAt).toLocaleDateString(),
                    content: c.content,
                    likes: c.likeCount || 0,
                    replies: c.replies.content.map((r: any) => ({
                        id: r.replyId,
                        userId: r.userId,
                        author: r.username ?? r.userEmail,
                        date: new Date(r.createdAt).toLocaleDateString(),
                        content: r.content,
                        likes: r.likeCount || 0,
                    })),
                }))
                setComments(mapped)
                setCommentError(null)
            } catch (e: any) {
                setCommentError(e.message)
            } finally {
                setLoading(false)
            }
        }
        fetchComments()
    }, [postId])

    // ─── 4) 댓글 등록 ───────────────────────────────────────────────
    const handleCommentSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!commentInput.trim()) return
        ensureLogin()
        try {
            setLoading(true)
            const res = await fetch(`${API}/api/v1/comments/create`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ postId, content: commentInput.trim() }),
            })

            if (!res.ok) throw new Error('댓글 생성 실패')
            const raw = await res.json()

            // ← 새 댓글 매핑 후 앞에 추가
            const newComment: Comment = {
                id: raw.commentId,
                userId: raw.userId,
                author: raw.username ?? raw.userEmail,
                date: new Date(raw.createdAt).toLocaleDateString(),
                content: raw.content,
                likes: raw.likeCount || 0,
                replies: raw.replies.content.map((r: any) => ({
                    id: r.replyId,
                    author: r.username ?? r.userEmail,
                    date: new Date(r.createdAt).toLocaleDateString(),
                    content: r.content,
                    likes: r.likeCount || 0,
                })),
            }
            setComments((prev) => [newComment, ...prev])
            setCommentInput('')
        } catch (e: any) {
            setCommentError(e.message)
        } finally {
            setLoading(false)
        }
    }

    // ─── 5) 댓글 좋아요 토글 ───────────────────────────────────────
    const handleCommentLike = async (cid: number) => {
        ensureLogin()
        const res = await fetch(`${API}/api/v1/comments/${cid}/like`, {
            method: 'POST',
            credentials: 'include',
        })
        if (!res.ok) return alert('좋아요 실패')
        const { likeCount } = await res.json()
        setComments((cs) => cs.map((c) => (c.id === cid ? { ...c, likes: likeCount } : c)))
        setLikedComments((l) => ({ ...l, [cid]: !l[cid] }))
    }

    // ─── 6) 댓글 수정 / 삭제 ───────────────────────────────────────
    const handleCommentEdit = (cid: number, content: string) => {
        setEditingCommentId(cid)
        setEditedCommentContent(content)
    }
    const handleCommentEditSave = async (cid: number) => {
        ensureLogin()
        try {
            setLoading(true)
            const res = await fetch(`${API}/api/v1/comments/update/${cid}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ commentId: cid, content: editedCommentContent }),
            })
            if (!res.ok) throw new Error('댓글 수정 실패')
            const updated = await res.json()
            setComments((cs) => cs.map((c) => (c.id === updated.commentId ? { ...c, content: updated.content } : c)))
            setEditingCommentId(null)
        } catch (e: any) {
            setCommentError(e.message)
        } finally {
            setLoading(false)
        }
    }
    const handleCommentDelete = async (cid: number) => {
        if (!confirm('정말 삭제하시겠습니까?')) return
        ensureLogin()
        try {
            setLoading(true)
            const res = await fetch(`${API}/api/v1/comments/delete/${cid}`, {
                method: 'DELETE',
                credentials: 'include',
            })
            if (!res.ok) throw new Error('댓글 삭제 실패')
            setComments((cs) => cs.filter((c) => c.id !== cid))
        } catch (e: any) {
            setCommentError(e.message)
        } finally {
            setLoading(false)
        }
    }

    // ─── 7) 대댓글 토글 · 등록 · 좋아요 ─────────────────────────────
    const toggleReplyForm = (cid: number) => {
        setActiveReplyId((a) => (a === cid ? null : cid))
        setReplyInputs((ri) => ({ ...ri, [cid]: ri[cid] || '' }))
    }
    const handleReplyInputChange = (cid: number, v: string) => setReplyInputs((ri) => ({ ...ri, [cid]: v }))
    const handleReplySubmit = async (cid: number) => {
        const content = replyInputs[cid]?.trim()
        if (!content) return
        ensureLogin()
        try {
            setLoading(true)
            const res = await fetch(`${API}/api/v1/replies/create`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ commentId: cid, content }),
            })
            if (!res.ok) throw new Error('답글 등록 실패')
            const raw = await res.json()
            const newR: Reply = {
                id: raw.replyId,
                userId: raw.userId,
                author: raw.username ?? raw.userEmail,
                date: new Date(raw.createdAt).toLocaleDateString(),
                content: raw.content,
                likes: 0,
            }
            setComments((cs) => cs.map((c) => (c.id === cid ? { ...c, replies: [...c.replies, newR] } : c)))
            setReplyInputs((ri) => ({ ...ri, [cid]: '' }))
            setActiveReplyId(null)
        } catch (e: any) {
            setCommentError(e.message)
        } finally {
            setLoading(false)
        }
    }
    const handleReplyLike = async (cid: number, rid: number) => {
        ensureLogin()
        const res = await fetch(`${API}/api/v1/replies/${rid}/like`, {
            method: 'POST',
            credentials: 'include',
        })
        if (!res.ok) return alert('좋아요 실패')
        const { likeCount } = await res.json()
        setComments((cs) =>
            cs.map((c) =>
                c.id === cid
                    ? {
                          ...c,
                          replies: c.replies.map((r) => (r.id === rid ? { ...r, likes: likeCount } : r)),
                      }
                    : c,
            ),
        )
        setLikedReplies((l) => ({ ...l, [rid]: !l[rid] }))
    }

    // ─── 8) 대댓글 수정 / 삭제 ─────────────────────────────────────
    const handleReplyEdit = (cid: number, rid: number, content: string) => {
        setEditingReplyId(rid)
        setEditedReplyContent(content)
    }
    const handleReplyEditSave = async (cid: number, rid: number) => {
        ensureLogin()
        try {
            setLoading(true)
            const res = await fetch(`${API}/api/v1/replies/update/${rid}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    commentId: cid,
                    replyId: rid,
                    content: editedReplyContent,
                }),
            })
            if (!res.ok) throw new Error('대댓글 수정 실패')
            const updated = await res.json()
            setComments((cs) =>
                cs.map((c) =>
                    c.id === cid
                        ? {
                              ...c,
                              replies: c.replies.map((r) =>
                                  r.id === updated.replyId ? { ...r, content: updated.content } : r,
                              ),
                          }
                        : c,
                ),
            )
            setEditingReplyId(null)
        } catch (e: any) {
            setCommentError(e.message)
        } finally {
            setLoading(false)
        }
    }
    const handleReplyDelete = async (cid: number, rid: number) => {
        if (!confirm('정말 삭제하시겠습니까?')) return
        ensureLogin()
        try {
            setLoading(true)
            const res = await fetch(`${API}/api/v1/replies/delete/${rid}`, {
                method: 'DELETE',
                credentials: 'include',
            })
            if (!res.ok) throw new Error('대댓글 삭제 실패')
            setComments((cs) =>
                cs.map((c) => (c.id === cid ? { ...c, replies: c.replies.filter((r) => r.id !== rid) } : c)),
            )
        } catch (e: any) {
            setCommentError(e.message)
        } finally {
            setLoading(false)
        }
    }

    const handleFollow = async (author: string) => {
        if (!isLogin) {
            router.push('/login')
            return
        }

        // comments 배열에서 글쓴이(author)에 해당하는 userId 찾기
        const followeeId = comments.find((c) => c.author === author)?.userId
        if (!followeeId) {
            alert('유저 ID를 찾을 수 없습니다.')
            return
        }

        try {
            const res = await fetch(
                `${API}/api/v1/follow/${isFollowing[author] ? 'delete/unfollow' : 'create/follow'}`,
                {
                    method: isFollowing[author] ? 'DELETE' : 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ followeeId }),
                },
            )
            if (!res.ok) throw new Error('실패')
            setIsFollowing((f) => ({ ...f, [author]: !f[author] }))
        } catch {
            alert('팔로우 처리에 실패했습니다.')
        }
    }

    // ─── 9) 렌더링 ─────────────────────────────────────────────────
    return (
        <div>
            {/* 로딩 스피너 */}
            {loading && <div className="text-center py-4">Loading...</div>}

            {/* 에러 표시 */}
            {commentError && <p className="text-red-500 mb-4">{commentError}</p>}

            {/* 새 댓글 폼 */}
            {isLogin ? (
                <form onSubmit={handleCommentSubmit} className="mb-6">
                    <textarea
                        className="w-full p-2 border rounded mb-2"
                        rows={3}
                        placeholder="댓글을 작성하세요."
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                    />
                    <button type="submit" className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700">
                        댓글 등록
                    </button>
                </form>
            ) : (
                <p className="mb-6 text-gray-600">로그인 후 댓글 작성이 가능합니다.</p>
            )}

            {/* 댓글 리스트 */}
            {comments.map((comment) => (
                <div key={comment.id} className="border-b pb-6 mb-6">
                    <div className="flex justify-between items-center">
                        <div className="relative">
                            <button
                                onClick={() => setActiveCommentId((id) => (id === comment.id ? null : comment.id))}
                                className="font-medium hover:text-[#2E804E]"
                            >
                                {comment.author}
                            </button>
                            {activeCommentId === comment.id && (
                                <div className="absolute z-10 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200">
                                    <div className="p-3 space-y-2">
                                        {/* 프로필 버튼 */}
                                        <button
                                            onClick={() => router.push(`/mypage/${comment.userId}`)}
                                            className="flex items-center space-x-2 w-full hover:bg-gray-100 p-2 rounded"
                                        >
                                            {/* 집 아이콘 */}
                                            {/* 집 아이콘 */}
                                            <svg
                                                className="w-5 h-5"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                {/* TODO: 집 아이콘 path 여기에 입력 */}
                                                <path d="M3 9L12 2l9 7v11a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V13H9v7a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9z" />
                                            </svg>
                                            <span>마이페이지</span>
                                        </button>
                                        {/* 팔로우/언팔 */}
                                        <button
                                            onClick={() => handleFollow(comment.author)}
                                            className={`w-full text-center py-2 rounded ${
                                                isFollowing[comment.author] ? 'bg-gray-100' : 'bg-green-600 text-white'
                                            }`}
                                        >
                                            {isFollowing[comment.author] ? '팔로우 취소' : '팔로우'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <span className="text-xs text-gray-500">{comment.date}</span>
                    </div>

                    {/* 댓글 내용 or 편집 폼 */}
                    {editingCommentId === comment.id ? (
                        <div className="mt-2">
                            <textarea
                                className="w-full p-2 border rounded mb-2"
                                rows={3}
                                value={editedCommentContent}
                                onChange={(e) => setEditedCommentContent(e.target.value)}
                            />
                            <div className="flex space-x-2">
                                <button onClick={() => setEditingCommentId(null)} className="px-3 py-1 border rounded">
                                    취소
                                </button>
                                <button
                                    onClick={() => handleCommentEditSave(comment.id)}
                                    className="px-3 py-1 bg-green-600 text-white rounded"
                                >
                                    저장
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <p className="mt-2">{comment.content}</p>
                            <div className="flex space-x-4 text-sm text-gray-600 mt-2">
                                <button onClick={() => handleCommentLike(comment.id)} className="flex items-center">
                                    ❤️ 좋아요 {comment.likes}
                                </button>
                                <button onClick={() => toggleReplyForm(comment.id)} className="hover:text-gray-800">
                                    💬 답글
                                </button>
                                <button
                                    onClick={() => handleCommentEdit(comment.id, comment.content)}
                                    className="hover:text-gray-800"
                                >
                                    ✏️ 수정
                                </button>
                                <button onClick={() => handleCommentDelete(comment.id)} className="hover:text-gray-800">
                                    🗑️ 삭제
                                </button>
                            </div>
                        </>
                    )}

                    {/* 대댓글 폼 */}
                    {activeReplyId === comment.id && (
                        <div className="mt-4 ml-6">
                            <textarea
                                className="w-full p-2 border rounded mb-2"
                                rows={2}
                                placeholder="답글을 작성하세요."
                                value={replyInputs[comment.id] || ''}
                                onChange={(e) => handleReplyInputChange(comment.id, e.target.value)}
                            />
                            <div className="flex space-x-2">
                                <button onClick={() => setActiveReplyId(null)} className="px-3 py-1 border rounded">
                                    취소
                                </button>
                                <button
                                    onClick={() => handleReplySubmit(comment.id)}
                                    className="px-3 py-1 bg-green-600 text-white rounded"
                                >
                                    등록
                                </button>
                            </div>
                        </div>
                    )}

                    {/* 대댓글 리스트 */}
                    {comment.replies.length > 0 && (
                        <div className="mt-4 ml-6 space-y-4">
                            {comment.replies.map((reply) => (
                                <div key={reply.id} className="border-l pl-4">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-sm">{reply.author}</span>
                                        <span className="text-xs text-gray-500">{reply.date}</span>
                                    </div>

                                    {/* 대댓글 내용 or 편집 폼 */}
                                    {editingReplyId === reply.id ? (
                                        <div className="mt-2">
                                            <textarea
                                                className="w-full p-2 border rounded mb-2"
                                                rows={2}
                                                value={editedReplyContent}
                                                onChange={(e) => setEditedReplyContent(e.target.value)}
                                            />
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => setEditingReplyId(null)}
                                                    className="px-3 py-1 border rounded"
                                                >
                                                    취소
                                                </button>
                                                <button
                                                    onClick={() => handleReplyEditSave(comment.id, reply.id)}
                                                    className="px-3 py-1 bg-green-600 text-white rounded"
                                                >
                                                    저장
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <p className="mt-1 text-sm">{reply.content}</p>
                                            <div className="flex space-x-4 text-sm text-gray-600 mt-1">
                                                <button
                                                    onClick={() => handleReplyLike(comment.id, reply.id)}
                                                    className="flex items-center"
                                                >
                                                    ❤️ 좋아요 {reply.likes}
                                                </button>
                                                <button
                                                    onClick={() => handleReplyEdit(comment.id, reply.id, reply.content)}
                                                    className="hover:text-gray-800"
                                                >
                                                    ✏️ 수정
                                                </button>
                                                <button
                                                    onClick={() => handleReplyDelete(comment.id, reply.id)}
                                                    className="hover:text-gray-800"
                                                >
                                                    🗑️ 삭제
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}
