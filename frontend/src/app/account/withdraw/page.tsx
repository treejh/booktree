"use client";

import { useState } from "react";
import styles from "./withdraw.module.css";
import Link from "next/link";

export default function WithdrawalPage() {
  const [isAgreed, setIsAgreed] = useState(false);
  const userEmail = "minsu_kim";

  return (
    <div className={styles.container}>
      <div className={styles.mainWrapper}>
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <h1 className={styles.title}>회원탈퇴</h1>
            <p className={styles.email}>@{userEmail}</p>
          </div>

          <form className={styles.form}>
            <div>
              <div className={styles.subtitle}>
                <h2>회원탈퇴를 진행하시기 전에 아래내용을 확인해주세요.</h2>
              </div>
              <div className={styles.noticeList}>
                <p>
                  • 계정 삭제 시 모든 데이터가 영구적으로 삭제되며 복구가
                  불가능합니다.
                </p>
                <p>• 작성하신 게시물, 댓글 등의 콘텐츠가 모두 삭제됩니다.</p>
                <p>• 구매하신 이용권은 환불되지 않으며 즉시 소멸됩니다.</p>
                <p>• 연동된 소셜 계정 정보도 함께 삭제됩니다.</p>
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

              <div className={styles.passwordContainer}>
                <div className="mb-2">
                  <label htmlFor="password" className={styles.passwordLabel}>
                    비밀번호 확인
                  </label>
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className={styles.passwordInput}
                  placeholder="현재 비밀번호를 입력해주세요"
                />
              </div>

              <div className={styles.buttonContainer}>
                <button type="submit" className={styles.withdrawButton}>
                  회원탈퇴
                </button>
                <button type="button" className={styles.cancelButton}>
                  취소
                </button>
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
