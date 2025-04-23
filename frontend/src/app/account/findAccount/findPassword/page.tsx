'use client'

import { useState } from 'react'
import styles from './findPassword.module.css'
import Link from 'next/link'

export default function FindPasswordPage() {
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [result, setResult] = useState<{ tempPassword: string; message: string } | null>(null)
    const [errorMessage, setErrorMessage] = useState('')

    const validatePhoneNumber = (phoneNumber: string) => {
        const phoneRegex = /^\d{3}-\d{4}-\d{4}$/
        return phoneRegex.test(phoneNumber)
    }

    const handleFindByEmail = async () => {
        if (!email) {
            setErrorMessage('이메일을 입력해주세요.')
            return
        }

        try {
            const response = await fetch(`http://localhost:8090/api/v1/users/find/pw/email?email=${email}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
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

    const handleFindByPhone = async () => {
        if (!validatePhoneNumber(phone)) {
            setErrorMessage('전화번호 형식이 올바르지 않습니다. 000-0000-0000 형식으로 입력해주세요.')
            return
        }

        try {
            const response = await fetch('http://localhost:8090/api/v1/users/find/pw/phone', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phoneNumber: phone }),
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

    return (
        <div className={styles.container}>
            <div className={styles.mainWrapper}>
                <div className={styles.formContainer}>
                    <h1 className={styles.title}>비밀번호 찾기</h1>
                    <div className={styles.form}>
                        {/* 이메일로 찾기 */}
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
                            <button className={styles.submitButton} onClick={handleFindByEmail}>
                                이메일로 찾기
                            </button>
                        </div>

                        {/* 핸드폰 번호로 찾기 */}
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
                            <button className={styles.submitButton} onClick={handleFindByPhone}>
                                핸드폰 번호로 찾기
                            </button>
                        </div>
                    </div>

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

                    {errorMessage && (
                        <div className={styles.modal}>
                            <div className={styles.modalContent}>
                                <p>{errorMessage}</p>
                                <button className={styles.closeButton} onClick={() => setErrorMessage('')}>
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
                </div>
            </div>
            <footer className={styles.footer}>
                <div className={styles.footerDivider}></div>
                <div className={styles.footerLine}></div>
                <div className={styles.footerContent}></div>
                <div className={styles.footerText}>
                    <span className={styles.copyright}>© 2025 All rights reserved.</span>
                </div>
            </footer>
        </div>
    )
}
