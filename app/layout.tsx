import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";


const prompt = Prompt({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "Rapid Medical Demo",
  description: "Showcasing The Capabilities of Rapid Medical",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${prompt.className} min-h-[calc(100dvh)] bg-white`}>{children}</body>
    </html>
  );
}
