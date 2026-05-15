import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./sections/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./animations/**/*.{ts,tsx}"
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem"
      }
    },
    extend: {
      colors: {
        ink: "#03070d",
        void: "#060912",
        panel: "#0b111d",
        line: "rgba(180, 221, 255, 0.14)",
        plasma: {
          cyan: "#22d3ee",
          mint: "#5eead4",
          violet: "#a78bfa",
          rose: "#fb7185",
          amber: "#fbbf24"
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-space-grotesk)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular", "monospace"]
      },
      backgroundImage: {
        "radial-grid":
          "radial-gradient(circle at 50% 0%, rgba(34, 211, 238, 0.22), transparent 32rem), linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
        "signal-line":
          "linear-gradient(90deg, transparent, rgba(94, 234, 212, 0.8), rgba(167, 139, 250, 0.7), transparent)"
      },
      boxShadow: {
        glow: "0 0 50px rgba(34, 211, 238, 0.2)",
        panel: "0 18px 70px rgba(0, 0, 0, 0.42)"
      },
      keyframes: {
        scan: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" }
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" }
        }
      },
      animation: {
        scan: "scan 3s linear infinite",
        pulseGlow: "pulseGlow 3.5s ease-in-out infinite"
      }
    }
  },
  plugins: [typography]
};

export default config;
