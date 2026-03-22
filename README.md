# Dev Blog

A minimal dark-mode blog in Next.js with:

- a public `/blog` endpoint
- a private `/dashboard` endpoint for writing posts
- Neon Postgres storage for posts and subscribers
- Google Cloud Storage image uploads for cover and inline blog images

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env.local` and fill in:

- `DATABASE_URL`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `AUTH_SECRET`
- `GOOGLE_CLOUD_PROJECT`
- `GCS_BUCKET_NAME`
- `GCS_PUBLIC_BASE_URL`
- `GCS_UPLOAD_PREFIX`

3. Configure Google credentials:

- on GCP, attach a service account with `Storage Object User` access to the bucket
- locally, use Application Default Credentials or set `GOOGLE_APPLICATION_CREDENTIALS` to a service-account JSON path
- make sure the bucket is publicly readable if you want blog images to load directly from the generated URL
- a common setup is granting `Storage Object Viewer` on the bucket to `allUsers` for reads while keeping writes restricted to your service account

4. Start the app:

```bash
npm run dev
```

5. Open:

- `http://localhost:3000/blog`
- `http://localhost:3000/dashboard`

## Notes

- The dashboard is protected by a cookie-backed login using your `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
- Uploaded images are stored in Google Cloud Storage and inserted into posts as public URLs.
- The database tables auto-create on first access, but the SQL is also included in `sql/schema.sql`.
- For Cloud Run deployment, see `DEPLOY_CLOUD_RUN.md`.
