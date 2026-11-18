import type { Metadata } from "next";

import { Chat } from "@/components/Chat";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Practice — Èdè Wa",
  description:
    "Ìjíròrò, a patient AI conversation partner for practising everyday Yorùbá.",
};

export default function PracticePage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10 sm:py-24">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-pink-600 uppercase">
            Ìjíròrò · AI conversation partner
          </p>

          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-green-950 sm:text-5xl">
            Pick a moment. Start talking.
          </h1>

          <p className="mt-5 text-base leading-8 text-green-900/70">
            Ìjíròrò replies in Yorùbá with an English translation underneath,
            and gives you one gentle tip when something could be said better.
            Mistakes are the whole point.
          </p>
        </div>

        <div className="mt-12">
          <Chat />
        </div>
      </div>
    </SiteShell>
  );
}
