import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://astra-ai.example"),
  title: {
    default: "ASTRA AI | Autonomous Intelligence for Modern Teams",
    template: "%s | ASTRA AI"
  },
  description:
    "ASTRA AI is a futuristic AI SaaS platform for orchestration, automation, analytics, and secure enterprise-grade intelligence.",
  keywords: ["ASTRA AI", "AI SaaS", "automation", "agent orchestration", "enterprise AI"],
  authors: [{ name: "ASTRA AI" }],
  openGraph: {
    title: "ASTRA AI",
    description: "Autonomous intelligence for modern teams.",
    url: "https://astra-ai.example",
    siteName: "ASTRA AI",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "ASTRA AI",
    description: "Autonomous intelligence for modern teams."
  },
  robots: {
    index: true,
    follow: true
  }
};

export const viewport: Viewport = {
  themeColor: "#03070d",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body>{children}</body>
    </html>
  );
}
