# 설치 가이드

## 필수 요구사항

- Node.js 18.x 이상
- npm 또는 yarn 패키지 매니저

## 빠른 시작

### 1단계: 의존성 설치

프로젝트 디렉토리에서 다음 명령어를 실행하세요:

```bash
npm install
```

또는 yarn 사용 시:

```bash
yarn install
```

### 2단계: 개발 서버 실행

```bash
npm run dev
```

개발 서버가 시작되면 브라우저에서 http://localhost:3000 을 여세요.

### 3단계: 프로덕션 빌드 (선택사항)

프로덕션용 빌드를 생성하려면:

```bash
npm run build
npm start
```

## 문제 해결

### 포트가 이미 사용 중인 경우

다른 포트에서 실행하려면:

```bash
npm run dev -- -p 3001
```

### 의존성 설치 오류

캐시를 삭제하고 재설치:

```bash
rm -rf node_modules package-lock.json
npm install
```

## 개발 환경 설정

### 환경 변수 설정 (필수)

`.env.local` 파일을 생성하여 API 키를 설정하세요:

```env
NEXT_PUBLIC_VWORLD_API_KEY=your_vworld_api_key_here
NEXT_PUBLIC_WEATHER_API_KEY=your_weather_api_key_here
```

**API 키 발급 방법:**

1. **VWorld API 키** (지오코딩):
   - https://www.vworld.kr 접속
   - 회원가입 후 로그인
   - API 신청 → Geocoder API 선택
   - 발급받은 키를 `NEXT_PUBLIC_VWORLD_API_KEY`에 입력

2. **날씨 API 키**:
   - 현재 사용 중인 날씨 API 키를 설정
