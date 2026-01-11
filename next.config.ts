import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 압축 활성화
  compress: true,

  // 이미지 최적화
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Trailing slash 설정
  trailingSlash: false,

  // 파워드 바이 헤더 제거 (보안)
  poweredByHeader: false,

  // 리액트 스트릭트 모드
  reactStrictMode: true,
};

export default nextConfig;
