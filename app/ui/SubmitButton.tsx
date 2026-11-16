"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton({
  className,
  pendingText,
  children,
}: {
  className: string;
  pendingText?: string;
  children: React.ReactNode;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={className} disabled={pending}>
      {pending && pendingText ? pendingText : children}
    </button>
  );
}
