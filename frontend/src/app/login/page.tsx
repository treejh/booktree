"use client";

import { useState } from "react";
import styles from "./login.module.css";
import Link from "next/link";

export default function LoginPage() {
  const [rememberLogin, setRememberLogin] = useState(false);

  return (
    <div className={styles.loginContainer}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className="flex items-center gap-2">
            <img
              src="https://booktree-s3-bucket.s3.ap-northeast-2.amazonaws.com/BookTree.png"
              alt="BookTree"
              className={styles.logo}
            />
            <span className={styles.logoText}>BookTree</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <button className={styles.loginButton}>로그인</button>
            </Link>

            <Link href="/register">
              <button className={styles.signupButton}>회원가입</button>
            </Link>
          </div>
        </div>
      </header>

      <div className={styles.mainContent}>
        <div className={styles.formContainer}>
          <h1 className="text-2xl font-bold text-center mb-8">로그인</h1>

          <form className={styles.form}>
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="id"
                  className="block text-sm font-medium text-gray-700"
                >
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
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
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
                  <label
                    htmlFor="remember"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    로그인 상태 유지
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="text-gray-700">
                    비밀번호 찾기
                  </a>
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                로그인
              </button>

              <button
                type="button"
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2 fill-current">
                  <path d="M12 3C6.5 3 2 6.5 2 11c0 2.5 1.2 4.7 3 6.2l-1 3.8 4-2.4c1.3.4 2.6.6 4 .6 5.5 0 10-3.5 10-8s-4.5-8-10-8z" />
                </svg>
                카카오로 시작하기
              </button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-white text-sm text-gray-500">
                    또는
                  </span>
                </div>
              </div>

              <div className="text-center text-sm">
                <span className="text-gray-500">계정이 없으신가요? </span>
                <Link
                  href="/register"
                  className="text-gray-900 hover:text-gray-700 font-medium"
                >
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
  );
}
