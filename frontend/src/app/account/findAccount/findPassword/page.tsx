'use client'

import { useState } from 'react'
import styles from './findPassword.module.css'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function FindPasswordPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [result, setResult] = useState<{ tempPassword: string; message: string } | null>(null)
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    const handleFindPassword = async () => {
        if (!email) {
            setErrorMessage('이메일을 입력해주세요.')
            setResult(null)
            setSuccessMessage('')
            return
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/users/find/pw/email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email, // 이메일 값
                }),
            })

            if (response.ok) {
                setSuccessMessage(
                    '이메일 함에 임시 비밀번호를 전송했습니다.(메일이 보이지 않는다면, 스팸 메일함을 확인해주세요.)',
                )
                setResult(null)
                setErrorMessage('')
            } else {
                const errorData = await response.json()
                setErrorMessage(errorData.message || '비밀번호 찾기에 실패했습니다.')
                setResult(null)
                setSuccessMessage('')
            }
        } catch (error) {
            console.error('비밀번호 찾기 요청 중 오류 발생:', error)
            setErrorMessage('서버와의 통신 중 문제가 발생했습니다.')
            setResult(null)
            setSuccessMessage('')
        }
    }

    const closeResult = () => {
        setResult(null) // 결과 모달 닫기
    }

    const closeError = () => {
        setErrorMessage('') // 에러 메시지 모달 닫기
    }

    // **성공 메시지 모달을 닫으면서 로그인 페이지로 이동하는 함수**
    const handleSuccessModalClose = () => {
        setSuccessMessage('') // 성공 메시지 모달 닫기
        router.push('/account/login') // 로그인 페이지로 이동
    }

    return (
        <div className={styles.container}>
            <div className={styles.mainWrapper}>
                <div className={styles.formContainer}>
                    <h1 className={styles.title}>비밀번호 찾기</h1>
                    <p className={styles.notice}>
                        카카오, 깃허브 사용자는 <br />
                        비밀번호 찾기를 이용할 수 없습니다.
                    </p>
                    <div className={styles.form}>
                        {/* 이메일 입력 */}
                        <div className={styles.inputGroup}>
                            <label htmlFor="email" className={styles.label}>
                                이메일
                            </label>
                            <input
                                id="email"
                                type="email"
                                className={styles.input}
                                placeholder="가입시 등록한 이메일을 입력하세요"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className={styles.form}>
                        {/* 비밀번호 찾기 버튼 */}
                        <button className={styles.submitButton} onClick={handleFindPassword}>
                            비밀번호 찾기
                        </button>
                    </div>
                </div>
            </div>

            {/* **성공 메시지 모달 (새로 추가)** */}
            {successMessage && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <p>{successMessage}</p>
                        {/* 임시 비밀번호는 여기서는 표시하지 않습니다. */}
                        <button className={styles.closeButton} onClick={handleSuccessModalClose}>
                            닫기
                        </button>
                    </div>
                </div>
            )}

            {/* 결과 모달 */}
            {result && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <p>{result.message}</p>
                        <p>임시 비밀번호: {result.tempPassword}</p>
                        <button className={styles.closeButton} onClick={closeResult}>
                            닫기
                        </button>
                    </div>
                </div>
            )}

            {/* 에러 메시지 모달 */}
            {errorMessage && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <p>{errorMessage}</p>
                        <button className={styles.closeButton} onClick={closeError}>
                            닫기
                        </button>
                    </div>
                </div>
            )}

            <div className={styles.loginLink}>
                <span>비밀번호를 찾으셨나요?</span>
                <Link href="/account/login" className={styles.loginLinkText}>
                    로그인하기
                </Link>
            </div>
            <footer className={styles.footer}>
                <div className={styles.footerDivider}></div>
                <div className={styles.footerLine}></div>
                <div className={styles.footerContent}></div>
                <div className={styles.footerText}>
                    <span>© 2025 All rights reserved.</span>
                </div>
            </footer>
        </div>
    )
}
