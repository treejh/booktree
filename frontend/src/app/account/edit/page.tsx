'use client'

import { useState } from 'react'
import styles from './edit.module.css'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function EditProfilePage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        email: 'user@example.com', // 기존 이메일
        phone: '010-1234-5678', // 기존 전화번호
        nickname: '사용자', // 기존 닉네임
        password: '',
        newPassword: '',
        confirmPassword: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // TODO: 프로필 수정 로직 구현
        console.log('프로필 수정:', formData)
    }

    const handleWithdraw = () => {
        router.push('/account/withdraw')
    }

    return (
        <div className={styles.container}>
            <div className={styles.mainWrapper}>
                <div className={styles.formContainer}>
                    <h1 className={styles.title}>회원정보 수정</h1>

                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="email" className={styles.label}>
                                이메일
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder="이메일을 입력하세요"
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="phone" className={styles.label}>
                                핸드폰 번호
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder="핸드폰 번호를 입력하세요"
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="nickname" className={styles.label}>
                                닉네임
                            </label>
                            <input
                                type="text"
                                id="nickname"
                                name="nickname"
                                value={formData.nickname}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder="닉네임을 입력하세요"
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="password" className={styles.label}>
                                현재 비밀번호
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder="현재 비밀번호를 입력하세요"
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="newPassword" className={styles.label}>
                                새 비밀번호
                            </label>
                            <input
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder="새 비밀번호를 입력하세요"
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="confirmPassword" className={styles.label}>
                                새 비밀번호 확인
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder="새 비밀번호를 다시 입력하세요"
                            />
                        </div>

                        <div className={styles.buttonContainer}>
                            <button type="submit" className={styles.submitButton}>
                                변경사항 저장
                            </button>
                            <button type="button" onClick={handleWithdraw} className={styles.withdrawButton}>
                                회원 탈퇴
                            </button>
                        </div>
                    </form>
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
