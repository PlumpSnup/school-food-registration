"use client";

import Image from "next/image";
import { useState } from "react";
import { GRADES, PLANS } from "@/lib/constants";

type Status = "idle" | "sending" | "created" | "duplicate";

export default function WaitlistForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const payload = {
      parentName: data.get("parentName"),
      email: data.get("email"),
      phone: data.get("phone"),
      school: data.get("school"),
      grade: data.get("grade"),
      plan: data.get("plan"),
      allergies: data.get("allergies"),
      consent: data.get("consent") === "on",
      website: data.get("website"),
    };

    setStatus("sending");
    setErrors({});
    setFormError("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (res.ok) {
        setStatus(json.status === "duplicate" ? "duplicate" : "created");
        return;
      }
      if (json.errors) setErrors(json.errors);
      setFormError(json.error ?? "Please check the highlighted fields.");
    } catch {
      setFormError("We couldn't reach the server. Please check your connection and try again.");
    }
    setStatus("idle");
  }

  if (status === "created" || status === "duplicate") {
    return (
      <div className="form-card thanks" role="status">
        <Image src="/bee.png" alt="" width={256} height={256} className="thanks-bee" />
        <h3>{status === "created" ? "You're on the list!" : "You're already on the list!"}</h3>
        <p>
          {status === "created"
            ? "Thanks for joining. We'll be in touch as soon as MealBee is ready at your child's school."
            : "We already have your email, so there's nothing more to do. We'll be in touch soon."}
        </p>
      </div>
    );
  }

  const err = (name: string) =>
    errors[name] ? (
      <span className="field-error" id={`${name}-error`}>
        {errors[name]}
      </span>
    ) : null;
  const aria = (name: string) =>
    errors[name] ? { "aria-invalid": true, "aria-describedby": `${name}-error` } : {};

  return (
    <form className="form-card" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="parentName">Parent&apos;s name</label>
        <input id="parentName" name="parentName" autoComplete="name" required {...aria("parentName")} />
        {err("parentName")}
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" required {...aria("email")} />
          {err("email")}
        </div>
        <div className="field">
          <label htmlFor="phone">
            Phone <span className="optional">(optional)</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+971 50 123 4567"
            {...aria("phone")}
          />
          {err("phone")}
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="school">Child&apos;s school</label>
          <input id="school" name="school" required {...aria("school")} />
          {err("school")}
        </div>
        <div className="field">
          <label htmlFor="grade">Grade</label>
          <select id="grade" name="grade" required defaultValue="" {...aria("grade")}>
            <option value="" disabled>
              Choose a grade
            </option>
            {GRADES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          {err("grade")}
        </div>
      </div>

      <fieldset className="field" {...aria("plan")}>
        <legend>Which are you interested in?</legend>
        <div className="choices">
          {Object.entries(PLANS).map(([value, label]) => (
            <label key={value} className="choice">
              <input type="radio" name="plan" value={value} required />
              <span>{label}</span>
            </label>
          ))}
        </div>
        {err("plan")}
      </fieldset>

      <div className="field">
        <label htmlFor="allergies">
          Allergies or dietary needs <span className="optional">(optional)</span>
        </label>
        <textarea id="allergies" name="allergies" rows={2} placeholder="e.g. dairy-free, vegetarian" />
      </div>

      <div className="hp" aria-hidden="true">
        <label htmlFor="website">Leave this empty</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="field">
        <label className="consent">
          <input type="checkbox" name="consent" required {...aria("consent")} />
          <span>
            I&apos;m the child&apos;s parent or guardian, and I agree that MealBee can contact me about its launch.
          </span>
        </label>
        {err("consent")}
      </div>

      {formError && (
        <p className="form-error" role="alert">
          {formError}
        </p>
      )}

      <button type="submit" className="btn btn-block" disabled={status === "sending"}>
        {status === "sending" ? "Joining…" : "Join the waitlist"}
      </button>
    </form>
  );
}
