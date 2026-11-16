"use client";

import { useActionState } from "react";
import { saveChild, type FormState } from "@/app/actions";
import { GRADES } from "@/lib/constants";
import type { Child } from "@/lib/demo";
import SubmitButton from "./SubmitButton";

export default function ChildForm({ child }: { child?: Child }) {
  const [state, action] = useActionState<FormState, FormData>(saveChild, {});
  const err = (name: string) =>
    state.errors?.[name] ? (
      <span className="field-error" id={`${name}-error`}>
        {state.errors[name]}
      </span>
    ) : null;
  const aria = (name: string) =>
    state.errors?.[name] ? { "aria-invalid": true as const, "aria-describedby": `${name}-error` } : {};

  return (
    <form action={action} className="card form-pad" noValidate>
      {child && <input type="hidden" name="id" value={child.id} />}
      <div className="field">
        <label htmlFor="name">Child's first name</label>
        <input id="name" name="name" defaultValue={child?.name} autoComplete="off" required {...aria("name")} />
        {err("name")}
      </div>
      <div className="field-row">
        <div className="field">
          <label htmlFor="school">School</label>
          <input id="school" name="school" defaultValue={child?.school} required {...aria("school")} />
          {err("school")}
        </div>
        <div className="field">
          <label htmlFor="grade">Grade</label>
          <select id="grade" name="grade" defaultValue={child?.grade ?? ""} required {...aria("grade")}>
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
      <div className="field">
        <label htmlFor="allergies">
          Allergies or dietary needs <span className="optional">(optional)</span>
        </label>
        <input id="allergies" name="allergies" defaultValue={child?.allergies} placeholder="e.g. no dairy" />
      </div>
      <div className="field">
        <label htmlFor="notes">
          Notes for the kitchen <span className="optional">(optional)</span>
        </label>
        <input id="notes" name="notes" defaultValue={child?.notes} placeholder="e.g. small portion please" />
      </div>
      <SubmitButton className="btn btn-block" pendingText="Saving…">
        {child ? "Save changes" : "Add child"}
      </SubmitButton>
    </form>
  );
}
