"use client";

import { useActionState, useRef, useState } from "react";
import { requestCode, restartSignIn, verifyCode, type FormState } from "@/app/actions";
import SubmitButton from "./SubmitButton";

export function EmailForm({ next }: { next?: string }) {
  const [state, action] = useActionState<FormState, FormData>(requestCode, {});
  return (
    <form action={action} className="card form-pad" noValidate>
      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          aria-invalid={state.errors?.email ? true : undefined}
          aria-describedby={state.errors?.email ? "email-error" : undefined}
        />
        {state.errors?.email && (
          <span className="field-error" id="email-error">
            {state.errors.email}
          </span>
        )}
      </div>
      {next && <input type="hidden" name="next" value={next} />}
      <SubmitButton className="btn btn-block" pendingText="Sending…">
        Send my code
      </SubmitButton>
      <p className="hint">
        Trying the demo? Use <strong>sara@example.com</strong> to see a parent with lunches already ordered.
      </p>
    </form>
  );
}

export function CodeForm({ email, code, next }: { email: string; code: string; next?: string }) {
  const [state, action] = useActionState<FormState, FormData>(verifyCode, {});
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const boxes = useRef<(HTMLInputElement | null)[]>([]);

  function fill(from: number, value: string) {
    const chars = value.replace(/\D/g, "").slice(0, 6 - from).split("");
    if (chars.length === 0) return;
    setDigits((d) => {
      const copy = [...d];
      chars.forEach((c, i) => (copy[from + i] = c));
      return copy;
    });
    boxes.current[Math.min(from + chars.length, 5)]?.focus();
  }

  return (
    <form action={action} className="card form-pad">
      <p className="signin-email">
        Code sent to <strong>{email}</strong>
      </p>
      <div className="codebox" role="note">
        <span className="codebox-tag">Demo</span>
        Your code is <strong className="codebox-code">{code}</strong>
      </div>
      <fieldset className="field">
        <legend>Enter the 6-digit code</legend>
        <div className="digits">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                boxes.current[i] = el;
              }}
              value={d}
              inputMode="numeric"
              autoComplete={i === 0 ? "one-time-code" : "off"}
              aria-label={`Digit ${i + 1}`}
              className={d ? "digit filled" : "digit"}
              onChange={(e) => {
                if (e.target.value === "") setDigits((ds) => ds.map((x, j) => (j === i ? "" : x)));
                else fill(i, e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && !d && i > 0) boxes.current[i - 1]?.focus();
              }}
              onPaste={(e) => {
                e.preventDefault();
                fill(i, e.clipboardData.getData("text"));
              }}
            />
          ))}
        </div>
      </fieldset>
      <input type="hidden" name="code" value={digits.join("")} />
      {next && <input type="hidden" name="next" value={next} />}
      {state.error && (
        <p className="form-error" role="alert">
          {state.error}
        </p>
      )}
      <SubmitButton className="btn btn-block" pendingText="Signing in…">
        Sign in
      </SubmitButton>
      <button type="submit" formAction={restartSignIn} className="link-button">
        Use a different email
      </button>
    </form>
  );
}
