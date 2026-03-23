import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requestIsAuthorized } from "@/lib/auth";
import { imageStorageConfigured, uploadImage } from "@/lib/image-storage";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  if (!requestIsAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!imageStorageConfigured()) {
    return NextResponse.json(
      { error: "Set Cloudinary env vars before uploading images." },
      { status: 500 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only images are allowed." }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "Image must be 5MB or smaller." },
      { status: 400 }
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploaded = await uploadImage({
      fileName: file.name,
      contentType: file.type,
      buffer
    });

    return NextResponse.json({
      url: uploaded.url
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Image upload to Cloudinary failed."
      },
      { status: 500 }
    );
  }
}
