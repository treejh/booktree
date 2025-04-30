'use client'

import { useState, useEffect, useRef, MouseEvent } from 'react'
import { useRouter, useParams } from 'next/navigation'
import React from 'react'
import { useGlobalLoginUser } from '@/stores/auth/loginMember'
import { CommentsSection } from '@/app/components/CommentsSection'
import Link from 'next/link'

// 1. 카테고리 관련 인터페이스 추가
interface Category {
    name: string
    count: number
    path: string
    isParent?: boolean
    postCount: number
    id: number
    isOpen?: boolean
    subCategories?: Category[]
    // postCount?: number // 일부 코드에서 사용됨
}

interface TwoCategory {
    id: number
    name: string
}

interface TwoMainCategory {
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

    //카테고리 확인 유저 아이디
    causerId: number
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

interface ContentPart {
    type: 'text' | 'image'
    data?: string // type=text일 때 텍스트
    index?: number
}

interface ImagePreview {
    file: File
    url: string
}

export default function DetailPage() {
    // 1. Router와 Context Hooks
    const router = useRouter()
    const { postId } = useParams()
    const { isLoginUserPending, isLogin, loginUser } = useGlobalLoginUser()

    // 2. Ref Hooks
    const editorRef = useRef<HTMLDivElement>(null)

    // 3. State Hooks
    const [isAuthor, setIsAuthor] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [post, setPost] = useState<PostDetail | null>(null)
    const [isPostEditing, setIsPostEditing] = useState(false)
    const [categories, setCategories] = useState<Category[]>([])
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
    const [showPopover, setShowPopover] = useState(false)
    const [isFollowing, setIsFollowing] = useState(false)
    const [activePopoverAuthor, setActivePopoverAuthor] = useState<string | null>(null)
    const [isListVisible, setIsListVisible] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [userId, setUserId] = useState<number>()
    const [editCategories, setEditCategories] = useState<TwoCategory[]>([])
    const [editMainCategories, setEditMainCategories] = useState<TwoMainCategory[]>([])

    const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([])
    const [blogInfo, setBlogInfo] = useState<{ blogId: number | null }>({ blogId: null })
    const [selectedImages, setSelectedImages] = useState<FileList | null>(null)
    const [isBold, setIsBold] = useState(false)
    const [isItalic, setIsItalic] = useState(false)
    const [isUnderline, setIsUnderline] = useState(false)
    const [contentParts, setContentParts] = useState<ContentPart[]>([])
    const [currentContent, setCurrentContent] = useState('')

    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null)

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                setLoading(true)
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/posts/get/userid/${postId}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    },
                )

                if (!response.ok) {
                    throw new Error('유저 ID를 불러오는데 실패했습니다다.')
                }

                const data = await response.json()
                console.log('UserId : ', data)
                console.log('LoginUser : ', loginUser)
                setUserId(data)
            } catch (err) {
                console.error('Error fetching post:', err)
                setError(err instanceof Error ? err.message : '유저 ID를 불러오지 못했습니다')
            }
        }
        fetchUserId()
    }, [postId])

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!post?.causerId) return // post.causerId가 없으면 요청하지 않음

            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/users/get/profile/${post.causerId}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    },
                )

                if (!response.ok) {
                    throw new Error('프로필 정보를 가져오는 데 실패했습니다.')
                }

                const data = await response.json()
                setProfileImageUrl(data.imageUrl) // imageUrl을 상태로 저장
            } catch (error) {
                console.error('프로필 이미지 로드 실패:', error)
                setProfileImageUrl(null) // 실패 시 기본값 설정
            }
        }

        fetchUserProfile()
    }, [post?.causerId])

    useEffect(() => {
        const fetchIsFollowing = async () => {
            if (!userId || !isLogin) return // userId가 아직 없으면 요청 안 보냄

            try {
                setLoading(true)
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/follow/get/isfollowing/${userId}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                    },
                )

                // 401/403 에러는 조용히 처리
                if (response.status === 401 || response.status === 403) {
                    return
                }

                if (!response.ok) {
                    throw new Error('팔로우 현황을 불러오는 데 실패했습니다.')
                }

                const data = await response.json()
                console.log('팔로우 여부:', data)
                setIsFollowing(data)
            } catch (err) {
                console.error('Error fetching isFollowing:', err)
                // setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
            } finally {
                setLoading(false)
            }
        }

        fetchIsFollowing()
    }, [userId])

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
                    postId: data.postId,
                    title: data.title,
                    causerId: data.userId,
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
                }
                setPost(formattedPost)
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
                })
            } catch (error) {
                console.error('게시글 로드 실패:', error)
                // 에러 시 UI에 표시하지 않음
            } finally {
                setLoading(false)
            }
        }
        if (postId) fetchPost()
    }, [postId])

    useEffect(() => {
        if (post && loginUser) {
            setIsAuthor(post.username === loginUser.username)
        }
    }, [post, loginUser])

    useEffect(() => {
        const fetchCategories = async () => {
            if (!post?.causerId) return // causerId가 없으면 실행하지 않음
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/categories/get/${post?.causerId}`,
                    {
                        // 유저의 모든 카테고리 찾기 기능
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    },
                )

                // 401/403 에러는 조용히 처리
                if (response.status === 401 || response.status === 403) {
                    console.log('권한이 없습니다')
                    return
                }

                if (!response.ok) {
                    throw new Error('유저 카테고리를 불러오는데 실패했습니다.')
                }

                const data = await response.json()
                console.log('카테고리 : ', data)
                setCategories(data)
                console.log(categories)
            } catch (err) {
                console.error('Error fetching post:', err)
                //setError(err instanceof Error ? err.message : '유저 카테고리를 불러오지 못했습니다')
                setCategories([])
            }
        }

        // ✅ userId가 존재할 때만 호출되도록 조건 추가
        if (post?.causerId) {
            fetchCategories()
        }
    }, [post?.causerId])

    useEffect(() => {
        const fetchTwoCategories = async () => {
            try {
                // 메인 카테고리 가져오기
                const mainResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/maincategories/get`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include', // 이 부분 추가
                })

                // 401/403 에러는 조용히 처리
                if (mainResponse.status === 401 || mainResponse.status === 403) {
                    console.log('메인 카테고리 조회 권한이 없습니다')
                    return
                }

                if (!mainResponse.ok) {
                    throw new Error('메인 카테고리를 불러오는데 실패했습니다.')
                }

                const mainData = await mainResponse.json()
                console.log('메인 카테고리 데이터:', mainData)
                setEditMainCategories(mainData)

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
                setEditCategories(categoryData)
            } catch (error) {
                console.error('카테고리 로드 에러:', error)
                // 에러 시 빈 배열로 초기화
                setEditMainCategories([])
                setEditCategories([])
            }
        }

        fetchTwoCategories()
    }, [])

    useEffect(() => {
        const fetchLikeStatus = async () => {
            if (!postId) return

            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/likeposts/get/${postId}/count`,
                    {
                        credentials: 'include',
                    },
                )
                // 401/403 에러는 조용히 처리
                if (response.status === 401 || response.status === 403) {
                    console.log('좋아요 상태 확인 권한이 없습니다')
                    return
                }

                if (!response.ok) throw new Error('좋아요 상태를 불러오는데 실패했습니다.')

                const data = await response.json()
                setPostLiked(data.liked)
                setPost((prev) => (prev ? { ...prev, likeCount: data.likeCount } : null))
            } catch (error) {
                console.error('좋아요 상태 로드 실패:', error)
                // 에러 시 기본값 설정
                setPostLiked(false)
                setPost((prev) => (prev ? { ...prev, likeCount: 0 } : null))
            }
        }

        fetchLikeStatus()
    }, [postId])

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

    useEffect(() => {
        return () => {
            imagePreviews.forEach((preview) => URL.revokeObjectURL(preview.url))
        }
    }, [])

    // 게시물 좋아요 토글 함수
    const togglePostLike = async () => {
        if (!isLogin) {
            alert('로그인이 필요합니다.')
            return
        }

        // 자신의 글인지 확인
        if (post && post.username === loginUser.username) {
            alert('자신의 글은 좋아요를 할 수 없습니다.')
            return
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/likeposts/click/${postId}`, {
                method: 'POST',
                credentials: 'include',
            })

            if (!response.ok) throw new Error('좋아요 처리에 실패했습니다.')

            const data = await response.json()
            setPostLiked(data.liked)
            setPost((prev) => (prev ? { ...prev, likeCount: data.likeCount } : null))
        } catch (error) {
            console.error('좋아요 토글 실패:', error)
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
            window.location.reload()
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

            window.location.reload()
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
                if (userId !== undefined) {
                    await unfollowUser(userId)
                } else {
                    console.error('userId is undefined')
                }
                setIsFollowing(false)
            } else {
                // ✅ 아직 팔로우 안 했으면 → 팔로우 요청
                if (userId !== undefined) {
                    await followUser(userId)
                } else {
                    console.error('userId is undefined')
                }
                setIsFollowing(true)
            }
        } catch (error) {
            console.error('팔로우/언팔로우 실패:', error)
        }
    }

    const handleCategoryClick = (path: string) => router.push(path)
    const toggleCategory = (idx: number) =>
        setCategories(categories.map((cat, i) => (i === idx ? { ...cat, isOpen: !cat.isOpen } : cat)))

    const handleProfileClick = (username: string) => router.push('/mypage')

    // 게시글을 불러오는 함수

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

    // 상태 추가

    const applyFormat = (
        event: MouseEvent<HTMLButtonElement>,
        format: 'bold' | 'italic' | 'underline' | 'insertUnorderedList' | 'insertOrderedList',
    ) => {
        event.preventDefault()
        if (!editorRef.current) return

        editorRef.current.focus()
        document.execCommand(format, false)

        if (format === 'bold') setIsBold(!isBold)
        if (format === 'italic') setIsItalic(!isItalic)
        if (format === 'underline') setIsUnderline(!isUnderline)
    }

    const postsPerPage = 5 // 페이지당 게시글 수

    // 페이지 변경 핸들러 추가
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber)
        // 여기에서 실제 데이터를 불러오는 API 호출이 있을 수 있습니다
        // 현재는 더미 데이터이므로 페이지만 변경합니다
    }

    // const toggleList = () => setIsListVisible(!isListVisible)
    // const handlePageChange = (n: number) => setCurrentPage(n)
    // handleImageChange 함수 수정
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedImages(e.target.files)

            Array.from(e.target.files).forEach((file) => {
                const imageUrl = URL.createObjectURL(file)

                if (editorRef.current) {
                    const selection = window.getSelection()
                    const range = selection?.getRangeAt(0)

                    if (range) {
                        // 이미지 요소 생성
                        const imgElement = document.createElement('img')
                        imgElement.src = imageUrl
                        imgElement.className = 'max-w-full h-auto my-4'
                        imgElement.setAttribute('data-filename', file.name)

                        // 이미지를 p 태그로 감싸기
                        const p = document.createElement('p')
                        p.appendChild(imgElement)
                        p.className = 'text-center' // 이미지 중앙 정렬
                        range.insertNode(p)

                        // 커서를 이미지 다음으로 이동
                        range.setStartAfter(p)
                        range.setEndAfter(p)

                        // 줄바꿈 추가
                        const br = document.createElement('br')
                        range.insertNode(br)

                        // 선택 영역 업데이트
                        selection?.removeAllRanges()
                        selection?.addRange(range)

                        // content 업데이트
                        setEditedPost((prev) => ({
                            ...prev,
                            content: editorRef.current?.innerHTML || prev.content,
                        }))
                    }
                }
            })
        }
    }

    // handlePostEdit 함수 수정
    const handlePostEdit = async () => {
        if (!post || !loginUser) return

        try {
            // 먼저 blogId 가져오기
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
            const formData = new FormData()

            // 필수 필드들 추가
            formData.append('blogId', blogData.blogId.toString())
            formData.append('title', editedPost.title)
            formData.append('mainCategoryId', editedPost.mainCategoryId.toString())

            if (editorRef.current) {
                const tempDiv = document.createElement('div')
                tempDiv.innerHTML = editorRef.current.innerHTML

                const parts: Array<{ type: string; data?: string; index?: number }> = []
                let imageIndex = 0

                // 이미지가 있다면 추가
                if (selectedImages) {
                    Array.from(selectedImages).forEach((file) => {
                        formData.append('images', file)
                    })
                }

                // content와 contentParts 생성
                Array.from(tempDiv.childNodes).forEach((node) => {
                    if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
                        parts.push({
                            type: 'text',
                            data: node.textContent.trim(),
                        })
                    } else if (node instanceof HTMLElement) {
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
                        } else if (node.tagName === 'IMG') {
                            parts.push({
                                type: 'image',
                                index: imageIndex++,
                            })
                        }
                    }
                })

                // contentParts와 content 추가
                formData.append('contentParts', JSON.stringify(parts))
                formData.append('content', editorRef.current.innerHTML)
            }

            // 선택적 필드 추가
            if (editedPost.categoryId) {
                formData.append('categoryId', editedPost.categoryId.toString())
            }
            if (editedPost.author) {
                formData.append('author', editedPost.author)
            }
            if (editedPost.book) {
                formData.append('book', editedPost.book)
            }

            // FormData 내용 확인
            for (let [key, value] of formData.entries()) {
                console.log(`${key}:`, value instanceof File ? `File: ${value.name}` : value)
            }

            // 수정 요청 보내기
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/posts/patch/${post.postId}`, {
                method: 'PATCH',
                credentials: 'include',
                body: formData,
            })

            const responseText = await response.text()
            console.log('서버 응답:', responseText)

            if (!response.ok) {
                throw new Error('게시글 수정에 실패했습니다.')
            }

            alert('게시글이 성공적으로 수정되었습니다!')
            setIsPostEditing(false)
            window.location.reload()
        } catch (error) {
            console.error('게시글 수정 실패:', error)
            alert('게시글 수정에 실패했습니다.')
        }
    }
    // handlePostEdit 함수 수정
    /* const handlePostEdit = async (e: React.FormEvent) => {
        if (!post || !loginUser) return

        try {
            const blogResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/blogs/get/token`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            })

            const blogData = await blogResponse.json()
            const formData = new FormData()

            // 기본 필드 추가
            formData.append('blogId', blogData.blogId.toString())
            formData.append('title', editedPost.title)
            formData.append('mainCategoryId', editedPost.mainCategoryId.toString())

            // content와 이미지 처리
            if (editorRef.current) {
                const tempDiv = document.createElement('div')
                tempDiv.innerHTML = editedPost.content

                // contentParts 생성
                const parts: Array<{ type: string; data?: string; index?: number }> = []
                let imageIndex = 0

                // 이미지 파일 추가
                const imageFiles: File[] = []
                if (selectedImages) {
                    Array.from(selectedImages).forEach((file) => {
                        imageFiles.push(file)
                        formData.append('images', file)
                    })
                }

                // content와 contentParts 생성
                const nodes = Array.from(tempDiv.childNodes)
                for (const node of nodes) {
                    if (node instanceof HTMLElement) {
                        if (node.tagName === 'P') {
                            const img = node.querySelector('img')
                            if (img) {
                                const fileName = img.getAttribute('data-filename')
                                if (fileName) {
                                    parts.push({
                                        type: 'image',
                                        index: imageIndex++,
                                    })
                                }
                            } else if (node.textContent?.trim()) {
                                parts.push({
                                    type: 'text',
                                    data: node.textContent.trim(),
                                })
                            }
                        } else if (node.tagName == 'IMG') {
                            const fileName = node.getAttribute('data-filename')
                            if (fileName) {
                                parts.push({
                                    type: 'image',
                                    index: imageIndex++,
                                })
                            }
                        } else if (node.textContent?.trim()) {
                            parts.push({
                                type: 'text',
                                data: node.textContent.trim(),
                            })
                        }
                    } else if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
                        parts.push({
                            type: 'text',
                            data: node.textContent.trim(),
                        })
                    }
                }

                // contentParts JSON 문자열로 변환하여 추가
                formData.append('contentParts', JSON.stringify(parts))
                formData.append('content', editedPost.content)

                // 실제 content를 생성할 때는 이미지 플레이스홀더 포함
                const content = parts
                    .map((part) => {
                        if (part.type === 'text') {
                            return `<p>${part.data}</p>`
                        } else if (part.type === 'image') {
                            return `<img src="IMAGE_PLACEHOLDER_${part.index}" />`
                        }
                        return ''
                    })
                    .join('\n')

                formData.append('content', content)
            }

            // 선택적 필드 추가
            if (editedPost.categoryId) {
                formData.append('categoryId', editedPost.categoryId.toString())
            }
            if (editedPost.author) {
                formData.append('author', editedPost.author)
            }
            if (editedPost.book) {
                formData.append('book', editedPost.book)
            }

            // FormData 내용 확인
            for (let [key, value] of formData.entries()) {
                console.log(`${key}:`, value instanceof File ? `File: ${value.name}` : value)
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/posts/patch/${post.postId}`, {
                method: 'PATCH',
                credentials: 'include',
                body: formData,
            })

            if (!response.ok) {
                const responseText = await response.text()
                console.log('서버 응답:', responseText)
                throw new Error('게시글 수정에 실패했습니다.')
            }

            alert('게시글이 성공적으로 수정되었습니다!')
            setIsPostEditing(false)
            window.location.reload()
        } catch (error) {
            console.error('게시글 수정 실패:', error)
            alert('게시글 수정에 실패했습니다.')
        }
    } */

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

    // Add image input handler
    /* const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedImages((prev) => {
                const newFiles = prev ? [...prev] : []
                return [...newFiles, ...Array.from(e.target.files || [])]
            })

            Array.from(e.target.files).forEach((file) => {
                const imageUrl = URL.createObjectURL(file)

                if (editorRef.current) {
                    const selection = window.getSelection()
                    const range = selection?.getRangeAt(0)

                    if (range) {
                        // 이미지 요소 생성 및 삽입
                        const imgElement = document.createElement('img')
                        imgElement.src = imageUrl
                        imgElement.className = 'max-w-full h-auto my-4'
                        imgElement.setAttribute('data-filename', file.name)

                        // 현재 커서 위치에 이미지 삽입
                        range.insertNode(imgElement)

                        // contentParts 업데이트
                        const currentContent = editorRef.current.innerHTML
                        updateContentParts(currentContent)

                        // 커서를 이미지 다음으로 이동
                        range.setStartAfter(imgElement)
                        range.setEndAfter(imgElement)
                        selection?.removeAllRanges()
                        selection?.addRange(range)
                    }
                }
            })
        }
    } */

    // handleImageChange 함수 수정
    // handleImageChange 함수 수정

    // Content Area 부분 수정

    const updateContentParts = (content: string) => {
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = content

        const parts: Array<{ type: string; data?: string; index?: number }> = []
        let imageIndex = 0

        const processNode = (node: Node) => {
            if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
                parts.push({
                    type: 'text',
                    data: node.textContent.trim(),
                })
            } else if (node.nodeName === 'IMG') {
                parts.push({
                    type: 'image',
                    index: imageIndex++,
                })
            } else if (node.hasChildNodes()) {
                Array.from(node.childNodes).forEach(processNode)
            }
        }

        Array.from(tempDiv.childNodes).forEach(processNode)
        setContentParts(parts)
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

    // handlePostDelete 함수 추가
    const handlePostDelete = async () => {
        if (!post || !loginUser) return

        try {
            // 먼저 해당 유저의 blogId를 가져옴
            const blogResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/blogs/get/username/${post.username}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            )

            if (!blogResponse.ok) {
                throw new Error('블로그 정보를 가져오는데 실패했습니다.')
            }

            const blogId = await blogResponse.json()

            // 게시글 삭제 요청
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
            router.push(`/blog/${blogId}`) // 홈페이지로 리다이렉트
        } catch (error) {
            console.error('게시글 삭제 실패:', error)
            alert('게시글 삭제에 실패했습니다.')
        }
    }

    const handleBlogMainClick = async (username: string) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/blogs/get/username/${username}`,
                {
                    method: 'GET',
                    // credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            )

            if (!response.ok) {
                throw new Error('블로그 정보를 가져오는데 실패했습니다.')
            }

            const blogId = await response.json()
            router.push(`/blog/${blogId}`)
        } catch (error) {
            console.error('Error:', error)
        }
    }

    /* const handleEditorChange = () => {
        if (editorRef.current) {
            const content = editorRef.current.innerHTML
            setCurrentContent(content)

            // contentParts 업데이트
            const textPart: ContentPart = {
                type: 'text',
                data: content,
            }
            setContentParts((prev) => [...prev, textPart])
        }
    } */

    const handleEditorChange = () => {
        if (editorRef.current) {
            setEditedPost((prev) => ({
                ...prev,
                content: editorRef.current.innerHTML,
            }))

            // contentParts 업데이트
            const tempDiv = document.createElement('div')
            tempDiv.innerHTML = editorRef.current.innerHTML

            const parts: ContentPart[] = []
            let imageIndex = 0

            Array.from(tempDiv.childNodes).forEach((node) => {
                if (node instanceof HTMLElement) {
                    if (node.tagName === 'IMG') {
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
            })

            setContentParts(parts)
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
                                    <button
                                        onClick={(e) => applyFormat(e, 'bold')}
                                        className={`p-2 rounded ${isBold ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
                                        title="굵게"
                                    >
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                                            {/* ... SVG path ... */}
                                        </svg>
                                    </button>
                                    <button
                                        onClick={(e) => applyFormat(e, 'italic')}
                                        className={`p-2 rounded ${isItalic ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
                                        title="기울임"
                                    >
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                                            {/* ... SVG path ... */}
                                        </svg>
                                    </button>
                                    <button
                                        onClick={(e) => applyFormat(e, 'underline')}
                                        className={`p-2 rounded ${isUnderline ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
                                        title="밑줄"
                                    >
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                                            {/* ... SVG path ... */}
                                        </svg>
                                    </button>
                                </div>
                                {/* Text Formatting Toolbar */}
                                {/* <div className="border border-gray-200 rounded-t-lg p-2 bg-gray-50 flex space-x-2">
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
                                </div> */}
                                {/* Content Area */}
                                {/* Content Area */}
                                {/* <div className="mb-8">
                                    <div
                                        ref={editorRef}
                                        contentEditable
                                        suppressContentEditableWarning
                                        className="w-full min-h-[500px] p-4 border border-gray-300 rounded-lg prose max-w-none
            focus:outline-none focus:ring-1 focus:ring-green-500
            [&>p]:my-4 [&>img]:max-w-full [&>img]:h-auto"
                                        dangerouslySetInnerHTML={{ __html: editedPost.content }}
                                        onInput={() => {
                                            if (editorRef.current) {
                                                setEditedPost((prev) => ({
                                                    ...prev,
                                                    content: editorRef.current?.innerHTML || prev.content,
                                                }))
                                            }
                                        }}
                                    />
                                </div> */}
                                
                                <div className="mb-8">
                                    <div className="flex items-center mb-4">
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                            id="image-upload"
                                        />
                                        <label
                                            htmlFor="image-upload"
                                            className="cursor-pointer inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md"
                                        >
                                            <svg
                                                className="w-5 h-5 mr-2"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                            이미지 첨부
                                        </label>
                                    </div>
                                    <div
                                        ref={editorRef}
                                        contentEditable
                                        suppressContentEditableWarning
                                        className="w-full min-h-[500px] p-6 border border-gray-300 rounded-lg prose max-w-none
            focus:outline-none focus:ring-1 focus:ring-green-500
            [&>p]:my-4 [&>p]:text-base [&>img]:max-w-full [&>img]:h-auto [&>img]:mx-auto
            [&>p]:leading-relaxed [&>p]:text-gray-800"
                                        dangerouslySetInnerHTML={{ __html: editedPost.content }}
                                        onInput={handleEditorChange}
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
                                            src={
                                                profileImageUrl ||
                                                'https://booktree-s3-bucket.s3.ap-northeast-2.amazonaws.com/default_profile.png'
                                            } // 기본 이미지 설정
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
                                        {/* 팝오버 미니창 수정 */}
                                        {showPopover && (
                                            <div className="absolute z-10 mt-2 min-w-[12rem] w-auto whitespace-nowrap bg-white rounded-lg shadow-lg border border-gray-200 left-0">
                                                <div className="p-4">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex items-center min-w-0">
                                                            <div className="w-10 h-10 flex-shrink-0 rounded-full bg-gray-300 mr-3 overflow-hidden">
                                                                <img
                                                                    src={
                                                                        profileImageUrl ||
                                                                        'https://booktree-s3-bucket.s3.ap-northeast-2.amazonaws.com/default_profile.png'
                                                                    } // 기본 이미지 설정
                                                                    alt="프로필"
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <button
                                                                    onClick={() => handleProfileClick(post.author)}
                                                                    className="font-medium hover:text-[#2E804E] transition-colors duration-200 truncate block"
                                                                >
                                                                    {post.username}
                                                                </button>
                                                            </div>
                                                            <button
                                                                onClick={() => handleBlogMainClick(post.username)}
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
                                                    {loginUser?.id !== userId && (
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
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex text-xs text-gray-500">
                                            <span className="mx-2">•</span>
                                            <span>작성일 {post.createdAt}</span>
                                            <span className="mx-2">•</span>
                                            <span>조회수 {post.viewCount}</span>
                                            <span className="mx-2">•</span>
                                            <span>좋아요 {post.likeCount}</span>
                                        </div>
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
                                        // HTML 컨텐츠를 직접 렌더링
                                        <div
                                            className="prose max-w-none"
                                            dangerouslySetInnerHTML={{
                                                __html: post.content,
                                            }}
                                        />
                                    )}
                                </div>

                                {/* 좋아요 버튼 */}
                                <div className="flex justify-center mb-8">
                                    <button
                                        onClick={togglePostLike}
                                        className={`flex items-center justify-center px-4 py-2 
                                            ${
                                                post.username === loginUser?.username
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-green-50 hover:bg-green-100 transition'
                                            } 
                                            rounded-md ${postLiked ? 'text-red-500' : 'text-green-600'}`}
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
                                        좋아요 {post.likeCount}
                                    </button>
                                </div>

                                {/* 구분선 추가 */}
                                <div className="border-b border-gray-200 mb-8"></div>
                            </div>
                        </div>
                    )}

                    {!isPostEditing && <CommentsSection postId={Number(postId)} />}
                </div>

                {/* 카테고리 사이드바 */}
                <div className="w-64 flex-shrink-0">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        {isPostEditing ? (
                            // 수정 모드일 때 보여줄 카테고리 선택 폼
                            <div className="space-y-6">
                                {/* Regular Category */}
                                <div>
                                    <h3 className="text-lg font-medium mb-4">카테고리 선택</h3>
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
                                            {editCategories.map((cat: TwoCategory) => (
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

                                {/* Main Category */}
                                <div>
                                    <h3 className="text-lg font-medium mb-4">메인 카테고리 선택</h3>
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
                                            {editMainCategories.map((cat: TwoMainCategory) => (
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
                                <ul className="space-y-2 ">
                                    {/* 메인카테고리 */}
                                    <h2 className="text-l font-bold mb-4">메인 카테고리</h2>
                                    <li className="text-gray-700 mb-10">
                                        <span className="inline-block py-1 px-4 rounded-full text-white text-sm font-semibold bg-[#2E804E] hover:bg-[#236b3e]">
                                            {post.mainCategory}
                                        </span>
                                    </li>
                                </ul>
                                <h2 className="text-l font-bold mb-4">
                                    {post.username} <br />
                                    카테고리 목록
                                </h2>
                                <div className="border-b border-gray-200 mb-4"></div>
                                <ul className="space-y-2">
                                    {categories.map((category) => (
                                        <li key={category.id}>
                                            <Link
                                                href={`/category/${category.id}`}
                                                className="flex justify-between items-center text-gray-700 hover:text-gray-900"
                                            >
                                                <span>{category.name}</span>
                                                <span className="text-gray-500">({category.postCount})</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
