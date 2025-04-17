"use client";

import { useEffect } from "react";

export function ClientLayout({ children }: { children: React.ReactNode }) {

    useEffect(() => {
        fetch("http://localhost:8090/api/v1/users/get/token")
            .then(response => response.json())
            .then(data => {
                console.log(data);
            });
    }, []);

    return (
        <main>
            <nav>네비바</nav>
            {children}
        </main>
    )

}