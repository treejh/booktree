'use client'

import { useState } from 'react'
import styles from './edit.module.css'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function EditProfilePage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        email: 'test5@example.com',
        phone: '010-5555-5678',
        nickname: 'bookTree_5150289c',
    })

    const [editState, setEditState] = useState({
        email: false,
        phone: false,
        nickname: false,
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleFieldChange = (field: string) => {
        setEditState((prev) => ({
            ...prev,
            [field]: false,
        }))
    }

    const startEdit = (field: string) => {
        setEditState((prev) => ({
            ...prev,
            [field]: true,
        }))
    }

    return (
        <div className={styles.container}>
            <div className={styles.mainWrapper}>
                <div className={styles.formContainer}>
                    <h1 className={styles.title}>회원정보 수정</h1>

                    <form className={styles.form}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="email" className={styles.label}>
                                이메일
                            </label>
                            <div className={styles.inputWrapper}>
                                <div className={styles.inputContainer}>
                                    {editState.email ? (
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={styles.input}
                                            placeholder="이메일을 입력하세요"
                                        />
                                    ) : (
                                        <div className={styles.value}>{formData.email}</div>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => (editState.email ? handleFieldChange('email') : startEdit('email'))}
                                    className={styles.changeButton}
                                >
                                    {editState.email ? '적용' : '변경'}
                                </button>
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="phone" className={styles.label}>
                                핸드폰 번호
                            </label>
                            <div className={styles.inputWrapper}>
                                <div className={styles.inputContainer}>
                                    {editState.phone ? (
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className={styles.input}
                                            placeholder="핸드폰 번호를 입력하세요"
                                        />
                                    ) : (
                                        <div className={styles.value}>{formData.phone}</div>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => (editState.phone ? handleFieldChange('phone') : startEdit('phone'))}
                                    className={styles.changeButton}
                                >
                                    {editState.phone ? '적용' : '변경'}
                                </button>
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="nickname" className={styles.label}>
                                닉네임
                            </label>
                            <div className={styles.inputWrapper}>
                                <div className={styles.inputContainer}>
                                    {editState.nickname ? (
                                        <input
                                            type="text"
                                            id="nickname"
                                            name="nickname"
                                            value={formData.nickname}
                                            onChange={handleChange}
                                            className={styles.input}
                                            placeholder="닉네임을 입력하세요"
                                        />
                                    ) : (
                                        <div className={styles.value}>{formData.nickname}</div>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() =>
                                        editState.nickname ? handleFieldChange('nickname') : startEdit('nickname')
                                    }
                                    className={styles.changeButton}
                                >
                                    {editState.nickname ? '적용' : '변경'}
                                </button>
                            </div>
                        </div>

                        <div className={styles.buttonContainer}>
                            <button
                                type="button"
                                onClick={() => router.push('/account/editPassword')}
                                className={styles.editPasswordButton}
                            >
                                비밀번호 변경
                            </button>
                            <button
                                type="button"
                                onClick={() => router.push('/mypage')}
                                className={styles.cancelButton}
                            >
                                취소
                            </button>
                            <button
                                type="button"
                                onClick={() => router.push('/account/withdraw')}
                                className={styles.withdrawButton}
                            >
                                회원 탈퇴
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
