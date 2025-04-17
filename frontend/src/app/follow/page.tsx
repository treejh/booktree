"use client";

import { useState } from "react";

interface User {
  id: number;
  username: string;
  nickname: string;
  isFollowing: boolean;
}

export default function FollowPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"following" | "followers">(
    "following"
  );
  const [following, setFollowing] = useState<User[]>([
    { id: 1, username: "user1", nickname: "사용자 1", isFollowing: true },
    { id: 2, username: "user2", nickname: "사용자 2", isFollowing: true },
    { id: 3, username: "user3", nickname: "사용자 3", isFollowing: true },
    // ... 더 많은 팔로잉 데이터
  ]);
  const [followers, setFollowers] = useState<User[]>([
    { id: 4, username: "user4", nickname: "사용자 4", isFollowing: false },
    { id: 5, username: "user5", nickname: "사용자 5", isFollowing: true },
    { id: 6, username: "user6", nickname: "사용자 6", isFollowing: false },
    // ... 더 많은 팔로워 데이터
  ]);

  const itemsPerPage = 5;
  const currentList = activeTab === "following" ? following : followers;
  const totalItems = currentList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // 현재 페이지에 해당하는 데이터만 표시
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = currentList.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleFollowToggle = (userId: number) => {
    if (activeTab === "following") {
      setFollowing(
        following.map((user) =>
          user.id === userId
            ? { ...user, isFollowing: !user.isFollowing }
            : user
        )
      );
    } else {
      setFollowers(
        followers.map((user) =>
          user.id === userId
            ? { ...user, isFollowing: !user.isFollowing }
            : user
        )
      );
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-8">
          {activeTab === "following" ? "팔로잉" : "팔로워"}
        </h1>

        {/* 탭 네비게이션 */}
        <div className="border-b mb-8">
          <nav className="flex gap-8">
            <button
              onClick={() => setActiveTab("following")}
              className={`pb-2 border-b-2 ${
                activeTab === "following"
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              팔로잉
            </button>
            <button
              onClick={() => setActiveTab("followers")}
              className={`pb-2 border-b-2 ${
                activeTab === "followers"
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              팔로워
            </button>
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
              key={user.id}
              className="flex items-center justify-between p-6 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                <div>
                  <h3 className="font-medium text-lg">{user.nickname}</h3>
                  <p className="text-sm text-gray-500">@{user.username}</p>
                </div>
              </div>
              <button
                onClick={() => handleFollowToggle(user.id)}
                className={`px-6 py-2.5 rounded-md transition-colors ${
                  user.isFollowing
                    ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    : "bg-[#2E804E] text-white hover:bg-[#247040]"
                }`}
              >
                {user.isFollowing ? "팔로잉" : "팔로우"}
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
      </div>
    </main>
  );
}
