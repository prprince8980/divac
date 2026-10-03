Frontend quick start:

1. cd frontend
2. npm install
3. npm run dev

During local development, Vite proxies `/api` and `/uploads` requests to the deployed backend, avoiding browser CORS checks. Set `VITE_API_URL` to the backend origin for production builds; leave it unset locally to use the proxy.
