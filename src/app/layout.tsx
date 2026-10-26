import type { Metadata } from "next";
import { Geist, Geist_Mono, Lora } from "next/font/google";
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

// Headings. Unlike Fraunces, Lora stacks a tone mark on a dotted letter (ẹ̀, ọ́).
const lora = Lora({
  variable: "--font-lora",
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
      className={`${geistSans.variable} ${geistMono.variable} ${lora.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
