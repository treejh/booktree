"use client";

import { useState } from "react";

interface Post {
  id: number;
  title: string;
  date: string;
  views: number;
  comments: number;
}

export default function MyPage() {
  const [posts] = useState<Post[]>([
    {
      id: 1,
      title: "독서후기",
      date: "2024.02.20",
      views: 156,
      comments: 8,
    },
    {
      id: 2,
      title: "자격증 책 추천",
      date: "2024.02.18",
      views: 234,
      comments: 12,
    },
    {
      id: 3,
      title: "소설 추천",
      date: "2024.02.15",
      views: 189,
      comments: 5,
    },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [introduction, setIntroduction] = useState(
    "안녕하세요! 제 블로그에 오신 것을 환영합니다. 여기서는 일상과 관심사를 공유하고 있습니다."
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* 프로필 섹션 */}
      <div className="bg-white rounded-lg p-6 mb-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden mr-4">
              <img
                src="https://randomuser.me/api/portraits/women/44.jpg"
                alt="프로필"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center">
                <h1 className="text-xl font-bold">김블로그</h1>
                <span className="text-gray-500 text-sm ml-2">@blog_kim</span>
              </div>
              <p className="text-gray-500 text-sm">가입일: 2024년 1월 15일</p>
            </div>
          </div>
          <button
            className="px-4 py-2 bg-[#2E804E] text-white rounded-md hover:bg-[#246A40]"
            onClick={() => setIsEditing(!isEditing)}
          >
            프로필 수정
          </button>
        </div>
        <div className="mt-4">
          {isEditing ? (
            <div className="flex flex-col gap-2">
              <textarea
                value={introduction}
                onChange={(e) => setIntroduction(e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={3}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 text-sm text-gray-600 border rounded-md hover:bg-gray-100"
                >
                  취소
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                  }}
                  className="px-3 py-1 text-sm text-white bg-[#2E804E] rounded-md hover:bg-[#246A40]"
                >
                  저장
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">{introduction}</p>
          )}
        </div>
      </div>

      {/* 통계 섹션 */}
      <div className="flex gap-4 mb-4">
        <div className="flex-1 bg-white p-6 rounded-lg shadow-sm text-center">
          <h3 className="text-gray-500 mb-2">게시물</h3>
          <p className="text-2xl font-bold">42</p>
        </div>
        <div className="flex-1 bg-white p-6 rounded-lg shadow-sm text-center">
          <h3 className="text-gray-500 mb-2">팔로잉</h3>
          <p className="text-2xl font-bold">128</p>
        </div>
        <div className="flex-1 bg-white p-6 rounded-lg shadow-sm text-center">
          <h3 className="text-gray-500 mb-2">팔로워</h3>
          <p className="text-2xl font-bold">128</p>
        </div>
      </div>

      {/* 카테고리 섹션 */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
        <h2 className="text-lg font-bold p-6 border-b">카테고리</h2>
        {/* divide-y 클래스를 제거하고 일반 div로 변경 */}
        <div>
          {posts.map((post) => (
            <div
              key={post.id}
              className="p-6 hover:bg-gray-50 transition cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{post.title}</h3>
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
              <div className="flex items-center text-sm text-gray-500 mt-2">
                <span>{post.date}</span>
                <span className="mx-2">•</span>
                <span>조회 {post.views}</span>
                <span className="mx-2">•</span>
                <span>댓글 {post.comments}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 푸터 */}
      <footer className="text-center text-gray-500 text-sm">
        © 2025 북트리 서비스. All rights reserved.
      </footer>
    </div>
  );
}
