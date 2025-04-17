"use client";

import CategoryGrid from './components/CategoryGrid';
import Link from 'next/link';
import Header from './components/Header';

export default function Home() {
  console.log(process.env.NEXT_PUBLIC_API_BASE_URL);

  return (
    <div className="bg-[#F4F4F4] min-h-screen">
      <div className="w-full px-0 py-4">
        <div className="flex flex-wrap gap-2 mb-6">
          <Link 
            href="/main/category/novel"
            className="py-2 px-6 bg-white rounded-md text-center hover:bg-gray-100 border border-gray-200 shadow-sm flex-1 min-w-24 text-sm"
          >
            소설
          </Link>
          <Link 
            href="/main/category/self-development"
            className="py-2 px-6 bg-white rounded-md text-center hover:bg-gray-100 border border-gray-200 shadow-sm flex-1 min-w-24 text-sm"
          >
            자기계발서
          </Link>
          <Link 
            href="/main/category/study"
            className="py-2 px-6 bg-white rounded-md text-center hover:bg-gray-100 border border-gray-200 shadow-sm flex-1 min-w-24 text-sm"
          >
            공부/자격
          </Link>
          <Link 
            href="/main/category/essay"
            className="py-2 px-6 bg-white rounded-md text-center hover:bg-gray-100 border border-gray-200 shadow-sm flex-1 min-w-24 text-sm"
          >
            에세이/일상
          </Link>
          <Link 
            href="/main/category/hobby"
            className="py-2 px-6 bg-white rounded-md text-center hover:bg-gray-100 border border-gray-200 shadow-sm flex-1 min-w-24 text-sm"
          >
            실용/취미
          </Link>
          <Link 
            href="/main/category/it"
            className="py-2 px-6 bg-white rounded-md text-center hover:bg-gray-100 border border-gray-200 shadow-sm flex-1 min-w-24 text-sm"
          >
            IT/컴퓨터
          </Link>
        </div>

        <div className="w-full h-96 rounded-lg overflow-hidden mb-12">
          <img
            src="https://images.unsplash.com/photo-1507842217343-583bb7270b66"
            alt="도서관 이미지"
            className="w-full h-full object-cover"
          />
        </div>

        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-6">인기 게시물</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg overflow-hidden shadow-sm">
              <div className="relative h-48 bg-gray-200">
                <img
                  src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c"
                  alt="책 이미지"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3 bg-white">
                <span className="text-xs bg-[#2E804E] text-white px-2 py-1 rounded-md">
                  소설
                </span>
                <h3 className="font-medium mt-2 text-sm">
                  미래를 바꾸는 순간들
                </h3>
                <p className="text-xs text-gray-500 mt-1">조회수 1,234</p>
              </div>
            </div>

            <div className="rounded-lg overflow-hidden shadow-sm">
              <div className="relative h-48 bg-gray-200">
                <img
                  src="https://images.unsplash.com/photo-1512820790803-83ca734da794"
                  alt="책 이미지"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3 bg-white">
                <span className="text-xs bg-[#2E804E] text-white px-2 py-1 rounded-md">
                  자기계발서
                </span>
                <h3 className="font-medium mt-2 text-sm">
                  성공하는 습관의 비밀
                </h3>
                <p className="text-xs text-gray-500 mt-1">조회수 987</p>
              </div>
            </div>

            <div className="rounded-lg overflow-hidden shadow-sm">
              <div className="relative h-48 bg-gray-200">
                <img
                  src="https://images.unsplash.com/photo-1599008633840-052c7f756385"
                  alt="책상 이미지"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3 bg-white">
                <span className="text-xs bg-[#2E804E] text-white px-2 py-1 rounded-md">
                  공부/자격
                </span>
                <h3 className="font-medium mt-2 text-sm">
                  효율적인 학습법 가이드
                </h3>
                <p className="text-xs text-gray-500 mt-1">조회수 856</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-6">카테고리별 인기 게시물</h2>
          <CategoryGrid />
        </section>
      </div>
    </>
  );
}
