'use client'

import { useEffect } from 'react'
import Header from './components/Header'
import { LoginUserContext, useLoginUser } from '@/stores/auth/loginMember'

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const { loginUser, setLoginUser, isLoginUserPending, setNoLoginUser, isLogin, logout, logoutAndHome } =
        useLoginUser()

    const LoginUserContextValue = {
        loginUser,
        setLoginUser,
        isLoginUserPending,
        setNoLoginUser,
        isLogin,
        logout,
        logoutAndHome,
    }

    useEffect(() => {
        fetch('http://localhost:8090/api/v1/users/get/token', {
            credentials: 'include', // 쿠키를 포함하도록 설정
        })
            .then((response) => response.json())
            .then((data) => {
                // 서버로부터 받은 데이터 처리
                setLoginUser(data)
            })
            .catch((error) => {
                setNoLoginUser()
            })
    }, [])

    if (isLoginUserPending) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div>로딩중</div>
            </div>
        )
    }

    return (
        <LoginUserContext.Provider value={LoginUserContextValue}>
            <main className="bg-[#F4F4F4] min-h-screen">
                <Header /> {/* 👈 공통 헤더 */}
                {children}
            </main>
        </LoginUserContext.Provider>
    )
}
