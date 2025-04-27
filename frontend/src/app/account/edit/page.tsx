'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useGlobalLoginUser } from '@/stores/auth/loginMember'
import styles from './edit.module.css'

export default function EditProfilePage() {
    const router = useRouter()
    const { isLogin, loginUser } = useGlobalLoginUser()

    const [password, setPassword] = useState('')
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const socialLoginForKakaoUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/oauth2/authorization/kakao`
    const socialLoginForGithubUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/oauth2/authorization/github`
    const redirectUrlAfterSocialLogin = `${process.env.NEXT_PUBLIC_FRONT_BASE_URL}`
    const [provider, setProvider] = useState<string | null>(null)

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

    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [selectedImage, setSelectedImage] = useState<File | null>(null)

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

            setProvider(loginUser.provider || null)
        }
    }, [isLogin, loginUser, router])

    const handlePasswordAuth = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/users/validation/password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ password }),
            })

            if (!response.ok) {
                throw new Error('비밀번호 인증에 실패했습니다.')
            }

            alert('비밀번호 인증에 성공했습니다.')
            setIsAuthenticated(true)
            router.push('/account/edit') // 인증 성공 시 이동
        } catch (error) {
            console.error(error)
            alert('비밀번호가 일치하지 않습니다.')
        }
    }

    const handleSocialAuth = async (provider: 'kakao' | 'github') => {
        try {
            const authUrl =
                provider === 'kakao'
                    ? `${socialLoginForKakaoUrl}?redirectUrl=${redirectUrlAfterSocialLogin}`
                    : `${socialLoginForGithubUrl}?redirectUrl=${redirectUrlAfterSocialLogin}`

            // 소셜 인증 성공 시 처리
            router.replace(authUrl)

            // 인증 성공 후 처리 (예: 리다이렉트 후 콜백에서 처리)
            setIsAuthenticated(true)
            console.log(isAuthenticated)
            router.push('/account/edit') // 인증 성공 시 이동
        } catch (error) {
            console.error(error)
            alert(`${provider} 인증 중 오류가 발생했습니다. 다시 시도해주세요.`)
        }
    }

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
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/users/patch/email?email=${email}`,
                    {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                    },
                )

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
            const phoneRegex = /^\d{3}-\d{4}-\d{4}$/

            if (!phoneRegex.test(formData.phone)) {
                alert('핸드폰 번호는 000-0000-0000 형식이어야 합니다.')
                return
            }

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/users/patch/phoneNumber`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        phoneNumber: formData.phone,
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

        if (field === 'username') {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/users/patch/username?username=${formData.username}`,
                    {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                    },
                )

                if (!response.ok) {
                    throw new Error('닉네임 변경에 실패했습니다.')
                }

                alert('닉네임이 성공적으로 변경되었습니다!')
            } catch (error) {
                console.error(error)
                alert('닉네임 변경 중 오류가 발생했습니다. 다시 시도해주세요.')
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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedImage(file)
            setImagePreview(URL.createObjectURL(file)) // 이미지 미리보기 설정
        }
    }

    const handleImageUpload = async () => {
        if (!selectedImage) {
            alert('이미지를 선택해주세요.')
            return
        }

        const formData = new FormData()
        formData.append('images', selectedImage)

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/users/patch/image`, {
                method: 'PATCH',
                credentials: 'include',
                body: formData,
            })

            if (!response.ok) {
                throw new Error('이미지 업로드에 실패했습니다.')
            }

            alert('이미지가 성공적으로 업로드되었습니다!')
            setSelectedImage(null)
            setImagePreview(null)

            // 새로고침하여 변경된 이미지 적용
            window.location.reload()
        } catch (error) {
            console.error(error)
            alert('이미지 업로드 중 오류가 발생했습니다. 다시 시도해주세요.')
        }
    }

    if (!isAuthenticated) {
        return (
            <div className={styles.container}>
                <div className={styles.authWrapper}>
                    <h1 className={styles.title}>회원정보 수정 인증</h1>

                    {/* 비밀번호 인증 섹션 */}
                    {!provider && (
                        <div className={styles.section}>
                            <h2 className={styles.subtitle}>비밀번호 인증</h2>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="비밀번호를 입력하세요"
                                className={`${styles.input} w-full`}
                            />
                            <button
                                type="button"
                                onClick={handlePasswordAuth}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2E804E] hover:bg-[#256d41] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2E804E]"
                            >
                                비밀번호 인증
                            </button>
                        </div>
                    )}

                    {/* 소셜 인증 섹션 */}
                    {provider && (
                        <div className={styles.section}>
                            <div className="flex flex-col space-y-8">
                                <h2 className={styles.subtitle}>소셜 인증</h2>
                                {provider === 'KAKAO' && (
                                    <button
                                        type="button"
                                        className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-[#FFE812] hover:bg-[#FFE200] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                                        onClick={() => handleSocialAuth('kakao')}
                                    >
                                        <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2 fill-current">
                                            <path d="M12 3C6.5 3 2 6.5 2 11c0 2.5 1.2 4.7 3 6.2l-1 3.8 4-2.4c1.3.4 2.6.6 4 .6 5.5 0 10-3.5 10-8s-4.5-8-10-8z" />
                                        </svg>
                                        카카오로 인증
                                    </button>
                                )}
                                {provider === 'GITHUB' && (
                                    <button
                                        type="button"
                                        className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#24292F] hover:bg-[#1C2024] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                        onClick={() => handleSocialAuth('github')}
                                    >
                                        <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2 fill-current">
                                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                                        </svg>
                                        GitHub으로 인증
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.mainWrapper}>
                <div className={styles.formContainer}>
                    <h1 className={styles.title}>회원정보 수정</h1>

                    {/* 이미지 업로드 섹션 */}
                    <div className={styles.inputGroup} style={{ marginBottom: '1.5rem' }}>
                        <div className="flex flex-col items-center">
                            <label htmlFor="profileImage" className={styles.label} style={{ marginBottom: '0.5rem' }}>
                                프로필 이미지
                            </label>
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="미리보기"
                                    className="w-32 h-32 rounded-full object-cover mb-4"
                                />
                            ) : (
                                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                                    {loginUser.image ? (
                                        <img
                                            src={loginUser.image}
                                            alt="프로필 이미지"
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                    ) : (
                                        <span className="text-gray-500 text-sm">이미지 없음</span>
                                    )}
                                </div>
                            )}
                            <div className="flex items-center">
                                <label
                                    htmlFor="profileImage"
                                    className="px-2 py-1 bg-white border border-gray-300 rounded-md text-sm cursor-pointer hover:bg-gray-100 transition"
                                >
                                    파일 선택
                                </label>
                                <input
                                    type="file"
                                    id="profileImage"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden" /* 기본 파일 입력 숨기기 */
                                />
                                <span className="ml-2 text-gray-500 text-sm">
                                    {selectedImage ? selectedImage.name : '선택된 파일 없음'}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={handleImageUpload}
                                className="mt-4 px-4 py-2 bg-[#2E804E] text-white rounded-md hover:bg-[#256d41] transition"
                            >
                                이미지 업로드
                            </button>
                        </div>
                    </div>

                    <div className={styles.inputGroup} style={{ marginBottom: '1.5rem' }}>
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

                    <div className={styles.inputGroup} style={{ marginBottom: '1.5rem' }}>
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
                    <div className={styles.inputGroup} style={{ marginBottom: '1.5rem' }}>
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
                        <button
                            type="button"
                            onClick={() => router.push(`/mypage/${loginUser.id}`)}
                            className={styles.cancelButton}
                        >
                            취소
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
