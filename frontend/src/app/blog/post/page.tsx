'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'

const CreatePostForm = () => {
    const [form, setForm] = useState({
        mainCategoryId: '',
        blogId: '',
        categoryId: '',
        title: '',
        content: '',
        author: '',
        book: '',
        images: [],
    })
    const [user, setUser] = useState(null) // 로그인된 사용자 정보

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await fetch('http://localhost:8090/api/v1/users/login', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include', // 쿠키 포함
                })

                console.log('status:', response.status)

                if (!response.ok) {
                    console.log('응답 실패:', response.status)
                    setUser(null)
                    return
                }

                const data = await response.json()
                console.log('로그인 사용자 정보:', data) // 👈 이거 찍어보기
                setUser(data)
            } catch (error) {
                console.error('로그인 상태 확인 실패:', error)
                setUser(null)
            }
        }

        checkLoginStatus()
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleFileChange = (e) => {
        setForm((prev) => ({ ...prev, images: e.target.files }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // 로그인된 사용자가 아니라면 게시글 등록하지 못하게 처리
        if (!user) {
            alert('로그인 후 게시글을 작성할 수 있습니다.')
            return
        }

        const formData = new FormData()
        formData.append('mainCategoryId', form.mainCategoryId)
        formData.append('blogId', form.blogId)
        formData.append('title', form.title)
        formData.append('content', form.content)

        if (form.categoryId) formData.append('categoryId', form.categoryId)
        if (form.author) formData.append('author', form.author)
        if (form.book) formData.append('book', form.book)
        if (form.images.length > 0) {
            for (let i = 0; i < form.images.length; i++) {
                formData.append('images', form.images[i])
            }
        }

        try {
            const response = await axios.post('/api/v1/posts/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // JWT 토큰을 Authorization 헤더에 포함
                },
            })
            alert('게시글 등록 성공!')
            console.log(response.data)
        } catch (error) {
            console.error('게시글 등록 실패:', error.response?.data || error.message)
            alert('게시글 등록 실패')
        }
    }

    return (
        <div>
            {!user ? (
                <p>로그인 후 게시글을 작성할 수 있습니다.</p>
            ) : (
                <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4 p-4">
                    <input
                        type="number"
                        name="mainCategoryId"
                        placeholder="Main Category ID"
                        onChange={handleChange}
                        required
                    />
                    <input type="number" name="blogId" placeholder="Blog ID" onChange={handleChange} required />
                    <input type="number" name="categoryId" placeholder="(선택) Category ID" onChange={handleChange} />
                    <input type="text" name="title" placeholder="Title" onChange={handleChange} required />
                    <textarea name="content" placeholder="Content" onChange={handleChange} required />
                    <input type="text" name="author" placeholder="(선택) Author" onChange={handleChange} />
                    <input type="text" name="book" placeholder="(선택) Book" onChange={handleChange} />
                    <input type="file" name="images" multiple onChange={handleFileChange} />
                    <button type="submit">게시글 등록</button>
                </form>
            )}
        </div>
    )
}

export default CreatePostForm
