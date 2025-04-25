// src/components/CommentForm.jsx
'use client'

import { useState } from 'react'

export default function CommentForm({ postId, onCommentCreated }) {
    const [content, setContent] = useState('')
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch('/api/v1/comments/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // 쿠키 기반 인증
                body: JSON.stringify({ postId, content }),
            })

            if (!response.ok) {
                const { message } = await response.json()
                throw new Error(message || '댓글 생성 실패')
            }

            const data = await response.json()
            onCommentCreated(data) // 부모 컴포넌트에 새 댓글 전달
            setContent('')
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-2">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="댓글을 작성하세요."
                required
                className="w-full p-2 border rounded"
            />
            {error && <p className="text-red-500">{error}</p>}
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                등록
            </button>
        </form>
    )
}
