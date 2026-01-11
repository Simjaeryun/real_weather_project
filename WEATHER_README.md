# 🌤️ 날씨 앱

Feature Sliced Design 아키텍처 기반 날씨 정보 애플리케이션

## 🚀 프로젝트 실행 방법

### 1. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 API 키를 설정하세요:

```env
NEXT_PUBLIC_VWORLD_API_KEY=your_vworld_api_key_here
NEXT_PUBLIC_WEATHER_API_KEY=your_weather_api_key_here
```

**VWorld API 키 발급:**

- https://www.vworld.kr 접속
- 회원가입 후 API 신청 → Geocoder API 선택

### 2. 의존성 설치 및 실행

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## ✨ 구현한 기능

### 1. 날씨 정보 표시

- **현재 날씨**: 기온, 체감 기온, 습도, 풍속, 날씨 설명
- **일일 날씨**: 당일 최저/최고 기온
- **시간별 예보**: 24시간 단위 시간별 기온 및 날씨
- **날씨 아이콘**: OpenWeatherMap 제공 아이콘 표시

### 2. 현재 위치 감지

- 브라우저의 Geolocation API를 통한 현재 위치 자동 감지
- 첫 진입 시 또는 버튼 클릭으로 현재 위치의 날씨 정보 표시
- 위치 권한 요청 및 에러 핸들링

### 3. 장소 검색

- **한국 전역 검색**: 시/도, 시/군/구, 읍/면/동 모든 단위 검색 가능
  - 예: "서울특별시", "종로구", "청운동" 등
- **자동완성**: 입력 시 실시간으로 매칭되는 장소 목록 표시
- **매칭 알고리즘**:
  - 정확히 일치 (100점)
  - 시작 부분 일치 (90점)
  - 포함 여부 (70점)
  - 부분 일치 (50-60점)
- **키보드 네비게이션**: 화살표 키로 선택, Enter로 확정, ESC로 닫기

### 4. 즐겨찾기 관리

- **추가/삭제**: 최대 6개 장소 저장
- **별칭 수정**: 즐겨찾기 장소의 이름 커스터마이징
- **카드 UI**:
  - 현재 날씨 정보
  - 당일 최저/최고 기온
  - 날씨 아이콘
  - 편집/삭제 버튼
- **로컬 스토리지**: 브라우저에 영구 저장
- **상세 페이지**: 카드 클릭 시 전체 날씨 정보 표시

### 5. 반응형 디자인

- 모바일, 태블릿, 데스크톱 최적화
- 그리드 레이아웃: 모바일 1열, 태블릿 2열, 데스크톱 3열

## 🏗️ 아키텍처 및 기술 선택

### FSD (Feature Sliced Design) 구조

```
fsd-project/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 메인 페이지 (날씨 앱)
│   ├── layout.tsx         # 루트 레이아웃
│   └── providers.tsx      # React Query Provider
├── entities/              # 비즈니스 엔티티
│   ├── location/          # 위치/주소
│   │   ├── api/          # 주소 검색 API
│   │   ├── lib/          # 파싱, 좌표 변환
│   │   └── model/        # 타입
│   ├── weather/           # 날씨
│   │   ├── api/          # OpenWeatherMap API
│   │   └── model/        # 타입, React Query hooks
│   └── favorite/          # 즐겨찾기
│       ├── lib/          # 로컬 스토리지
│       └── model/        # 타입, hooks
├── features/              # 기능
│   ├── weather-search/    # 장소 검색
│   │   └── ui/           # 검색 입력 + 자동완성
│   ├── favorite-list/     # 즐겨찾기 목록
│   │   └── ui/           # 카드 목록 + 개별 카드
│   └── weather-detail/    # 날씨 상세
│       └── ui/           # 상세 정보 표시
└── shared/                # 공유 레이어
    ├── api/              # API 클라이언트
    ├── lib/              # React Query 설정
    └── ui/               # 공통 UI 컴포넌트
```

### 주요 기술적 결정

#### 1. Open-Meteo API

**선택 이유:**

- **API 키 불필요** - 완전 무료
- 한 번의 API 호출로 현재 날씨 + 시간별 + 일일 예보 모두 제공
- 정확한 날씨 데이터 (1-11km 고해상도)
- 클라이언트에서 직접 호출 가능
- 비상업적 용도 무제한 사용

#### 2. 로컬 JSON + 필요시 Geocoding

**주소 데이터:**

- 20,558개 한국 주소 (시/도/구/동)
- 로컬 JSON으로 즉시 로드
- 빠른 검색 (클라이언트 사이드)

**좌표 데이터:**

- VWorld Geocoder API 사용 (국토교통부 공식)
- 사용자가 주소 선택할 때만 호출
- 즐겨찾기에 좌표 저장 (재사용)

**데이터 구조:**

```json
[
  "서울특별시",
  "서울특별시-종로구",
  "서울특별시-종로구-청운동",
  ...
]
```

#### 3. Lazy Geocoding 전략

**문제:** 20,558개 주소 모두 사전 geocoding은 비현실적  
**해결:** 필요시에만 geocoding

**동작 방식:**

1. 초기 로드: 주소 목록만 (좌표 없음)
2. 사용자 선택: VWorld Geocoder API로 좌표 획득
3. 즐겨찾기: 좌표 포함하여 저장
4. 재사용: API 호출 없이 즉시 사용

**장점:**

- 빠른 초기 로드 (< 100ms)
- 효율적인 API 사용 (실제 선택한 것만)
- 국토교통부 공식 API로 정확한 한국 좌표
- Rate limit 문제 없음

#### 4. Tanstack Query (React Query)

**사용 이유:**

- 자동 캐싱: 같은 위치는 10분간 재사용
- 로딩/에러 상태 자동 관리
- 백그라운드 리페칭으로 최신 날씨 유지
- 중복 요청 방지

```typescript
export function useWeather(lat, lon, locationName) {
  return useQuery({
    queryKey: ["weather", lat, lon],
    queryFn: () => fetchWeatherData(lat, lon, locationName),
    staleTime: 1000 * 60 * 10, // 10분간 fresh
    gcTime: 1000 * 60 * 30, // 30분간 캐시
  });
}
```

#### 5. 로컬 스토리지 즐겨찾기

**선택 이유:**

- 백엔드 불필요 (프론트엔드만으로 완결)
- 브라우저 영구 저장
- 빠른 CRUD 작업

**제약사항:**

- 최대 6개 제한
- 중복 방지
- JSON 직렬화/역직렬화

## 🎯 구현 세부사항

### 검색 알고리즘

```typescript
function calculateMatchScore(address, query) {
  // 1. 정확히 일치: 100점
  if (address === query) return 100;

  // 2. 시작 부분 일치: 90점
  if (address.startsWith(query)) return 90;

  // 3. 포함 여부: 70점
  if (address.includes(query)) return 70;

  // 4. 부분 일치: 50-60점
  const parts = address.split("-");
  const matches = parts.filter((p) => p.includes(query));
  if (matches.length > 0) return 50 + matches.length * 10;

  return 0;
}
```

### 현재 위치 감지

```typescript
navigator.geolocation.getCurrentPosition(
  (position) => {
    const { latitude, longitude } = position.coords;
    // 좌표로 즉시 날씨 조회
    showWeather(latitude, longitude);
  },
  (error) => {
    // 권한 거부 또는 위치 서비스 비활성화 처리
    alert("위치 권한을 허용해주세요");
  },
);
```

### 날씨 데이터 캐싱 전략

- **10분 staleTime**: 날씨는 자주 변하지 않으므로 10분간 서버 요청 안함
- **30분 gcTime**: 30분간 메모리에 캐시 유지
- **위치별 캐싱**: `["weather", lat, lon]` 키로 위치마다 독립적 캐싱

## 📱 사용 시나리오

### 1. 첫 방문 사용자

1. 페이지 로드
2. "현재 위치 날씨 보기" 버튼 클릭
3. 위치 권한 허용
4. 현재 위치의 상세 날씨 정보 표시
5. 즐겨찾기에 추가 가능

### 2. 장소 검색 및 즐겨찾기 추가

1. 검색창에 "강남" 입력
2. 자동완성에서 "강남구, 서울특별시" 선택
3. 날씨 상세 정보 표시
4. "즐겨찾기 추가" 버튼 클릭
5. 별칭 수정 (예: "회사")
6. 메인 페이지로 돌아가면 카드로 표시됨

### 3. 즐겨찾기 관리

1. 즐겨찾기 카드의 연필 아이콘 클릭
2. 별칭 수정 (예: "집" → "우리집")
3. 저장
4. 카드 클릭 시 상세 날씨 확인
5. X 버튼으로 삭제 가능

## 🔧 환경 설정

### 필수 환경 변수

`.env.local` 파일을 생성하고 다음 API 키를 설정하세요:

```env
NEXT_PUBLIC_VWORLD_API_KEY=your_vworld_api_key_here
NEXT_PUBLIC_WEATHER_API_KEY=your_weather_api_key_here
```

### API 정보

**VWorld Geocoder API:**

- **용도**: 주소 → 좌표 변환
- **엔드포인트**: https://api.vworld.kr/req/address
- **발급**: https://www.vworld.kr (무료)
- **문서**: https://www.vworld.kr/dev/v4dv_geocoderguide2_s001.do

**날씨 API:**

- 현재 사용 중인 날씨 API 설정

## 🎨 UI/UX 특징

- **모던 디자인**: Tailwind CSS 4 활용
- **그라데이션 배경**: 현재 날씨 카드에 파란색 그라데이션
- **날씨 아이콘**: OpenWeatherMap 공식 아이콘
- **호버 효과**: 카드, 버튼 호버 시 시각적 피드백
- **로딩 상태**: Spinner로 명확한 로딩 표시
- **에러 처리**: 사용자 친화적 에러 메시지
- **키보드 네비게이션**: 접근성 향상

## 🚨 에러 처리

### 1. 위치 권한 거부

```
"위치 정보를 가져올 수 없습니다. 위치 권한을 허용해주세요."
```

### 2. API 키 미설정

```
"OpenWeatherMap API 키가 설정되지 않았습니다."
```

### 3. 날씨 데이터 없음

```
"해당 장소의 정보가 제공되지 않습니다."
```

### 4. 즐겨찾기 최대 개수 초과

```
"최대 6개까지만 추가할 수 있습니다."
```

## 📊 데이터 흐름

```
사용자 입력 (검색/위치)
    ↓
Location Entity (주소 → 좌표)
    ↓
Weather Entity (좌표 → 날씨 API)
    ↓
React Query 캐싱
    ↓
UI 컴포넌트 (표시)
    ↓
Favorite Entity (로컬 스토리지 저장)
```

## 🔄 업데이트 주기

- **날씨 데이터**: 10분마다 자동 갱신 (React Query staleTime)
- **즐겨찾기**: 실시간 (로컬 스토리지 즉시 반영)
- **검색 결과**: 300ms 디바운스

## 🛠️ 사용한 기술 스택

### Core

- **Next.js 16.1** - React 프레임워크
- **React 19.2** - UI 라이브러리
- **TypeScript 5** - 타입 안정성

### 상태 관리

- **Tanstack Query 5.62** - 서버 상태 관리
- **React Hooks** - 로컬 상태 관리

### API & Data

- **VWorld Geocoder API** - 주소 좌표 변환 (국토교통부)
- **날씨 API** - 날씨 데이터
- **ky 1.7** - HTTP 클라이언트
- **Geolocation API** - 현재 위치
- **Local Storage API** - 즐겨찾기

### 스타일링

- **Tailwind CSS 4** - 유틸리티 CSS

## 📈 성능 최적화

1. **JSON 데이터 캐싱**: 주소 데이터를 메모리에 한 번만 로드
2. **React Query 캐싱**: 날씨 데이터 중복 요청 방지
3. **디바운스**: 검색 입력 300ms 지연
4. **코드 스플리팅**: Next.js 자동 최적화
5. **이미지 최적화**: Next.js Image 컴포넌트 (아이콘은 외부 URL)

## 🔐 보안 고려사항

- API 키는 `.env.local`에 저장 (git 제외)
- `NEXT_PUBLIC_` 접두사로 클라이언트 노출 명시
- VWorld API는 도메인 제한 설정 권장
- 로컬 스토리지는 민감 정보 저장 안함
- HTTPS 사용 권장 (Geolocation API 요구사항)

## 🐛 알려진 제약사항

1. **좌표 정확도**: 동/읍/면 단위는 상위 시/구 좌표 사용
   - 날씨는 넓은 지역 기준이므로 실사용에 문제 없음
2. **API 호출 제한**: 무료 플랜 1,000 calls/day
3. **로컬 스토리지**: 브라우저별 독립적 저장 (기기 간 동기화 안됨)
4. **역지오코딩 미지원**: 현재 위치는 "현재 위치"로만 표시

## 🎯 향후 개선 가능 사항

1. **역지오코딩**: 현재 위치 좌표 → 주소 변환
2. **주간 예보**: 7일 날씨 추가
3. **날씨 알림**: 특정 날씨 조건 시 알림
4. **테마**: 날씨에 따른 동적 배경/테마
5. **공유 기능**: URL로 특정 위치 공유
6. **PWA**: 오프라인 지원, 설치 가능
7. **백엔드 연동**: 사용자 계정, 클라우드 동기화

## 📝 라이선스

MIT License

## 👤 개발자

FSD 아키텍처 기반 날씨 앱 프로젝트
