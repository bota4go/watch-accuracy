import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        app: {
          a1: "var(--app-a1)",
          a2: "var(--app-a2)",
          fg: "var(--app-fg)",
          muted: "var(--app-muted)",
          in: "var(--app-input-fg)",
          body: "var(--app-body)",
          card: "var(--app-card)",
          line: "var(--app-line)",
          dash: "var(--app-dashed)",
          "record-b": "var(--app-record-border)",
          "record-fg": "var(--app-record-fg)",
          "btn-b": "var(--app-btn-primary-border)",
          "btn-fg": "var(--app-btn-primary-fg)",
          "btn-n": "var(--app-btn-nudge)",
        },
      },
    },
  },
  plugins: [],
};
export default config;
