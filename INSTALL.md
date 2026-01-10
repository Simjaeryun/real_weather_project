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

### 환경 변수 (선택사항)

`.env.local` 파일을 생성하여 환경 변수를 설정할 수 있습니다:

```env
NEXT_PUBLIC_API_URL=https://jsonplaceholder.typicode.com
```

현재는 코드에 하드코딩되어 있지만, 실제 프로젝트에서는 환경 변수 사용을 권장합니다.
