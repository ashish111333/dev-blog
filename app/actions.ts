"use server";

import { createSubscriber } from "@/lib/posts";
import { isValidEmail } from "@/lib/utils";

export type ActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function subscribeAction(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!email) {
    return { status: "error", message: "Email is required." };
  }

  if (!email.endsWith("@gmail.com")) {
    return {
      status: "error",
      message: "Only Gmail addresses are allowed for now."
    };
  }

  if (!isValidEmail(email)) {
    return { status: "error", message: "Enter a valid email address." };
  }

  try {
    await createSubscriber(email);
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error && error.message.includes("DATABASE_URL")
          ? "Subscriptions will work once DATABASE_URL is set."
          : "Could not save your subscription right now."
    };
  }

  return {
    status: "success",
    message: "You are subscribed. New posts will have your Gmail on the list."
  };
}
