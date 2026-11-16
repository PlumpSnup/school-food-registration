"use client";

import { useActionState } from "react";
import { kitchenLogin, type FormState } from "@/app/actions";
import SubmitButton from "./SubmitButton";

export default function KitchenLogin() {
  const [state, action] = useActionState<FormState, FormData>(kitchenLogin, {});
  return (
    <form action={action} className="card form-pad">
      <div className="field">
        <label htmlFor="password">Kitchen password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required />
      </div>
      {state.error && (
        <p className="form-error" role="alert">
          {state.error}
        </p>
      )}
      <SubmitButton className="btn btn-block" pendingText="Checking…">
        Open the kitchen
      </SubmitButton>
      <p className="hint">Same password as the admin page.</p>
    </form>
  );
}
