
![Image](https://github.com/user-attachments/assets/39d63baf-4054-4289-bb33-20b1bbd5051a)

<br/>
<br/>

# 📚 BookTree - 독서 기록 공유 플랫폼

🔗 **서비스 접속하기**: [https://www.booktri.site](https://www.booktri.site)  
🎥 **서비스 영상 보기**: [YouTube 링크](https://youtu.be/dzWKdEcuflM)


<br/>
<br/>

# 1. Project Overview (프로젝트 개요)
## 📚 BookTree

> **독서 입문자와 다독가 모두를 위한 독서 기록 플랫폼**

**BookTree**는 단순한 독서 기록을 넘어서, **책을 카테고리별로 정리하고 공유하며, 다시 쉽게 꺼내볼 수 있는 공간**을 제공합니다.  
나만의 블로그를 통해 독서의 즐거움을 더 풍부하게 경험해보세요!

---

### 🛠️ 기술 스택

- **Backend**: Java (Spring Boot)
- **Frontend**: JavaScript, HTML
- **기타**: OAuth2 (Kakao, GitHub)

---

### 🌟 주요 기능

#### 📝 나만의 블로그
- 카테고리를 자유롭게 생성하여 **독서 기록을 체계적으로 분류**
- 독서 후기를 공유하고, **사람들과 소통**하는 블로그 운영 가능

#### 📄 내 글 정렬 기능
- 작성한 게시글을 **최신순 / 좋아요순**으로 정렬하여 손쉽게 탐색 가능
- 자주 찾는 글을 빠르게 다시 꺼내볼 수 있도록 구성

#### 🔥 인기 게시글
- **메인 페이지**에서 실시간 인기 게시글 확인 (조회수 기준)
- **월간 인기 게시글** 기능으로 분야별 트렌디한 책 추천

#### 🌳 초보자도 쉽게!
- **게시글 및 댓글 기능**으로 자유로운 정보 교류
- **좋아요, 댓글 좋아요** 기능으로 유익한 글과 반응 높은 댓글을 쉽게 탐색

#### 🎯 팔로우 & 스크랩
- 관심 있는 사용자를 **팔로우**하고, 마음에 드는 글은 **스크랩**하여 따로 모아보기

#### 🚀 간편한 소셜 로그인
- **OAuth2 기반 소셜 로그인 지원**
- Kakao, GitHub 계정으로 **한 번의 클릭으로 로그인 및 회원가입 가능**

---

### ✨ 프로젝트 배경

> 독서 기록을 단순히 모으는 것을 넘어, 종류별로 정리하고 다시 꺼내보기 쉬운 공간이 필요하다고 느꼈습니다.  
> BookTree는 **책을 더 오래, 더 깊이 기억할 수 있는 독서 공간**을 목표로 개발되었습니다.


<br/>
<br/>

# 2. Team Members (팀원 및 팀 소개)
| 장지현 | 백선영 | 김건호 | 이현석 |
|:------:|:------:|:------:|:------:|
| <img src="https://hackmd.io/_uploads/Syp9xC-lxg.png" alt="장지현" width="150"> | <img src="https://hackmd.io/_uploads/BkjjbAbele.png" alt="백선영" width="150"> | <img src="https://hackmd.io/_uploads/SygUG0-llg.png" alt="김건호" width="150"> | <img src="https://hackmd.io/_uploads/HkfDfAZgxe.png" alt="이현석" width="150"> |
| BE,FE | BE,FE | BE,FE | BE,FE |
| [GitHub](https://github.com/treejh) | [GitHub](https://github.com/backsunyoung) | [GitHub](https://github.com/KIMKEONHO) | [GitHub](https://github.com/hsle95) |

<br/>
<br/>

# 3. Key Features (주요 기능 상세)

- **회원 관리**:
  - 일반 로그인 및 OAuth2 로그인을 통해 사용자 인증을 지원합니다.
    - 일반 로그인: 사용자 이메일과 비밀번호를 통한 로그인
    - OAuth2 로그인: Kakao 및 GitHub 계정을 통한 간편 로그인

- **게시글 관리**:
    - 사용자는 게시글을 생성하고 수정, 삭제할 수 있고 비사용자는 조회할 수 있습니다.

- **카테고리 관리**:
    - 카테고리 생성, 수정, 삭제 기능을 제공합니다.

- **블로그 관리**:
  - 블로그 생성, 수정, 삭제 기능을 제공합니다.

- **댓글 관리:**
    - 사용자는 게시글에 댓글을 달거나, 수정 삭제할 수 있고 비사용자는 조회할 수 있습니다.
- **대댓글 관리:**
    - 사용자는 댓글에 답 댓글을 달거나 수정, 삭제할 수 있고 비사용자는 조회할 수 있습니다.


- **인기 게시글 기능** : 
    - 카테고리별 가장 많이 조회된 책 TOP5 을 조회할 수 있습니다.
    - 실시간 월간 일기 게시글을 조회할 수 있습니다. 

- **팔로우 관리**:
    
  - 로그인 한 사용자끼리 팔로우하거나 팔로우를 취소하거나 내가 팔로우, 팔로잉한 사람들과 그들의 게시글을 확인할 수 있습니다.

- **좋아요 관리**:
  - 게시글, 댓글, 답글에 좋아요를 누르거나 좋아요를 취소할 수 있고 내가 좋아요를 한 게시글들을 확인할 수 있습니다.


<br/>
<br/>

# 4. Tasks & Responsibilities (작업 및 역할 분담)
## 4.1 백엔드
|  |  |
|-----------------|-----------------|
| 장지현    | <ul><li>회원 API(비밀번호 찾기 - 이메일 API)</li><li>로그인(깃허브, 카카오), 로그아웃 API</li><li>블로그 API</li><li>본인 게시글 검색 API</li><li>게시글 조회(팔로잉, 좋아요) API</li><li>S3 이미지 API</li></ul>     |
| 백선영   | <ul><li>게시글 API</li><li>게시글 좋아요 API</li><li>최근 1주 간 인기, 최신 순 정렬과 페이징</li><li>조회(블로그별, 회원별, 게시글에 좋아요 한 유저 목록) API</li></ul> |
| 김건호   |<ul><li>카테고리 API</li><li>메인 카테고리 API</li><li>메인 카테고리별 인기 게시글 API</li><li>월간 실시간 인기 게시글 API</li><li>팔로우 API</li></ul>  |
| 이현석    | <ul><li>댓글, 댓글좋아요 API</li><li>대댓글, 대댓글좋아요 API</li><li>검색 기능</li></ul>    |

## 4.2 프론트
|  |  |
|-----------------|-----------------|
| 장지현     | <ul><li>회원 로그인(+깃허브, 카카오 로그인), 회원 가입, 탈퇴</li><li>비밀번호, 이메일 찾기</li><li>블로그 기능</li><li>본인 게시글 내 검색</li><li>블로그 내 팔로잉, 스크랩 조회</li><li>회원 카테고리별 게시글 가져오기 페이지</li></ul>     |
| 백선영   | <ul><li>게시글 작성, 조회, 수정, 삭제 기능</li><li>게시글 좋아요 toggle, 조회 기능</li><li>블로그 내 게시글 리스트 최신순, 추천순 정렬 및 페이징</li><li>블로그 페이지, 게시글 프로필창에 유저 info 연결</li></ul> |
| 김건호   | <ul><li>전체 게시글 조회수순 인기 게시글</li><li>메인 카테고리 별 조회수순 인기 게시글</li><li>메인 카테고리 별 월간 실시간 인기 게시글</li><li>팔로워 페이지</li><li>게시글 상세보기 팔로잉 기능</li></ul>  |
| 이현석    |   <ul><li>게시글 검색 페이지(전체, 게시글 제목, 작가, 책이름 검색)</li><li>댓글, 댓글 좋아요 기능</li><li>대댓글, 대댓글 좋아요 기능</li><li>사용자에 따른 댓글 버튼 기능</li></ul>    |

<br/>
<br/>

# 5. Technology Stack (기술 스택)


## 5.1 Frotend

<img src="https://img.shields.io/badge/Amazon_S3-white?style=flat-square&logo=Amazon-S3&logoColor=569A31)" alt="Amazon S3">
<img src="https://img.shields.io/badge/Next.js-white?style=flat-square&logo=Next.js&logoColor=020000)" alt="Next.js">
<img src="https://img.shields.io/badge/OAuth-white?style=flat-square&logo=oauth&logoColor=000000)" alt="OAuth">
<img src="https://img.shields.io/badge/Vercel-white?style=flat-square&logo=vercel&logoColor=000000" alt="Vercel">

<br/>
<br/>

## 5.2 Backend


<img src="https://img.shields.io/badge/Spring-white?style=flat-square&logo=Spring&logoColor=6DB33F)" alt="Spring">
<img src="https://img.shields.io/badge/MySQL-white?style=flat-square&logo=MySQL&logoColor=4479A1)" alt="MySQL">
<img src="https://img.shields.io/badge/Amazon_EC2-white?style=flat-square&logo=Amazon-EC2&logoColor=FF9900" alt="Amazon EC2">
<img src="https://img.shields.io/badge/Docker-white?style=flat-square&logo=Docker&logoColor=2496ED)" alt="Docker">
<img src="https://img.shields.io/badge/Nginx-white?style=flat-square&logo=NGINX&logoColor=020639)" alt="Nginx">
<img src="https://img.shields.io/badge/OAuth-white?style=flat-square&logo=oauth&logoColor=000000)" alt="OAuth">

<br/>
<br/>

## 5.3 Etc
<img src="https://img.shields.io/badge/HAProxy-white?style=flat-square&logo=haproxy&logoColor=000000)" alt="HAProxy">
<img src="https://img.shields.io/badge/Git-white?style=flat-square&logo=git&logoColor=F05032)" alt="Git">
<img src="https://img.shields.io/badge/GitHub_Actions-white?style=flat-square&logo=github-actions&logoColor=181717)" alt="GitHub_Actions">
<img src="https://img.shields.io/badge/Notion-white?style=flat-square&logo=notion&logoColor=020000" alt="Notion">


<br/>
<br/>

# 6. Project Structure (프로젝트 구조) 


## 6-1 백엔드 프로젝트 구조 
```
📦main
 ┣ 📂java
 ┃ ┗ 📂com
 ┃ ┃ ┗ 📂example
 ┃ ┃ ┃ ┗ 📂booktree
 ┃ ┃ ┃ ┃ ┣ 📂auditable
 ┃ ┃ ┃ ┃ ┣ 📂blog
 ┃ ┃ ┃ ┃ ┣ 📂category
 ┃ ┃ ┃ ┃ ┣ 📂comment
 ┃ ┃ ┃ ┃ ┣ 📂config
 ┃ ┃ ┃ ┃ ┣ 📂email
 ┃ ┃ ┃ ┃ ┣ 📂enums
 ┃ ┃ ┃ ┃ ┣ 📂exception
 ┃ ┃ ┃ ┃ ┣ 📂follow
 ┃ ┃ ┃ ┃ ┣ 📂image
 ┃ ┃ ┃ ┃ ┣ 📂jwt
 ┃ ┃ ┃ ┃ ┣ 📂likecomment
 ┃ ┃ ┃ ┃ ┣ 📂likepost
 ┃ ┃ ┃ ┃ ┣ 📂likereply
 ┃ ┃ ┃ ┃ ┣ 📂maincategory
 ┃ ┃ ┃ ┃ ┣ 📂oauth
 ┃ ┃ ┃ ┃ ┣ 📂popularpost
 ┃ ┃ ┃ ┃ ┣ 📂post
 ┃ ┃ ┃ ┃ ┣ 📂reply
 ┃ ┃ ┃ ┃ ┣ 📂role
 ┃ ┃ ┃ ┃ ┣ 📂security
 ┃ ┃ ┃ ┃ ┣ 📂user
 ┃ ┃ ┃ ┃ ┣ 📂utils
 ┃ ┃ ┃ ┃ ┗ 📜BookTreeApplication.java
 ┗ 📂resources
 ┃ ┣ 📂static
 ┃ ┣ 📂templates
 ┃ ┃ ┗ 📜password.html
 ┃ ┣ 📜application-dev.yml
 ┃ ┣ 📜application-prod.yml
 ┃ ┣ 📜application-secret.yml
 ┃ ┣ 📜application-test.yml
 ┃ ┣ 📜application.yml
 ┃ ┣ 📜application.yml.default
 ┃ ┗ 📜data.sql
```
## 6-2 프론트 프로젝트 구조 

```
📦src
 ┣ 📂app
 ┃ ┣ 📂account
 ┃ ┃ ┣ 📂edit
 ┃ ┃ ┣ 📂editPassword
 ┃ ┃ ┣ 📂findAccount
 ┃ ┃ ┃ ┣ 📂findId
 ┃ ┃ ┃ ┗ 📂findPassword
 ┃ ┃ ┣ 📂login
 ┃ ┃ ┣ 📂signup
 ┃ ┃ ┗ 📂withdraw
 ┃ ┣ 📂blog
 ┃ ┃ ┣ 📂[id]
 ┃ ┃ ┃ ┣ 📂search
 ┃ ┃ ┣ 📂create
 ┃ ┃ ┣ 📂edit
 ┃ ┃ ┗ 📂post
 ┃ ┣ 📂category
 ┃ ┃ ┣ 📂[categoryId]
 ┃ ┣ 📂components
 ┃ ┣ 📂follow
 ┃ ┃ ┗ 📂[id]
 ┃ ┣ 📂main
 ┃ ┃ ┗ 📂category
 ┃ ┃ ┃ ┣ 📂[slug]
 ┃ ┣ 📂mypage
 ┃ ┃ ┣ 📂[id]
 ┃ ┃ ┗ 📂editCategory
 ┃ ┃ ┃ ┗ 📂[userId]
 ┃ ┣ 📂post
 ┃ ┃ ┣ 📂[postId]
 ┃ ┃ ┃ ┗ 📂detail
 ┃ ┃ ┃ ┃ ┗ 📂get
 ┃ ┃ ┗ 📂write
 ┃ ┣ 📂search
 ┃ ┣ 📜.prettierrc
 ┃ ┣ 📜ClientLayout.tsx
 ┃ ┣ 📜favicon.ico
 ┃ ┣ 📜globals.css
 ┃ ┣ 📜layout.tsx
 ┃ ┗ 📜page.tsx
 ┗ 📂stores
 ┃ ┗ 📂auth
```
## 6-3 배포 프로젝트 구조 

```
📦infra
 ┣ 📜.gitignore
 ┣ 📜.terraform.lock.hcl
 ┣ 📜main.tf
 ┣ 📜secrets.tf
 ┣ 📜secrets.tf.default
 ┣ 📜terraform.tfstate
 ┣ 📜terraform.tfstate.1745779507.backup
 ┣ 📜terraform.tfstate.backup
 ┗ 📜variables.tf
```



<br/>
<br/>

# 7. Development Workflow (개발 워크플로우)

## 7-1 브랜치 전략 (Branch Strategy)
우리의 브랜치 전략은 Git Flow를 기반으로 하며, 다음과 같은 브랜치를 사용합니다.
- **Main Branch**
     - `main`  
    - 배포 가능한 상태의 코드를 유지합니다.
    - 모든 배포는 이 브랜치에서 이루어집니다.


- **프론트 단독 개발**  
    - `front/#이슈번호-브랜치이름`  
      - **프론트엔드(html, css 등) 단독 작업 시 사용합니다.**  
      - 배포 가능한 상태의 코드를 유지해야 하며, 배포는 이 브랜치에서 직접 이루어집니다.

  
- **프론트 + 백엔드 기능 연결**
    - `front/[type]/#이슈번호-브랜치이름` 
      - **프론트와 백엔드 기능이 함께 연결되는 작업 시 사용합니다.**
      - 팀원 각자의 기능 개발용 브랜치입니다.
      - 기능 개발, 테스트, UI/서버 연동 등이 이 브랜치에서 이루어집니다.
      - 완료 시 main 혹은 다른 상위 브랜치에 병합합니다.

- **백엔드 기능 개발**
    - `[type]/#이슈번호-브랜치이름 `
      - **백엔드 API, 서비스 로직, DB 처리 등 백엔드 중심 작업 시 사용합니다.**
      - 팀원 각자의 기능 개발용 브랜치입니다.
      - 모든 기능 개발은 이 브랜치에서 진행되며, 완료 시 병합 요청합니다.


<br/>
<br/>


# 8. 커밋 컨벤션
## 8-1 기본 구조
```
[ 브랜치 앞 명명 type ]  : [ # 이슈 번호 ] subject
```

<br/>

## 8-2 type 종류
```
feat : 새로운 기능 추가
fix : 버그 수정
refact : 코드 리펙토링
add : 파일 추가
delete : 파일 삭제 
docs : 문서 수정
```

<br/>


## 8-3 이슈 네이밍 규칙
```
[ type ]  :  subject
```
- 작업 목적 + 대상 + 내용을 포함해 작성합니다.


예시:
- [ front / refact ] : 메인페이지 인기 게시글, 블로그 페이지 팔로우, 팔로우 페이지 블로그 연동
- [ front / feat ] 댓글버튼 숨기기
- [ feat ] : 이메일 인증 구현 
