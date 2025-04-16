"use client";

import "./globals.css";
import styles from "./login/login.module.css";

interface LayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
