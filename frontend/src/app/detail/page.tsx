"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import React from "react";

// 답글 타입 정의
interface Reply {
  id: number;
  author: string;
  date: string;
  content: string;
  likes: number;
}

// 댓글 타입 정의
interface Comment {
  id: number;
  author: string;
  date: string;
  content: string;
  likes: number;
  replies: Reply[];
}

export default function DetailPage() {
  // 라우터 초기화
  const router = useRouter();

  // 게시물 데이터 상태
  const [post, setPost] = useState({
    id: 1,
    title: "2025년 책 읽기 좋은 장소 추천",
    author: "이지은",
    date: "2025.04.16",
    views: 1234,
    likes: 56,
    content:
      "안녕하세요! 2024년 봄을 맞이하여 책 읽기 좋은 장소 추천을 소개해드리고 싶습니다.",
    recommendations: [
      {
        title: "성수",
        subItems: ["서울북카페 센터", "세이버앤페이버"],
      },
      {
        title: "광진",
        subItems: ["아차산 숲속도서관", "북카페림"],
      },
      {
        title: "송파",
        subItems: ["그래픽바이대신", "하우스서울"],
      },
    ],
  });

  // 게시물 좋아요 상태 추가
  const [postLiked, setPostLiked] = useState(false);

  // 댓글 데이터 상태
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: "스미스",
      date: "2025.04.16",
      content: "정말 좋은 정보 감사합니다!",
      likes: 5,
      replies: [],
    },
    {
      id: 2,
      author: "이지은",
      date: "2025.04.16",
      content: "좋은 시간 보내세요! 😊",
      likes: 2,
      replies: [],
    },
    {
      id: 3,
      author: "범퍼카",
      date: "2025.04.17",
      content:
        "순천만 국가정원도 봄에 가면 정말 조용히 책읽기 좋습니다! 일학 가서는 정원을 추천합니다!",
      likes: 3,
      replies: [],
    },
  ]);

  // 댓글 입력 상태
  const [commentInput, setCommentInput] = useState("");

  // 좋아요 상태 관리를 위한 객체
  const [likedComments, setLikedComments] = useState<{
    [key: number]: boolean;
  }>({});

  // 답글 입력 상태를 관리하는 객체
  const [replyInputs, setReplyInputs] = useState<{
    [key: number]: string;
  }>({});

  // 답글 입력창을 표시할 댓글 ID
  const [activeReplyId, setActiveReplyId] = useState<number | null>(null);

  // 게시물 좋아요 토글 함수
  const togglePostLike = () => {
    setPostLiked(!postLiked);
    setPost((prev) => ({
      ...prev,
      likes: postLiked ? Math.max(0, prev.likes - 1) : prev.likes + 1,
    }));
  };

  // 좋아요 토글 함수
  const toggleLike = (commentId: number) => {
    setLikedComments((prev) => {
      const newLikedComments = { ...prev };
      newLikedComments[commentId] = !prev[commentId];

      // 댓글 좋아요 수 업데이트
      setComments(
        comments.map((comment) => {
          if (comment.id === commentId) {
            return {
              ...comment,
              likes: newLikedComments[commentId]
                ? comment.likes + 1
                : Math.max(0, comment.likes - 1),
            };
          }
          return comment;
        })
      );

      return newLikedComments;
    });
  };

  // 댓글 제출 핸들러
  const handleCommentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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

  // 답글 작성 창 토글 함수
  const toggleReplyForm = (commentId: number) => {
    if (activeReplyId === commentId) {
      setActiveReplyId(null);
    } else {
      setActiveReplyId(commentId);
      if (!replyInputs[commentId]) {
        setReplyInputs({
          ...replyInputs,
          [commentId]: "",
        });
      }
    }
  };

  // 답글 입력 핸들러
  const handleReplyInputChange = (commentId: number, value: string) => {
    setReplyInputs({
      ...replyInputs,
      [commentId]: value,
    });
  };

  // 답글 제출 핸들러
  const handleReplySubmit = (commentId: number) => {
    if (!replyInputs[commentId] || replyInputs[commentId].trim() === "") return;

    const newReply: Reply = {
      id: Date.now(), // 유니크한 ID 생성
      author: "김민수", // 현재 로그인한 사용자 이름
      date: new Date()
        .toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/\. /g, ".")
        .replace(/\.$/, ""),
      content: replyInputs[commentId],
      likes: 0,
    };

    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [...comment.replies, newReply],
          };
        }
        return comment;
      })
    );

    // 입력창 초기화
    setReplyInputs({
      ...replyInputs,
      [commentId]: "",
    });
    setActiveReplyId(null);
  };

  // 답글 작성 취소 핸들러
  const handleReplyCancel = () => {
    setActiveReplyId(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {" "}
      {/* max-w-5xl을 max-w-7xl로 변경 */}
      <div className="flex gap-8">
        {" "}
        {/* 메인 컨텐츠와 사이드바를 감싸는 flex 컨테이너 */}
        {/* 메인 컨텐츠 */}
        <div className="flex-1">
          {/* 헤더 */}
          <header></header>

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
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyieIewsxilz3T5dktElsgbQZcziGjh6GCQg&s"
                    alt="공원 벤치"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="rounded-lg overflow-hidden h-80">
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyieIewsxilz3T5dktElsgbQZcziGjh6GCQg&s"
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
              <button
                onClick={togglePostLike}
                className={`flex items-center justify-center px-4 py-2 bg-green-50 hover:bg-green-100 transition rounded-md ${
                  postLiked ? "text-red-500" : "text-green-600"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  fill={postLiked ? "currentColor" : "none"}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  />
                </svg>
                좋아요 {post.likes}
              </button>
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
                          <p className="text-xs text-gray-500">
                            {comment.date}
                          </p>
                        </div>
                        <p className="mt-1">{comment.content}</p>
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                          <button
                            className="flex items-center mr-4"
                            onClick={() => toggleLike(comment.id)}
                          >
                            {likedComments[comment.id] ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1 text-red-500"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
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
                                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                              </svg>
                            )}
                            좋아요 {comment.likes}
                          </button>
                          <button
                            className="flex items-center"
                            onClick={() => toggleReplyForm(comment.id)}
                          >
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

                        {/* 답글 입력 폼 */}
                        {activeReplyId === comment.id && (
                          <div className="mt-4 pl-5 border-l-2 border-gray-200">
                            <textarea
                              className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                              rows={2}
                              placeholder="답글을 작성해주세요."
                              value={replyInputs[comment.id] || ""}
                              onChange={(e) =>
                                handleReplyInputChange(
                                  comment.id,
                                  e.target.value
                                )
                              }
                            ></textarea>
                            <div className="flex justify-end mt-2 space-x-2">
                              <button
                                onClick={handleReplyCancel}
                                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                              >
                                취소
                              </button>
                              <button
                                onClick={() => handleReplySubmit(comment.id)}
                                className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                              >
                                등록
                              </button>
                            </div>
                          </div>
                        )}

                        {/* 답글 목록 */}
                        {comment.replies.length > 0 && (
                          <div className="mt-4 pl-5 border-l-2 border-gray-200 space-y-4">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="pt-2">
                                <div className="flex items-start">
                                  <div className="w-6 h-6 rounded-full bg-gray-300 mr-2 overflow-hidden">
                                    <img
                                      src={`https://randomuser.me/api/portraits/men/${
                                        reply.id % 50
                                      }.jpg`}
                                      alt="프로필"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <div className="flex items-center">
                                      <p className="font-medium text-sm">
                                        {reply.author}
                                      </p>
                                      <span className="mx-2 text-xs text-gray-500">
                                        •
                                      </span>
                                      <p className="text-xs text-gray-500">
                                        {reply.date}
                                      </p>
                                    </div>
                                    <p className="mt-1 text-sm">
                                      {reply.content}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* 카테고리 사이드바 */}
        <div className="w-64 flex-shrink-0">
          <div className="sticky top-8">
            <h3 className="text-lg font-bold mb-4">전체 주제별게시판 (83)</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-gray-900">JAVA (33)</span>
              </li>
              <li>
                <span className="text-gray-700">스프링 / 스프링 부트 (24)</span>
              </li>
              <li>
                <span className="text-gray-700">스프링 시큐리티 (1)</span>
              </li>
              <li>
                <span className="text-gray-700">스프링 리액티브 (1)</span>
              </li>
              <li>
                <span className="text-gray-700">JdbC - 드라이버 (2)</span>
              </li>
              <li>
                <span className="text-gray-700">기타의 기술 (1)</span>
              </li>
              <li>
                <span className="text-gray-700">Git (1)</span>
              </li>
              <li>
                <span className="text-gray-700">코딩테스트 (34)</span>
              </li>
              <li>
                <span className="text-gray-700">AWS (9)</span>
              </li>
              <li>
                <span className="text-gray-700">데이터베이스 (2)</span>
              </li>
              <li>
                <span className="text-gray-700">컴퓨터 네트워크 (1)</span>
              </li>
              <li>
                <span className="text-gray-700">알고리즘, 자료구조 (4)</span>
              </li>
              <li>
                <span className="text-gray-700">서비스 프로젝트 (7)</span>
              </li>
              <li>
                <span className="text-gray-700">토이프로젝트 (1)</span>
              </li>
              <li>
                <span className="text-gray-700">후기글 (1)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
