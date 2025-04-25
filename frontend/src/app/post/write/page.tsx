'use client'

import { useState, useEffect, useRef, MouseEvent } from 'react'
import Link from 'next/link'

// import axios from 'axios'

import { useRouter } from 'next/navigation'
import { useGlobalLoginUser } from '@/stores/auth/loginMember'

// 카테고리 인터페이스 추가

interface Category {
    id: number
    name: string
    create_at: string
    update_at: string
}

export interface User {
    id: number
    email: string
    username: string
    blogId: number
    role: string
}

export interface LoginResponse {
    user: User
    accessToken: string
}

export default function PostWritePage() {
    const router = useRouter()
    const { isLogin, loginUser } = useGlobalLoginUser()

    // interface MainCategory {
    //     id: number
    //     name: string
    // }

    // State for the form fields
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [bookTitle, setBookTitle] = useState('')
    const [content, setContent] = useState('')
    const [tags, setTags] = useState('')

    //const [category, setCategory] = useState('전체')
    //const [mainCategory, setMainCategory] = useState('전체')

    // 카테고리 관련 상태 수정
    const [categories, setCategories] = useState<Category[]>([])
    const [mainCategories, setMainCategories] = useState<Category[]>([])
    const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0)
    const [selectedMainCategoryId, setSelectedMainCategoryId] = useState<number>(0)

    // const [category, setCategory] = useState('전체')
    // const [mainCategory, setMainCategory] = useState('전체')
    // const [categories, setCategories] = useState<Category>([])
    // const [mainCategories, setMainCategories] = useState<MainCategory>([])
    // const [error, setError] = useState<string | null>(null)

    // State for UI rendering
    const [isClient, setIsClient] = useState(false)
    const editorRef = useRef<HTMLDivElement>(null)

    // State for text formatting
    const [isBold, setIsBold] = useState(false)
    const [isItalic, setIsItalic] = useState(false)
    const [isUnderline, setIsUnderline] = useState(false)
    const [isBulletList, setIsBulletList] = useState(false)
    const [isNumberedList, setIsNumberedList] = useState(false)

    // First add state for image files
    const [selectedImages, setSelectedImages] = useState<FileList | null>(null)

    // 블로그 정보를 가져오는 상태 추가
    const [blogInfo, setBlogInfo] = useState<{ blogId: number | null }>({ blogId: null })

    // 로그인 체크
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('http://localhost:8090/api/v1/users/get/token', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include', // 쿠키 포함
                })

                if (!response.ok) {
                    console.error('인증 실패:', response.status)
                    // alert('로그인이 필요한 서비스입니다.')
                    router.push('/account/login')
                    return
                }

                const userData = await response.json()
                console.log('인증 성공:', userData)
            } catch (error) {
                console.error('인증 확인 실패:', error)
                // alert('로그인이 필요한 서비스입니다.')
                router.push('/account/login')
            }
        }
    }, [router])

    // 블로그 정보를 가져오는 useEffect 추가
    useEffect(() => {
        const fetchBlogInfo = async () => {
            if (!loginUser?.id) return

            try {
                const response = await fetch(`http://localhost:8090/api/v1/blogs/get/token`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                })

                if (!response.ok) {
                    throw new Error('블로그 정보를 가져오는데 실패했습니다.')
                }

                const data = await response.json()
                console.log('블로그 정보:', data)
                setBlogInfo({ blogId: data.blogId })
            } catch (error) {
                console.error('블로그 정보 조회 실패:', error)
            }
        }

        // 로그인 상태일 때만 블로그 정보 가져오기
        if (isLogin) {
            fetchBlogInfo()
        }
    }, [isLogin])

    // 카테고리 데이터 불러오기

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // 메인 카테고리 가져오기
                const mainResponse = await fetch('http://localhost:8090/api/v1/maincategories/get', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                })

                const mainData = await mainResponse.json()
                console.log('메인 카테고리 데이터:', mainData)

                // 메인 카테고리 설정
                if (Array.isArray(mainData)) {
                    setMainCategories(mainData)
                } else {
                    console.error('메인 카테고리 데이터 형식 오류:', mainData)
                    setMainCategories([])
                }

                // 유저의 카테고리 가져오기
                const categoryResponse = await fetch('http://localhost:8090/api/v1/categories/get/allcategory', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                })

                const categoryData = await categoryResponse.json()
                console.log('카테고리 데이터:', categoryData)

                // 카테고리 설정
                if (Array.isArray(categoryData)) {
                    setCategories(categoryData)
                } else {
                    console.error('카테고리 데이터 형식 오류:', categoryData)
                    setCategories([])
                }
            } catch (error) {
                console.error('카테고리 로드 에러:', error)
                setMainCategories([])
                setCategories([])
            }
        }

        // 로그인된 경우에만 카테고리 데이터 로드
        if (isLogin) {
            fetchCategories()
        }
    }, [isLogin])

    // This ensures hydration errors are prevented by only rendering on the client
    useEffect(() => {
        setIsClient(true)
    }, [])

    // Initialize editor once it's rendered
    useEffect(() => {
        if (isClient && editorRef.current) {
            // Make the editor area focused by default
            editorRef.current.focus()
            // Set default separator for paragraphs
            try {
                document.execCommand('defaultParagraphSeparator', false, 'p')
            } catch (e) {
                console.error('Failed to set default paragraph separator')
            }
        }
    }, [isClient])

    // Add image input handler
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedImages(e.target.files)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // blogId 체크
        if (!blogInfo.blogId) {
            console.error('블로그 정보가 없습니다:', blogInfo)
            alert('블로그 정보를 불러오는데 실패했습니다.')

            return
        }

        // 필수값 체크
        if (!title.trim()) {
            alert('제목을 입력해주세요.')
            return
        }

        // 필수 값 체크
        /* if (!selectedMainCategoryId) {
            alert('메인 카테고리를 선택해주세요.')
            return
        }   */

        if (!selectedMainCategoryId || selectedMainCategoryId === 0) {
            alert('메인 카테고리를 선택해주세요.')
            return
        }

        const editorContent = editorRef.current?.innerHTML || ''

        // blogId 체크 추가
        /* if (!loginUser?.id) {
            console.error('사용자 정보가 없습니다:', loginUser)
            alert('로그인이 필요합니다.')
            router.push('/account/login')
            return
        } */

        try {
            // FormData 객체 생성
            const formData = new FormData()

            // 필수 필드

            formData.append('blogId', blogInfo.blogId.toString())
            formData.append('mainCategoryId', selectedMainCategoryId.toString())

            formData.append('title', title.trim())
            formData.append('content', editorContent)

            // Add optional fields
            if (selectedCategoryId && selectedCategoryId !== 0) {
                formData.append('categoryId', selectedCategoryId.toString())
            }
            if (author.trim()) {
                formData.append('author', author.trim())
            }
            if (bookTitle.trim()) {
                formData.append('book', bookTitle.trim())
            }

            // Add images if selected
            if (selectedImages) {
                Array.from(selectedImages).forEach((image) => {
                    formData.append('images', image)
                })
            }

            // 디버깅용 로그
            for (let [key, value] of formData.entries()) {
                console.log(`전송 데이터 - ${key}:`, value)
            }

            const response = await fetch('http://localhost:8090/api/v1/posts/create', {
                method: 'POST',
                credentials: 'include', // 쿠키 포함
                body: formData,
            })

            // 응답 상태 로깅
            console.log('응답 상태:', response.status)

            if (!response.ok) {
                throw new Error('게시글 등록에 실패했습니다.')
            }

            // 응답 처리를 한 번만 시도
            const responseText = await response.text()
            console.log('서버 응답:', responseText)

            // 응답이 JSON인지 확인
            try {
                const responseData = JSON.parse(responseText)
                console.log('생성된 게시글:', responseData)
                alert('게시글이 성공적으로 등록되었습니다.')
                if (responseData.id) {
                    router.push(`/post/${responseData.id}/detail/get`)
                } else {
                    router.push(`/blog/post/${blogInfo.blogId}/list`)
                }
            } catch (jsonError) {
                // JSON 파싱 실패시 (일반 텍스트 응답)
                alert('게시글이 성공적으로 등록되었습니다.')
                router.push(`/blog/post/${blogInfo.blogId}/list`)
            }
        } catch (error) {
            console.error('Error:', error)
            alert('게시글 등록에 실패했습니다.')
        }
    }

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const categoryId = Number(e.target.value)
        setSelectedCategoryId(categoryId)
        //setCategory(categoryId.toString())
    }

    const handleMainCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const mainCategoryId = Number(e.target.value)
        setSelectedMainCategoryId(mainCategoryId)
        //setMainCategory(mainCategoryId.toString())
    }

    // Format handlers using document.execCommand for direct formatting
    const applyFormat = (
        event: MouseEvent<HTMLButtonElement>,
        format: 'bold' | 'italic' | 'underline' | 'insertUnorderedList' | 'insertOrderedList',
    ) => {
        // Prevent default button behavior (which might cause page reload)
        event.preventDefault()

        if (!editorRef.current) return

        // Make sure the editor has focus
        editorRef.current.focus()

        // Get the current selection
        const selection = window.getSelection()
        const range = selection?.getRangeAt(0)

        // Execute the command
        try {
            // For simple formatting commands
            if (format === 'bold' || format === 'italic' || format === 'underline') {
                document.execCommand(format, false)

                // Update state to reflect active formatting
                switch (format) {
                    case 'bold':
                        setIsBold(!isBold)
                        break
                    case 'italic':
                        setIsItalic(!isItalic)
                        break
                    case 'underline':
                        setIsUnderline(!isUnderline)
                        break
                }
            }
            // For list commands - handle them manually if execCommand doesn't work
            else if (format === 'insertUnorderedList') {
                // Try standard command first
                const success = document.execCommand(format, false)

                // If standard command fails, manual implementation
                if (!success && range && editorRef.current) {
                    const selectedText = range.toString()
                    const listItems = selectedText.split('\n').filter((line) => line.trim() !== '')

                    if (listItems.length > 0) {
                        const ul = document.createElement('ul')
                        listItems.forEach((item) => {
                            const li = document.createElement('li')
                            li.textContent = item
                            ul.appendChild(li)
                        })

                        range.deleteContents()
                        range.insertNode(ul)
                    } else {
                        // If no text is selected, just create an empty list item
                        const ul = document.createElement('ul')
                        const li = document.createElement('li')
                        li.innerHTML = '&nbsp;' // Empty list item needs a space to be visible
                        ul.appendChild(li)

                        range.deleteContents()
                        range.insertNode(ul)

                        // Place caret in the empty list item
                        range.selectNodeContents(li)
                        range.collapse(true)
                        selection?.removeAllRanges()
                        selection?.addRange(range)
                    }
                }

                setIsBulletList(!isBulletList)
            } else if (format === 'insertOrderedList') {
                // Try standard command first
                const success = document.execCommand(format, false)

                // If standard command fails, manual implementation
                if (!success && range && editorRef.current) {
                    const selectedText = range.toString()
                    const listItems = selectedText.split('\n').filter((line) => line.trim() !== '')

                    if (listItems.length > 0) {
                        const ol = document.createElement('ol')
                        listItems.forEach((item) => {
                            const li = document.createElement('li')
                            li.textContent = item
                            ol.appendChild(li)
                        })

                        range.deleteContents()
                        range.insertNode(ol)
                    } else {
                        // If no text is selected, just create an empty list item
                        const ol = document.createElement('ol')
                        const li = document.createElement('li')
                        li.innerHTML = '&nbsp;' // Empty list item needs a space to be visible
                        ol.appendChild(li)

                        range.deleteContents()
                        range.insertNode(ol)

                        // Place caret in the empty list item
                        range.selectNodeContents(li)
                        range.collapse(true)
                        selection?.removeAllRanges()
                        selection?.addRange(range)
                    }
                }

                setIsNumberedList(!isNumberedList)
            }
        } catch (e) {
            console.error('Error applying format:', format, e)
        }

        // Return focus to editor after command is executed
        setTimeout(() => {
            if (editorRef.current) {
                editorRef.current.focus()
            }
        }, 10)
    }

    // Check if selection exists in editor (helper function)
    const hasSelection = (): boolean => {
        const selection = window.getSelection()
        return selection !== null && selection.toString().length > 0
    }

    // If not yet client-side rendered, show a loading state or nothing
    if (!isClient) {
        return <div className="flex max-w-7xl mx-auto p-6">Loading...</div>
    }

    if (!isClient || !isLogin) {
        return (
            <div className="flex max-w-7xl mx-auto p-6">
                <div className="text-center w-full">
                    <p className="text-xl">로그인 한 사용자만 게시글을 작성하실 수 있습니다.</p>
                    <Link href="/account/login" className="text-blue-500 hover:underline mt-4 inline-block">
                        로그인하러 가기
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="flex max-w-7xl mx-auto p-6 gap-6">
            {/* Main content - post editor */}
            <div className="flex-1 bg-white rounded shadow p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Title Input */}
                    <div className="mb-8">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="제목"
                            className="w-full py-3 px-0 text-4xl font-light border-0 border-b border-gray-200 focus:outline-none focus:border-gray-300 focus:ring-0"
                            required
                        />
                    </div>
                    {/* Author Input */}
                    <div>
                        <input
                            type="text"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            placeholder="작가를 입력하세요"
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    {/* Book Title Input */}
                    <div>
                        <input
                            type="text"
                            value={bookTitle}
                            onChange={(e) => setBookTitle(e.target.value)}
                            placeholder="책 제목을 입력하세요"
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    {/* Formatting Toolbar */}
                    <div className="flex space-x-6 border-t border-b border-gray-200 py-2 mb-4 items-center">
                        <button
                            type="button"
                            onMouseDown={(e) => applyFormat(e, 'bold')}
                            className={`p-1 font-bold text-xl ${isBold ? 'text-[#2E804E]' : 'text-black'}`}
                        >
                            B
                        </button>
                        <button
                            type="button"
                            onMouseDown={(e) => applyFormat(e, 'italic')}
                            className={`p-1 italic text-xl ${isItalic ? 'text-[#2E804E]' : 'text-black'}`}
                        >
                            I
                        </button>
                        <button
                            type="button"
                            onMouseDown={(e) => applyFormat(e, 'underline')}
                            className={`p-1 underline text-xl ${isUnderline ? 'text-[#2E804E]' : 'text-black'}`}
                        >
                            U
                        </button>
                        <div className="text-gray-300">|</div>
                        <button
                            type="button"
                            onMouseDown={(e) => applyFormat(e, 'insertUnorderedList')}
                            className={`p-1 text-xl ${isBulletList ? 'text-[#2E804E]' : 'text-black'}`}
                        >
                            •
                        </button>
                        <button
                            type="button"
                            onMouseDown={(e) => applyFormat(e, 'insertOrderedList')}
                            className={`p-1 text-xl ${isNumberedList ? 'text-[#2E804E]' : 'text-black'}`}
                        >
                            1.
                        </button>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">이미지 첨부</label>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                            className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-md file:border-0
                                file:text-sm file:font-semibold
                                file:bg-green-50 file:text-green-700
                                hover:file:bg-green-100"
                        />
                    </div>
                    {/* Content Area - ContentEditable div instead of textarea */}
                    <div className="min-h-[300px] border border-gray-200 rounded-md overflow-hidden mb-6">
                        <div
                            ref={editorRef}
                            contentEditable
                            suppressContentEditableWarning={true}
                            className="w-full h-full min-h-[300px] p-4 outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400"
                            style={{ overflowY: 'auto' }}
                            data-placeholder="내용을 입력하세요"
                            onInput={() => {
                                // Additional handling for changes if needed
                            }}
                        ></div>
                    </div>
                    {/* Submit Buttons */}
                    <div className="flex justify-end space-x-4 mt-6">
                        <Link
                            href="/post"
                            className="px-5 py-2 min-w-[100px] bg-white text-black rounded border border-gray-200 text-base"
                        >
                            돌아가기
                        </Link>
                        <button
                            type="submit"
                            className="px-5 py-2 min-w-[100px] bg-[#2E804E] text-white rounded border border-gray-300 text-base"
                        >
                            발행하기
                        </button>
                    </div>
                </form>
            </div>

            {/* Right sidebar - Categories */}
            <div className="w-80 space-y-6">
                {/* Combined Category Selector */}
                <div className="bg-white rounded shadow p-4">
                    <div className="space-y-6">
                        {/* Regular Category */}
                        <div>
                            <h3 className="text-lg font-medium mb-4">카테고리 선택</h3>
                            <div className="relative mb-4">
                                <select
                                    value={selectedCategoryId}
                                    onChange={handleCategoryChange}
                                    className="w-full p-2 border border-gray-300 rounded appearance-none"
                                >
                                    <option value={0}>전체</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
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

                        {/* Main Category */}
                        <div>
                            <h3 className="text-lg font-medium mb-4">메인 카테고리 선택</h3>
                            <div className="relative mb-4">
                                <select
                                    value={selectedMainCategoryId}
                                    onChange={handleMainCategoryChange}
                                    className="w-full p-2 border border-gray-300 rounded appearance-none"
                                >
                                    <option value={0}>전체</option>
                                    {mainCategories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
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
                </div>
            </div>
        </div>
    )
}
