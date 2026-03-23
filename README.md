# Systems Notes

A minimal dark-theme blog in Next.js with:

- a public `/blog` endpoint
- a private `/dashboard` endpoint for writing posts
- Neon Postgres storage for posts and subscribers
- Cloudinary image uploads for cover and inline blog images
- Vercel-friendly deployment flow

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
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLOUDINARY_FOLDER`

3. Create a Cloudinary account:

- create a free Cloudinary account
- copy your cloud name, API key, and API secret from the Cloudinary dashboard
- optionally choose a folder name like `systems-notes` for uploaded blog images

4. Start the app:

```bash
npm run dev
```

5. Open:

- `http://localhost:3000/blog`
- `http://localhost:3000/dashboard`

## Vercel Deploy

1. Push this repo to GitHub.
2. Import the repo into Vercel.
3. Add the same values from `.env.local` into the Vercel project environment variables.
4. Redeploy after any env var change.

## Notes

- The dashboard is protected by a cookie-backed login using your `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
- Uploaded images are stored in Cloudinary and inserted into posts as public URLs.
- The database tables auto-create on first access, but the SQL is also included in `sql/schema.sql`.
- For Vercel deployment, set the same env vars in your Vercel project settings and redeploy.
- See `DEPLOY_VERCEL.md` for the quick deploy path.
