'use client'

import { useState } from 'react'
import styles from './login.module.css'
import Link from 'next/link'

export default function LoginPage() {
    const [rememberLogin, setRememberLogin] = useState(false)
    const socialLoginForKakaoUrl = `http://localhost:8090/oauth2/authorization/kakao`
    const socialLoginForGithubUrl = `http://localhost:8090/oauth2/authorization/github`
    const redirectUrlAfterSocialLogin = 'http://localhost:3000'

    return (
        <div className={styles.container}>
            <div className={styles.mainContent}>
                <div className={styles.formContainer}>
                    <h1 className="text-2xl font-bold text-center mb-8">로그인</h1>

                    <form className={styles.form}>
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="id" className="block text-sm font-medium text-gray-700">
                                    아이디
                                </label>
                                <input
                                    type="text"
                                    id="id"
                                    name="id"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                    placeholder="아이디를 입력하세요"
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
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                    placeholder="비밀번호를 입력하세요"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember"
                                        name="remember"
                                        type="checkbox"
                                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                        checked={rememberLogin}
                                        onChange={(e) => setRememberLogin(e.target.checked)}
                                    />
                                    <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                                        로그인 상태 유지
                                    </label>
                                </div>
                                <div className="text-sm">
                                    <Link href="/account/findAccount/findId" className="text-gray-700">
                                        이메일 찾기
                                    </Link>
                                    /
                                    <Link href="/account/findAccount/findPassword" className="text-gray-700">
                                        비밀번호 찾기
                                    </Link>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2E804E] hover:bg-[#256d41] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2E804E]"
                            >
                                로그인
                            </button>

                            <Link
                                href={`${socialLoginForKakaoUrl}?redirectUrl=http://localhost:3000`}
                                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
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

                            <div className="relative py-4">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="px-4 bg-white text-sm text-gray-500">또는</span>
                                </div>
                            </div>

                            <div className="text-center text-sm">
                                <span className="text-gray-500">계정이 없으신가요? </span>
                                <Link href="/account/signup" className="text-gray-900 hover:text-gray-700 font-medium">
                                    회원가입
                                </Link>
                            </div>
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
