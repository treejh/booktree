"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DetailPage() {
  // 라우터 초기화
  const router = useRouter();

  // 게시물 데이터 상태
  const [post, setPost] = useState({
    id: 1,
    title: "2024년 책 읽기 좋은 장소 추천",
    author: "이지은",
    date: "2024.03.15",
    views: 1234,
    likes: 56,
    content:
      "안녕하세요! 2024년 봄을 맞이하여 책 읽기 좋은 장소 추천을 소개해드리고 싶습니다.",
    recommendations: [
      {
        title: "성수",
        subItems: ["서울북카페 센터", "세이버얼웨어바"],
      },
      {
        title: "제주도 유채꽃밭",
        subItems: ["카페도 유채꽃 추천", "산왕산 유채꽃길"],
      },
      {
        title: "순천만 국가정원",
        subItems: ["북꽃 정원", "습지 생태공원"],
      },
    ],
  });

  // 댓글 데이터 상태
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "박상현",
      date: "2024.03.15",
      content: "정말 좋은 정보 감사합니다! 장주 벚꽃이 특히 가볼만해요.",
      likes: 5,
      replies: [],
    },
    {
      id: 2,
      author: "이지은",
      date: "2024.03.15",
      content: "네, 좋은 시간 보내세요! 😊",
      likes: 2,
      replies: [],
    },
    {
      id: 3,
      author: "최영희",
      date: "2024.03.15",
      content:
        "순천만 국가정원도 봄에 가면 정말 조용히 책읽기 좋습니다! 일학 가서는 정원을 추천합니다!",
      likes: 3,
      replies: [],
    },
  ]);

  // 댓글 입력 상태
  const [commentInput, setCommentInput] = useState("");

  // 댓글 제출 핸들러
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentInput.trim() === "") return;

    const newComment = {
      id: comments.length + 1,
      author: "김민수", // 현재 로그인한 사용자 이름
      date: new Date()
        .toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/\. /g, ".")
        .replace(/\.$/, ""),
      content: commentInput,
      likes: 0,
      replies: [],
    };

    setComments([...comments, newComment]);
    setCommentInput("");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* 헤더 */}
      <header className="flex items-center justify-between py-3 mb-6 border-b pb-4">
        <div className="flex items-center">
          <img
            src="https://booktree-s3-bucket.s3.ap-northeast-2.amazonaws.com/BookTree.png"
            alt="책 아이콘"
            className="w-6 h-6 mr-2"
          />
          <h1 className="text-xl font-bold">BookTree</h1>
        </div>
        <div className="flex items-center">
          <button
            className="px-4 py-2 text-sm text-white bg-green-600 rounded-md hover:bg-green-700"
            onClick={() => router.push("/")}
          >
            메인으로
          </button>
        </div>
      </header>

      {/* 게시물 상세 */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">{post.title}</h1>
          <div className="flex space-x-2">
            <button className="p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </button>
            <button className="p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex items-center mb-6">
          <div className="w-8 h-8 rounded-full bg-gray-300 mr-2 overflow-hidden">
            <img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="프로필"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-medium">{post.author}</p>
            <div className="flex text-xs text-gray-500">
              <span>{post.date}</span>
              <span className="mx-2">•</span>
              <span>조회 {post.views}</span>
              <span className="mx-2">•</span>
              <span>좋아요 {post.likes}</span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <p className="mb-6">{post.content}</p>

          {/* 이미지 표시 - 트윈테일 스타일로 두 개의 이미지를 나란히 배치 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="rounded-lg overflow-hidden h-80">
              <img
                src="https://images.unsplash.com/photo-1523481503411-dc6899fb4221"
                alt="벚꽃 길"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="rounded-lg overflow-hidden h-80">
              <img
                src="https://images.unsplash.com/photo-1609141236292-528b591df258"
                alt="공원 벤치"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>

          <div className="mb-8">
            <ol className="list-decimal pl-5 space-y-4">
              {post.recommendations.map((rec, index) => (
                <li key={index} className="pl-2">
                  <p className="font-semibold">{rec.title}</p>
                  <ul className="list-disc pl-5 mt-2">
                    {rec.subItems.map((item, i) => (
                      <li key={i} className="text-gray-700">
                        {item}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <button className="flex items-center justify-center px-4 py-2 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            좋아요
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
            #책추천
          </span>
          <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
            #봄
          </span>
          <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
            #벚꽃
          </span>
          <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
            #독서
          </span>
          <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
            #힐링
          </span>
        </div>
      </div>

      {/* 댓글 섹션 */}
      <div>
        <h2 className="text-xl font-bold mb-4">댓글 {comments.length}</h2>

        <form onSubmit={handleCommentSubmit} className="mb-6">
          <textarea
            className="w-full p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
            rows={3}
            placeholder="댓글을 작성해주세요."
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
          ></textarea>
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              댓글 작성
            </button>
          </div>
        </form>

        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="border-b pb-6">
              <div className="flex items-start mb-2">
                <div className="w-8 h-8 rounded-full bg-gray-300 mr-2 overflow-hidden">
                  <img
                    src={`https://randomuser.me/api/portraits/${
                      comment.author === "이지은"
                        ? "women/44.jpg"
                        : "men/32.jpg"
                    }`}
                    alt="프로필"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <p className="font-medium">{comment.author}</p>
                    <span className="mx-2 text-xs text-gray-500">•</span>
                    <p className="text-xs text-gray-500">{comment.date}</p>
                  </div>
                  <p className="mt-1">{comment.content}</p>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <button className="flex items-center mr-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                        />
                      </svg>
                      좋아요 {comment.likes}
                    </button>
                    <button className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      답글
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
