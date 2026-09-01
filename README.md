# 모임 (가칭)

친구, 커플, 가족, 동창, 동아리, 회사 동료, 여행 멤버 등 여러 명이 하나의 링크로 모여
우리만의 성향, 관계, 추억, 편지를 함께 만들어보는 서비스입니다.

> **christmas-letters와 완전히 독립적인 별개 프로젝트입니다.** 기술 스택(Next.js + Firebase +
> Vercel)과 "서버 전용 Firestore 접근" 보안 패턴만 참고했을 뿐, 코드/데이터/디자인은 공유하지 않습니다.

## 구조

- **`/`** — 서비스 소개, "우리 모임 만들기" 진입.
- **`/new`** — 모임 생성 폼 (이름 / 유형 / 아이콘 / 예상 인원 / 소개 / 내 닉네임).
- **`/g/[slug]`** — 모임 페이지.
  - 이 브라우저가 아직 참여하지 않았다면 → 닉네임만 입력하는 참여 폼.
  - 이미 참여했다면 → 모임 홈(멤버 목록, 초대 링크, 모임 메뉴).
- 계정/로그인 시스템 없음. 모임 생성 시 초대 링크(`slug`)가 생기고, 각 멤버가 참여하면
  서버가 발급한 비밀 `token`을 **httpOnly 쿠키**(`moim_m_{slug}`)에 저장해 "이 브라우저 = 이
  모임의 이 멤버"임을 기억합니다. 쿠키는 해당 모임 경로(`/g/{slug}`)에만 스코프됩니다.
- 데이터는 Firebase Firestore에 저장됩니다. Firestore 보안 규칙에서 클라이언트 직접 접근은
  전부 막고, 모든 읽기/쓰기는 서버(Next.js Server Actions)를 통해서만 이루어집니다.

## 데이터 구조

```
groups/{slug}
  name, typeId, description, icon, memberTarget, createdAt

groups/{slug}/members/{memberId}
  name, token, isOwner, joinedAt
```

`slug`는 초대 링크에 노출되는 추측 불가능한 공개 식별자(10자리), `token`은 멤버별 32자리
비밀 값으로 쿠키에만 저장됩니다. 향후 기능은 같은 `groups/{slug}` 하위에 서브컬렉션으로
확장합니다: `personalityResults`, `questions`, `votes`, `letters`, `memories`, `places`,
`report` 등. 한 사용자가 여러 모임에 속할 수 있고(모임마다 별도 쿠키), 한 모임에 여러 멤버가
존재하는 구조를 그대로 따릅니다.

## 처음 세팅하기

### 1. 의존성 설치

```bash
npm install
```

### 2. Firebase 프로젝트 만들기

1. [Firebase 콘솔](https://console.firebase.google.com/)에서 새 프로젝트를 만듭니다.
   (christmas-letters와는 **별개의 새 프로젝트**로 만드세요.)
2. 왼쪽 메뉴에서 **Firestore Database**를 만듭니다 (프로덕션 모드로 시작해도 됩니다).
3. **프로젝트 설정 → 서비스 계정 → "새 비공개 키 생성"**을 눌러 JSON 키 파일을 내려받습니다.
4. 프로젝트 루트에 `.env.local` 파일을 만들고 (`.env.local.example` 참고), JSON 파일의 값을
   옮겨 적습니다:

```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### 3. Firestore 보안 규칙 적용

`firestore.rules` 파일 내용을 Firebase 콘솔의 **Firestore Database → 규칙** 탭에
그대로 붙여넣으세요 (모든 클라이언트 직접 접근 차단).

### 4. 로컬에서 실행

```bash
npm run dev
```

http://localhost:3000 에서 확인합니다.

### 5. 배포 (Vercel)

1. GitHub 저장소를 만들고 이 프로젝트를 push합니다.
2. [Vercel](https://vercel.com)에서 저장소를 import합니다.
3. 프로젝트 설정의 Environment Variables에 `.env.local`의 세 값(`FIREBASE_PROJECT_ID`,
   `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`)을 그대로 등록합니다.
4. 배포 후 도메인이 생기면 `NEXT_PUBLIC_SITE_URL`에도 등록해두세요.

## 기술 스택

- Next.js 16 (App Router, Server Actions)
- TypeScript
- Tailwind CSS 4
- Firebase Admin SDK (Firestore)

## 현재 구현 범위 (Phase 1)

모임 생성 → 초대 링크 → 멤버 참여 → 모임 홈까지 구현되어 있습니다. 홈 화면의 나머지 8개
메뉴(성향 테스트, 궁합, 역할, 질문/투표, 편지, 추억, 장소, 리포트)는 카드 UI만 미리
배치해두었고("곧 만나요"), Phase 2부터 순서대로 구현할 예정입니다.
