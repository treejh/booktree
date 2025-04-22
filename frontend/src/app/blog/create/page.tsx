'use client'

import { useState } from 'react'
import styles from './create.module.css'
import { useRouter } from 'next/navigation'

export default function CreateBlogPage() {
    const router = useRouter()
    const [name, setName] = useState('')
    const [profile, setProfile] = useState('')
    const [notice, setNotice] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // 입력값 검증
        if (!name) {
            setErrorMessage('이름을 입력해주세요.')
            return
        }
        if (!profile) {
            setErrorMessage('프로필을 입력해주세요.')
            return
        }
        if (!notice) {
            setErrorMessage('공지사항을 입력해주세요.')
            return
        }

        setErrorMessage('') // 에러 메시지 초기화

        // 입력값 처리 로직
        const requestData = {
            name,
            profile,
            notice,
        }

        // 백엔드로 데이터 전송 (예시)
        fetch('http://localhost:8090/api/v1/blog/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('블로그 생성 성공:', data)

                // 성공 알림
                alert('블로그가 성공적으로 생성되었습니다!')

                // 블로그 메인 페이지로 이동
                router.push('/blog')
            })
            .catch((error) => {
                console.error('블로그 생성 오류:', error)
                alert('블로그 생성 중 오류가 발생했습니다. 다시 시도해주세요.')
            })
    }

    return (
        <div className={styles.container}>
            <div className={styles.mainContent}>
                <div className={styles.formContainer}>
                    <h1 className="text-2xl font-bold text-center mb-8">블로그 생성</h1>

                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    블로그 이름
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                    placeholder="블로그 이름을 입력하세요"
                                />
                            </div>

                            <div>
                                <label htmlFor="profile" className="block text-sm font-medium text-gray-700">
                                    프로필
                                </label>
                                <textarea
                                    id="profile"
                                    name="profile"
                                    value={profile}
                                    onChange={(e) => setProfile(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                    placeholder="프로필을 입력하세요"
                                    rows={3}
                                />
                            </div>

                            <div>
                                <label htmlFor="notice" className="block text-sm font-medium text-gray-700">
                                    공지사항
                                </label>
                                <textarea
                                    id="notice"
                                    name="notice"
                                    value={notice}
                                    onChange={(e) => setNotice(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                    placeholder="공지사항을 입력하세요"
                                    rows={3}
                                />
                            </div>

                            {errorMessage && <p className="mt-2 text-sm text-red-600">{errorMessage}</p>}

                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2E804E] hover:bg-[#256d41] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2E804E]"
                            >
                                블로그 생성
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
