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
    const popoverRef = useRef<HTMLDivElement>(null)
    const replyPopoverRef = useRef<HTMLDivElement>(null)

    // ─── 상태 선언 ───────────────────────────────────────────────────
    const [userImages, setUserImages] = useState<Record<number, string>>({})
    const [rawComments, setRawComments] = useState<Omit<Comment, 'authorImage'>[]>([])
    const [comments, setComments] = useState<Comment[]>([])
    const [commentInput, setCommentInput] = useState('')
    const [replyInputs, setReplyInputs] = useState<Record<number, string>>({})
    const [loading, setLoading] = useState(false)
    const [commentError, setCommentError] = useState<string | null>(null)
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
    const [editedCommentContent, setEditedCommentContent] = useState('')
    const [activeReplyId, setActiveReplyId] = useState<number | null>(null)
    const [editingReplyId, setEditingReplyId] = useState<number | null>(null)
    const [editedReplyContent, setEditedReplyContent] = useState('')
    const [activeCommentId, setActiveCommentId] = useState<number | null>(null)
    const [activeReplyPopoverId, setActiveReplyPopoverId] = useState<number | null>(null)
    const [isFollowing, setIsFollowing] = useState<{ [key: number]: boolean }>({})

    const ensureLogin = () => {
        if (!isLogin) router.push('/login')
    }

    // ─── 댓글 불러오기 함수 ─────────────────────────────────────────
    const fetchComments = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${API}/api/v1/comments/get?postId=${postId}&page=1&size=10`, {
                credentials: 'include',
            })
            if (!res.ok) throw new Error('댓글을 불러오지 못했습니다.')
            const json = await res.json()
            const mapped = json.content.map((c: any) => ({
                id: c.commentId,
                userId: c.userId,
                author: c.username ?? c.userEmail,
                date: new Date(c.createdAt).toLocaleDateString(),
                content: c.content,
                likes: c.likeCount || 0,
                isFollowing: c.following,
                isMe: loginUser?.id === c.userId,
                replies: c.replies.content.map((r: any) => ({
                    id: r.replyId,
                    userId: r.userId,
                    author: r.username ?? r.userEmail,
                    date: new Date(r.createdAt).toLocaleDateString(),
                    content: r.content,
                    likes: r.likeCount || 0,
                    isMe: loginUser?.id === r.userId,
                })),
            }))
            setRawComments(mapped)
            console.log('어이어이 ', mapped)
        } catch (e: any) {
            setCommentError(e.message)
        } finally {
            setLoading(false)
        }
    }

    // ─── 초기 렌더링 및 로그인 유저 변경 시 ──────────────────────────
    useEffect(() => {
        fetchComments()
    }, [postId, loginUser])

    // ─── rawComments 또는 프로필 이미지 변경 시 병합 ────────────────
    useEffect(() => {
        if (rawComments.length === 0) return
        const merged = rawComments.map((c) => ({
            ...c,
            authorImage: userImages[c.userId] ?? loginUser.image,
            replies: c.replies.map((r) => ({
                ...r,
                authorImage: userImages[r.userId] ?? loginUser.image,
            })),
        }))
        setComments(merged)
    }, [rawComments, userImages, loginUser.image])

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
            await fetchComments()
            setCommentInput('')
        } catch (e: any) {
            setCommentError(e.message)
        } finally {
            setLoading(false)
        }
    }

    // ─── 5) 댓글 좋아요 ─────────────────────────────────────────────
    const handleCommentLike = async (cid: number) => {
        ensureLogin()
        try {
            const res = await fetch(`${API}/api/v1/comments/${cid}/like`, {
                method: 'POST',
                credentials: 'include',
            })
            if (!res.ok) throw new Error('좋아요 실패')
            await fetchComments()
        } catch {
            alert('좋아요 처리에 실패했습니다.')
        }
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
            await fetchComments()
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
            await fetchComments()
        } catch (e: any) {
            setCommentError(e.message)
        } finally {
            setLoading(false)
        }
    }

    // ─── 7) 대댓글 등록 ─────────────────────────────────────────────
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
            await fetchComments()
            setReplyInputs((ri) => ({ ...ri, [cid]: '' }))
            setActiveReplyId(null)
        } catch (e: any) {
            setCommentError(e.message)
        } finally {
            setLoading(false)
        }
    }

    // ─── 8) 대댓글 좋아요 ───────────────────────────────────────────
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
            await fetchComments()
        } catch {
            alert('대댓글 좋아요 처리에 실패했습니다.')
        }
    }

    // ─── 9) 대댓글 수정/삭제 ────────────────────────────────────────
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
            await fetchComments()
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
            await fetchComments()
        } catch (e: any) {
            setCommentError(e.message)
        } finally {
            setLoading(false)
        }
    }

    // ─── 10) 팔로우/언팔로우 ───────────────────────────────────────
    const handleFollow = async (userId: number) => {
        if (!isLogin) {
            router.push('/login')
            return
        }
        try {
            if (isFollowing[userId]) {
                await fetch(`${API}/api/v1/follow/delete/unfollow`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ followeeId: userId }),
                })
            } else {
                await fetch(`${API}/api/v1/follow/create/follow`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ followeeId: userId }),
                })
            }
            setIsFollowing((prev) => ({ ...prev, [userId]: !prev[userId] }))
            window.location.reload()
        } catch {
            alert('팔로우/언팔로우 처리에 실패했습니다.')
        }
    }

    // ─── 클릭 외부 감지 ─────────────────────────────────────────────
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (activeCommentId !== null && popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setActiveCommentId(null)
            }
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

    // ─── 프로필 이미지 불러오기 ────────────────────────────────────
    // useEffect(() => {
    //     if (!comments.length) return
    //     const ids = Array.from(
    //         new Set([...comments.map((c) => c.userId), ...comments.flatMap((c) => c.replies.map((r) => r.userId))]),
    //     )
    //     async function fetchUserImages() {
    //         const map: Record<number, string> = {}
    //         await Promise.all(
    //             ids.map(async (id) => {
    //                 try {
    //                     const res = await fetch(`${API}/api/v1/users/get/profile/${id}`)
    //                     if (!res.ok) return
    //                     const { imageUrl } = await res.json()
    //                     map[id] = imageUrl
    //                 } catch {}
    //             }),
    //         )
    //         setUserImages(map)
    //     }
    //     fetchUserImages()
    // }, [comments])

    useEffect(() => {
        if (!rawComments.length) return
        const ids = Array.from(
            new Set([
                ...rawComments.map((c) => c.userId),
                ...rawComments.flatMap((c) => c.replies.map((r) => r.userId)),
            ]),
        )
        async function fetchUserImages() {
            const map: Record<number, string> = {}
            await Promise.all(
                ids.map(async (id) => {
                    try {
                        const res = await fetch(`${API}/api/v1/users/get/profile/${id}`)
                        if (!res.ok) return
                        const { imageUrl } = await res.json()
                        map[id] = imageUrl
                    } catch {}
                }),
            )
            setUserImages(map)
        }
        fetchUserImages()
    }, [rawComments])

    // ─── 렌더링 ────────────────────────────────────────────────────
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
                    {/* 댓글 상단 */}
                    <div className="flex justify-between items-center">
                        <div className="relative flex items-center">
                            <img
                                src={userImages[comment.userId] ?? comment.authorImage}
                                alt={`${comment.author} 프로필`}
                                className="w-6 h-6 rounded-full mr-2 object-cover"
                            />
                            <button
                                onClick={() => setActiveCommentId((id) => (id === comment.id ? null : comment.id))}
                                className="font-medium hover:text-[#2E804E]"
                            >
                                {comment.author}
                            </button>
                            {activeCommentId === comment.id && (
                                <div
                                    ref={popoverRef}
                                    className="absolute z-10 mt-2 min-w-[12rem] w-auto bg-white rounded-lg shadow-lg border border-gray-200 left-0"
                                >
                                    <div className="p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center min-w-0">
                                                <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 overflow-hidden">
                                                    <img
                                                        src={userImages[comment.userId] ?? comment.authorImage}
                                                        alt={`${comment.author} 프로필`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <button
                                                        onClick={() => router.push(`/blog/${comment.userId}`)}
                                                        className="font-medium hover:text-[#2E804E] truncate block"
                                                    >
                                                        {comment.author}
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => router.push(`/blog/${comment.userId}`)}
                                                    className="text-gray-500 hover:text-[#2E804E] ml-2"
                                                >
                                                    {/* 아이콘 */}
                                                </button>
                                            </div>
                                        </div>
                                        {!comment.isMe && (
                                            <button
                                                onClick={() => handleFollow(comment.userId)}
                                                className={`w-full px-4 py-2 text-sm rounded-md ${
                                                    isFollowing[comment.userId]
                                                        ? 'text-gray-700 bg-gray-100 hover:bg-gray-200 border'
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

                    {/* 댓글 내용 / 편집 */}
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
                                {loginUser?.id === comment.userId && (
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

                    {/* 대댓글 리스트 */}
                    {comment.replies.length > 0 && (
                        <div className="mt-4 ml-6 space-y-4">
                            {comment.replies.map((reply) => (
                                <div key={reply.id} className="border-l border-gray-300 pl-4">
                                    <div className="flex justify-between items-center">
                                        <div className="relative flex items-center">
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
                                            {activeReplyPopoverId === reply.id && (
                                                <div
                                                    ref={replyPopoverRef}
                                                    className="absolute z-10 mt-2 min-w-[12rem] w-auto bg-white rounded-lg shadow-lg border border-gray-200 left-0"
                                                >
                                                    <div className="p-4">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <div className="flex items-center min-w-0">
                                                                <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 overflow-hidden">
                                                                    <img
                                                                        src={
                                                                            userImages[reply.userId] ??
                                                                            reply.authorImage
                                                                        }
                                                                        alt={`${reply.author} 프로필`}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <button
                                                                        onClick={() =>
                                                                            router.push(`/blog/${reply.userId}`)
                                                                        }
                                                                        className="font-medium hover:text-[#2E804E] truncate block"
                                                                    >
                                                                        {reply.author}
                                                                    </button>
                                                                </div>
                                                                <button
                                                                    onClick={() => router.push(`/blog/${reply.userId}`)}
                                                                    className="text-gray-500 hover:text-[#2E804E] ml-2"
                                                                >
                                                                    {/* 아이콘 */}
                                                                </button>
                                                            </div>
                                                        </div>
                                                        {!reply.isMe && (
                                                            <button
                                                                onClick={() => handleFollow(reply.userId)}
                                                                className={`w-full px-4 py-2 text-sm rounded-md ${
                                                                    isFollowing[reply.userId]
                                                                        ? 'text-gray-700 bg-gray-100 hover:bg-gray-200 border'
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
                                                {loginUser?.id === reply.userId && (
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
