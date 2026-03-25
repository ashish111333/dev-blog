"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import {
  adminCredentialsMatch,
  clearAdminSession,
  requireAdminSession,
  setAdminSession
} from "@/lib/auth";
import { createPost } from "@/lib/posts";
import { slugify } from "@/lib/utils";

export type ActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function loginAction(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  try {
    if (!adminCredentialsMatch(email, password)) {
      return {
        status: "error",
        message: "These credentials do not match your private dashboard."
      };
    }
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error && error.message.includes("Missing")
          ? "Set ADMIN_EMAIL, ADMIN_PASSWORD, and AUTH_SECRET to unlock the dashboard."
          : "The dashboard could not verify your credentials."
    };
  }

  await setAdminSession(email);
  redirect("/dashboard");
}

export async function logoutAction() {
  await clearAdminSession();
}

export async function createPostAction(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdminSession();

  const title = String(formData.get("title") ?? "").trim();
  const rawSlug = String(formData.get("slug") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const coverImage = String(formData.get("coverImage") ?? "").trim();
  const slug = slugify(rawSlug || title);

  if (!title || !excerpt || !content) {
    return {
      status: "error",
      message: "Title, excerpt, and content are required."
    };
  }

  if (!slug) {
    return {
      status: "error",
      message: "A valid slug could not be generated from the title."
    };
  }

  try {
    await createPost({
      title,
      slug,
      excerpt,
      content,
      coverImage: coverImage || null
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("duplicate key")) {
      return {
        status: "error",
        message: "That slug already exists. Pick a different one."
      };
    }

    if (error instanceof Error && error.message.includes("DATABASE_URL")) {
      return {
        status: "error",
        message: "Set DATABASE_URL before publishing posts."
      };
    }

    throw error;
  }

  revalidateTag("posts");
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/dashboard");

  return {
    status: "success",
    message: "Post published successfully."
  };
}
