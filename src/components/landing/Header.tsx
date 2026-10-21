export function Header() {
  return (
    <header className="relative z-10 border-b border-green-900/10 bg-bisque-50/90 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5 sm:px-10">
        <a href="#" className="flex items-center gap-3">
          <span
            aria-hidden
            className="flex size-10 items-center justify-center rounded-full bg-green-700 font-display text-lg font-semibold text-bisque-50 shadow-sm"
          >
            È
          </span>

          <span className="font-display text-xl font-semibold tracking-tight text-green-950">
            Èdè Wa
          </span>
        </a>

        <nav className="flex items-center gap-5 text-sm font-medium sm:gap-8">
          <a
            href="#who"
            className="hidden text-green-800 transition-colors hover:text-pink-600 sm:block"
          >
            Who it is for
          </a>

          <a
            href="#practice"
            className="hidden text-green-800 transition-colors hover:text-pink-600 sm:block"
          >
            Practice with AI
          </a>

          <a
            href="#begin"
            className="rounded-full bg-green-700 px-4 py-2.5 text-bisque-50 transition-all hover:bg-green-800 hover:shadow-md"
          >
            Start learning
          </a>
        </nav>
      </div>
    </header>
  );
}
