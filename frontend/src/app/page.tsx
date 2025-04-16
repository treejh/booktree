"use client";

export default function Home() {
  console.log(process.env.NEXT_PUBLIC_API_BASE_URL);

  return (
    <div className="container mx-auto px-4 py-4">
      <header className="flex items-center justify-between py-3 mb-6">
        <div className="flex items-center">
          <img
            src="https://booktree-s3-bucket.s3.ap-northeast-2.amazonaws.com/BookTree.png"
            alt="책 아이콘"
            className="w-6 h-6 mr-2"
          />
          <h1 className="text-xl font-bold">BookTree</h1>
        </div>
        <div className="flex items-center">
          <div className="relative mr-4">
            <div className="flex border rounded-md">
              <button className="px-3 py-1 text-sm border-r">전체</button>
              <input
                type="text"
                placeholder="게시물을 검색하기"
                className="px-3 py-1 w-64 focus:outline-none"
              />
              <button className="px-3">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
          <button
            className="px-4 py-2 mr-2 text-sm border rounded-md hover:bg-gray-50"
            onClick={() => {
              window.location.href = "/login";
            }}
          >
            로그인
          </button>
          <button
            className="px-4 py-2 text-sm text-white bg-green-600 rounded-md hover:bg-green-700"
            onClick={() => {
              window.location.href = "/signup";
            }}
          >
            회원가입
          </button>
        </div>
      </header>

      <div className="grid grid-cols-6 gap-3 mb-6">
        <a
          href="http://localhost:3000/api/v1/maincategories/get/1"
          className="py-4 bg-gray-100 rounded-md text-center hover:bg-gray-200"
        >
          소설
        </a>
        <a
          href="http://localhost:3000/api/v1/maincategories/get/2"
          className="py-4 bg-gray-100 rounded-md text-center hover:bg-gray-200"
        >
          자기계발서
        </a>
        <a
          href="http://localhost:3000/api/v1/maincategories/get/3"
          className="py-4 bg-gray-100 rounded-md text-center hover:bg-gray-200"
        >
          공부/자격
        </a>
        <a
          href="http://localhost:3000/api/v1/maincategories/get/4"
          className="py-4 bg-gray-100 rounded-md text-center hover:bg-gray-200"
        >
          예체이/힐링
        </a>
        <a
          href="http://localhost:3000/api/v1/maincategories/get/5"
          className="py-4 bg-gray-100 rounded-md text-center hover:bg-gray-200"
        >
          실용/취미
        </a>
        <a
          href="http://localhost:3000/api/v1/maincategories/get/6"
          className="py-4 bg-gray-100 rounded-md text-center hover:bg-gray-200"
        >
          IT/컴퓨터
        </a>
      </div>

      <div className="w-full h-80 rounded-lg overflow-hidden mb-12">
        <img
          src="https://images.unsplash.com/photo-1507842217343-583bb7270b66"
          alt="도서관 이미지"
          className="w-full h-full object-cover"
        />
      </div>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-6">인기 게시물</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a
            href="/detail/1"
            className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
          >
            <div className="relative h-60 bg-gray-200">
              <img
                src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c"
                alt="책 이미지"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-md">
                소설
              </span>
              <h3 className="font-medium mt-2">
                2024년 책 읽기 좋은 장소 추천
              </h3>
              <p className="text-xs text-gray-500 mt-1">조회수 1,234</p>
            </div>
          </a>

          <div className="rounded-lg overflow-hidden shadow-sm">
            <div className="relative h-60 bg-gray-200">
              <img
                src="https://images.unsplash.com/photo-1512820790803-83ca734da794"
                alt="책 이미지"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-md">
                자기계발서
              </span>
              <h3 className="font-medium mt-2">성공하는 습관의 비밀</h3>
              <p className="text-xs text-gray-500 mt-1">조회수 987</p>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden shadow-sm">
            <div className="relative h-60 bg-gray-200">
              <img
                src="https://images.unsplash.com/photo-1599008633840-052c7f756385"
                alt="책상 이미지"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-md">
                공부/자격
              </span>
              <h3 className="font-medium mt-2">효율적인 학습법 가이드</h3>
              <p className="text-xs text-gray-500 mt-1">조회수 856</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">카테고리별 인기 게시물</h2>
        <div className="border-b mb-6">
          <ul className="flex space-x-6">
            <li className="border-b-2 border-black pb-2">
              <a href="#" className="font-medium">
                소설
              </a>
            </li>
            <li className="pb-2">
              <a href="#">자기계발서</a>
            </li>
            <li className="pb-2">
              <a href="#">공부/자격</a>
            </li>
            <li className="pb-2">
              <a href="#">예체이/힐링</a>
            </li>
            <li className="pb-2">
              <a href="#">실용/취미</a>
            </li>
            <li className="pb-2">
              <a href="#">IT/컴퓨터</a>
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="rounded-lg overflow-hidden shadow-sm">
            <div className="relative h-48 bg-gray-200">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxBw75olVQ3ArdIwG17A7Qi26D3TSNEqCztA&s"
                alt="밤의 이미지"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium">월간 인기 소설</h3>
              <p className="text-xs text-gray-500 mt-1">월간 조회수 5,678</p>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden shadow-sm">
            <div className="relative h-48 bg-gray-200">
              <img
                src="https://images.unsplash.com/photo-1517048676732-d65bc937f952"
                alt="모임 이미지"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium">이달의 자기계발</h3>
              <p className="text-xs text-gray-500 mt-1">월간 조회수 4,321</p>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden shadow-sm">
            <div className="relative h-48 bg-gray-200">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644"
                alt="학생들 이미지"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium">이달의 학습서</h3>
              <p className="text-xs text-gray-500 mt-1">월간 조회수 3,987</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-lg overflow-hidden shadow-sm">
            <div className="relative h-48 bg-gray-200">
              <img
                src="https://images.unsplash.com/photo-1543002588-bfa74002ed7e"
                alt="독서 공간"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium">이달의 예체이</h3>
              <p className="text-xs text-gray-500 mt-1">월간 조회수 3,654</p>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden shadow-sm">
            <div className="relative h-48 bg-gray-200">
              <img
                src="https://images.unsplash.com/photo-1513542789411-b6a5d4f31634"
                alt="취미 이미지"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium">이달의 취미</h3>
              <p className="text-xs text-gray-500 mt-1">월간 조회수 3,245</p>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden shadow-sm">
            <div className="relative h-48 bg-gray-200">
              <img
                src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97"
                alt="코딩 이미지"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium">이달의 IT</h3>
              <p className="text-xs text-gray-500 mt-1">월간 조회수 2,987</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
