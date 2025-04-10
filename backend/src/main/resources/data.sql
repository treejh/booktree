INSERT INTO ROLES (id, role, created_at, last_modified_AT)
VALUES (1, 'ROLE_USER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 사용자 추가
INSERT INTO users (id,role_id, email, password, phone_number, username) VALUES
                                                                         (1, 1, 'example@example.com', 'password123', '010-1234-5678', 'exampleUser'),
                                                                         (2, 1, 'example1@example.com', 'password123', '010-1234-5678', 'exampleUser1'),
                                                                         (3, 1, 'example2@example.com', 'password123', '010-1234-5678', 'exampleUser2'),
                                                                         (4, 1, 'example3@example.com', 'password123', '010-1234-5678', 'exampleUser3');

-- 카테고리 추가
INSERT INTO categories (id, name, user_id) VALUES
                                               (1, '카테고리1', 1),
                                               (2, '카테고리2', 1),
                                               (3, '카테고리3', 1),
                                               (4, '카테고리4', 1);

-- MainCategory 테이블에 데이터 삽입
INSERT INTO main_categories (id, name,created_at, last_modified_AT) VALUES (1, '소설', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO main_categories (id, name,created_at, last_modified_AT) VALUES (2, '자기개발서', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO main_categories (id, name,created_at, last_modified_AT) VALUES (3, '공부/자격', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO main_categories (id, name,created_at, last_modified_AT) VALUES (4, '에세이/일상', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO main_categories (id, name,created_at, last_modified_AT) VALUES (5, '실용/취미', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO main_categories (id, name,created_at, last_modified_AT) VALUES (6, 'IT/컴퓨터', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


