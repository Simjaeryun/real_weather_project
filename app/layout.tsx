import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { WebsiteJsonLd } from "@/shared/components/json-ld";

export const metadata: Metadata = {
  title: {
    default: "Real Weather - 실시간 날씨 정보",
    template: "%s | Real Weather",
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
  authors: [{ name: "Real Weather" }],
  creator: "Real Weather",
  publisher: "Real Weather",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL as string),
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "/",
    siteName: "Real Weather",
    title: "Real Weather - 실시간 날씨 정보",
    description:
      "전국 실시간 날씨 정보를 확인하세요. 기온, 습도, 강수량, 풍속 등 상세한 날씨 데이터를 제공합니다.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Real Weather",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Real Weather - 실시간 날씨 정보",
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
    <html lang="ko">
      <head>
        <WebsiteJsonLd />
      </head>
      <body className="antialiased bg-gray-50">
        <Providers>
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <h1 className="text-2xl font-bold text-gray-900">Real Weather</h1>
            </div>
          </header>
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
