'use client'

import { useState, useEffect } from 'react'
import styles from './withdraw.module.css'
import Link from 'next/link'
import { useRouter } from 'next/navigation' // useRouter import 추가
import { useGlobalLoginUser } from '@/stores/auth/loginMember'

export default function WithdrawalPage() {
    const router = useRouter() // router 정의
    const [isAgreed, setIsAgreed] = useState(false)
    const { isLogin, loginUser } = useGlobalLoginUser()

    const [password, setPassword] = useState('')
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const socialLoginForKakaoUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/oauth2/authorization/kakao`
    const socialLoginForGithubUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/oauth2/authorization/github`
    const redirectUrlAfterSocialLogin = `${process.env.NEXT_PUBLIC_FRONT_BASE_URL}/account/withdraw`
    const [provider, setProvider] = useState<string | null>(null)
    const [showAlert, setShowAlert] = useState(false) // 알림 모달 상태

    useEffect(() => {
        // 로그인 여부 확인
        if (!isLogin) {
            alert('로그인이 필요합니다.')
            router.push('/account/login')
            return
        }
        setProvider(loginUser.provider) // 로그인한 사용자의 소셜 로그인 제공자 설정
        //setIsAuthenticated(true)
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
            setIsAuthenticated(true) // 인증 성공 시 상태 업데이트
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

            setIsAuthenticated(true) // 인증 성공 시 상태 업데이트
        } catch (error) {
            console.error(error)
            alert(`${provider} 인증 중 오류가 발생했습니다. 다시 시도해주세요.`)
        }
    }

    const handleDeleteAccount = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/users/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // 쿠키 포함
            })

            if (!response.ok) {
                throw new Error('회원 탈퇴에 실패했습니다.')
            }

            alert('회원 탈퇴가 성공적으로 완료되었습니다.')
            router.push('/') // 탈퇴 후 메인 페이지 이동
        } catch (error) {
            console.error('회원 탈퇴 요청 중 오류 발생:', error)
            alert('회원 탈퇴 중 오류가 발생했습니다. 다시 시도해주세요.')
        }
    }

    const handleAction = (action: () => void) => {
        if (!isAgreed) {
            setShowAlert(true) // 알림 모달 표시
            return
        }
        action()
    }

    if (!isAuthenticated) {
        return (
            <div className={styles.container}>
                <div className={styles.authWrapper}>
                    <h1 className={styles.title}>회원탈퇴 인증</h1>

                    {!provider && (
                        <div className={styles.section}>
                            <h2 className={styles.subtitle}></h2>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="비밀번호를 입력하세요"
                                className={`${styles.input} w-full`}
                                style={{
                                    border: '1px solid #d1d5db', // 얇은 회색 테두리
                                    borderRadius: '4px', // 모서리 둥글게
                                    padding: '8px', // 내부 여백
                                    marginBottom: '16px', // 버튼과 간격 추가
                                }}
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
                                <h2 className={styles.subtitle}></h2>
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
                    <div className={styles.formHeader}>
                        <h1 className={styles.title}>회원탈퇴</h1>
                    </div>

                    <form className={styles.form}>
                        <div>
                            <div className={styles.subtitle}>
                                <h2>회원탈퇴를 진행하시기 전에 아래내용을 확인해주세요.</h2>
                            </div>
                            <div className={styles.noticeList}>
                                <p>• 계정 삭제 시 모든 데이터가 영구적으로 삭제되며 복구가 불가능합니다.</p>
                                <p>• 작성하신 게시물, 댓글 등의 콘텐츠가 모두 삭제됩니다.</p>
                                <p>• 연동된 소셜 계정 정보도 함께 삭제됩니다.</p>
                                <p>• 인증을 완료해야 회원 탈퇴 버튼이 활성화됩니다.</p>
                            </div>

                            <div className={styles.checkboxContainer}>
                                <input
                                    id="agree"
                                    name="agree"
                                    type="checkbox"
                                    className={styles.checkbox}
                                    checked={isAgreed}
                                    onChange={(e) => setIsAgreed(e.target.checked)}
                                />
                                <label htmlFor="agree" className={styles.checkboxLabel}>
                                    위 내용을 모두 확인하였으며, 이에 동의합니다.
                                </label>
                            </div>

                            <div className={styles.buttonContainer}>
                                {/* 인증이 완료된 경우에만 회원탈퇴 버튼 표시 */}

                                <button
                                    type="button"
                                    onClick={() => handleAction(handleDeleteAccount)}
                                    className={styles.withdrawButton}
                                >
                                    회원 탈퇴
                                </button>
                                <button
                                    type="button"
                                    onClick={() => router.push('/account/edit')} // edit 페이지로 이동
                                    className={styles.cancelButton}
                                >
                                    취소
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* 알림 모달 */}
            {showAlert && (
                <div className={styles.alertOverlay}>
                    <div className={styles.alertModal}>
                        <p>체크박스를 선택해야 진행할 수 있습니다.</p>
                        <button
                            type="button"
                            onClick={() => setShowAlert(false)} // 알림 닫기
                            className={styles.alertButton}
                        >
                            확인
                        </button>
                    </div>
                </div>
            )}
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
