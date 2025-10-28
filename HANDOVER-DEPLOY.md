# Option A Deployment - Access Needed and Steps

## Access to Share with Me

- Render account invite (or a Deploy Key/Token)
  - Role: member with rights to create a Web Service
- Vercel project invite (or org invite)
  - Role: member with rights to create a project
- Secrets:
  - `OPENROUTER_API_KEY`
  - `GOOGLE_API_KEY` (optional)

## What I Will Do

1. Backend (Render)
   - Use `render.yaml` to create `amrutam-backend` service
   - Set env vars: `OPENROUTER_API_KEY`, `GOOGLE_API_KEY`
   - Confirm health at `/health`
   - Share the public URL (e.g., https://amrutam-backend.onrender.com)

2. Frontend (Vercel)
   - Import the `amrutam-ai` subfolder as project
   - Set env var `BACKEND_URL` to the Render URL from step 1
   - Build and deploy
   - Share the Vercel URL

## Post-Deployment

- Upload/verify `best_efficientnet.pth` is present on backend root
- Test endpoints:
  - `GET /health`
  - `POST /api/skin` with sample image
  - `POST /api/remedy` with sample payload

You can revoke my access after I provide the live links.
