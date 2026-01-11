# 날씨 앱 아키텍처

## 핵심 전략: 필요시 Geocoding (Lazy Loading)

### 문제 인식

**시도했던 방법들:**

1. ❌ 하드코딩: 부정확, 유지보수 어려움
2. ❌ 서버 사전 Geocoding: 20,558개 → 6시간 소요, API lock
3. ✅ **필요시 Geocoding**: 사용자가 선택할 때만 호출 (VWorld API 사용)

### 최종 솔루션

**원칙:**

- 주소 목록은 즉시 로드 (좌표 없음)
- 좌표는 필요할 때만 API 호출
- 한번 조회한 좌표는 즐겨찾기에 저장

## 데이터 흐름

```
1. 페이지 로드 (SSR)
   - 20,558개 주소 목록만 로드 (< 100ms)
   - 좌표는 undefined

2. 사용자가 주소 검색
   - 로컬 검색 (빠름)
   - 좌표 없이 표시

3. 사용자가 주소 선택
   - VWorld Geocoder API 호출 (1-2초)
   - 좌표 획득
   - 날씨 API 호출

4. 즐겨찾기 추가
   - 좌표 포함하여 로컬스토리지 저장
   - 다음번엔 API 호출 없이 즉시 사용
```

## 구현 세부사항

### 1. 서버: 주소 목록만 제공

```typescript
// entities/location/api/location-server.ts
import koreaDistricts from "@/public/korea_districts.json";

const locations: Location[] = koreaDistricts.map((address) => ({
  ...parseAddress(address),
  lat: undefined, // 좌표 없음
  lon: undefined,
}));

export function getLocations(): Location[] {
  return locations;
}
```

**특징:**

- JSON import로 자동 캐싱
- 서버 메모리에 1회만 로드
- 빠른 응답 (< 1ms)

### 2. 클라이언트: 필요시 Geocoding

```typescript
// entities/location/api/geocode-client.ts
export async function geocodeLocation(
  location: Location,
): Promise<Location | null> {
  // VWorld Geocoder API 호출
  // "서울특별시-종로구-청운동" → "서울특별시 종로구 청운동"
  // 응답: { x: 경도, y: 위도 }
}
```

**호출 시점:**

- 사용자가 주소 선택
- 날씨 상세 페이지 진입

### 3. 즐겨찾기: 좌표 저장

```typescript
// entities/favorite/lib/storage.ts
export function addFavorite(favorite: Favorite) {
  // favorite.location에 lat, lon 포함
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}
```

**효과:**

- 즐겨찾기 장소는 API 호출 없이 즉시 표시
- 가장 자주 쓰는 장소만 캐싱
- 실용적이고 효율적

## 파일 구조

```
entities/location/
├── api/
│   ├── location-api.ts       # 클라이언트 검색 (로컬)
│   ├── location-server.ts    # 서버 주소 목록
│   └── geocode-client.ts     # 클라이언트 geocoding
└── lib/
    └── parser.ts             # 주소 파싱

app/
└── page.tsx                  # SSR, 주소 목록만 전달

widgets/
└── weather-dashboard/        # 필요시 geocoding
```

## 성능 지표

### 페이지 로드

- 주소 목록: < 100ms (20,558개)
- 메모리: ~2MB

### 사용자 인터랙션

- 주소 검색: < 10ms (로컬)
- Geocoding: 1-2초 (VWorld API)
- 날씨 조회: 500ms (날씨 API)

### 즐겨찾기

- 추가/삭제: < 10ms (로컬스토리지)
- 날씨 조회: 500ms (좌표 캐싱됨)

## 장점

**1. 빠른 초기 로드**

- 페이지 즉시 표시
- 20,558개 주소 즉시 검색 가능
- 사용자 대기 없음

**2. API 효율성**

- 실제 선택한 주소만 geocoding
- Rate limit 문제 없음
- 99%의 주소는 API 호출 안함

**3. 실용성**

- 사용자는 보통 3-5개 장소만 사용
- 즐겨찾기로 반복 사용
- 불필요한 API 호출 없음

**4. 간단함**

- 복잡한 캐싱 로직 불필요
- Next.js 표준 패턴
- 유지보수 쉬움

## 사용자 경험

### 첫 방문 사용자

```
1. 페이지 즉시 로드 ✅
2. "서울" 검색 → 즉시 결과 표시 ✅
3. "강남구" 선택 → 1-2초 로딩 ⏳
4. 날씨 정보 표시 ✅
5. 즐겨찾기 추가 ✅
```

### 재방문 사용자

```
1. 페이지 즉시 로드 ✅
2. 즐겨찾기에서 "강남구" 클릭 ✅
3. 날씨 정보 즉시 표시 ✅ (좌표 캐싱)
```

## 비용

- **API 호출**: 사용자당 3-10회 (즐겨찾기 추가)
- **무료 한도**: VWorld API 일일 한도 내 (국토교통부 공식)
- **메모리**: 2MB (주소 목록)
- **스토리지**: < 1KB (즐겨찾기 6개)

## 개선 가능성

### 1. React Query 캐싱

```typescript
export function useGeocode(location: Location) {
  return useQuery({
    queryKey: ["geocode", location.id],
    queryFn: () => geocodeLocation(location),
    staleTime: Infinity, // 영구 캐싱
  });
}
```

### 2. 인기 주소 사전 캐싱

```typescript
// 서울, 부산 등 주요 도시만 사전 geocoding
const POPULAR_LOCATIONS = ["서울특별시", "부산광역시", ...];
```

### 3. IndexedDB 사용

```typescript
// localStorage 대신 IndexedDB로 더 많은 주소 캐싱
```

## 결론

**필요시 Geocoding**이 최적의 솔루션:

- ✅ 빠른 초기 로드
- ✅ 효율적인 API 사용
- ✅ 실용적인 캐싱
- ✅ 간단한 구현
- ✅ 좋은 사용자 경험

**핵심:** 모든 것을 미리 하지 말고, 필요한 것만 필요할 때!
