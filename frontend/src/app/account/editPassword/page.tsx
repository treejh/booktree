'use client'
import { useState, useEffect } from 'react'
import styles from './editPassword.module.css'
import { useRouter } from 'next/navigation'
import { useGlobalLoginUser } from '@/stores/auth/loginMember'

export default function EditPassword() {
    const router = useRouter()
    const { isLogin, loginUser } = useGlobalLoginUser()
    const [errorMessage, setErrorMessage] = useState('') // 에러 메시지 상태 추가
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    })

    useEffect(() => {
        if (!isLogin) {
            alert('로그인이 필요합니다.')
            router.push('/account/login')
        }
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswords({
            ...passwords,
            [e.target.name]: e.target.value,
        })
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // 새 비밀번호와 확인 비밀번호가 다를 경우 에러 메시지 표시
        if (passwords.newPassword !== passwords.confirmPassword) {
            setErrorMessage('비밀번호 확인이 다릅니다')
            return
        }

        // 비밀번호 변경 API 호출
        try {
            const response = await fetch('/api/v1/users/patch/pw', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    changePassword: passwords.newPassword,
                    beforePassword: passwords.currentPassword,
                }),
            })

            if (response.ok) {
                alert('비밀번호가 성공적으로 변경되었습니다.')
                router.push('/account/edit') // 성공 시 edit 페이지로 리다이렉트
            } else {
                const errorData = await response.json()
                setErrorMessage(errorData.message || '비밀번호 변경에 실패했습니다.')
            }
        } catch (error) {
            console.error('비밀번호 변경 요청 중 오류 발생:', error)
            setErrorMessage('서버와의 통신 중 문제가 발생했습니다.')
        }
    }
    return (
        <div className={styles.container}>
            <div className={styles.mainWrapper}>
                <div className={styles.formContainer}>
                    <h1 className={styles.title}>비밀번호 변경</h1>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>현재 비밀번호</label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={passwords.currentPassword}
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>새 비밀번호</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={passwords.newPassword}
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>새 비밀번호 확인</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={passwords.confirmPassword}
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.buttonContainer}>
                            <button type="submit" className={styles.submitButton}>
                                저장
                            </button>
                            <button
                                type="button"
                                onClick={() => router.push('/account/edit')}
                                className={styles.cancelButton}
                            >
                                취소
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <footer className={styles.footer}>
                <div className={styles.footerDivider}></div>
                <div className={styles.footerLine}></div>
                <div className={styles.footerContent}>
                    <div className={styles.footerText}>
                        <span className={styles.copyright}>© 2025 BookTree. All rights reserved.</span>
                    </div>
                </div>
            </footer>
        </div>
    )
}
