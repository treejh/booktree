'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const CategoryDetailPage = () => {
  const params = useParams();
  const slug = params.slug as string;
  
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

  const topBooks = [
    { id: 1, title: '원하는 것을 얻는 기술' },
    { id: 2, title: '습관의 힘' },
    { id: 3, title: '성장하는 힘' },
    { id: 4, title: '미라클 모닝' },
    { id: 5, title: '최고의 나를 만드는 방법' },
  ];

  const featuredBooks = [
    {
      id: 1,
      title: '아침의 기적: 당신의 하루를 바꾸는 6분',
      description: '매일 아침 일찍 일어나 자신을 위한 시간을 가지는 것이 얼마나 중요한지 알려주는 책입니다. 6분 동안의 명상, 독서, 운동으로 하루를 시작하세요.',
      image: '/images/book1.jpg',
    },
    {
      id: 2,
      title: '마인드셋: 성공하는 사람들의 사고방식',
      description: '성장 마인드셋과 고정 마인드셋의 차이를 통해 우리의 잠재력을 최대한 끌어올리는 방법을 배워보세요.',
      image: '/images/book2.jpg',
    },
    {
      id: 3,
      title: '습관의 힘: 작은 변화가 만드는 큰 성과',
      description: '좋은 습관을 형성하고 나쁜 습관을 제거하는 방법을 통해 자신의 삶을 완전히 바꿀 수 있는 실질적인 방법을 소개합니다.',
      image: '/images/book1.jpg',
    },
    {
      id: 4,
      title: '도전을 즐기다: 성공을 위한 마음가짐',
      description: '어려움에 직면했을 때 이를 기회로 바꾸는 방법과 실패를 성장의 기회로 삼는 마음가짐을 배워보세요.',
      image: '/images/book2.jpg',
    },
    {
      id: 5,
      title: '목표 달성의 비밀: 당신의 꿈을 현실로',
      description: '명확한 목표 설정과 실행 계획을 통해 자신의 꿈을 현실로 만드는 구체적인 방법론을 다룹니다.',
      image: '/images/book1.jpg',
    },
    {
      id: 6,
      title: '시간 관리의 달인: 하루 24시간을 최대한 활용하기',
      description: '바쁜 일상 속에서 시간을 효율적으로 사용하여 더 많은 성과를 내는 방법을 알려줍니다.',
      image: '/images/book2.jpg',
    },
    {
      id: 7,
      title: '자신감의 비밀: 내면의 힘을 키우는 방법',
      description: '자신감을 키우고 두려움을 극복하여 원하는 것을 성취하는 실질적인 방법을 다룹니다.',
      image: '/images/book1.jpg',
    },
    {
      id: 8,
      title: '성공하는 리더의 조건: 영향력 있는 리더가 되는 법',
      description: '팀을 이끌고 영향력을 행사하는 진정한 리더십의 비밀을 공유합니다.',
      image: '/images/book2.jpg',
    },
  ];

  return (
    <div className="w-full px-5 py-4">
      <div className="flex flex-wrap gap-2 mb-6">
        <Link 
          href="/main/category/novel"
          className={`py-2 px-6 bg-white rounded-md text-center hover:bg-gray-100 border border-gray-200 shadow-sm flex-1 min-w-24 text-sm ${slug === 'novel' ? 'border-black font-medium' : ''}`}
        >
          소설
        </Link>
        <Link 
          href="/main/category/self-development"
          className={`py-2 px-6 bg-white rounded-md text-center hover:bg-gray-100 border border-gray-200 shadow-sm flex-1 min-w-24 text-sm ${slug === 'self-development' ? 'border-black font-medium' : ''}`}
        >
          자기계발서
        </Link>
        <Link 
          href="/main/category/study"
          className={`py-2 px-6 bg-white rounded-md text-center hover:bg-gray-100 border border-gray-200 shadow-sm flex-1 min-w-24 text-sm ${slug === 'study' ? 'border-black font-medium' : ''}`}
        >
          공부/자격
        </Link>
        <Link 
          href="/main/category/essay"
          className={`py-2 px-6 bg-white rounded-md text-center hover:bg-gray-100 border border-gray-200 shadow-sm flex-1 min-w-24 text-sm ${slug === 'essay' ? 'border-black font-medium' : ''}`}
        >
          에세이/일상
        </Link>
        <Link 
          href="/main/category/hobby"
          className={`py-2 px-6 bg-white rounded-md text-center hover:bg-gray-100 border border-gray-200 shadow-sm flex-1 min-w-24 text-sm ${slug === 'hobby' ? 'border-black font-medium' : ''}`}
        >
          실용/취미
        </Link>
        <Link 
          href="/main/category/it"
          className={`py-2 px-6 bg-white rounded-md text-center hover:bg-gray-100 border border-gray-200 shadow-sm flex-1 min-w-24 text-sm ${slug === 'it' ? 'border-black font-medium' : ''}`}
        >
          IT/컴퓨터
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-8">{getCategoryTitle()}</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-grow">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-6">최신순</h2>
            
            <div className="grid grid-cols-1 gap-6">
              {featuredBooks.map((book) => (
                <div key={book.id} className="flex border border-gray-100 rounded-lg p-4 gap-4 hover:shadow-md transition-shadow">
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
              ))}
            </div>
            
            <div className="flex justify-center mt-8 gap-2">
              <button className="w-10 h-10 border rounded flex items-center justify-center bg-gray-800 text-white">1</button>
              <button className="w-10 h-10 border rounded flex items-center justify-center">2</button>
              <button className="w-10 h-10 border rounded flex items-center justify-center">3</button>
            </div>
          </div>
        </div>
        
        <div className="lg:w-80">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-4">인기 {getCategoryTitle()} 게시글 TOP 5</h2>
            
            <div className="space-y-3">
              {topBooks.map((book) => (
                <div key={book.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md">
                  <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-sm">
                    {book.id}
                  </div>
                  <span>{book.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetailPage; 