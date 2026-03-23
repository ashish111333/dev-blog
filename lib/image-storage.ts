import crypto from "node:crypto";
import path from "node:path";
import { v2 as cloudinary } from "cloudinary";

declare global {
  // eslint-disable-next-line no-var
  var __devBlogCloudinaryConfigured: boolean | undefined;
}

function sanitizeFileName(fileName: string) {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (!cloudName || !apiKey || !apiSecret) {
    return null;
  }

  return {
    cloudName,
    apiKey,
    apiSecret,
    folder: process.env.CLOUDINARY_FOLDER?.trim() || "systems-notes"
  };
}

function configureCloudinary() {
  const config = getCloudinaryConfig();

  if (!config) {
    return null;
  }

  if (!global.__devBlogCloudinaryConfigured) {
    cloudinary.config({
      cloud_name: config.cloudName,
      api_key: config.apiKey,
      api_secret: config.apiSecret
    });
    global.__devBlogCloudinaryConfigured = true;
  }

  return config;
}

export function imageStorageConfigured() {
  return Boolean(getCloudinaryConfig());
}

export async function uploadImage(input: {
  fileName: string;
  contentType: string;
  buffer: Buffer;
}) {
  const config = configureCloudinary();

  if (!config) {
    throw new Error("Missing Cloudinary environment variables.");
  }

  const extension = path.extname(input.fileName) || ".png";
  const baseName = path.basename(input.fileName, extension);
  const safeName = sanitizeFileName(baseName) || "image";
  const assetId = `${safeName}-${crypto.randomUUID()}`;
  const dataUri = `data:${input.contentType};base64,${input.buffer.toString("base64")}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: config.folder,
    public_id: assetId,
    resource_type: "image",
    overwrite: false
  });

  return {
    publicId: `${config.folder}/${assetId}`,
    url: result.secure_url
  };
}
