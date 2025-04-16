"use client";

import { useState } from "react";

export default function FollowPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalItems = 20; // 임시로 총 20명의 사용자가 있다고 가정
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // 현재 페이지에 해당하는 데이터만 표시
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = Array.from(
    { length: totalItems },
    (_, i) => i + 1
  ).slice(startIndex, endIndex);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 bg-[#F4F4F4]">
      <h1 className="text-3xl font-bold mb-8">팔로우</h1>

      {/* 탭 네비게이션 */}
      <div className="border-b mb-8">
        <nav className="flex gap-8">
          <button className="pb-2 border-b-2 border-gray-900">팔로잉</button>
          <button className="pb-2 text-gray-500">팔로워</button>
        </nav>
      </div>

      {/* 검색바 추가 */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="사용자 검색"
            className="w-full px-4 py-2 border rounded-lg pl-10"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* 팔로우 목록 */}
      <div className="space-y-4">
        {currentItems.map((user) => (
          <div
            key={user}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div>
                <h3 className="font-medium">사용자 {user}</h3>
                <p className="text-sm text-gray-500">@user{user}</p>
              </div>
            </div>
            <button className="bg-[#2E804E] text-white px-4 py-2 rounded-md hover:bg-[#247040] transition-colors">
              팔로우
            </button>
          </div>
        ))}
      </div>

      {/* 페이지네이션 */}
      <div className="mt-8 flex justify-center gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded border disabled:opacity-50"
        >
          이전
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-1 rounded border ${
              currentPage === page
                ? "bg-[#2E804E] text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded border disabled:opacity-50"
        >
          다음
        </button>
      </div>
    </main>
  );
}
