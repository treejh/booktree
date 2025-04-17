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
  isEditing?: boolean; // 수정 모드 상태 추가
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
    content: `안녕하세요! 2024년 봄을 맞이하여 책 읽기 좋은 장소 추천을 소개해드리고 싶습니다.

1. 성수
성수동은 요즘 핫한 카페거리로 유명한데요, 그중에서도 책 읽기 좋은 장소를 추천드립니다.
- 서울북카페 센터: 조용하고 아늑한 분위기로 독서에 집중하기 좋습니다.
- 세이버앤페이버: 디자인 서적이 많이 구비되어 있어 관심 있으신 분들께 추천드립니다.

2. 광진
광진구에는 자연과 함께 책을 읽을 수 있는 장소들이 많습니다.
- 아차산 숲속도서관: 아차산의 자연 속에서 책을 읽을 수 있는 특별한 공간입니다.
- 북카페림: 편안한 분위기와 맛있는 음료를 함께 즐길 수 있습니다.

3. 송파
송파구의 현대적인 분위기의 북카페들을 소개합니다.
- 그래픽바이대신: 인테리어가 예쁘고 조명이 독서하기 좋습니다.
- 하우스서울: 아늑한 공간에서 책도 읽고 휴식도 취할 수 있습니다.`,
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

  // 상태 추가
  const [editingReplyId, setEditingReplyId] = useState<number | null>(null);
  const [editedReplyContent, setEditedReplyContent] = useState("");
  const [hasReplied, setHasReplied] = useState<{ [key: number]: boolean }>({});
  // 상태 추가
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editedCommentContent, setEditedCommentContent] = useState("");

  // 답글 좋아요 상태를 관리할 객체 추가
  const [likedReplies, setLikedReplies] = useState<{
    [key: number]: boolean;
  }>({});

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

  // 답글 좋아요 토글 함수 추가
  const toggleReplyLike = (commentId: number, replyId: number) => {
    setLikedReplies((prev) => {
      const newLikedReplies = { ...prev };
      newLikedReplies[replyId] = !prev[replyId];

      // 답글 좋아요 수 업데이트
      setComments(
        comments.map((comment) => {
          if (comment.id === commentId) {
            return {
              ...comment,
              replies: comment.replies.map((reply) => {
                if (reply.id === replyId) {
                  return {
                    ...reply,
                    likes: newLikedReplies[replyId]
                      ? reply.likes + 1
                      : Math.max(0, reply.likes - 1),
                  };
                }
                return reply;
              }),
            };
          }
          return comment;
        })
      );

      return newLikedReplies;
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

  // 답글 수정 함수
  const handleReplyEdit = (
    commentId: number,
    replyId: number,
    content: string
  ) => {
    setEditingReplyId(replyId);
    setEditedReplyContent(content);
  };

  // 답글 수정 저장 함수
  const handleReplyEditSave = (commentId: number, replyId: number) => {
    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: comment.replies.map((reply) => {
              if (reply.id === replyId) {
                return {
                  ...reply,
                  content: editedReplyContent,
                };
              }
              return reply;
            }),
          };
        }
        return comment;
      })
    );
    setEditingReplyId(null);
  };

  // 답글 삭제 함수
  const handleReplyDelete = (commentId: number, replyId: number) => {
    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: comment.replies.filter((reply) => reply.id !== replyId),
          };
        }
        return comment;
      })
    );
    setHasReplied({
      ...hasReplied,
      [commentId]: false,
    });
  };

  // 댓글 수정/삭제 함수 추가
  const handleCommentEdit = (commentId: number, content: string) => {
    setEditingCommentId(commentId);
    setEditedCommentContent(content);
  };

  const handleCommentEditSave = (commentId: number) => {
    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            content: editedCommentContent,
          };
        }
        return comment;
      })
    );
    setEditingCommentId(null);
  };

  const handleCommentDelete = (commentId: number) => {
    setComments(comments.filter((comment) => comment.id !== commentId));
  };

  // 답글 제출 핸들러
  const handleReplySubmit = (commentId: number) => {
    if (!replyInputs[commentId] || replyInputs[commentId].trim() === "") return;
    if (hasReplied[commentId]) return; // 이미 답글을 작성한 경우 return

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
    setHasReplied({
      ...hasReplied,
      [commentId]: true,
    });
  };

  // 답글 작성 취소 핸들러
  const handleReplyCancel = () => {
    setActiveReplyId(null);
  };

  const [isPostEditing, setIsPostEditing] = useState(false);
  const [editedPost, setEditedPost] = useState({
    title: post.title,
    content: post.content,
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl bg-gray-50">
      <div className="flex gap-8">
        {/* 메인 컨텐츠 */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm p-8">
            {" "}
            {/* 흰색 배경 컨테이너 추가 */}
            {/* 헤더 */}
            <div className="mb-10">
              <div className="flex justify-between items-center mb-4">
                {/* 제목 부분 */}
                {isPostEditing ? (
                  <input
                    type="text"
                    value={editedPost.title}
                    onChange={(e) =>
                      setEditedPost({ ...editedPost, title: e.target.value })
                    }
                    className="text-2xl font-bold w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                ) : (
                  <h1 className="text-2xl font-bold">{post.title}</h1>
                )}
                <div className="flex space-x-2">
                  <div className="flex space-x-2">
                    {isPostEditing ? (
                      <>
                        <button
                          onClick={() => {
                            setPost((prev) => ({
                              ...prev,
                              title: editedPost.title,
                              content: editedPost.content,
                            }));
                            setIsPostEditing(false);
                          }}
                          className="px-4 py-1 text-sm text-white bg-[#2E804E] rounded-md hover:bg-[#246A40] min-w-[60px]"
                        >
                          저장
                        </button>
                        <button
                          onClick={() => {
                            setIsPostEditing(false);
                            setEditedPost({
                              title: post.title,
                              content: post.content,
                            });
                          }}
                          className="px-4 py-1 text-sm text-gray-600 border rounded-md hover:bg-gray-100 min-w-[60px]"
                        >
                          취소
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 cursor-pointer"
                          onClick={() => setIsPostEditing(true)}
                        >
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
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 cursor-pointer">
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
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* 프로필 정보 */}
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

              {/* 게시글 내용 */}
              <div className="mb-8">
                {/* 이미지를 컨텐츠 위로 이동 */}
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

                {/* 컨텐츠 표시 */}
                {isPostEditing ? (
                  <textarea
                    value={editedPost.content}
                    onChange={(e) =>
                      setEditedPost({ ...editedPost, content: e.target.value })
                    }
                    className="w-full p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 mb-6"
                    rows={15}
                  />
                ) : (
                  <div className="mb-6 whitespace-pre-line">{post.content}</div>
                )}
              </div>

              {/* 좋아요 버튼 */}
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

              {/* 구분선 추가 */}
              <div className="border-b border-gray-200 mb-8"></div>

              {/* 댓글 섹션 */}
              <div>
                <h2 className="text-xl font-bold mb-4">
                  댓글 {comments.length}
                </h2>

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
                      className="px-4 py-2 bg-[#2E804E] text-white rounded-md hover:bg-[#246A40]"
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
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center">
                                <p className="font-medium">{comment.author}</p>
                                <span className="mx-2 text-xs text-gray-500">
                                  •
                                </span>
                                <p className="text-xs text-gray-500">
                                  {comment.date}
                                </p>
                              </div>
                              {editingCommentId === comment.id ? (
                                <div className="mt-2 w-full">
                                  <textarea
                                    value={editedCommentContent}
                                    onChange={(e) =>
                                      setEditedCommentContent(e.target.value)
                                    }
                                    className="w-full p-3 border rounded-md min-h-[80px] focus:outline-none focus:ring-2 focus:ring-green-500"
                                    rows={3}
                                  />
                                  <div className="flex justify-end mt-2 space-x-2">
                                    <button
                                      onClick={() => setEditingCommentId(null)}
                                      className="px-4 py-1.5 text-sm text-gray-600 border rounded-md hover:bg-gray-100"
                                    >
                                      취소
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleCommentEditSave(comment.id)
                                      }
                                      className="px-4 py-1.5 text-sm text-white bg-[#2E804E] rounded-md hover:bg-[#246A40]"
                                    >
                                      저장
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <p className="mt-1">{comment.content}</p>
                                  <div className="flex items-center mt-2 text-sm text-gray-500">
                                    <button
                                      className="flex items-center mr-4"
                                      onClick={() => toggleLike(comment.id)}
                                    >
                                      {/* 기존 좋아요 버튼 내용 */}
                                    </button>
                                    {!hasReplied[comment.id] && (
                                      <button
                                        className="flex items-center"
                                        onClick={() =>
                                          toggleReplyForm(comment.id)
                                        }
                                      >
                                        {/* 기존 답글 버튼 내용 */}
                                      </button>
                                    )}
                                  </div>
                                </>
                              )}
                            </div>
                            {!editingCommentId && (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() =>
                                    handleCommentEdit(
                                      comment.id,
                                      comment.content
                                    )
                                  }
                                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
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
                                <button
                                  onClick={() =>
                                    handleCommentDelete(comment.id)
                                  }
                                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
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
                            )}
                          </div>

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
                            {!hasReplied[comment.id] && (
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
                            )}
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
                                    <div className="flex-1">
                                      <div className="flex items-center justify-between">
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
                                          {editingReplyId === reply.id ? (
                                            <div className="mt-2 w-full">
                                              <textarea
                                                value={editedReplyContent}
                                                onChange={(e) =>
                                                  setEditedReplyContent(
                                                    e.target.value
                                                  )
                                                }
                                                className="w-full p-3 border rounded-md min-h-[80px] focus:outline-none focus:ring-2 focus:ring-green-500"
                                                rows={3}
                                              />
                                              <div className="flex justify-end mt-2 space-x-2">
                                                <button
                                                  onClick={() =>
                                                    setEditingReplyId(null)
                                                  }
                                                  className="px-4 py-1.5 text-sm text-gray-600 border rounded-md hover:bg-gray-100"
                                                >
                                                  취소
                                                </button>
                                                <button
                                                  onClick={() =>
                                                    handleReplyEditSave(
                                                      comment.id,
                                                      reply.id
                                                    )
                                                  }
                                                  className="px-4 py-1.5 text-sm text-white bg-[#2E804E] rounded-md hover:bg-[#246A40]"
                                                >
                                                  저장
                                                </button>
                                              </div>
                                            </div>
                                          ) : (
                                            <p className="mt-1 text-sm">
                                              {reply.content}
                                            </p>
                                          )}
                                        </div>
                                        {!editingReplyId && (
                                          <div className="flex space-x-2">
                                            <button
                                              onClick={() =>
                                                handleReplyEdit(
                                                  comment.id,
                                                  reply.id,
                                                  reply.content
                                                )
                                              }
                                              className="text-gray-400 hover:text-gray-600"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4"
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
                                            <button
                                              onClick={() =>
                                                handleReplyDelete(
                                                  comment.id,
                                                  reply.id
                                                )
                                              }
                                              className="text-gray-400 hover:text-gray-600"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4"
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
                                        )}
                                      </div>
                                      {/* 답글 좋아요 버튼 추가 */}
                                      <div className="flex items-center mt-2 text-sm text-gray-500">
                                        <button
                                          className="flex items-center mr-4"
                                          onClick={() =>
                                            toggleReplyLike(
                                              comment.id,
                                              reply.id
                                            )
                                          }
                                        >
                                          {likedReplies[reply.id] ? (
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
                                          좋아요 {reply.likes}
                                        </button>
                                      </div>
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
        </div>

        {/* 카테고리 사이드바 */}
        <div className="w-64 flex-shrink-0">
          <div className="sticky top-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {" "}
              {/* 흰색 배경과 스타일 추가 */}
              <h3 className="text-lg font-bold mb-4">전체 주제별게시판 (83)</h3>
              <ul className="space-y-2">
                <li>
                  <span className="text-gray-900">JAVA (33)</span>
                </li>
                <li>
                  <span className="text-gray-700">
                    스프링 / 스프링 부트 (24)
                  </span>
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
    </div>
  );
}
