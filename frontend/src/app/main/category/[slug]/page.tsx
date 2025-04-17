'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import CategoryNav from '@/app/components/CategoryNav';

// 카테고리별 데이터 (실제로는 API에서 가져올 것입니다)
const categoryData = {
  novel: [
    {
      id: 101,
      title: '월간 인기 소설',
      views: '5,678',
      imageUrl: 'https://booktree-s3-bucket.s3.ap-northeast-2.amazonaws.com/BookTree+%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB+%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5+%E1%84%8E%E1%85%AC%E1%84%8C%E1%85%A9%E1%86%BC%E1%84%87%E1%85%A9%E1%86%AB.png'
    },
    {
      id: 102,
      title: '판타지 소설 추천',
      views: '4,892',
      imageUrl: 'https://booktree-s3-bucket.s3.ap-northeast-2.amazonaws.com/BookTree+%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB+%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5+%E1%84%8E%E1%85%AC%E1%84%8C%E1%85%A9%E1%86%BC%E1%84%87%E1%85%A9%E1%86%AB.png'
    },
    {
      id: 103,
      title: '로맨스 소설 베스트',
      views: '4,231',
      imageUrl: 'https://booktree-s3-bucket.s3.ap-northeast-2.amazonaws.com/BookTree+%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB+%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5+%E1%84%8E%E1%85%AC%E1%84%8C%E1%85%A9%E1%86%BC%E1%84%87%E1%85%A9%E1%86%AB.png'
    },
    {
      id: 104,
      title: '미스터리 스릴러 추천',
      views: '3,986',
      imageUrl: 'https://booktree-s3-bucket.s3.ap-northeast-2.amazonaws.com/BookTree+%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB+%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5+%E1%84%8E%E1%85%AC%E1%84%8C%E1%85%A9%E1%86%BC%E1%84%87%E1%85%A9%E1%86%AB.png'
    },
    {
      id: 105,
      title: '고전 문학 명작선',
      views: '3,678',
      imageUrl: 'https://booktree-s3-bucket.s3.ap-northeast-2.amazonaws.com/BookTree+%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB+%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5+%E1%84%8E%E1%85%AC%E1%84%8C%E1%85%A9%E1%86%BC%E1%84%87%E1%85%A9%E1%86%AB.png'
    }
  ],
  'self-development': [
    {
      id: 201,
      title: '이달의 자기계발',
      views: '4,321',
      imageUrl: 'https://booktree-s3-bucket.s3.ap-northeast-2.amazonaws.com/BookTree+%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB+%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5+%E1%84%8E%E1%85%AC%E1%84%8C%E1%85%A9%E1%86%BC%E1%84%87%E1%85%A9%E1%86%AB.png'
    },
    {
      id: 202,
      title: '습관 형성의 기술',
      views: '3,987',
      imageUrl: 'https://booktree-s3-bucket.s3.ap-northeast-2.amazonaws.com/BookTree+%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB+%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5+%E1%84%8E%E1%85%AC%E1%84%8C%E1%85%A9%E1%86%BC%E1%84%87%E1%85%A9%E1%86%AB.png'
    },
    {
      id: 203,
      title: '시간 관리의 비결',
      views: '3,854',
      imageUrl: 'https://booktree-s3-bucket.s3.ap-northeast-2.amazonaws.com/BookTree+%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB+%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5+%E1%84%8E%E1%85%AC%E1%84%8C%E1%85%A9%E1%86%BC%E1%84%87%E1%85%A9%E1%86%AB.png'
    },
    {
      id: 204,
      title: '마인드셋 변화 가이드',
      views: '3,642',
      imageUrl: 'https://booktree-s3-bucket.s3.ap-northeast-2.amazonaws.com/BookTree+%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB+%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5+%E1%84%8E%E1%85%AC%E1%84%8C%E1%85%A9%E1%86%BC%E1%84%87%E1%85%A9%E1%86%AB.png'
    },
    {
      id: 205,
      title: '리더십 함양 전략',
      views: '3,421',
      imageUrl: 'https://booktree-s3-bucket.s3.ap-northeast-2.amazonaws.com/BookTree+%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB+%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5+%E1%84%8E%E1%85%AC%E1%84%8C%E1%85%A9%E1%86%BC%E1%84%87%E1%85%A9%E1%86%AB.png'
    }
  ],
  study: [
    {
      id: 301,
      title: '이달의 학술서',
      views: '3,987',
      imageUrl: 'https://booktree-s3-bucket.s3.ap-northeast-2.amazonaws.com/BookTree+%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB+%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5+%E1%84%8E%E1%85%AC%E1%84%8C%E1%85%A9%E1%86%BC%E1%84%87%E1%85%A9%E1%86%AB.png'
    },
    {
      id: 302,
      title: '효과적인 공부법',
      views: '3,768',
      imageUrl: 'https://booktree-s3-bucket.s3.ap-northeast-2.amazonaws.com/BookTree+%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB+%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5+%E1%84%8E%E1%85%AC%E1%84%8C%E1%85%A9%E1%86%BC%E1%84%87%E1%85%A9%E1%86%AB.png'
    },
    {
      id: 303,
      title: '자격증 취득 가이드',
      views: '3,542',
      imageUrl: 'https://booktree-s3-bucket.s3.ap-northeast-2.amazonaws.com/BookTree+%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB+%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5+%E1%84%8E%E1%85%AC%E1%84%8C%E1%85%A9%E1%86%BC%E1%84%87%E1%85%A9%E1%86%AB.png'
    },
    {
      id: 304,
      title: '언어 학습의 비결',
      views: '3,421',
      imageUrl: 'https://booktree-s3-bucket.s3.ap-northeast-2.amazonaws.com/BookTree+%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB+%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5+%E1%84%8E%E1%85%AC%E1%84%8C%E1%85%A9%E1%86%BC%E1%84%87%E1%85%A9%E1%86%AB.png'
    },
    {
      id: 305,
      title: '수험 전략과 팁',
      views: '3,265',
      imageUrl: 'https://booktree-s3-bucket.s3.ap-northeast-2.amazonaws.com/BookTree+%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB+%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5+%E1%84%8E%E1%85%AC%E1%84%8C%E1%85%A9%E1%86%BC%E1%84%87%E1%85%A9%E1%86%AB.png'
    }
  ],
  essay: [
    {
      id: 401,
      title: '이달의 에세이',
      views: '3,654',
      imageUrl: 'https://booktree-s3-bucket.s3.ap-northeast-2.amazonaws.com/BookTree+%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB+%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5+%E1%84%8E%E1%85%AC%E1%84%8C%E1%85%A9%E1%86%BC%E1%84%87%E1%85%A9%E1%86%AB.png'
    },
    {
      id: 402,
      title: '일상의 소소한 기록',
      views: '3,521',
      imageUrl: 'https://booktree-s3-bucket.s3.ap-northeast-2.amazonaws.com/BookTree+%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB+%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5+%E1%84%8E%E1%85%AC%E1%84%8C%E1%85%A9%E1%86%BC%E1%84%87%E1%85%A9%E1%86%AB.png'
    },
    {
      id: 403,
      title: '여행자의 시선',
      views: '3,432',
      imageUrl: 'https://booktree-s3-bucket.s3.ap-northeast-2.amazonaws.com/BookTree+%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB+%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5+%E1%84%8E%E1%85%AC%E1%84%8C%E1%85%A9%E1%86%BC%E1%84%87%E1%85%A9%E1%86%AB.png'
    },
    {
      id: 404,
      title: '철학적 사색',
      views: '3,254',
      imageUrl: 'https://booktree-s3-bucket.s3.ap-northeast-2.amazonaws.com/BookTree+%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB+%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5+%E1%84%8E%E1%85%AC%E1%84%8C%E1%85%A9%E1%86%BC%E1%84%87%E1%85%A9%E1%86%AB.png'
    },
    {
      id: 405,
      title: '문화와 예술 비평',
      views: '3,187',
      imageUrl: 'https://booktree-s3-bucket.s3.ap-northeast-2.amazonaws.com/BookTree+%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB+%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5+%E1%84%8E%E1%85%AC%E1%84%8C%E1%85%A9%E1%86%BC%E1%84%87%E1%85%A9%E1%86%AB.png'
    }
  ],
  hobby: [
    {
      id: 501,
      title: '이달의 취미',
      views: '3,245',
      imageUrl: 'https://booktree-s3-bucket.s3.ap-northeast-2.amazonaws.com/BookTree+%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB+%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5+%E1%84%8E%E1%85%AC%E1%84%8C%E1%85%A9%E1%86%BC%E1%84%87%E1%85%A9%E1%86%AB.png'
    },
    {
      id: 502,
      title: 'DIY 홈 인테리어',
      views: '3,142',
      imageUrl: 'https://booktree-s3-bucket.s3.ap-northeast-2.amazonaws.com/BookTree+%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB+%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5+%E1%84%8E%E1%85%AC%E1%84%8C%E1%85%A9%E1%86%BC%E1%84%87%E1%85%A9%E1%86%AB.png'
    },
    {
      id: 503,
      title: '요리와 베이킹',
      views: '3,098',
      imageUrl: 'https://booktree-s3-bucket.s3.ap-northeast-2.amazonaws.com/BookTree+%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB+%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5+%E1%84%8E%E1%85%AC%E1%84%8C%E1%85%A9%E1%86%BC%E1%84%87%E1%85%A9%E1%86%AB.png'
    },
    {
      id: 504,
      title: '아웃도어 활동 가이드',
      views: '2,987',
      imageUrl: 'https://booktree-s3-bucket.s3.ap-northeast-2.amazonaws.com/BookTree+%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB+%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5+%E1%84%8E%E1%85%AC%E1%84%8C%E1%85%A9%E1%86%BC%E1%84%87%E1%85%A9%E1%86%AB.png'
    },
    {
      id: 505,
      title: '공예와 수공예',
      views: '2,876',
      imageUrl: 'https://booktree-s3-bucket.s3.ap-northeast-2.amazonaws.com/BookTree+%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB+%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5+%E1%84%8E%E1%85%AC%E1%84%8C%E1%85%A9%E1%86%BC%E1%84%87%E1%85%A9%E1%86%AB.png'
    }
  ],
  it: [
    {
      id: 601,
      title: '이달의 IT',
      views: '2,987',
      imageUrl: 'https://booktree-s3-bucket.s3.ap-northeast-2.amazonaws.com/BookTree+%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB+%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5+%E1%84%8E%E1%85%AC%E1%84%8C%E1%85%A9%E1%86%BC%E1%84%87%E1%85%A9%E1%86%AB.png'
    },
    {
      id: 602,
      title: '프로그래밍 입문',
      views: '2,876',
      imageUrl: 'https://booktree-s3-bucket.s3.ap-northeast-2.amazonaws.com/BookTree+%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB+%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5+%E1%84%8E%E1%85%AC%E1%84%8C%E1%85%A9%E1%86%BC%E1%84%87%E1%85%A9%E1%86%AB.png'
    },
    {
      id: 603,
      title: '최신 기술 트렌드',
      views: '2,765',
      imageUrl: 'https://booktree-s3-bucket.s3.ap-northeast-2.amazonaws.com/BookTree+%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB+%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5+%E1%84%8E%E1%85%AC%E1%84%8C%E1%85%A9%E1%86%BC%E1%84%87%E1%85%A9%E1%86%AB.png'
    },
    {
      id: 604,
      title: '앱 개발 가이드',
      views: '2,654',
      imageUrl: 'https://booktree-s3-bucket.s3.ap-northeast-2.amazonaws.com/BookTree+%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB+%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5+%E1%84%8E%E1%85%AC%E1%84%8C%E1%85%A9%E1%86%BC%E1%84%87%E1%85%A9%E1%86%AB.png'
    },
    {
      id: 605,
      title: '웹 개발 기초',
      views: '2,543',
      imageUrl: 'https://booktree-s3-bucket.s3.ap-northeast-2.amazonaws.com/BookTree+%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB+%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5+%E1%84%8E%E1%85%AC%E1%84%8C%E1%85%A9%E1%86%BC%E1%84%87%E1%85%A9%E1%86%AB.png'
    }
  ]
};

const CategoryDetailPage = () => {
  const params = useParams();
  const slug = params.slug as string;
  
  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 4; // 한 페이지당 표시할 게시물 수
  
  // 카테고리에 따른 타이틀 설정
  const getCategoryTitle = () => {
    switch(slug) {
      case 'novel': return '소설';
      case 'self-development': return '자기계발서';
      case 'study': return '공부/자격';
      case 'essay': return '에세이/일상';
      case 'hobby': return '실용/취미';
      case 'it': return 'IT/컴퓨터';
      default: return '모든 게시물';
    }
  };

  // 전체 게시물 데이터
  const featuredBooks = [
    {
      id: 1,
      title: '아침의 기적: 당신의 하루를 바꾸는 6분',
      description: '매일 아침 일찍 일어나 자신을 위한 시간을 가지는 것이 얼마나 중요한지 알려주는 책입니다. 6분 동안의 명상, 독서, 운동으로 하루를 시작하세요.',
      image: 'https://booktree-s3-bucket.s3.ap-northeast-2.amazonaws.com/BookTree+%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB+%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5+%E1%84%8E%E1%85%AC%E1%84%8C%E1%85%A9%E1%86%BC%E1%84%87%E1%85%A9%E1%86%AB.png',
    },
    {
      id: 2,
      title: '마인드셋: 성공하는 사람들의 사고방식',
      description: '성장 마인드셋과 고정 마인드셋의 차이를 통해 우리의 잠재력을 최대한 끌어올리는 방법을 배워보세요.',
      image: 'https://booktree-s3-bucket.s3.ap-northeast-2.amazonaws.com/BookTree+%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB+%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5+%E1%84%8E%E1%85%AC%E1%84%8C%E1%85%A9%E1%86%BC%E1%84%87%E1%85%A9%E1%86%AB.png',
    },
    {
      id: 3,
      title: '습관의 힘: 작은 변화가 만드는 큰 성과',
      description: '좋은 습관을 형성하고 나쁜 습관을 제거하는 방법을 통해 자신의 삶을 완전히 바꿀 수 있는 실질적인 방법을 소개합니다.',
      image: 'https://booktree-s3-bucket.s3.ap-northeast-2.amazonaws.com/BookTree+%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB+%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5+%E1%84%8E%E1%85%AC%E1%84%8C%E1%85%A9%E1%86%BC%E1%84%87%E1%85%A9%E1%86%AB.png',
    },
    {
      id: 4,
      title: '도전을 즐기다: 성공을 위한 마음가짐',
      description: '어려움에 직면했을 때 이를 기회로 바꾸는 방법과 실패를 성장의 기회로 삼는 마음가짐을 배워보세요.',
      image: 'https://booktree-s3-bucket.s3.ap-northeast-2.amazonaws.com/BookTree+%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB+%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5+%E1%84%8E%E1%85%AC%E1%84%8C%E1%85%A9%E1%86%BC%E1%84%87%E1%85%A9%E1%86%AB.png',
    },
    {
      id: 5,
      title: '목표 달성의 비밀: 당신의 꿈을 현실로',
      description: '명확한 목표 설정과 실행 계획을 통해 자신의 꿈을 현실로 만드는 구체적인 방법론을 다룹니다.',
      image: 'https://booktree-s3-bucket.s3.ap-northeast-2.amazonaws.com/BookTree+%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB+%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5+%E1%84%8E%E1%85%AC%E1%84%8C%E1%85%A9%E1%86%BC%E1%84%87%E1%85%A9%E1%86%AB.png',
    },
    {
      id: 6,
      title: '시간 관리의 달인: 하루 24시간을 최대한 활용하기',
      description: '바쁜 일상 속에서 시간을 효율적으로 사용하여 더 많은 성과를 내는 방법을 알려줍니다.',
      image: 'https://booktree-s3-bucket.s3.ap-northeast-2.amazonaws.com/BookTree+%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB+%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5+%E1%84%8E%E1%85%AC%E1%84%8C%E1%85%A9%E1%86%BC%E1%84%87%E1%85%A9%E1%86%AB.png',
    },
    {
      id: 7,
      title: '자신감의 비밀: 내면의 힘을 키우는 방법',
      description: '자신감을 키우고 두려움을 극복하여 원하는 것을 성취하는 실질적인 방법을 다룹니다.',
      image: 'https://booktree-s3-bucket.s3.ap-northeast-2.amazonaws.com/BookTree+%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB+%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5+%E1%84%8E%E1%85%AC%E1%84%8C%E1%85%A9%E1%86%BC%E1%84%87%E1%85%A9%E1%86%AB.png',
    },
    {
      id: 8,
      title: '성공하는 리더의 조건: 영향력 있는 리더가 되는 법',
      description: '팀을 이끌고 영향력을 행사하는 진정한 리더십의 비밀을 공유합니다.',
      image: 'https://booktree-s3-bucket.s3.ap-northeast-2.amazonaws.com/BookTree+%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB+%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5+%E1%84%8E%E1%85%AC%E1%84%8C%E1%85%A9%E1%86%BC%E1%84%87%E1%85%A9%E1%86%AB.png',
    },
    {
      id: 9,
      title: '감정 지능 키우기: 인간관계의 핵심',
      description: '자신과 타인의 감정을 이해하고 조절하는 능력을 키워 더 나은 인간관계를 형성하는 방법을 알아봅니다.',
      image: 'https://booktree-s3-bucket.s3.ap-northeast-2.amazonaws.com/BookTree+%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB+%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5+%E1%84%8E%E1%85%AC%E1%84%8C%E1%85%A9%E1%86%BC%E1%84%87%E1%85%A9%E1%86%AB.png',
    },
    {
      id: 10,
      title: '창의적 사고의 기술: 혁신적인 아이디어 발상법',
      description: '고정관념을 깨고 새로운 시각으로 문제를 바라보는 창의적 사고 방식을 배웁니다.',
      image: 'https://booktree-s3-bucket.s3.ap-northeast-2.amazonaws.com/BookTree+%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB+%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5+%E1%84%8E%E1%85%AC%E1%84%8C%E1%85%A9%E1%86%BC%E1%84%87%E1%85%A9%E1%86%AB.png',
    },
    {
      id: 11,
      title: '명상과 마음챙김: 현대인의 필수 습관',
      description: '바쁜 일상에서 내면의 평화를 찾고 스트레스를 줄이는 명상과 마음챙김 기법을 소개합니다.',
      image: 'https://booktree-s3-bucket.s3.ap-northeast-2.amazonaws.com/BookTree+%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB+%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5+%E1%84%8E%E1%85%AC%E1%84%8C%E1%85%A9%E1%86%BC%E1%84%87%E1%85%A9%E1%86%AB.png',
    },
    {
      id: 12,
      title: '재정 관리의 지혜: 부자가 되는 사고방식',
      description: '돈에 대한 올바른 관점과 현명한 재정 관리로 경제적 자유를 얻는 방법을 알려줍니다.',
      image: 'https://booktree-s3-bucket.s3.ap-northeast-2.amazonaws.com/BookTree+%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB+%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5+%E1%84%8E%E1%85%AC%E1%84%8C%E1%85%A9%E1%86%BC%E1%84%87%E1%85%A9%E1%86%AB.png',
    }
  ];
  
  // 현재 페이지에 표시할 게시물
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = featuredBooks.slice(indexOfFirstBook, indexOfLastBook);
  
  // 페이지 변경 핸들러
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  // 인기 게시글 데이터
  const popularBooks = categoryData[slug as keyof typeof categoryData] || [];

  return (
    <div className="w-full">
      <CategoryNav currentSlug={slug} />
      
      <h1 className="text-3xl font-bold mb-8 mt-6">{getCategoryTitle()}</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-grow lg:w-2/3">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-6">최신순</h2>
            
            <div className="grid grid-cols-1 gap-6">
              {currentBooks.map((book) => (
                <Link href={`/post/${book.id}`} key={book.id} className="block">
                  <div className="flex border border-gray-100 rounded-lg p-4 gap-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="w-24 h-32 relative flex-shrink-0">
                      <Image 
                        src={book.image} 
                        alt={book.title}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">{book.title}</h3>
                      <p className="text-gray-600 text-sm">{book.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center mt-8 mb-8">
            {Array.from({ length: Math.ceil(featuredBooks.length / booksPerPage) }, (_, i) => (
              <button 
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={`w-10 h-10 border border-gray-200 rounded flex items-center justify-center mr-2 ${
                  currentPage === i + 1 ? 'bg-[#2E804E] text-white' : 'hover:bg-gray-100'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
        
        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-4">인기 {getCategoryTitle()} 게시글 TOP 5</h2>
            
            <div className="space-y-0">
              {popularBooks.map((book, index) => (
                <Link href={`/post/${book.id}`} key={index} className="block">
                  <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer border-b border-gray-100">
                    <div className="w-6 h-6 rounded-full bg-[#2E804E] text-white flex items-center justify-center text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <span className="block text-sm font-medium">{book.title}</span>
                      <span className="text-xs text-gray-500">조회수 {book.views}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetailPage; 