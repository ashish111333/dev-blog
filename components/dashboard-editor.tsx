"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createPostAction, type ActionState, logoutAction } from "@/app/dashboard/actions";
import { SubmitButton } from "@/components/submit-button";

const initialState: ActionState = {
  status: "idle",
  message: ""
};

type DashboardEditorProps = {
  adminEmail: string;
};

export function DashboardEditor({ adminEmail }: DashboardEditorProps) {
  const router = useRouter();
  const [state, formAction] = useActionState(createPostAction, initialState);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [content, setContent] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const [isUploading, startUploadTransition] = useTransition();
  const [isLoggingOut, startLogoutTransition] = useTransition();

  useEffect(() => {
    if (state.status === "success") {
      setTitle("");
      setSlug("");
      setExcerpt("");
      setCoverImage("");
      setContent("");
      router.refresh();
    }
  }, [router, state.status]);

  async function handleUpload(file: File) {
    const payload = new FormData();
    payload.set("file", file);
    setUploadMessage("");

    const response = await fetch("/api/upload", {
      method: "POST",
      body: payload
    });

    const data = (await response.json()) as { error?: string; url?: string };

    if (!response.ok || !data.url) {
      throw new Error(data.error || "Upload failed.");
    }

    setCoverImage((current) => current || data.url!);
    setContent((current) =>
      current
        ? `${current}\n\n![${file.name}](${data.url})`
        : `![${file.name}](${data.url})`
    );
    setUploadMessage("Image uploaded to Cloudinary and inserted into the post.");
  }

  return (
    <div className="stack">
      <section className="panel">
        <div className="split">
          <div className="stack">
            <span className="eyebrow">Private dashboard</span>
            <h1 className="section-title">Write and publish</h1>
            <p className="muted">
              Logged in as {adminEmail}. New posts publish directly to your public blog.
            </p>
          </div>

          <div className="button-row">
            <button
              type="button"
              className="ghost-button"
              onClick={() =>
                startLogoutTransition(() => {
                  void (async () => {
                    await logoutAction();
                    router.push("/dashboard/login");
                    router.refresh();
                  })();
                })
              }
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Leaving..." : "Log out"}
            </button>
          </div>
        </div>
      </section>

      <form className="editor stack" action={formAction}>
        <div className="input-grid">
          <div className="field">
            <label htmlFor="post-title">Title</label>
            <input
              id="post-title"
              className="input"
              name="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Designing for developers at midnight"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="post-slug">Slug</label>
            <input
              id="post-slug"
              className="input code"
              name="slug"
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              placeholder="leave blank to auto-generate"
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="post-excerpt">Excerpt</label>
          <textarea
            id="post-excerpt"
            className="textarea"
            name="excerpt"
            value={excerpt}
            onChange={(event) => setExcerpt(event.target.value)}
            placeholder="A short summary for the blog list and homepage."
            required
            rows={3}
          />
        </div>

        <div className="input-grid">
          <div className="field">
            <label htmlFor="cover-image">Cover image URL</label>
            <input
              id="cover-image"
              className="input code"
              name="coverImage"
              value={coverImage}
              onChange={(event) => setCoverImage(event.target.value)}
              placeholder="https://res.cloudinary.com/your-cloud/image/upload/v1234/systems-notes/example.png"
            />
          </div>

          <div className="field">
            <label htmlFor="image-upload">Upload image</label>
            <input
              id="image-upload"
              className="hidden-input"
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0];

                if (!file) {
                  return;
                }

                startUploadTransition(() => {
                  void (async () => {
                    try {
                      await handleUpload(file);
                    } catch (error) {
                      setUploadMessage(
                        error instanceof Error ? error.message : "Upload failed."
                      );
                    } finally {
                      event.target.value = "";
                    }
                  })();
                });
              }}
            />
            <label className="upload-button" htmlFor="image-upload">
              {isUploading ? "Uploading..." : "Choose an image"}
            </label>
          </div>
        </div>

        <div className="field">
          <label htmlFor="post-content">Content</label>
          <textarea
            id="post-content"
            className="textarea code"
            name="content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder={`# Your title\n\nWrite with simple markdown.\n\n![Alt text](https://res.cloudinary.com/your-cloud/image/upload/v1234/systems-notes/example.png)`}
            required
          />
          <p className={`status ${uploadMessage ? "success" : ""}`}>{uploadMessage}</p>
        </div>

        <div className="button-row">
          <SubmitButton label="Publish post" pendingLabel="Publishing..." />
        </div>

        <p
          className={`status ${state.status === "error" ? "error" : ""} ${
            state.status === "success" ? "success" : ""
          }`}
        >
          {state.message}
        </p>
      </form>
    </div>
  );
}
