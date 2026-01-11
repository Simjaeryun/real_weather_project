# Docker 빌드 가이드

이 프로젝트는 2단계 Docker 빌드 전략을 사용합니다:

1. **Base 이미지**: `node_modules`만 포함 - 의존성 캐싱 전용 (별도 관리)
2. **Production 이미지**: Base에서 node_modules 복사 + 소스 코드 빌드

## 왜 Base를 분리했나요?

Base 이미지는 **오직 node_modules만 포함**합니다:

- ✅ `package.json` + `package-lock.json` → `npm ci` → `node_modules`
- ❌ 소스 코드, 환경 변수, 빌드 산출물 등 불필요

이렇게 하면 `package.json`이 변경되지 않는 한 Base를 재사용할 수 있어 빌드 시간이 크게 단축됩니다.

## 빌드 방법

### 1️⃣ Base 이미지 빌드 (최초 1회 또는 dependencies 변경 시)

```bash
# npm script 사용
npm run docker:build:base

# 또는 직접 명령어
docker build -f Dockerfile-fe-base -t fsd-weather-base:latest .
```

> **중요**: Base 이미지는 `package.json`이 변경될 때만 다시 빌드하면 됩니다.

### 2️⃣ Production 이미지 빌드

```bash
# 빌드 스크립트 실행 (base가 이미 있어야 함)
./docker-build.sh

# 또는 npm script
npm run docker:build:prod
```

## 실행 방법

```bash
# npm script로 실행
npm run docker:run

# 또는 직접 실행
docker run -p 3000:3000 fsd-weather-prod:latest

# 백그라운드 실행
docker run -d -p 3000:3000 --name weather-app fsd-weather-prod:latest
```

## 정지

```bash
# 컨테이너 정지
docker stop weather-app

# 컨테이너 삭제
docker rm weather-app
```

## Base 이미지의 역할

### Base 이미지 = node_modules 저장소

Base 이미지는 **순수하게 node_modules만 포함**합니다:

```dockerfile
# Dockerfile-fe-base
COPY package.json package-lock.json ./
RUN npm ci
# 끝! node_modules만 있음
```

### 왜 분리했나요?

**문제점**

- `npm install`은 오래 걸림 (~3-5분)
- 코드 한 줄 수정해도 매번 dependencies 재설치

**해결책**

- Base에 node_modules를 캐싱
- Production 빌드 시 Base에서 node_modules만 복사
- 코드 변경해도 Base는 그대로 재사용

### 빌드 시간 비교

```
Base 없이 매번 빌드:     ~5분 (npm install + build)
Base 재사용:            ~1분 (build만)
```

### 언제 Base를 재빌드하나요?

`package.json`이 변경될 때만:

- ✅ 새 패키지 추가/삭제
- ✅ 패키지 버전 업데이트
- ❌ 코드 수정 (재빌드 불필요)
- ❌ 환경 변수 변경 (재빌드 불필요)

## 환경 변수 설정

프로덕션 빌드 시 환경 변수는 빌드 타임에 번들에 포함됩니다.

### 지원하는 환경 변수 파일

Docker 빌드 시 다음 파일들을 인식합니다:

- ✅ `.env` - 기본 환경 변수
- ✅ `.env.production` - 프로덕션 환경 변수
- ✅ `.env.prod` - 프로덕션 환경 변수 (`.env.production`으로 자동 변환됨)
- ❌ `.env.local` - **빌드 시 포함되지 않음**

```bash
# 방법 1: .env 파일 사용 (권장)
cp env.example .env
# API 키 입력 후 빌드
./docker-build.sh

# 방법 2: .env.prod 파일 사용
cp env.example .env.prod
./docker-build.sh

# 방법 3: .env.production 파일 사용
cp env.example .env.production
./docker-build.sh
```

> **⚠️ 중요**: `.env.local` 파일은 Docker 빌드 시 **포함되지 않습니다**.
> Docker를 사용할 때는 반드시 `.env`, `.env.prod`, 또는 `.env.production` 파일을 사용하세요.

## Discord 알림 (완전 선택사항)

빌드 시작/완료 시 Discord로 알림을 받을 수 있습니다. **Discord webhook이 없어도 빌드는 정상 작동합니다.**

### 방법 1: 환경 변수로 설정

```bash
export DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_TOKEN"
./docker-build.sh
```

### 방법 2: 빌드 시 직접 전달

```bash
docker build \
  -f Dockerfile-prod \
  --build-arg DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_TOKEN" \
  -t fsd-weather-prod:latest \
  .
```

### 알림 없이 빌드 (기본값)

```bash
# Discord webhook을 설정하지 않으면 알림 없이 빌드됩니다
./docker-build.sh
```

> **참고**: Discord 알림이 실패해도 빌드는 계속 진행됩니다. 알림은 빌드 성공 여부에 영향을 주지 않습니다.

## 트러블슈팅

### Base 이미지가 없다는 에러

```bash
Error: pull access denied for fsd-weather-base
```

**해결**: Base 이미지를 먼저 빌드하세요

```bash
npm run docker:build:base
```

### 의존성이 오래됨

Base 이미지를 재빌드하세요:

```bash
npm run docker:build:base
npm run docker:build:prod
```

### 포트 충돌

다른 포트로 실행:

```bash
docker run -p 8080:3000 fsd-weather-prod:latest
```

### 환경 변수가 빌드에 포함되지 않음

```bash
Error: Invalid URL
```

**원인**: `.env.local` 파일만 작성하고 빌드했을 경우

**해결**: `.env` 또는 `.env.prod` 파일을 사용하세요

```bash
cp env.example .env
# 또는
cp env.example .env.prod

# 다시 빌드
npm run docker:build:prod
```

> **중요**: Docker 빌드 시 `.env.local` 파일은 **무시**됩니다!
