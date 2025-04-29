'use client'

import React, { useState, useEffect, useRef, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useGlobalLoginUser } from '@/stores/auth/loginMember'

export interface Reply {
    id: number
    userId: number
    author: string
    date: string
    authorImage: string
    content: string
    likes: number
    isMe: boolean
}

export interface Comment {
    id: number
    userId: number
    author: string
    authorImage: string
    date: string
    content: string
    likes: number
    replies: Reply[]
    isFollowing: boolean
    isMe: boolean
}

export function CommentsSection({ postId }: { postId: number }) {
    const router = useRouter()
    const { isLogin, loginUser } = useGlobalLoginUser()
    const API = process.env.NEXT_PUBLIC_API_BASE_URL
    const popoverRef = useRef<HTMLDivElement>(null) // 댓글 팝오버용
    const replyPopoverRef = useRef<HTMLDivElement>(null) // 대댓글 팝오버용

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
    const [activeReplyPopoverId, setActiveReplyPopoverId] = useState<number | null>(null)
    const [isFollowing, setIsFollowing] = useState<{ [key: number]: boolean }>({})

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
                    authorImage: c.userImageUrl ?? loginUser.image,
                    date: new Date(c.createdAt).toLocaleDateString(),
                    content: c.content,
                    likes: c.likeCount || 0,
                    isFollowing: c.following,
                    isMe: loginUser?.id === c.userId,
                    replies: c.replies.content.map((r: any) => ({
                        id: r.replyId,
                        userId: r.userId,
                        author: r.username ?? r.userEmail,
                        authorImage: r.userImageUrl ?? loginUser.image,
                        date: new Date(r.createdAt).toLocaleDateString(),
                        content: r.content,
                        likes: r.likeCount || 0,
                        isMe: loginUser?.id === r.userId,
                    })),
                }))
                setComments(mapped)

                const followStatus: { [key: number]: boolean } = {}
                mapped.forEach((c) => {
                    followStatus[c.userId] = c.isFollowing
                })
                setIsFollowing(followStatus)

                setCommentError(null)
            } catch (e: any) {
                setCommentError(e.message)
            } finally {
                setLoading(false)
            }
        }
        fetchComments()
    }, [postId, loginUser])

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
            const newComment: Comment = {
                id: raw.commentId,
                userId: raw.userId,
                author: raw.username ?? raw.userEmail,
                date: new Date(raw.createdAt).toLocaleDateString(),
                content: raw.content,
                likes: raw.likeCount || 0,
                isFollowing: raw.following,
                isMe: loginUser?.id === raw.userId,
                authorImage: loginUser.image,
                replies: raw.replies.content.map((r: any) => ({
                    id: r.replyId,
                    userId: r.userId,
                    author: r.username ?? r.userEmail,
                    date: new Date(r.createdAt).toLocaleDateString(),
                    content: r.content,
                    likes: r.likeCount || 0,
                    isMe: loginUser?.id === r.userId,
                    authorImage: loginUser.image,
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

    // ─── 6) 댓글 수정/삭제 ─────────────────────────────────────────
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

    // ─── 7) 대댓글 토글·등록·좋아요 ─────────────────────────────────
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
                isMe: loginUser?.id === raw.userId,
                authorImage: loginUser.image,
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

    // ─── 대댓글 좋아요 토글 ─────────────────────────────────────
    const handleReplyLike = async (cid: number, rid: number) => {
        ensureLogin()
        try {
            const res = await fetch(`${API}/api/v1/like-replies/toggle`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ replyId: rid }),
            })
            if (!res.ok) throw new Error('좋아요 처리 실패')
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
        } catch {
            alert('대댓글 좋아요 처리에 실패했습니다.')
        }
    }

    // ─── 8) 대댓글 수정/삭제 ─────────────────────────────────────
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

    const handleFollow = async (userId: number) => {
        if (!isLogin) {
            router.push('/login')
            return
        }
        try {
            if (isFollowing[userId]) {
                await unfollowUser(userId)
            } else {
                await followUser(userId)
            }
            setIsFollowing((prev) => ({
                ...prev,
                [userId]: !prev[userId],
            }))
        } catch {
            alert('팔로우/언팔로우 처리에 실패했습니다.')
        }
    }

    // ─── ?) 팔로우/언팔로우 요청 ───────────────────────────────────
    const followUser = async (followeeId: number) => {
        try {
            await fetch(`${API}/api/v1/follow/create/follow`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ followeeId }),
            })
        } catch {}
    }
    const unfollowUser = async (followeeId: number) => {
        try {
            await fetch(`${API}/api/v1/follow/delete/unfollow`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ followeeId }),
            })
        } catch {}
    }

    // 클릭 이벤트 핸들러
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            // 댓글 팝오버
            if (activeCommentId !== null && popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setActiveCommentId(null)
            }
            // 대댓글 팝오버
            if (
                activeReplyPopoverId !== null &&
                replyPopoverRef.current &&
                !replyPopoverRef.current.contains(event.target as Node)
            ) {
                setActiveReplyPopoverId(null)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [activeCommentId, activeReplyPopoverId])

    // ─── 9) 렌더링 ─────────────────────────────────────────────────
    return (
        <div>
            {loading && <div className="text-center py-4">Loading...</div>}
            {commentError && <p className="text-red-500 mb-4">{commentError}</p>}

            {isLogin ? (
                <form onSubmit={handleCommentSubmit} className="mb-6">
                    <textarea
                        className="w-full p-2 border border-gray-300 rounded mb-2 bg-white"
                        rows={3}
                        placeholder="댓글을 작성하세요."
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                    />
                    <button type="submit" className="px-4 py-1 bg-[#2E804E] text-white rounded hover:bg-[#246A40]">
                        댓글 등록
                    </button>
                </form>
            ) : (
                <p className="mb-6 text-gray-600">로그인 후 댓글 작성이 가능합니다.</p>
            )}

            {comments.map((comment) => (
                <div key={comment.id} className="border-b border-gray-300 pb-6 mb-6">
                    {/* 댓글 상단 (작성자/팝오버) */}
                    <div className="flex justify-between items-center">
                        <div className="relative flex items-center">
                            {' '}
                            {/* flex와 items-center 추가 */}
                            {/* 프로필 이미지 */}
                            <img
                                src={comment.authorImage}
                                alt={`${comment.author} 프로필`}
                                className="w-6 h-6 rounded-full mr-2 object-cover"
                            />
                            <button
                                onClick={() => setActiveCommentId((id) => (id === comment.id ? null : comment.id))}
                                className="font-medium hover:text-[#2E804E]"
                            >
                                {comment.author}
                            </button>
                            {/* 댓글 작성자 팝오버 미니창 */}
                            {activeCommentId === comment.id && (
                                <div
                                    ref={popoverRef}
                                    className="absolute z-10 mt-2 min-w-[12rem] w-auto whitespace-nowrap bg-white rounded-lg shadow-lg border border-gray-200 left-0"
                                >
                                    <div className="p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center min-w-0">
                                                <div className="w-10 h-10 flex-shrink-0 rounded-full bg-gray-300 mr-3 overflow-hidden">
                                                    <img
                                                        src={comment.authorImage}
                                                        alt={`${comment.author} 프로필`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <button
                                                        onClick={() => router.push(`/blog/${comment.userId}`)}
                                                        className="font-medium hover:text-[#2E804E] transition-colors duration-200 truncate block"
                                                    >
                                                        {comment.author}
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => router.push(`/blog/${comment.userId}`)}
                                                    className="text-gray-500 hover:text-[#2E804E] transition-colors duration-200 ml-2 flex-shrink-0"
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
                                        </div>
                                        {!comment.isMe && (
                                            <button
                                                onClick={() => handleFollow(comment.userId)}
                                                className={`w-full px-4 py-2 text-sm rounded-md transition-colors duration-200 ${
                                                    isFollowing[comment.userId]
                                                        ? 'text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300'
                                                        : 'text-white bg-[#2E804E] hover:bg-[#246A40]'
                                                }`}
                                            >
                                                {isFollowing[comment.userId] ? '팔로우 취소' : '팔로우 하기'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <span className="text-xs text-gray-500">{comment.date}</span>
                    </div>

                    {/* 댓글 내용/편집 */}
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
                                {loginUser && loginUser.id === comment.userId && (
                                    <>
                                        <button
                                            onClick={() => handleCommentEdit(comment.id, comment.content)}
                                            className="hover:text-gray-800"
                                        >
                                            ✏️ 수정
                                        </button>
                                        <button
                                            onClick={() => handleCommentDelete(comment.id)}
                                            className="hover:text-gray-800"
                                        >
                                            🗑️ 삭제
                                        </button>
                                    </>
                                )}
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

                    {/* 대댓글 리스트 (팝오버 + 수정/삭제) */}
                    {comment.replies.length > 0 && (
                        <div className="mt-4 ml-6 space-y-4">
                            {comment.replies.map((reply) => (
                                <div key={reply.id} className="border-l border-gray-300 pl-4">
                                    {/* 작성자·날짜·팝오버 */}
                                    <div className="flex justify-between items-center">
                                        <div className="relative flex items-center">
                                            {' '}
                                            {/* flex와 items-center 추가 */}
                                            {/* 프로필 이미지 */}
                                            <img
                                                src={reply.authorImage}
                                                alt={`${reply.author} 프로필`}
                                                className="w-6 h-6 rounded-full mr-2 object-cover"
                                            />
                                            <button
                                                onClick={() =>
                                                    setActiveReplyPopoverId((id) => (id === reply.id ? null : reply.id))
                                                }
                                                className="font-medium text-sm hover:text-[#2E804E]"
                                            >
                                                {reply.author}
                                            </button>
                                            {/* 대댓글 작성자 팝오버 미니창 수정 */}
                                            {activeReplyPopoverId === reply.id && (
                                                <div
                                                    ref={replyPopoverRef}
                                                    className="absolute z-10 mt-2 min-w-[12rem] w-auto whitespace-nowrap bg-white rounded-lg shadow-lg border border-gray-200 left-0"
                                                >
                                                    <div className="p-4">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <div className="flex items-center min-w-0">
                                                                <div className="w-10 h-10 flex-shrink-0 rounded-full bg-gray-300 mr-3 overflow-hidden">
                                                                    <img
                                                                        src={reply.authorImage}
                                                                        alt={`${reply.author} 프로필`}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <button
                                                                        onClick={() =>
                                                                            router.push(`/blog/${reply.userId}`)
                                                                        }
                                                                        className="font-medium hover:text-[#2E804E] transition-colors duration-200 truncate block"
                                                                    >
                                                                        {reply.author}
                                                                    </button>
                                                                </div>
                                                                <button
                                                                    onClick={() => router.push(`/blog/${reply.userId}`)}
                                                                    className="text-gray-500 hover:text-[#2E804E] transition-colors duration-200 ml-2 flex-shrink-0"
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
                                                        </div>
                                                        {!reply.isMe && (
                                                            <button
                                                                onClick={() => handleFollow(reply.userId)}
                                                                className={`w-full px-4 py-2 text-sm rounded-md transition-colors duration-200 ${
                                                                    isFollowing[reply.userId]
                                                                        ? 'text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300'
                                                                        : 'text-white bg-[#2E804E] hover:bg-[#246A40]'
                                                                }`}
                                                            >
                                                                {isFollowing[reply.userId]
                                                                    ? '팔로우 취소'
                                                                    : '팔로우 하기'}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-500">{reply.date}</span>
                                    </div>

                                    {/* 내용/수정 모드 */}
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
                                                {loginUser && loginUser.id === reply.userId && (
                                                    <>
                                                        <button
                                                            onClick={() =>
                                                                handleReplyEdit(comment.id, reply.id, reply.content)
                                                            }
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
                                                    </>
                                                )}
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
