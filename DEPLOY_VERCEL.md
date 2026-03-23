# Deploy To Vercel

This app is ready to deploy on Vercel with:

- Neon Postgres for blog data
- Cloudinary for blog images

## 1. Create a Cloudinary account

Create a free Cloudinary account and copy:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Optionally choose a folder value such as:

- `CLOUDINARY_FOLDER=systems-notes`

## 2. Import the repo into Vercel

- go to the Vercel dashboard
- import your GitHub repository
- keep the framework as `Next.js`

## 3. Add environment variables

Add these in the Vercel project settings:

- `DATABASE_URL`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `AUTH_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLOUDINARY_FOLDER`

## 4. Deploy

- click deploy
- after the first deploy, any env var change requires a redeploy

## Notes

- Vercel Hobby is fine for a personal blog
- Cloudinary handles image hosting, so Vercel does not need persistent disk
- your dashboard login remains protected by the server-side auth already in the app
- the environment variable list is also available in `vercel.env.example`
