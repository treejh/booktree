"use client";

import { useState } from "react";
import styles from "./findPassword.module.css";
import Link from "next/link";

export default function FindPasswordPage() {
  const [id1, setId1] = useState("");
  const [id2, setId2] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  return (
    <div className={styles.container}>
      <div className={styles.mainWrapper}>
        <div className={styles.formContainer}>
          <h1 className={styles.title}>비밀번호 찾기</h1>
          <div className={styles.form}>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>핸드폰 번호로 찾기</h2>
              <div className={styles.inputGroup}>
                <label htmlFor="id1" className={styles.label}>
                  아이디
                </label>
                <input
                  id="id1"
                  type="text"
                  className={styles.input}
                  placeholder="아이디를 입력하세요"
                  value={id1}
                  onChange={(e) => setId1(e.target.value)}
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
              <button className={styles.submitButton}>
                핸드폰 번호로 찾기
              </button>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>이메일로 찾기</h2>
              <div className={styles.inputGroup}>
                <label htmlFor="id2" className={styles.label}>
                  아이디
                </label>
                <input
                  id="id2"
                  type="text"
                  className={styles.input}
                  placeholder="아이디를 입력하세요"
                  value={id2}
                  onChange={(e) => setId2(e.target.value)}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="email" className={styles.label}>
                  이메일
                </label>
                <input
                  id="email"
                  type="email"
                  className={styles.input}
                  placeholder="가입시 등록한 이메일을 입력하세요"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button className={styles.submitButton}>이메일로 찾기</button>
            </div>
          </div>

          <div className={styles.loginLink}>
            <span>비밀번호를 찾으셨나요?</span>
            <Link href="/account/login" className={styles.loginLinkText}>
              로그인하기
            </Link>
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
