# Vercel Deployment

Deploy the backend and frontend as separate Vercel projects.

## Backend

Set the Vercel project root directory to `backend`. Add these environment variables for Production, Preview, and Development as appropriate:

- `MONGODB_URI`: a newly rotated MongoDB Atlas connection string
- `MONGODB_DB`: `diva_admin`
- `PUBLIC_APP_ORIGINS`: the exact deployed frontend origin(s), comma-separated if needed, for example `https://your-store.vercel.app`

The API is exported from `api/index.js`; `server.js` is only the local development launcher. Ensure Atlas network access allows the deployment to connect.

## Frontend

Create a second Vercel project with root directory `frontend`. Set `VITE_API_URL` to the deployed backend origin, `https://divac-two.vercel.app`, then redeploy so Vite includes it in the build. Add that frontend project's exact deployment origin to the backend's `PUBLIC_APP_ORIGINS`, then redeploy the backend. The local Vite proxy is for development only; production browser requests go directly to the API and require this CORS allowlist.

Never commit real `.env` files or credentials. The backend `.env.example` contains placeholders only.