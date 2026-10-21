/** Adire-inspired pattern and warm light behind the whole page. */
export function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <svg className="size-full text-pink-300/45">
        <defs>
          <pattern
            id="adire"
            width="76"
            height="76"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M38 4 72 38 38 72 4 38Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.75"
            />
            <circle cx="38" cy="38" r="2.5" fill="currentColor" />
            <circle cx="0" cy="0" r="1.5" fill="currentColor" />
            <circle cx="76" cy="0" r="1.5" fill="currentColor" />
            <circle cx="0" cy="76" r="1.5" fill="currentColor" />
            <circle cx="76" cy="76" r="1.5" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#adire)" opacity="0.16" />
      </svg>

      <div className="absolute -top-40 left-1/2 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-green-500/20 blur-[120px]" />
      <div className="absolute -top-24 right-[-10rem] h-[30rem] w-[30rem] rounded-full bg-pink-500/12 blur-[120px]" />
      <div className="absolute bottom-[-14rem] left-[-10rem] h-[32rem] w-[32rem] rounded-full bg-tan-600/18 blur-[130px]" />
    </div>
  );
}
