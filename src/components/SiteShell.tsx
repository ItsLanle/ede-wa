import { Backdrop } from "@/components/landing/Backdrop";
import { Footer } from "@/components/landing/Footer";
import { Header } from "@/components/landing/Header";

/** Backdrop, header and footer shared by every page. */
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-bisque-50 text-green-950">
      <Backdrop />
      <Header />
      <main className="relative z-10">{children}</main>
      <Footer />
    </div>
  );
}
