INSERT INTO ROLES (id, role, created_at, last_modified_AT)
VALUES (1, 'USER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO ROLES (id, role, created_at, last_modified_AT)
VALUES (2, 'ADMIN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 사용자 추가
INSERT INTO users (id,role_id, email, password, phone_number, username) VALUES
                                                                         (1, 1, 'test@example.com', 'test@!2!!123', '010-8574-5678', 'exampleUser'),
                                                                         (2, 1, 'test1@example.com', 'test@!2!!123', '010-2355-5678', 'exampleUser1'),
                                                                         (3, 1, 'test2@example.com', 'test@!2!!123', '010-2355-5679', 'exampleUser3'),
                                                                         (4, 1, 'test3@example.com', 'test@!2!!123', '010-2355-1238', 'exampleUser4')
                                                                         ;

-- 카테고리 추가
INSERT INTO categories (id, name, user_id) VALUES
                                               (1, '카테고리1', 1),
                                               (2, '카테고리2', 1),
                                               (3, '카테고리3', 1),
                                               (4, '카테고리4', 1);


-- 메인 카테고리 추가
INSERT INTO main_categories (id, name, created_at, last_modified_at) VALUES (1, '소설', NOW(), NOW());
INSERT INTO main_categories (id, name, created_at, last_modified_at) VALUES (2, '자기개발', NOW(), NOW());
INSERT INTO main_categories (id, name, created_at, last_modified_at) VALUES (3, '공부/자격', NOW(), NOW());
INSERT INTO main_categories (id, name, created_at, last_modified_at) VALUES (4, '에세이/일상', NOW(), NOW());
INSERT INTO main_categories (id, name, created_at, last_modified_at) VALUES (5, '실용/취미', NOW(), NOW());
INSERT INTO main_categories (id, name, created_at, last_modified_at) VALUES (6, 'IT/컴퓨터', NOW(), NOW());


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
) VALUES
      -- 카테고리별 게시글 조회를 위한 샘플 데이터 9개
      (1, 1, 2, 1, '좋은 글 제목 1', '이 책을 읽고 많은 걸 느꼈어요.', 'dose', '미움받을 용기', NOW(), NOW(), 0, 1),
      (2, 1, 2, 1, '좋은 글 제목 2', '이 책을 읽고 많은 걸 느꼈어요.', 'dose', '미움받을 용기', NOW() - INTERVAL '1' HOUR, NOW(), 0, 1),
      (3, 1, 2, 1, '좋은 글 제목 3', '이 책을 읽고 많은 걸 느꼈어요.', 'dose', '미움받을 용기', NOW() - INTERVAL '2' HOUR, NOW(), 0, 1),
      (4, 1, 2, 1, '좋은 글 제목 4', '이 책을 읽고 많은 걸 느꼈어요.', 'dose', '미움받을 용기', NOW() - INTERVAL '3' HOUR, NOW(), 0, 1),
      (5, 1, 2, 1, '좋은 글 제목 5', '이 책을 읽고 많은 걸 느꼈어요.', 'dose', '미움받을 용기', NOW() - INTERVAL '4' HOUR, NOW(), 0, 1),
      (6, 1, 2, 1, '좋은 글 제목 6', '이 책을 읽고 많은 걸 느꼈어요.', 'dose', '미움받을 용기', NOW() - INTERVAL '5' HOUR, NOW(), 0, 1),
      (7, 1, 2, 1, '좋은 글 제목 7', '이 책을 읽고 많은 걸 느꼈어요.', 'dose', '미움받을 용기', NOW() - INTERVAL '6' HOUR, NOW(), 0, 1),
      (8, 1, 2, 1, '좋은 글 제목 8', '이 책을 읽고 많은 걸 느꼈어요.', 'dose', '미움받을 용기', NOW() - INTERVAL '7' HOUR, NOW(), 0, 1),
      (9, 1, 2, 1, '좋은 글 제목 9', '이 책을 읽고 많은 걸 느꼈어요.', 'dose', '미움받을 용기', NOW() - INTERVAL '8' HOUR, NOW(), 0, 1),
      -- 일주일 사이 조회수 높은 게시글 탐색을 위한 샘플 데이터
      (10, 2, 2, 1, '조회수 높은 글 제목 1', '이 책을 읽고 많은 걸 느꼈어요.', 'dose', '미움받을 용기', NOW(), NOW(), 100, 1),
      (11, 2, 2, 1, '조회수 높은 글 제목 2', '이 책을 읽고 많은 걸 느꼈어요.', 'dose', '미움받을 용기', NOW() - INTERVAL '1' DAY, NOW(), 200, 1),
      (12, 2, 2, 1, '조회수 높은 글 제목 3', '이 책을 읽고 많은 걸 느꼈어요.', 'dose', '미움받을 용기', NOW() - INTERVAL '2' DAY, NOW(), 150, 1),
      (13, 2, 2, 1, '조회수 높은 글 제목 4', '이 책을 읽고 많은 걸 느꼈어요.', 'dose', '미움받을 용기', NOW() - INTERVAL '3' DAY, NOW(), 50, 1),
      (14, 2, 2, 1, '조회수 높은 글 제목 5', '이 책을 읽고 많은 걸 느꼈어요.', 'dose', '미움받을 용기', NOW() - INTERVAL '4' DAY, NOW(), 175, 1),
      (15, 2, 2, 1, '조회수 높은 글 제목 6', '이 책을 읽고 많은 걸 느꼈어요.', 'dose', '미움받을 용기', NOW() - INTERVAL '5' DAY, NOW(), 30, 1),
      (16, 2, 2, 1, '조회수 높은 글 제목 7', '이 책을 읽고 많은 걸 느꼈어요.', 'dose', '미움받을 용기', NOW() - INTERVAL '6' DAY, NOW(), 220, 1),
      (17, 2, 2, 1, '조회수 높은 글 제목 8', '이 책을 읽고 많은 걸 느꼈어요.', 'dose', '미움받을 용기', NOW() - INTERVAL '7' DAY, NOW(), 10, 1),
      (18, 2, 2, 1, '조회수 높은 글 제목 9', '이 책을 읽고 많은 걸 느꼈어요.', 'dose', '미움받을 용기', NOW() - INTERVAL '9' DAY, NOW(), 1115, 1);

