'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const CategoryPage = () => {
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
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">자기계발서</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-grow">
          <h2 className="text-xl font-semibold mb-4">최신순</h2>
          
          <div className="space-y-6">
            {featuredBooks.map((book) => (
              <div key={book.id} className="flex border rounded-lg p-4 gap-4">
                <div className="w-32 h-40 relative flex-shrink-0">
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
        
        <div className="lg:w-80">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-medium mb-4">인기 자기계발서 게시글 TOP 5</h2>
            
            <div className="space-y-2">
              {topBooks.map((book) => (
                <div key={book.id} className="flex items-center gap-2">
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

export default CategoryPage;
