import { ImageResponse } from "next/og";

export const alt = "link";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// 기본 폰트에 한글이 없어 영문 로고로 구성
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#2ac1bc",
          color: "#ffffff",
          fontSize: 200,
          fontWeight: 800,
          letterSpacing: -6,
        }}
      >
        <div
          style={{
            display: "flex",
            width: 220,
            height: 220,
            borderRadius: 56,
            background: "#ffd600",
            marginRight: 56,
          }}
        />
        link
      </div>
    ),
    size
  );
}
