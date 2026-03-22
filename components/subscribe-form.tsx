"use client";

import { useActionState } from "react";
import { subscribeAction, type ActionState } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";

const initialState: ActionState = {
  status: "idle",
  message: ""
};

export function SubscribeForm() {
  const [state, formAction] = useActionState(subscribeAction, initialState);

  return (
    <form className="subscribe-form" action={formAction}>
      <div className="subscribe-row">
        <div className="field">
          <label htmlFor="subscriber-email">Subscribe with Gmail</label>
          <input
            id="subscriber-email"
            className="input"
            type="email"
            name="email"
            placeholder="yourname@gmail.com"
            autoComplete="email"
            required
          />
        </div>

        <div className="field">
          <label>&nbsp;</label>
          <SubmitButton label="Subscribe" pendingLabel="Subscribing..." />
        </div>
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
