# Deploy To Cloud Run

This app is ready to run on Google Cloud Run with:

- Neon Postgres for the database
- Google Cloud Storage for blog images
- Secret Manager for sensitive runtime values

## 1. Create the bucket

Create a bucket for blog images and make it readable by the public if you want direct image URLs:

```bash
gcloud storage buckets create gs://YOUR_BUCKET_NAME --location=US-CENTRAL1
gcloud storage buckets add-iam-policy-binding gs://YOUR_BUCKET_NAME \
  --member=allUsers \
  --role=roles/storage.objectViewer
```

## 2. Create secrets

Store the sensitive app values in Secret Manager:

```bash
printf '%s' 'YOUR_DATABASE_URL' | gcloud secrets create dev-blog-database-url --data-file=-
printf '%s' 'YOUR_ADMIN_PASSWORD' | gcloud secrets create dev-blog-admin-password --data-file=-
printf '%s' 'YOUR_AUTH_SECRET' | gcloud secrets create dev-blog-auth-secret --data-file=-
```

If the secrets already exist, add a new version instead:

```bash
printf '%s' 'YOUR_DATABASE_URL' | gcloud secrets versions add dev-blog-database-url --data-file=-
printf '%s' 'YOUR_ADMIN_PASSWORD' | gcloud secrets versions add dev-blog-admin-password --data-file=-
printf '%s' 'YOUR_AUTH_SECRET' | gcloud secrets versions add dev-blog-auth-secret --data-file=-
```

## 3. Let Cloud Run read the secrets and write to the bucket

Replace `PROJECT_NUMBER` and `SERVICE_ACCOUNT_EMAIL` as needed. The default Cloud Run runtime identity is usually:

`PROJECT_NUMBER-compute@developer.gserviceaccount.com`

Grant:

```bash
gcloud secrets add-iam-policy-binding dev-blog-database-url \
  --member=serviceAccount:SERVICE_ACCOUNT_EMAIL \
  --role=roles/secretmanager.secretAccessor

gcloud secrets add-iam-policy-binding dev-blog-admin-password \
  --member=serviceAccount:SERVICE_ACCOUNT_EMAIL \
  --role=roles/secretmanager.secretAccessor

gcloud secrets add-iam-policy-binding dev-blog-auth-secret \
  --member=serviceAccount:SERVICE_ACCOUNT_EMAIL \
  --role=roles/secretmanager.secretAccessor

gcloud storage buckets add-iam-policy-binding gs://YOUR_BUCKET_NAME \
  --member=serviceAccount:SERVICE_ACCOUNT_EMAIL \
  --role=roles/storage.objectUser
```

## 4. Deploy

You can deploy directly from source. Since this repo includes a `Dockerfile`, Cloud Run will build with that Dockerfile:

```bash
gcloud run deploy systems-notes \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --set-env-vars ADMIN_EMAIL=you@gmail.com,GOOGLE_CLOUD_PROJECT=your-gcp-project-id,GCS_BUCKET_NAME=your-public-bucket-name,GCS_PUBLIC_BASE_URL=https://storage.googleapis.com/your-public-bucket-name,GCS_UPLOAD_PREFIX=blog-images \
  --set-secrets DATABASE_URL=dev-blog-database-url:latest,ADMIN_PASSWORD=dev-blog-admin-password:latest,AUTH_SECRET=dev-blog-auth-secret:latest
```

## 5. Optional custom domain

After deploy, map your domain from the Cloud Run console or with `gcloud run domain-mappings`.

## Notes

- Keep the service in a low-cost region like `us-central1`.
- Use Secret Manager for `DATABASE_URL`, `ADMIN_PASSWORD`, and `AUTH_SECRET`.
- The bucket can stay public for reads while uploads remain private to your service account.
