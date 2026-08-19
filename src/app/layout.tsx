import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// The vietnamese subset carries the dot-below vowels Yoruba needs (ẹ, ọ);
// latin-ext carries ṣ. Without both, diacritics fall back to a system font.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext", "vietnamese"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext", "vietnamese"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext", "vietnamese"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Èdè Wa — Our Language",
  description:
    "Learn Yorùbá the way it is actually spoken. Èdè Wa teaches tone, everyday conversation, and the culture behind the words — built for the diaspora.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
