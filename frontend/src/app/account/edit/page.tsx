'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useGlobalLoginUser } from '@/stores/auth/loginMember'
import styles from './edit.module.css'

export default function EditProfilePage() {
    const router = useRouter()
    const { isLogin, loginUser } = useGlobalLoginUser()
    const [phoneNumber, setPhoneNumber] = useState('')
    const [emailLocalPart, setEmailLocalPart] = useState('')
    const [emailDomain, setEmailDomain] = useState('')
    const [customEmailDomain, setCustomEmailDomain] = useState('')

    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        username: '',
    })

    const [editState, setEditState] = useState({
        email: false,
        phone: false,
        username: false,
    })

    useEffect(() => {
        if (!isLogin) {
            alert('로그인이 필요합니다.')
            router.push('/account/login')
        } else {
            const [localPart, domain] = (loginUser.email || '').split('@')
            setEmailLocalPart(localPart || '')
            setEmailDomain(domain || '')
            setFormData({
                email: loginUser.email || '',
                phone: loginUser.phoneNumber || '',
                username: loginUser.username || '',
            })
        }
    }, [isLogin, loginUser, router])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleFieldChange = async (field: string) => {
        if (field === 'email') {
            const domain = emailDomain === 'custom' ? customEmailDomain : emailDomain
            const email = `${emailLocalPart}@${domain}`
            setFormData((prev) => ({ ...prev, email }))

            try {
                const response = await fetch(`http://localhost:8090/api/v1/users/patch/email?email=${email}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                })

                if (!response.ok) {
                    throw new Error('이메일 변경에 실패했습니다.')
                }

                alert('이메일이 성공적으로 변경되었습니다!')
            } catch (error) {
                console.error(error)
                alert('이메일 변경 중 오류가 발생했습니다. 다시 시도해주세요.')
            }
        }

        if (field === 'phone') {
            const phoneRegex = /^\d{3}-\d{4}-\d{4}$/ // 핸드폰 번호 형식 검증
            if (!phoneRegex.test(formData.phone)) {
                alert('핸드폰 번호는 000-0000-0000 형식이어야 합니다.')
                return
            }

            try {
                const response = await fetch(`http://localhost:8090/api/v1/users/patch/phoneNumber`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        phoneNumber: formData.phone, // 요청 본문에 phoneNumber 포함
                    }),
                })

                if (!response.ok) {
                    throw new Error('핸드폰 번호 변경에 실패했습니다.')
                }

                alert('핸드폰 번호가 성공적으로 변경되었습니다!')
            } catch (error) {
                console.error(error)
                alert('핸드폰 번호 변경 중 오류가 발생했습니다. 다시 시도해주세요.')
            }
        }

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
                    <div className={styles.inputGroup}>
                        <label htmlFor="email" className={styles.label}>
                            이메일
                        </label>
                        <div className="flex gap-2 items-center w-full">
                            {editState.email ? (
                                <div className="flex gap-2 w-full">
                                    <input
                                        type="text"
                                        id="emailLocalPart"
                                        value={emailLocalPart}
                                        onChange={(e) => setEmailLocalPart(e.target.value)}
                                        className="w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                        placeholder="이메일 입력"
                                    />
                                    <span className="mt-2">@</span>
                                    <select
                                        id="emailDomain"
                                        value={emailDomain}
                                        onChange={(e) => {
                                            setEmailDomain(e.target.value)
                                            setCustomEmailDomain('')
                                        }}
                                        className="w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                    >
                                        <option value="">도메인 선택</option>
                                        <option value="gmail.com">gmail.com</option>
                                        <option value="naver.com">naver.com</option>
                                        <option value="daum.net">daum.net</option>
                                        <option value="custom">직접 입력</option>
                                    </select>
                                </div>
                            ) : (
                                <div className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                                    {formData.email}
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={() => (editState.email ? handleFieldChange('email') : startEdit('email'))}
                                className="w-20 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
                            >
                                {editState.email ? '적용' : '변경'}
                            </button>
                        </div>

                        {editState.email && emailDomain === 'custom' && (
                            <input
                                type="text"
                                id="customEmailDomain"
                                name="customEmailDomain"
                                value={customEmailDomain}
                                onChange={(e) => setCustomEmailDomain(e.target.value)}
                                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                placeholder="도메인을 입력하세요 (예: example.com)"
                            />
                        )}
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="phone" className={styles.label}>
                            핸드폰 번호
                        </label>
                        <div className="flex gap-2 items-center w-full">
                            {editState.phone ? (
                                <input
                                    type="text"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                                    placeholder="000-0000-0000"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                />
                            ) : (
                                <div className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                                    {formData.phone}
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={() => (editState.phone ? handleFieldChange('phone') : startEdit('phone'))}
                                className="w-20 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
                            >
                                {editState.phone ? '적용' : '변경'}
                            </button>
                        </div>
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="username" className={styles.label}>
                            닉네임
                        </label>
                        <div className="flex gap-2 items-center w-full">
                            {editState.username ? (
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="닉네임을 입력하세요"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                />
                            ) : (
                                <div className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                                    {formData.username}
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={() =>
                                    editState.username ? handleFieldChange('username') : startEdit('username')
                                }
                                className="w-20 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
                            >
                                {editState.username ? '적용' : '변경'}
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
                        <button type="button" onClick={() => router.push('/mypage')} className={styles.cancelButton}>
                            취소
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
