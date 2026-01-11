import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Real Weather - 실시간 날씨 정보",
    short_name: "Real Weather",
    description: "전국 실시간 날씨 정보를 확인하세요",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#3b82f6",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
