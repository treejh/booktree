'use client'

import { useState } from 'react'
import styles from './signup.module.css'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
    const router = useRouter()
    const [username, setUsername] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [emailLocalPart, setEmailLocalPart] = useState('')
    const [emailDomain, setEmailDomain] = useState('')
    const [customEmailDomain, setCustomEmailDomain] = useState('')

    const socialLoginForKakaoUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/oauth2/authorization/kakao`
    const socialLoginForGithubUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/oauth2/authorization/github`
    const redirectUrlAfterSocialLogin = `${process.env.NEXT_PUBLIC_FRONT_BASE_URL}`

    const validatePhoneNumber = (phoneNumber: string) => {
        const regex = /^\d{3}-\d{4}-\d{4}$/
        return regex.test(phoneNumber)
    }

    const validatePassword = (password: string) => {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/ // 영문자, 숫자, 특수문자 포함 8~20자리
        return passwordRegex.test(password)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // 이메일 생성 로직 수정
        const fullEmail =
            emailDomain === 'custom' ? `${emailLocalPart}@${customEmailDomain}` : `${emailLocalPart}@${emailDomain}`

        // 비어 있는 필드 확인
        if (!emailLocalPart || (!emailDomain && !customEmailDomain)) {
            setErrorMessage('이메일을 올바르게 입력해주세요.')
            return
        }

        if (emailDomain === 'custom' && !customEmailDomain) {
            setErrorMessage('도메인을 입력하세요.')
            return
        }

        if (username.length > 20) {
            setErrorMessage('닉네임은 최대 20글자까지 가능합니다.')
            return
        }
        if (!phoneNumber) {
            setErrorMessage('전화번호 칸이 비었습니다. 입력해주세요.')
            return
        }
        if (!validatePhoneNumber(phoneNumber)) {
            setErrorMessage('전화번호는 000-0000-0000 형식이어야 합니다.')
            return
        }
        if (!password) {
            setErrorMessage('비밀번호 칸이 비었습니다. 입력해주세요.')
            return
        }
        if (!validatePassword(password)) {
            setErrorMessage('비밀번호는 영문자, 숫자, 특수문자를 포함한 8~20자리여야 합니다.')
            return
        }
        if (!confirmPassword) {
            setErrorMessage('비밀번호 확인 칸이 비었습니다. 입력해주세요.')
            return
        }
        if (password !== confirmPassword) {
            setErrorMessage('비밀번호와 비밀번호 확인이 일치하지 않습니다.')
            return
        }

        setErrorMessage('') // 에러 메시지 초기화

        // requestDto 객체 생성
        const requestData = {
            roleId: 1, // 예시로 roleId가 1이라고 가정
            email: fullEmail, // 생성된 이메일
            password: password, // 비밀번호
            phoneNumber: phoneNumber, // 전화번호
        }

        // 백엔드로 requestDto 전송
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/users/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((errorData) => {
                        throw new Error(errorData.message) // 백엔드에서 반환된 오류 메시지
                    })
                }
                return response.json()
            })
            .then((data) => {
                alert('회원가입이 성공적으로 완료되었습니다!')

                // 로그인 페이지로 이동
                router.push('/account/login') // 로그인 페이지로 이동
            })
            .catch((error) => {
                if (error.message === '이미 존재하는 전화번호입니다.') {
                    alert('중복된 전화번호입니다.') // 알림 표시
                } else {
                    alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.')
                }
            })
    }

    return (
        <div className={styles.container}>
            <div className={styles.mainContent}>
                <div className={styles.formContainer}>
                    <h1 className="text-2xl font-bold text-center mb-8">회원가입</h1>

                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                    닉네임
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    maxLength={20} // 최대 20글자 제한
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                    placeholder="닉네임을 입력하세요 (최대 20글자)"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    이메일
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        id="emailLocalPart"
                                        name="emailLocalPart"
                                        value={emailLocalPart}
                                        onChange={(e) => setEmailLocalPart(e.target.value)}
                                        className="mt-1 block w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                        placeholder="이메일 입력"
                                    />
                                    <span className="mt-2">@</span>
                                    <select
                                        id="emailDomain"
                                        name="emailDomain"
                                        value={emailDomain}
                                        onChange={(e) => {
                                            setEmailDomain(e.target.value)
                                            setCustomEmailDomain('') // 도메인 선택 시 직접 입력 초기화
                                        }}
                                        className="mt-1 block w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                    >
                                        <option value="">도메인 선택</option>
                                        <option value="gmail.com">gmail.com</option>
                                        <option value="naver.com">naver.com</option>
                                        <option value="daum.net">daum.net</option>
                                        <option value="custom">직접 입력</option>
                                    </select>
                                </div>
                                {emailDomain === 'custom' && (
                                    <input
                                        type="text"
                                        id="customEmailDomain"
                                        name="customEmailDomain"
                                        value={customEmailDomain}
                                        onChange={(e) => setCustomEmailDomain(e.target.value)}
                                        className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                        placeholder="도메인을 입력하세요 (예: example.com)"
                                    />
                                )}
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                    전화번호
                                </label>
                                <input
                                    type="text"
                                    id="phone"
                                    name="phone"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                    placeholder="000-0000-0000"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    비밀번호
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                    placeholder="영문자, 숫자, 특수문자를 포함한 8~20자리"
                                />
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                    비밀번호 확인
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                    placeholder="비밀번호를 다시 입력하세요"
                                />
                            </div>

                            {errorMessage && <p className="mt-2 text-sm text-red-600">{errorMessage}</p>}

                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2E804E] hover:bg-[#256d41] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2E804E]"
                            >
                                회원가입
                            </button>

                            <Link
                                href={`${socialLoginForKakaoUrl}?redirectUrl=${redirectUrlAfterSocialLogin}`}
                                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-[#FFE812] hover:bg-[#FFE200] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                            >
                                <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2 fill-current">
                                    <path d="M12 3C6.5 3 2 6.5 2 11c0 2.5 1.2 4.7 3 6.2l-1 3.8 4-2.4c1.3.4 2.6.6 4 .6 5.5 0 10-3.5 10-8s-4.5-8-10-8z" />
                                </svg>
                                카카오로 시작하기
                            </Link>
                            <Link
                                href={`${socialLoginForGithubUrl}?redirectUrl=${redirectUrlAfterSocialLogin}`}
                                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#24292F] hover:bg-[#1C2024] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                                <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2 fill-current">
                                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                                </svg>
                                GitHub으로 시작하기
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
