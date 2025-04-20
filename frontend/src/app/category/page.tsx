'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Post {
    id: number
    category: string
    subCategory: string
    title: string
    content: string
    date: string
    views: number
    comments: number
    image: string
    likes: number
}

export default function CategoryPage() {
    const router = useRouter()
    const [posts] = useState<Post[]>([
        {
            id: 1,
            category: '인천',
            subCategory: '구월동',
            title: '몽당케이크 후기',
            content:
                '오늘은 몽당케이크 후기입니다 🙂 너무나부터 오랜만에 내타났죠... 😆 제가 작년에 줄설 수술한 분분 나시 2개를 제가 수술을 하고 회복하다가저저도 동응까지 실패해서 2주 정도 도 동응 치료를 받느라 계속 병원에 잇었어요...',
            date: '2025.04.18',
            views: 238,
            comments: 12,
            image: '/images/cake.jpg',
            likes: 42,
        },
        {
            id: 2,
            category: '서울',
            subCategory: '강남',
            title: '스타벅스 리저브 방문기',
            content:
                '오늘은 강남에 새로 오픈한 스타벅스 리저브를 다녀왔습니다 🫧 입구부터 남다른 분위기가 느껴지더라구요. 1층은 일반 스타벅스와 비슷한데, 2층 리저브 공간이 정말 특별했어요...',
            date: '2025.04.16',
            views: 412,
            comments: 24,
            image: '/images/starbucks.jpg',
            likes: 89,
        },
        {
            id: 3,
            category: '부산',
            subCategory: '해운대',
            title: '더베이 101 야경 투어',
            content:
                '부산 여행 마지막 날, 더베이 101에서 야경을 즐겼습니다 🌃 해안대의 반비치와 마린시티의 화려한 불빛이 어우러진 도움이 정말 환상적이었어요. 1층 푸드코트에서 맛있는 음식도 즐기고, 2층 루프탑에서 커피 한 잔과 함께 여유로운 시간을 보냈습니다...',
            date: '2025.04.15',
            views: 567,
            comments: 45,
            image: '/images/busan.jpg',
            likes: 156,
        },
        {
            id: 4,
            category: '카페',
            subCategory: '선릉하기',
            title: '신라명과 서브레쿠키 후기',
            content:
                '오늘은 신라명과 새 가게 앞 서브레쿠키 후기입니다 😊 제가 작년에 만난 언니에게 커피 선물을 받았는데 너무 맛있고 고급스러워서 미용에 제품이에요~ 신라 명과에서 나온 새거지만 서브레쿠키남니다더스 포장부터 고급진 느낌이라 가격에 놀졸 것 같아요...',
            date: '2025.04.17',
            views: 156,
            comments: 8,
            image: '/images/cookie.jpg',
            likes: 35,
        },
        {
            id: 5,
            category: '도서',
            subCategory: '독서모임',
            title: '4월 독서모임 - 달러구트 꿈 백화점',
            content:
                '이번 달 독서모임에서는 달러구트 꿈 백화점을 읽었습니다 📚 꿈을 사고파는 특별한 백화점이라는 독특한 설정이 인상적이었어요. 모임에서 각자의 꿈 이야기를 나누며 즐거운 시간을 보냈습니다...',
            date: '2025.04.14',
            views: 342,
            comments: 28,
            image: '/images/book-club.jpg',
            likes: 67,
        },
        {
            id: 6,
            category: '도서',
            subCategory: '서평',
            title: '미드나잇 라이브러리 서평',
            content:
                '매트 헤이그의 미드나잇 라이브러리를 완독했습니다 🌙 삶과 죽음의 경계에 있는 도서관에서 다양한 가능성의 삶을 체험하는 노라의 이야기가 깊은 여운을 남겼어요. 특히 후회와 선택에 대한 작가의 통찰이 인상적이었습니다...',
            date: '2025.04.13',
            views: 289,
            comments: 15,
            image: '/images/midnight-library.jpg',
            likes: 92,
        },
        {
            id: 7,
            category: '도서',
            subCategory: '북카페',
            title: '성수동 책방거리 투어',
            content:
                '오늘은 성수동 책방거리를 둘러보았습니다 📚 아담한 독립서점부터 분위기 좋은 북카페까지, 책을 좋아하는 사람들을 위한 공간이 정말 많더라구요. 특히 땡스북스의 큐레이션이 인상적이었습니다...',
            date: '2025.04.12',
            views: 423,
            comments: 32,
            image: '/images/bookstore.jpg',
            likes: 88,
        },
        {
            id: 8,
            category: '도서',
            subCategory: '전자책',
            title: '리디북스 한달 사용기',
            content:
                '리디북스 전자책 구독 서비스를 한 달간 이용해봤습니다 📱 통근 시간에 가볍게 읽을 수 있다는 점이 가장 큰 장점이었어요. 종이책과는 또 다른 매력이 있네요. 특히 밤에 불 끄고 읽기 좋았습니다...',
            date: '2025.04.11',
            views: 267,
            comments: 19,
            image: '/images/ebook.jpg',
            likes: 45,
        },
    ])

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">독서후기</h1>
            <div className="text-gray-600 mb-8">24개의 글글</div>

            <div className="space-y-6">
                {posts.map((post) => (
                    <div
                        key={post.id}
                        className="border-b pb-6 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => router.push(`/detail/${post.id}`)}
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <h2 className="text-lg font-bold mb-2">
                                    [{post.category}/{post.subCategory}] {post.title}
                                </h2>
                                <p className="text-gray-600 mb-2 line-clamp-2">{post.content}</p>
                                <div className="flex items-center text-sm text-gray-500">
                                    <span>{post.date}</span>
                                    <span className="mx-2">•</span>
                                    <span>조회 {post.views}</span>
                                    <span className="mx-2">•</span>
                                    <span>댓글 {post.comments}</span>
                                </div>
                            </div>
                            <div className="ml-4">
                                <img src={post.image} alt={post.title} className="w-24 h-24 object-cover rounded-lg" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 페이지네이션 */}
            <div className="flex justify-center mt-8 space-x-2">
                <button className="p-2">&lt;</button>
                {[1, 2, 3, 4, 5].map((num) => (
                    <button
                        key={num}
                        className={`w-8 h-8 rounded-full ${
                            num === 1 ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        {num}
                    </button>
                ))}
                <button className="p-2">&gt;</button>
            </div>
        </div>
    )
}
