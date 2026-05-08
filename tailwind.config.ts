import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/data/**/*.{js,ts}",
  ],
  safelist: [
    {pattern: /bg-gradient-to-(br|tr|bl|tl|t|r|b|l)/},
    {pattern: /(from|via|to)-(clay|brass|sand|bone|limestone|evening|midnight|ink)-(\d{2,3})/, variants: []},
    {pattern: /(from|via|to)-(clay|brass|sand|bone|limestone|evening|midnight|ink)-(\d{2,3})\/\d+/},
    {pattern: /(from|via|to)-(bone|sand-100|brass-500|clay-(400|700)|limestone-200|evening-600|midnight-950)/},
  ],
  theme: {
    extend: {
      colors: {
        clay: {
          400: "#D9886B",
          700: "#B8552E",
        },
        midnight: {
          950: "#1A1F2E",
        },
        sand: {
          100: "#F4EFE6",
        },
        bone: "#FAFAF7",
        ink: {
          DEFAULT: "#1F1A14",
          "08": "rgba(31, 26, 20, 0.08)",
          "12": "rgba(31, 26, 20, 0.12)",
          "20": "rgba(31, 26, 20, 0.20)",
          "40": "rgba(31, 26, 20, 0.40)",
          "60": "rgba(31, 26, 20, 0.60)",
        },
        evening: { 600: "#3D4A6B" },
        brass:   { 500: "#B89968" },
        limestone: { 200: "#DDD3C3" },
        cream: {
          "20": "rgba(244, 239, 230, 0.2)",
          "40": "rgba(244, 239, 230, 0.4)",
          "60": "rgba(244, 239, 230, 0.6)",
        },
        success: "#5C8A5C",
        warning: "#C9994A",
        error:   "#A84432",
        info:    "#4A6B7C",
      },
      fontFamily: {
        serif:  ["var(--font-serif)", "Georgia", "Times New Roman", "serif"],
        sans:   ["var(--font-sans)", "Helvetica Neue", "Calibri", "system-ui", "sans-serif"],
        arabic: ["var(--font-arabic)", "Noto Sans Arabic", "system-ui", "sans-serif"],
        mono:   ["var(--font-mono)", "ui-monospace", "SF Mono", "Menlo", "monospace"],
      },
      fontSize: {
        "display-xl": ["clamp(56px, 8vw, 96px)", { lineHeight: "1.02", letterSpacing: "-0.012em", fontWeight: "700" }],
        "display":    ["clamp(40px, 5.5vw, 64px)", { lineHeight: "1.05", letterSpacing: "-0.012em", fontWeight: "700" }],
        "section":    ["clamp(32px, 3.5vw, 44px)", { lineHeight: "1.1",  letterSpacing: "-0.005em", fontWeight: "700" }],
        "lede":       ["clamp(18px, 1.8vw, 26px)", { lineHeight: "1.45", fontWeight: "400" }],
        "body":       ["16px", { lineHeight: "1.65" }],
        "eyebrow":    ["13px", { lineHeight: "1", letterSpacing: "0.32em", fontWeight: "600" }],
      },
      letterSpacing: {
        wordmark: "0.32em",
      },
      backgroundImage: {
        "paper-grain":
          "radial-gradient(circle at 13% 27%, rgba(31,26,20,.018) 0 1px, transparent 1.5px)," +
          "radial-gradient(circle at 71% 49%, rgba(31,26,20,.018) 0 1px, transparent 1.5px)," +
          "radial-gradient(circle at 39% 81%, rgba(31,26,20,.022) 0 1px, transparent 1.5px)," +
          "radial-gradient(circle at 88% 12%, rgba(31,26,20,.018) 0 1px, transparent 1.5px)",
        "midnight-glow":
          "radial-gradient(ellipse at 20% 30%, rgba(184,85,46,0.06), transparent 55%)," +
          "radial-gradient(ellipse at 80% 80%, rgba(184,153,104,0.04), transparent 60%)",
      },
      backgroundSize: {
        "paper-grain": "41px 41px, 53px 53px, 67px 67px, 47px 47px",
      },
      maxWidth: {
        prose: "62ch",
      },
    },
  },
  plugins: [],
};
export default config;
