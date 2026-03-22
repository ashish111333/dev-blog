import crypto from "node:crypto";
import path from "node:path";
import { Storage } from "@google-cloud/storage";

declare global {
  // eslint-disable-next-line no-var
  var __devBlogStorageClient: Storage | undefined;
}

function sanitizeFileName(fileName: string) {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getBucketName() {
  return process.env.GCS_BUCKET_NAME?.trim() || null;
}

function getPublicBaseUrl() {
  return (
    process.env.GCS_PUBLIC_BASE_URL?.trim().replace(/\/+$/g, "") || null
  );
}

function getUploadPrefix() {
  return (
    process.env.GCS_UPLOAD_PREFIX?.trim().replace(/^\/+|\/+$/g, "") ||
    "blog-images"
  );
}

function getStorageClient() {
  const projectId = process.env.GOOGLE_CLOUD_PROJECT?.trim();

  const storage =
    global.__devBlogStorageClient ??
    new Storage(projectId ? { projectId } : undefined);

  if (process.env.NODE_ENV !== "production") {
    global.__devBlogStorageClient = storage;
  }

  return storage;
}

function buildPublicUrl(bucketName: string, objectPath: string) {
  const publicBaseUrl = getPublicBaseUrl();
  const encodedPath = objectPath.split("/").map(encodeURIComponent).join("/");

  if (publicBaseUrl) {
    return `${publicBaseUrl}/${encodedPath}`;
  }

  return `https://storage.googleapis.com/${bucketName}/${encodedPath}`;
}

export function cloudStorageConfigured() {
  return Boolean(getBucketName());
}

export async function uploadImageToCloudStorage(input: {
  fileName: string;
  contentType: string;
  buffer: Buffer;
}) {
  const bucketName = getBucketName();

  if (!bucketName) {
    throw new Error("Missing GCS_BUCKET_NAME environment variable.");
  }

  const extension = path.extname(input.fileName) || ".png";
  const safeName = sanitizeFileName(path.basename(input.fileName, extension)) || "image";
  const objectPath = `${getUploadPrefix()}/${safeName}-${crypto.randomUUID()}${extension}`;
  const storage = getStorageClient();
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(objectPath);

  await file.save(input.buffer, {
    metadata: {
      contentType: input.contentType,
      cacheControl: "public, max-age=31536000, immutable"
    },
    resumable: false
  });

  return {
    objectPath,
    url: buildPublicUrl(bucketName, objectPath)
  };
}
