import { Audiences } from "@/components/landing/Audiences";
import { Backdrop } from "@/components/landing/Backdrop";
import { FinalCta } from "@/components/landing/FinalCta";
import { Footer } from "@/components/landing/Footer";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Intro } from "@/components/landing/Intro";
import { Pillars } from "@/components/landing/Pillars";
import { Practice } from "@/components/landing/Practice";
import { WordOfTheDay } from "@/components/landing/WordOfTheDay";

// Re-render hourly so the word of the day changes soon after midnight UTC.
export const revalidate = 3600;

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-bisque-50 text-green-950">
      <Backdrop />
      <Header />

      <main className="relative z-10">
        <Hero />
        <Intro />
        <Audiences />
        <Pillars />
        <Practice />
        <WordOfTheDay />
        <FinalCta />
      </main>

      <Footer />
    </div>
  );
}
