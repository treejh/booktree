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

// 이미지 미리보기를 위한 인터페이스 추가
interface ImagePreview {
    file: File
    url: string
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

interface ContentPart {
    type: 'text' | 'image'
    data?: string // type=text일 때 텍스트
    index?: number
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
    const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([])

    // 블로그 정보를 가져오는 상태 추가
    const [blogInfo, setBlogInfo] = useState<{ blogId: number | null }>({ blogId: null })

    // nst [contentParts, setContentParts] = useState<ContentPart[]>([])
    // contentParts 상태 추가
    const [contentParts, setContentParts] = useState<
        Array<{
            type: string
            data?: string
            index?: number
        }>
    >([])

    const [currentContent, setCurrentContent] = useState('')

    // 로그인 체크
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/users/get/token`, {
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
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/blogs/get/token`, {
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
                const mainResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/maincategories/get`, {
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
            // 초기 내용 설정
            if (!editorRef.current.innerHTML) {
                editorRef.current.innerHTML = '<p><br></p>'
            }
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
        if (e.target.files && e.target.files.length > 0) {
            // 기존 이미지 배열에 새 이미지 추가
            setSelectedImages((prevImages) => {
                const prevFiles = prevImages ? Array.from(prevImages) : []
                const newFiles = Array.from(e.target.files || [])
                const dataTransfer = new DataTransfer()

                // 기존 파일과 새 파일을 결합
                const allFiles = prevFiles.concat(newFiles)

                // 모든 파일을 DataTransfer에 추가
                allFiles.forEach((file) => {
                    dataTransfer.items.add(file)
                })

                return dataTransfer.files
            })

            // 이미지 미리보기 업데이트
            Array.from(e.target.files).forEach((file) => {
                const imageUrl = URL.createObjectURL(file)
                setImagePreviews((prev) => [...prev, { file, url: imageUrl }])
            })

            // 선택된 각 이미지를 에디터에 삽입
            Array.from(e.target.files).forEach((file) => {
                if (editorRef.current) {
                    const selection = window.getSelection()
                    const range = selection?.getRangeAt(0) || editorRef.current.ownerDocument.createRange()

                    // 이미지를 감싸는 p 태그 생성
                    const p = document.createElement('p')
                    p.className = 'text-center my-4'

                    // 이미지 요소 생성
                    const img = document.createElement('img')
                    const imageUrl = URL.createObjectURL(file)
                    img.src = imageUrl
                    img.className = 'max-w-full h-auto mx-auto'
                    img.setAttribute('data-filename', file.name)

                    p.appendChild(img)

                    // 현재 위치에 이미지 삽입
                    range.insertNode(p)

                    // 줄바꿈 추가
                    const br = document.createElement('br')
                    p.after(br)

                    // 커서를 이미지 다음으로 이동
                    range.setStartAfter(br)
                    range.setEndAfter(br)
                    selection?.removeAllRanges()
                    selection?.addRange(range)
                }
            })

            // content 상태 업데이트
            handleEditorChange()
        }
    }
    /* const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            // 기존 이미지 배열에 새 이미지 추가
            setSelectedImages(prevImages => {
                const prevFiles = prevImages ? Array.from(prevImages) : []
                const newFiles = Array.from(e.target.files || [])
                const dataTransfer = new DataTransfer()
                
                // 기존 파일과 새 파일 모두 추가
                [...prevFiles, ...newFiles].forEach(file => {
                    dataTransfer.items.add(file)
                })
                
                return dataTransfer.files
            })

            // 선택된 각 이미지를 에디터에 삽입
            Array.from(e.target.files).forEach((file) => {
                if (editorRef.current) {
                    const selection = window.getSelection()
                    const range = selection?.getRangeAt(0) || editorRef.current.ownerDocument.createRange()

                    // 이미지를 감싸는 p 태그 생성
                    const p = document.createElement('p')
                    p.className = 'text-center my-4'

                    // 이미지 요소 생성
                    const img = document.createElement('img')
                    const imageUrl = URL.createObjectURL(file)
                    img.src = imageUrl
                    img.className = 'max-w-full h-auto mx-auto'
                    img.setAttribute('data-filename', file.name)

                    p.appendChild(img)

                    // 현재 위치에 이미지 삽입
                    range.insertNode(p)

                    // 줄바꿈 추가
                    const br = document.createElement('br')
                    p.after(br)

                    // 커서를 이미지 다음으로 이동
                    range.setStartAfter(br)
                    range.setEndAfter(br)
                    selection?.removeAllRanges()
                    selection?.addRange(range)

                    // content 상태 업데이트
                    handleEditorChange()
                }
            })
        }
    } */

    const generateContentParts = (html: string): ContentPart[] => {
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = html
        const parts: ContentPart[] = []
        let imageIndex = 0

        const processNode = (node: Node) => {
            if (node instanceof HTMLElement) {
                if (node.tagName === 'P') {
                    const img = node.querySelector('img')
                    if (img) {
                        parts.push({
                            type: 'image',
                            index: imageIndex++,
                        })
                    } else if (node.textContent?.trim()) {
                        parts.push({
                            type: 'text',
                            data: node.textContent.trim(),
                        })
                    }
                }
            } else if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
                parts.push({
                    type: 'text',
                    data: node.textContent.trim(),
                })
            }
        }

        Array.from(tempDiv.childNodes).forEach(processNode)
        return parts
    }

    // 이미지 삭제 핸들러 추가
    const handleRemoveImage = (index: number) => {
        setImagePreviews((prev) => {
            const newPreviews = [...prev]
            URL.revokeObjectURL(newPreviews[index].url)
            newPreviews.splice(index, 1)
            return newPreviews
        })
    }

    // 컴포넌트 언마운트 시 URL 정리
    useEffect(() => {
        return () => {
            imagePreviews.forEach((preview) => URL.revokeObjectURL(preview.url))
        }
    }, [])

    // 에디터 콘텐츠 변경 핸들러 추가
    const handleEditorChange = () => {
        if (editorRef.current) {
            const content = editorRef.current.innerHTML

            // 에디터가 완전히 비어있을 때 초기 p 태그 추가
            if (!content || content === '<br>' || content === '') {
                editorRef.current.innerHTML = '<p><br></p>'
            }
            console.log('현재 에디터 내용:', content) // 디버깅용
            setContent(content)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (selectedCategoryId === 0) {
            alert('카테고리를 선택해주세요.')
            return
        }

        if (selectedMainCategoryId === 0) {
            alert('메인 카테고리를 선택해주세요.')
            return
        }

        if (!blogInfo.blogId) {
            alert('블로그 정보를 찾을 수 없습니다.')
            return
        }

        // 필수값 체크
        if (!title.trim()) {
            alert('제목을 입력해주세요.')
            return
        }

        const checkPostExists = async (postId: number): Promise<boolean> => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/posts/get/${postId}`, {
                    method: 'GET',
                    credentials: 'include',
                })
                return response.ok
            } catch (error) {
                return false
            }
        }

        const findExistingPost = async (startId: number): Promise<number> => {
            let currentId = startId
            while (!(await checkPostExists(currentId))) {
                currentId++
            }
            return currentId
        }

        try {
            // 1. 다음 게시글 ID 먼저 가져오기
            const postIdResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/posts/get/createdId`, {
                method: 'GET',
                credentials: 'include',
            })

            if (!postIdResponse.ok) {
                throw new Error('게시글 ID를 가져오는데 실패했습니다.')
            }

            const createdPostId = await postIdResponse.json()
            console.log('생성될 게시글 ID:', createdPostId)

            const formData = new FormData()

            // 기본 정보 추가
            formData.append('title', title)
            formData.append('author', author)
            formData.append('book', bookTitle)
            formData.append('blogId', blogInfo.blogId.toString())
            formData.append('mainCategoryId', selectedMainCategoryId.toString())

            if (selectedCategoryId) {
                formData.append('categoryId', selectedCategoryId.toString())
            }

            // 이미지 파일 및 content 처리
            if (editorRef.current) {
                let contentHtml = editorRef.current.innerHTML.trim()
                const tempDiv = document.createElement('div')
                tempDiv.innerHTML = contentHtml

                // 불필요한 빈 줄바꿈 정리
                contentHtml = tempDiv.innerHTML.replace(/(<br\s*\/?>(?:\s*<br\s*\/?>)*)/g, '<br>')

                // content 유효성 검사
                const hasContent = Array.from(tempDiv.childNodes).some((node) => {
                    if (node instanceof HTMLElement) {
                        // 이미지나 텍스트 컨텐츠가 있는지 확인
                        return (
                            node.tagName === 'IMG' || node.querySelector('img') || node.textContent?.trim().length > 0
                        )
                    }
                    return node.textContent?.trim().length > 0
                })

                if (!hasContent) {
                    throw new Error('내용을 입력해주세요.')
                }

                // content와 이미지 처리
                formData.append('content', contentHtml)

                // 이미지 파일 추가
                if (selectedImages) {
                    Array.from(selectedImages).forEach((file) => {
                        formData.append('images', file)
                    })
                }

                // contentParts 생성
                const parts = generateContentParts(contentHtml)
                console.log('전송할 content:', contentHtml) // 디버깅용
                console.log('생성된 contentParts:', parts) // 디버깅용
                formData.append('contentParts', JSON.stringify(parts))
            }

            // API 호출
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/posts/create`, {
                method: 'POST',
                credentials: 'include',
                body: formData,
            })

            if (!response.ok) {
                const errorText = await response.text()
                console.error('서버 에러 응답:', errorText)
                throw new Error('게시글 작성에 실패했습니다. 서버 응답: ' + errorText)
            }

            // 성공적인 응답 처리
            /* const responseText = await response.text()

            if (!responseText) {
                console.log('서버 응답이 비어있습니다. 성공으로 처리합니다.')
                alert('게시글이 성공적으로 작성되었습니다.')
                router.push(`/post/${finalPostId}/detail/get`)
                return
            }

            try {
                const data = JSON.parse(responseText)
                console.log('게시글 작성 성공:', data)
                alert('게시글이 성공적으로 작성되었습니다.')
                router.push(`/post/${finalPostId}/detail/get`)
            } catch (e) {
                // JSON 파싱 실패하더라도 response.ok가 true면 성공으로 처리
                console.warn('JSON 파싱 실패했지만 요청은 성공:', responseText)
                alert('게시글이 성공적으로 작성되었습니다.')
                const finalPostId = await findExistingPost(createdPostId)
                router.push(`/post/${finalPostId}/detail/get`)
            }
        } catch (error) {
            console.error('게시글 작성 실패:', error)
            alert(error instanceof Error ? error.message : '게시글 작성에 실패했습니다.')
        }
 */
            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(errorText || '게시글 작성에 실패했습니다.')
            }

            alert('게시글이 성공적으로 작성되었습니다.')
            const finalPostId = await findExistingPost(createdPostId)
            router.push(`/post/${finalPostId}/detail/get`)
        } catch (error) {
            console.error('게시글 작성 실패:', error)
            alert(error instanceof Error ? error.message : '게시글 작성에 실패했습니다.')
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
            if (format === 'bold' || format === 'italic') {
                document.execCommand(format, false)
                // Update state to reflect active formatting
                if (format === 'bold') {
                    setIsBold(!isBold)
                } else if (format === 'italic') {
                    setIsItalic(!isItalic)
                }
            } else if (format === 'underline') {
                document.execCommand('underline', false)
                setIsUnderline(!isUnderline) // Toggle underline state
            }
            // For list commands - handle them manually if execCommand doesn't work
            else if (format === 'insertUnorderedList' || format === 'insertOrderedList') {
                const success = document.execCommand(format, false)

                if (!success && range && editorRef.current) {
                    const selectedText = range.toString()
                    const listItems = selectedText.split('\n').filter((line) => line.trim() !== '')

                    const list = document.createElement(format === 'insertUnorderedList' ? 'ul' : 'ol')
                    listItems.forEach((item) => {
                        const li = document.createElement('li')
                        li.textContent = item
                        list.appendChild(li)
                    })

                    range.deleteContents()
                    range.insertNode(list)
                }

                if (format === 'insertUnorderedList') {
                    setIsBulletList(!isBulletList)
                } else {
                    setIsNumberedList(!isNumberedList)
                }
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
                    {/* Author Input
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

                        {/* 이미지 미리보기 영역 */}
                        {imagePreviews.length > 0 && (
                            <div className="mt-4 grid grid-cols-3 gap-4">
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={preview.url}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-32 object-cover rounded"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                        >
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* Content Area - ContentEditable div instead of textarea */}
                    <div className="min-h-[300px] border border-gray-200 rounded-md overflow-hidden mb-6">
                        <div
                            ref={editorRef}
                            contentEditable
                            suppressContentEditableWarning
                            className="w-full min-h-[500px] p-6 border border-gray-300 rounded-lg prose max-w-none
        focus:outline-none focus:ring-1 focus:ring-green-500
        [&>p]:my-4 [&>p]:text-base [&>img]:max-w-full [&>img]:h-auto [&>img]:mx-auto
        [&>p]:leading-relaxed [&>p]:text-gray-800"
                            onInput={handleEditorChange}
                            // placeholder="내용을 입력하세요"
                        />
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
                                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 111.414 1.414l-4 4a 1 1 0 01-1.414 0l-4-4a 1 1 0 010-1.414z" />
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
                                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 111.414 1.414l-4 4a 1 1 0 01-1.414 0l-4-4a 1 1 0 010-1.414z" />
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
