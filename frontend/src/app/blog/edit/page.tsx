'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useGlobalLoginUser } from '@/stores/auth/loginMember'
import styles from './edit.module.css'

interface BlogInfo {
    name: string
    profile: string
    notice: string
    blogId: number
}

export default function EditBlogPage() {
    const router = useRouter()
    const { isLogin } = useGlobalLoginUser()
    const [name, setName] = useState('')
    const [profile, setProfile] = useState('')
    const [notice, setNotice] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [userBlogId, setUserBlogId] = useState<string | null>(null)
    const [blog, setBlog] = useState<BlogInfo | null>(null)

    useEffect(() => {
        const fetchBlogInfo = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/blogs/get/token`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                })

                if (!res.ok) {
                    throw new Error('블로그 정보를 가져오지 못했습니다.')
                }

                const data = await res.json()
                setBlog(data)
                setUserBlogId(data.blogId)
            } catch (error) {
                setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.')
            } finally {
                setIsLoading(false)
            }
        }

        if (!isLogin) {
            alert('로그인이 필요합니다.')
            router.push('/account/login')
        } else {
            fetchBlogInfo()
        }
    }, [isLogin, router])

    useEffect(() => {
        if (blog) {
            setName(blog.name)
            setProfile(blog.profile)
            setNotice(blog.notice)
        }
    }, [blog])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!name) {
            setErrorMessage('블로그 이름을 입력해주세요.')
            return
        }
        if (name.length > 20) {
            setErrorMessage('블로그 이름은 최대 20글자까지 가능합니다.')
            return
        }
        if (!profile) {
            setErrorMessage('프로필을 입력해주세요.')
            return
        }
        if (profile.length > 100) {
            setErrorMessage('프로필은 최대 100글자까지 가능합니다.')
            return
        }
        if (!notice) {
            setErrorMessage('공지사항을 입력해주세요.')
            return
        }
        if (notice.length > 100) {
            setErrorMessage('공지사항은 최대 100글자까지 가능합니다.')
            return
        }

        setErrorMessage('')

        const requestData = {
            name,
            profile,
            notice,
        }

        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/blogs/patch`, {
            method: 'PATCH', // PATCH 메서드 사용
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(requestData),
        })
            .then((response) => response.json())
            .then((data) => {
                alert('블로그 정보가 성공적으로 수정되었습니다!')
                router.push(`/blog/${userBlogId}`) // 수정된 블로그 페이지로 이동
            })
            .catch((error) => {
                console.error('블로그 수정 오류:', error)
                alert('블로그 수정 중 오류가 발생했습니다. 다시 시도해주세요.')
            })
    }

    if (isLoading) {
        return <div>로딩 중...</div>
    }

    if (error) {
        return <div className="text-red-500">{error}</div>
    }

    return (
        <div className={styles.container}>
            <div className={styles.mainContent}>
                <div className={styles.formContainer}>
                    <h1 className="text-2xl font-bold mb-6">블로그 수정</h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                블로그 이름 (최대 20글자)
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                maxLength={20} // 최대 20글자 제한
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="profile" className="block text-sm font-medium text-gray-700">
                                프로필 (최대 100글자)
                            </label>
                            <textarea
                                id="profile"
                                value={profile}
                                onChange={(e) => setProfile(e.target.value)}
                                maxLength={100} // 최대 100글자 제한
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                rows={3}
                            />
                        </div>

                        <div>
                            <label htmlFor="notice" className="block text-sm font-medium text-gray-700">
                                공지사항 (최대 100글자)
                            </label>
                            <textarea
                                id="notice"
                                value={notice}
                                onChange={(e) => setNotice(e.target.value)}
                                maxLength={100} // 최대 100글자 제한
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                rows={3}
                            />
                        </div>

                        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

                        <button
                            type="submit"
                            className="w-full bg-[#2E804E] text-white py-2 px-4 rounded-md hover:bg-[#247040] transition-colors"
                        >
                            수정 완료
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
