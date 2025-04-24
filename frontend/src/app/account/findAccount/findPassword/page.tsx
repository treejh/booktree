'use client'

import { useState } from 'react'
import styles from './findPassword.module.css'
import Link from 'next/link'

export default function FindPasswordPage() {
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [result, setResult] = useState<{ tempPassword: string; message: string } | null>(null)
    const [errorMessage, setErrorMessage] = useState('')

    const handleFindPassword = async () => {
        if (!email || !phone) {
            setErrorMessage('이메일과 전화번호를 모두 입력해주세요.')
            return
        }

        try {
            const response = await fetch('/api/v1/users/find/pw/emailAndPhone', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, phoneNumber: phone }),
            })

            if (response.ok) {
                const data = await response.json()
                setResult({ tempPassword: data.data, message: data.message })
                setErrorMessage('') // 에러 메시지 초기화
            } else {
                const errorData = await response.json()
                setErrorMessage(errorData.message || '비밀번호 찾기에 실패했습니다.')
                setResult(null)
            }
        } catch (error) {
            console.error('비밀번호 찾기 요청 중 오류 발생:', error)
            setErrorMessage('서버와의 통신 중 문제가 발생했습니다.')
            setResult(null)
        }
    }

    const closeResult = () => {
        setResult(null) // 결과 모달 닫기
    }

    const closeError = () => {
        setErrorMessage('') // 에러 메시지 모달 닫기
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

                        {/* 전화번호 입력 */}
                        <div className={styles.inputGroup}>
                            <label htmlFor="phone" className={styles.label}>
                                전화번호
                            </label>
                            <input
                                id="phone"
                                type="tel"
                                className={styles.input}
                                placeholder="가입시 등록한 전화번호를 입력하세요"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>

                        {/* 비밀번호 찾기 버튼 */}
                        <button className={styles.submitButton} onClick={handleFindPassword}>
                            비밀번호 찾기
                        </button>
                    </div>
                </div>
            </div>

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
