# Vercel Deployment

Deploy the backend and frontend as separate Vercel projects.

## Backend

Set the Vercel project root directory to `backend`. Add these environment variables for Production, Preview, and Development as appropriate:

- `MONGODB_URI`: a newly rotated MongoDB Atlas connection string
- `MONGODB_DB`: `diva_admin`
- `PUBLIC_APP_ORIGINS`: the exact deployed frontend origin, for example `https://your-store.vercel.app`

The API is exported from `api/index.js`; `server.js` is only the local development launcher. Ensure Atlas network access allows the deployment to connect.

## Frontend

Create a second Vercel project with root directory `frontend`. Set `REACT_APP_API` to the deployed backend origin, for example `https://your-api.vercel.app`, then redeploy so Create React App includes it in the build.

Never commit real `.env` files or credentials. The backend `.env.example` contains placeholders only.