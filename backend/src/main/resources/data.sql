INSERT INTO ROLES (id, role, created_at, last_modified_AT)
VALUES (1, 'USER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO ROLES (id, role, created_at, last_modified_AT)
VALUES (2, 'ADMIN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 사용자 추가
INSERT INTO users (id,role_id, email, password, phone_number, username) VALUES
                                                                         (1, 1, 'example@example.com', 'password123', '010-8574-5678', 'exampleUser'),
                                                                         (2, 1, 'example1@example.com', 'password123', '010-2355-5678', 'exampleUser1'),
                                                                         (3, 1, 'example2@example.com', 'password123', '010-2354-5678', 'exampleUser2'),
                                                                         (4, 1, 'example3@example.com', 'password123', '010-2356-5678', 'exampleUser3');

-- 카테고리 추가
INSERT INTO categories (id, name, user_id) VALUES
                                               (1, '카테고리1', 1),
                                               (2, '카테고리2', 1),
                                               (3, '카테고리3', 1),
                                               (4, '카테고리4', 1);


--main 카테고리 추가
INSERT INTO main_categories (
    id,
    name,
    created_at,
    last_modified_at
) VALUES (
             1,
             '자기계발',
             NOW(),
             NOW()
         );

--블로그 추가
INSERT INTO blogs (
    id,
    user_id,
    name,
    profile,
    notice,
    created_at,
    last_modified_at
) VALUES (
             2, -- 블로그 ID
             3, -- user_id (user 테이블에 있는 ID)
             '서연의 독서일기',
             '하루 한 권, 책으로 성장하는 블로그입니다.',
             '리뷰 요청은 댓글로 남겨주세요 :)',
             NOW(),
             NOW()
         );

--게시글 추가

INSERT INTO posts (
    id,
    main_category_id,
    blog_id,
    user_id,
    title,
    content,
    author,
    book,
    created_at,
    last_modified_at,
    view,
    category_id
) VALUES (
             1,                -- 게시글 ID (생략 가능하면 AUTO_INCREMENT)
             1,                -- main_category_id (외래키)
             2,                -- blog_id (외래키)
             1,                -- user_id (외래키)
             '좋은 글 제목',     -- title
             '이 책을 읽고 많은 걸 느꼈어요.', -- content
             'dose',          -- author
             '미움받을 용기',   -- book
             NOW(),            -- created_at
             NOW(),            -- modified_at
             0,                -- view
             1                 -- category_id (외래키)
         );


-- 포스트
INSERT INTO posts (
    main_category_id,
    blog_id,
    user_id,
    category_id,
    title,
    content,
    author,
    book,
    created_at,
    last_modified_at,
    view
) VALUES (
             1, -- main_category_id
             1, -- blog_id
             1, -- user_id
             1, -- category_id
             '예제 제목',
             '예제 콘텐츠입니다. 여기에 본문 내용이 들어갑니다.',
             '홍길동',
             '어린 왕자',
             NOW(), -- created_at
             NOW(), -- modified_at
             0 -- view
         );
