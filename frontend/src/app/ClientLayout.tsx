"use client";

import { useEffect } from "react";

export function ClientLayout({ children }: { children: React.ReactNode }) {
    
    useEffect(() => {
        fetch("http://localhost:8090/api/v1/users/get/token", {
            method: "GET",
            credentials: "include",  // 쿠키를 포함하도록 설정
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);  // 서버로부터 받은 데이터 처리
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
    }, []);

    return (
        <main>
            <nav>네비바</nav>
            {children}
        </main>
    );
}
