# SEO 설정 가이드

이 프로젝트에 적용된 SEO 최적화 목록입니다.

## 📋 적용된 SEO 설정

### 1. 메타데이터 (Metadata)

#### Root Layout (`app/layout.tsx`)

- ✅ 기본 title과 description
- ✅ Template title (모든 페이지에 "| Real Weather" 자동 추가)
- ✅ Keywords
- ✅ Open Graph 태그 (소셜 미디어 공유용)
- ✅ Twitter Card
- ✅ Robots 메타태그
- ✅ 언어 설정 (한국어)

#### 페이지별 메타데이터

- ✅ 홈페이지 (`app/page.tsx`) - 정적 메타데이터
- ✅ 날씨 상세 페이지 (`app/weather/page.tsx`) - 동적 메타데이터 (위치별)

### 2. Structured Data (JSON-LD)

`shared/components/json-ld.tsx` 에 구조화된 데이터 컴포넌트 추가:

- ✅ WebSite schema (검색 기능 포함)
- ✅ Place schema (날씨 정보용, 필요시 사용)

### 3. 사이트맵 & Robots

- ✅ `app/sitemap.ts` - 자동 sitemap.xml 생성
- ✅ `app/robots.ts` - robots.txt 설정
- ✅ `app/manifest.ts` - PWA manifest (앱처럼 설치 가능)

### 4. Next.js 설정 (`next.config.ts`)

- ✅ 압축 활성화
- ✅ 이미지 최적화 (AVIF, WebP)
- ✅ `poweredByHeader: false` (보안)
- ✅ React Strict Mode

## 🚀 추가 작업 필요 사항

### 1. Open Graph 이미지 생성

`/public` 폴더에 다음 이미지를 추가하세요:

```
/public/og-image.png      (1200x630px)
/public/icon-192.png      (192x192px)
/public/icon-512.png      (512x512px)
```

#### 빠른 생성 방법:

- Canva, Figma 등을 사용하여 브랜드 이미지 생성
- 또는 임시로 단색 배경에 "Real Weather" 텍스트만 넣어도 OK

### 2. 환경 변수 설정

`.env.local` 파일에 다음 추가:

```bash
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

**로컬 개발시**: `http://localhost:3000` (기본값)
**프로덕션**: 실제 배포된 도메인 URL

### 3. 검색엔진 등록

#### Google Search Console

1. https://search.google.com/search-console 접속
2. 속성 추가
3. 소유권 확인
4. sitemap 제출: `https://your-domain.com/sitemap.xml`

인증 코드를 받았다면 `app/layout.tsx`의 `verification` 부분 주석 해제:

```typescript
verification: {
  google: 'your-verification-code',
}
```

#### Naver Search Advisor

1. https://searchadvisor.naver.com/ 접속
2. 사이트 등록
3. 소유권 확인
4. sitemap 제출

인증 코드를 받았다면:

```typescript
verification: {
  other: {
    'naver-site-verification': 'your-naver-code'
  }
}
```

### 4. 성능 최적화

추가로 고려할 사항:

- ✅ 이미지 lazy loading (Next.js Image 컴포넌트 사용)
- ✅ 코드 스플리팅 (Next.js 자동 처리)
- 🔄 폰트 최적화 (`next/font` 사용 권장)
- 🔄 Analytics 추가 (GA4, Vercel Analytics 등)

### 5. SEO 체크리스트

배포 전 확인:

- [ ] 모든 페이지에 고유한 title/description
- [ ] OG 이미지 준비
- [ ] NEXT_PUBLIC_APP_URL 환경변수 설정
- [ ] robots.txt 접근 가능 (`/robots.txt`)
- [ ] sitemap.xml 접근 가능 (`/sitemap.xml`)
- [ ] manifest.json 접근 가능 (`/manifest.json`)
- [ ] 모바일 반응형 체크
- [ ] 페이지 로딩 속도 체크 (Lighthouse)

## 🔍 SEO 테스트 도구

- **Lighthouse**: Chrome DevTools > Lighthouse 탭
- **Google Rich Results Test**: https://search.google.com/test/rich-results
- **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
- **Twitter Card Validator**: https://cards-dev.twitter.com/validator

## 📊 모니터링

배포 후:

- Google Search Console에서 색인 상태 확인
- 검색 쿼리 분석
- Core Web Vitals 모니터링
- 페이지 로딩 속도 추적

## 💡 팁

1. **정기적 업데이트**: sitemap의 `lastModified`는 자동으로 현재 날짜로 설정됨
2. **동적 메타데이터**: 날씨 페이지는 URL 파라미터에 따라 메타데이터 자동 변경
3. **한국어 최적화**: 한국어 키워드와 설명으로 네이버, 다음 검색엔진에도 최적화됨
