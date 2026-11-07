"use client";

import { useEffect, useState } from "react";
import { FallingLeaves } from "falling-leaves/react";

// 24x24 viewBox dagi SVG path'lar (faqat kontur)
const SHAPES: Record<string, string[]> = {
  cap: [
    "M12 4 2 9l10 5 10-5z",
    "M6 11.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-4.5",
    "M22 9v6",
  ],
  star: ["M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"],
  sparkle: ["M12 3c.6 5 4 8.4 9 9-5 .6-8.4 4-9 9-.6-5-4-8.4-9-9 5-.6 8.4-4 9-9z"],
  diamond: ["M12 4l6 8-6 8-6-8z"],
};

const PALETTES = {
  dark: [
    { shape: "cap", color: "#3DDC97" },
    { shape: "star", color: "#F2D06B" },
    { shape: "sparkle", color: "#7CFFC4" },
    { shape: "diamond", color: "#D4AF37" },
  ],
  light: [
    { shape: "cap", color: "#1d885d" },
    { shape: "star", color: "#D4AF37" },
    { shape: "sparkle", color: "#1d885d" },
    { shape: "diamond", color: "#D4AF37" },
  ],
};

function makeNeonIcon(paths: string[], color: string, glow: number, px = 96) {
  const canvas = document.createElement("canvas");
  canvas.width = px;
  canvas.height = px;
  const ctx = canvas.getContext("2d")!;

  const pad = 16; // glow uchun bo'sh joy
  const scale = (px - pad * 2) / 24;
  ctx.translate(pad, pad);
  ctx.scale(scale, scale);
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  const shapes = paths.map((d) => new Path2D(d));

  // 1) Neon yorug'lik (glow)
  ctx.shadowColor = color;
  ctx.shadowBlur = glow;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.4;
  shapes.forEach((p) => ctx.stroke(p));

  // 2) Yorqin ingichka o'zak (neon naychasi effekti)
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "rgba(255,255,255,0.75)";
  ctx.lineWidth = 0.5;
  shapes.forEach((p) => ctx.stroke(p));

  return canvas;
}

export default function Leaves() {
  const [images, setImages] = useState<HTMLCanvasElement[] | null>(null);
  const [count, setCount] = useState(14);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    const palette = isDark ? PALETTES.dark : PALETTES.light;
    const glow = isDark ? 22 : 4; // yorug' fonda glow kuchsiz

    setImages(
      palette.map(({ shape, color }) =>
        makeNeonIcon(SHAPES[shape], color, glow)
      )
    );
    setCount(window.innerWidth < 768 ? 8 : 14);
  }, []);

  if (!images) return null;

  return (
    <FallingLeaves
      fullScreen
      images={images}
      count={count}
      size={[20, 34]}
      speed={[0.4, 1]}
      wind={[-0.2, 0.4]}
      rotationSpeed={[-0.6, 0.6]}
      opacity={0.9}
      zIndex={10}
    />
  );
}