"use client";

import { useActionState } from "react";
import { loginAction, type ActionState } from "@/app/dashboard/actions";
import { SubmitButton } from "@/components/submit-button";

const initialState: ActionState = {
  status: "idle",
  message: ""
};

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <form className="panel stack" action={formAction}>
      <div className="field">
        <label htmlFor="admin-email">Admin email</label>
        <input
          id="admin-email"
          className="input"
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@gmail.com"
        />
      </div>

      <div className="field">
        <label htmlFor="admin-password">Password</label>
        <input
          id="admin-password"
          className="input"
          type="password"
          name="password"
          required
          autoComplete="current-password"
          placeholder="Your private dashboard password"
        />
      </div>

      <div className="button-row">
        <SubmitButton label="Enter dashboard" pendingLabel="Checking..." />
      </div>

      <p
        className={`status ${state.status === "error" ? "error" : ""} ${
          state.status === "success" ? "success" : ""
        }`}
      >
        {state.message}
      </p>
    </form>
  );
}
