'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { useParams } from 'next/navigation'

const editCategory = () => {
    const [categoryName, setCategoryName] = useState('')
    const router = useRouter()
    const searchParams = useSearchParams()
    const { userId: userId } = useParams<{ id: string }>()
    console.log('userId : ', userId)

    const handleCreateCategory = async () => {
        if (!categoryName) {
            alert('카테고리 이름을 입력하세요.')
            return
        }

        try {
            const response = await fetch('http://localhost:8090/api/v1/categories/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ categoryName: categoryName }),
            })

            if (!response.ok) {
                throw new Error('카테고리 생성 실패')
            }

            // 성공적으로 생성되면 카테고리 목록 페이지로 이동
            router.push(`/mypage/${userId}`)
        } catch (error) {
            console.error('Error creating category:', error)
            alert('카테고리 생성 중 오류가 발생했습니다.')
        }
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-4">카테고리 생성</h2>
            <input
                type="text"
                placeholder="카테고리 이름"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <button
                onClick={handleCreateCategory}
                style={{ backgroundColor: '#2E804E' }}
                className="text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
                생성
            </button>
        </div>
    )
}

export default editCategory
