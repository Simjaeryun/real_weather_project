import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { WebsiteJsonLd } from "@/shared/components/json-ld";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-noto-sans",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "날씨 - 실시간 날씨 정보",
    template: "%s | 날씨",
  },
  description:
    "전국 실시간 날씨 정보를 확인하세요. 기온, 습도, 강수량, 풍속 등 상세한 날씨 데이터를 제공합니다.",
  keywords: [
    "날씨",
    "날씨 정보",
    "실시간 날씨",
    "기온",
    "강수량",
    "습도",
    "풍속",
    "날씨 예보",
    "한국 날씨",
  ],
  authors: [{ name: "날씨 앱" }],
  creator: "날씨 앱",
  publisher: "날씨 앱",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL as string),
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "/",
    siteName: "날씨",
    title: "날씨 - 실시간 날씨 정보",
    description:
      "전국 실시간 날씨 정보를 확인하세요. 기온, 습도, 강수량, 풍속 등 상세한 날씨 데이터를 제공합니다.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "날씨",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "날씨 - 실시간 날씨 정보",
    description:
      "전국 실시간 날씨 정보를 확인하세요. 기온, 습도, 강수량, 풍속 등 상세한 날씨 데이터를 제공합니다.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={notoSansKr.variable}>
      <head>
        <WebsiteJsonLd />
      </head>
      <body className={`${notoSansKr.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
