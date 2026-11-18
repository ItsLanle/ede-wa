"use client";

import { useFormStatus } from "react-dom";

import { Spinner } from "./PostForm";

/** A form button that shows a spinner while its server action runs. */
export function SubmitButton({
  children,
  pendingText,
  className,
}: {
  children: React.ReactNode;
  pendingText?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={`inline-flex items-center gap-2 disabled:opacity-60 ${className ?? ""}`}
    >
      {pending && <Spinner className="size-3.5" />}
      {pending && pendingText ? pendingText : children}
    </button>
  );
}
