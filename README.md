# 🌤️ Real Weather

Next.js 기반 실시간 날씨 조회 서비스입니다. FSD 아키텍처를 처음 적용해보면서 SSR과 TanStack Query의 캐싱 전략을 고민하며 만들었습니다.

## 🚀 프로젝트 실행 방법

두 가지 실행 방법을 제공합니다: **일반 빌드** 또는 **Docker 실행**

### 방법 1: 일반 빌드 (개발/테스트용)

#### 1. 환경 변수 설정

```bash
cp env.example .env.local
# .env.local 파일에 API 키 입력
```

**Kakao Maps API 키 발급** ([무료](https://developers.kakao.com/))

1. [Kakao Developers](https://developers.kakao.com/) 회원가입
2. 내 애플리케이션 > 애플리케이션 추가하기
3. 앱 설정 > 앱 키 > REST API 키 복사
4. `.env.local`에 `NEXT_PUBLIC_KAKAO_REST_API_KEY` 입력

> **참고**: 무료 할당량 하루 30만건까지 사용 가능합니다.

#### 2. 의존성 설치 및 실행

```bash
npm install
npm run dev  # 개발 서버 (http://localhost:3000)

# 또는 프로덕션 빌드
npm run build
npm start
```

### 방법 2: Docker 실행 (프로덕션용)

빌드 효율을 위해 `node_modules` 캐싱용 **Base 이미지**와 **Production 이미지**를 분리했습니다.

```bash
# 1. Base 이미지 빌드 (최초 1회 또는 package.json 변경 시)
npm run docker:build:base

# 2. 환경 변수 설정
cp env.example .env
# ⚠️ Docker는 .env 또는 .env.prod만 인식 (.env.local은 무시됨)

# 3. Production 이미지 빌드 (Next.js standalone 방식)
npm run docker:build:prod

# 4. 실행
npm run docker:run
# → http://localhost:3000
```

> **빌드 최적화:** Base 이미지를 재사용하면 5분 → 1분으로 단축됩니다.  
> 자세한 내용은 [DOCKER.md](DOCKER.md) 참고

## 구현 기능

### 핵심 기능

- **현재 위치 날씨**: 페이지 진입 시 자동으로 위치를 감지해서 날씨를 보여줍니다
- **장소 검색**: 8,000개 이상의 한국 행정구역 데이터를 로컬에서 검색합니다 (API 호출 없이 즉각 반응)
- **즐겨찾기**: 최대 5개 지역을 저장하고, 각 카드에서 실시간 날씨 미리보기를 제공합니다
- **상세 날씨**: 시간별 예보와 최저/최고 기온, 습도, 풍속 등을 확인할 수 있습니다
- **SEO**: 각 날씨 페이지마다 동적 메타데이터를 생성해서 공유 시 미리보기가 나옵니다

## 기술적 고민과 선택

### SSR과 캐싱 전략이 핵심이었습니다

이번 프로젝트에서 가장 신경 쓴 부분은 **Next.js의 SSR과 TanStack Query의 캐싱을 적절히 조합**하는 것이었습니다.

#### 왜 이게 중요했냐면

날씨 데이터는 자주 바뀌지 않으면서도 실시간성이 중요합니다. 매번 API를 호출하면 느리고, 그렇다고 너무 오래 캐싱하면 오래된 데이터를 보여주게 됩니다.

**해결 방법:**

```typescript
// 날씨 데이터: 5분간 fresh, 10분간 캐시 유지
staleTime: 5 * 60 * 1000,
gcTime: 10 * 60 * 1000,

// 좌표→주소 변환: 1시간 캐싱 (거의 안 바뀜)
staleTime: 60 * 60 * 1000,
```

페이지 진입 시 서버에서 초기 데이터를 받아오고(SSR), 이후에는 캐시된 데이터를 보여주면서 백그라운드에서 조용히 업데이트합니다. 사용자는 로딩을 거의 못 느끼면서도 항상 최신 날씨를 볼 수 있습니다.

특히 즐겨찾기 카드에서 여러 지역의 날씨를 동시에 보여줄 때 이 전략이 빛을 발했습니다. 각 카드가 독립적으로 캐싱되어서 한 번 로드한 지역은 다시 방문해도 즉시 표시됩니다.

### Route 기반에서 FSD로 넘어오면서 느낀 점

평소에는 Next.js의 폴더 구조 그대로 `app/` 안에서 route별로 코드를 구성했습니다. 솔직히 작은 프로젝트에는 그게 더 직관적이고 빠릅니다.

하지만 이번에 Feature-Sliced Design을 적용해보면서 느낀 점:

**장점**

- **재사용성이 확실히 좋습니다**: `useWeather` 훅을 한 번 만들어두니 대시보드, 상세 페이지, 즐겨찾기 카드 어디서든 똑같이 쓸 수 있었습니다
- **의존성 방향이 명확합니다**: `shared` → `entities` → `features` → `widgets` 순서로만 import하다 보니 순환 참조 걱정이 없었습니다
- **테스트하기 쉽습니다**: 각 레이어가 독립적이라 단위 테스트를 작성할 때 모킹할 부분이 명확했습니다

**단점**

- **초반 세팅이 복잡합니다**: 파일 하나 만들려고 해도 "이게 entity인가 feature인가?" 고민하는 시간이 많았습니다
- **import 경로가 깁니다**: `@/entities/weather/model/queries` 같은 경로를 계속 쓰다 보니 불편했습니다 (그래서 각 폴더마다 index.ts로 public API를 정리했습니다)
- **작은 기능에는 오버엔지니어링**

결론적으로, 팀 프로젝트나 규모가 큰 서비스라면 FSD가 확실히 유리할 것 같습니다. 다만 작은 프로젝트나 프로토타입을 빠르게 만들 때는 route 기반이 더 나을 수도 있겠다는 생각이 들었습니다.

### Next.js를 선택한 이유

이 프로젝트는 과제 테스트였고, 채용 공고에서 Next.js와 SSR/SSG, SEO 최적화 경험을 요구했습니다. 메타데이터 API로 동적 SEO를 구현하고 App Router로 SSR을 적용하면서 요구사항을 충족시킬 수 있었습니다.

### 전역 상태 관리를 안 쓴 이유

평소에는 Zustand를 주로 쓰는데, 이 프로젝트는 서버 상태(날씨, 위치)만 있고 복잡한 클라이언트 상태가 없어서 TanStack Query만으로 충분했습니다. 즐겨찾기는 LocalStorage로 직접 관리했습니다.

### 커스텀 로거를 만든 이유

Next.js의 `removeConsole` 옵션을 켜면 프로덕션 빌드에서 console이 다 지워지는데, 문제는 서버 콘솔까지 같이 사라진다는 점입니다. 서버 에러를 트래킹할 방법이 없어져서 디버깅이 너무 힘들더라고요. 그래서 커스텀 logger를 만들어서 나중에 환경변수로 클라이언트 로그만 선택적으로 지울 수 있게 했습니다.

## 기술 스택

- **Next.js 16** (App Router) - SSR과 메타데이터 API 활용
- **React 19** - React Compiler로 자동 메모이제이션
- **TypeScript** - strict mode
- **TanStack Query 5** - 서버 상태 관리 및 캐싱
- **Tailwind CSS 4** - 스타일링
- **ky** - HTTP 클라이언트
- **Zod** - 환경변수 런타임 검증 및 타입 안전성
- **Open-Meteo API** - 날씨 데이터 (무료)
- **Kakao Maps API** - 한국 주소 좌표 변환 (무료 30만건/일)

## 트러블슈팅

### Kakao Maps API 전환

VWorld API는 Vercel(해외 서버)에서 502 에러가 발생하여 Kakao Maps API로 전환했습니다.

**문제**: VWorld API는 한국 공공 API로 해외 IP를 차단하여 Vercel에서 동작하지 않음

**해결**: Kakao Maps API 사용

- ✅ Vercel에서 정상 작동 (글로벌 인프라 지원)
- ✅ 안정적인 99.9% SLA
- ✅ 무료 할당량 30만건/일 ([Kakao Developers](https://developers.kakao.com/docs/latest/ko/local/dev-guide))
- ✅ 도메인 기반 보안

---

2026.01 | 과제 제출용 프로젝트
