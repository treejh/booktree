"use client";

import { useState } from "react";
import styles from "./findId.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function FindAccountPage() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.mainWrapper}>
        <div className={styles.formContainer}>
          <h1 className={styles.title}>비밀번호 / 아이디 찾기</h1>
          <div className={styles.form}>
            <div className={styles.tabContainer}>
              <button
                className={`${styles.tabButton} ${styles.tabButtonActive}`}
              >
                아이디 찾기
              </button>
              <button
                className={`${styles.tabButton} ${styles.tabButtonInactive}`}
                onClick={() => router.push("/account/findAccount/findPassword")}
              >
                비밀번호 찾기
              </button>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                이메일
              </label>
              <input
                id="email"
                type="email"
                className={styles.input}
                placeholder="가입 시 등록한 이메일을 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="phone" className={styles.label}>
                전화번호
              </label>
              <input
                id="phone"
                type="tel"
                className={styles.input}
                placeholder="가입시 등록한 전화번호를 입력하세요"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <button className={styles.submitButton}>아이디 찾기</button>

            <div className={styles.loginLink}>
              <span>비밀번호를 찾으셨나요?</span>
              <Link href="/account/login" className={styles.loginLinkText}>
                로그인하기
              </Link>
            </div>
          </div>
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
