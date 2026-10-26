import { Audiences } from "@/components/landing/Audiences";
import { FinalCta } from "@/components/landing/FinalCta";
import { Hero } from "@/components/landing/Hero";
import { Intro } from "@/components/landing/Intro";
import { Pillars } from "@/components/landing/Pillars";
import { Practice } from "@/components/landing/Practice";
import { WordOfTheDay } from "@/components/landing/WordOfTheDay";
import { SiteShell } from "@/components/SiteShell";

// Re-render hourly so the word of the day changes soon after midnight UTC.
export const revalidate = 3600;

export default function Home() {
  return (
    <SiteShell>
      <Hero />
      <Intro />
      <Audiences />
      <Pillars />
      <Practice />
      <WordOfTheDay />
      <FinalCta />
    </SiteShell>
  );
}
