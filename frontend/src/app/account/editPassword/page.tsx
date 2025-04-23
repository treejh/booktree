'use client'
import { useState } from 'react'
import styles from './editPassword.module.css'
import { useRouter } from 'next/navigation'

export default function EditPassword() {
    const router = useRouter()
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswords({
            ...passwords,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        // 비밀번호 변경 API 호출 로직 추가
        // 성공시 edit 페이지로 리다이렉트
        router.push('/account/edit')
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
                        <span className={styles.copyright}>© 2024 BookTree. All rights reserved.</span>
                    </div>
                </div>
            </footer>
        </div>
    )
}
