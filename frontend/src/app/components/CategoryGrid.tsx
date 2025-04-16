import { useState } from 'react';
import CategoryBox from './CategoryBox';
import CategoryTabs from './CategoryTabs';

// 카테고리별 데이터
const categoryData = {
  novel: [
    {
      title: '월간 인기 소설',
      views: '5,678',
      imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c',
      href: '/novels'
    },
    {
      title: '판타지 소설 추천',
      views: '4,892',
      imageUrl: 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d',
      href: '/novels/fantasy'
    },
    {
      title: '로맨스 소설 베스트',
      views: '4,231',
      imageUrl: 'https://images.unsplash.com/photo-1474932430478-367dbb6832c1',
      href: '/novels/romance'
    },
    {
      title: '미스터리 스릴러 추천',
      views: '3,986',
      imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794',
      href: '/novels/thriller'
    },
    {
      title: '고전 문학 명작선',
      views: '3,678',
      imageUrl: 'https://images.unsplash.com/photo-1533327325824-76bc4e62d560',
      href: '/novels/classic'
    },
    {
      title: 'SF 소설 인기작',
      views: '3,421',
      imageUrl: 'https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14',
      href: '/novels/sf'
    }
  ],
  'self-development': [
    {
      title: '이달의 자기계발',
      views: '4,321',
      imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952',
      href: '/self-development'
    },
    {
      title: '습관 형성의 기술',
      views: '3,987',
      imageUrl: 'https://images.unsplash.com/photo-1541167760496-1628856ab772',
      href: '/self-development/habits'
    },
    {
      title: '시간 관리의 비결',
      views: '3,854',
      imageUrl: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe',
      href: '/self-development/time'
    },
    {
      title: '마인드셋 변화 가이드',
      views: '3,642',
      imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173',
      href: '/self-development/mindset'
    },
    {
      title: '리더십 함양 전략',
      views: '3,421',
      imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
      href: '/self-development/leadership'
    },
    {
      title: '성공적인 대인관계',
      views: '3,286',
      imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216',
      href: '/self-development/relationships'
    }
  ],
  study: [
    {
      title: '이달의 학술서',
      views: '3,987',
      imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644',
      href: '/academic'
    },
    {
      title: '효과적인 공부법',
      views: '3,768',
      imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b',
      href: '/academic/study-methods'
    },
    {
      title: '자격증 취득 가이드',
      views: '3,542',
      imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173',
      href: '/academic/certifications'
    },
    {
      title: '언어 학습의 비결',
      views: '3,421',
      imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d',
      href: '/academic/languages'
    },
    {
      title: '수험 전략과 팁',
      views: '3,265',
      imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',
      href: '/academic/exam-tips'
    },
    {
      title: '학술 논문 작성법',
      views: '3,142',
      imageUrl: 'https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3',
      href: '/academic/papers'
    }
  ],
  essay: [
    {
      title: '이달의 에세이',
      views: '3,654',
      imageUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e',
      href: '/essay'
    },
    {
      title: '일상의 소소한 기록',
      views: '3,521',
      imageUrl: 'https://images.unsplash.com/photo-1530021232320-687d8e3dba54',
      href: '/essay/daily'
    },
    {
      title: '여행자의 시선',
      views: '3,432',
      imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470',
      href: '/essay/travel'
    },
    {
      title: '철학적 사색',
      views: '3,254',
      imageUrl: 'https://images.unsplash.com/photo-1429734160945-4f85244d6a5a',
      href: '/essay/philosophy'
    },
    {
      title: '문화와 예술 비평',
      views: '3,187',
      imageUrl: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b',
      href: '/essay/culture'
    },
    {
      title: '개인적 성찰의 글',
      views: '3,076',
      imageUrl: 'https://images.unsplash.com/photo-1483389127117-b6a2102724ae',
      href: '/essay/reflection'
    }
  ],
  hobby: [
    {
      title: '이달의 취미',
      views: '3,245',
      imageUrl: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634',
      href: '/hobby'
    },
    {
      title: 'DIY 홈 인테리어',
      views: '3,142',
      imageUrl: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126',
      href: '/hobby/diy'
    },
    {
      title: '요리와 베이킹',
      views: '3,098',
      imageUrl: 'https://images.unsplash.com/photo-1556911220-bff31c812dba',
      href: '/hobby/cooking'
    },
    {
      title: '아웃도어 활동 가이드',
      views: '2,987',
      imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306',
      href: '/hobby/outdoor'
    },
    {
      title: '공예와 수공예',
      views: '2,876',
      imageUrl: 'https://images.unsplash.com/photo-1547333590-47fae5f58d21',
      href: '/hobby/crafts'
    },
    {
      title: '그림과 드로잉',
      views: '2,765',
      imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f',
      href: '/hobby/drawing'
    }
  ],
  it: [
    {
      title: '이달의 IT',
      views: '2,987',
      imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
      href: '/it'
    },
    {
      title: '프로그래밍 입문',
      views: '2,876',
      imageUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4',
      href: '/it/programming'
    },
    {
      title: '최신 기술 트렌드',
      views: '2,765',
      imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
      href: '/it/trends'
    },
    {
      title: '앱 개발 가이드',
      views: '2,654',
      imageUrl: 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6',
      href: '/it/app-development'
    },
    {
      title: '웹 개발 기초',
      views: '2,543',
      imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
      href: '/it/web-development'
    },
    {
      title: '데이터 사이언스 입문',
      views: '2,432',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
      href: '/it/data-science'
    }
  ]
};

const CategoryGrid = () => {
  const [activeTab, setActiveTab] = useState('novel');

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // 현재 선택된 탭의 데이터 표시
  const currentData = categoryData[activeTab as keyof typeof categoryData] || [];

  return (
    <div>
      <CategoryTabs activeTab={activeTab} onTabChange={handleTabChange} />
      <div className="bg-white rounded-b-lg p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentData.map((item, index) => (
            <CategoryBox
              key={index}
              title={item.title}
              views={item.views}
              imageUrl={item.imageUrl}
              href={item.href}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryGrid; 