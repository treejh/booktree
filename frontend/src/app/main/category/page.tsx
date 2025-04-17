'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CategoryPage() {
  const router = useRouter();
  
  useEffect(() => {
    // 기본적으로 '소설' 카테고리로 리디렉션
    router.push('/main/category/novel');
  }, [router]);
  
  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <p>카테고리 페이지로 이동 중입니다...</p>
    </div>
  );
}
