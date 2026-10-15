# Branda V2 Commerce Starter

A deployable full-stack e-commerce starter with a Next.js App Router frontend and an Express + TypeScript API backend.

## Included
- Responsive storefront with search, category filters, product cards and product details
- Persistent browser cart (localStorage)
- Checkout form that creates an order through the API
- Backend product listing, product detail, order creation, order listing and simple admin product CRUD endpoints
- JSON-file persistence for demo/starter deployment
- Basic metadata, robots.txt, sitemap.xml and product structured data
- Health endpoint and CORS configuration

## Important limitations
- This is a functional starter/demo, not a production-ready commerce system.
- Checkout records orders but does **not** collect payment or process real card transactions.
- The included admin endpoints are not protected with authentication. Add real authentication/authorization before exposing them publicly.
- JSON-file storage is suitable for local demos only and is not reliable for serverless/multi-instance deployments. Use PostgreSQL/Supabase or another managed database for production.
- Before taking real orders, add payment provider integration, email notifications, inventory reservation, validation/rate limiting, monitoring, tests, and privacy/legal pages.

## Requirements
- Node.js 20+
- npm

## 1. Start the backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```
The API runs on `http://localhost:4000`.

## 2. Start the frontend
In another terminal:
```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```
Open `http://localhost:3000`.

## Deployment
Deploy the frontend and backend as separate services.

### Backend
- Root directory: `backend`
- Build command: `npm install && npm run build`
- Start command: `npm start`
- Set `PORT` and `FRONTEND_ORIGIN` (your deployed frontend URL).
- Ensure the hosting platform provides persistent disk storage if using JSON persistence. Otherwise replace `backend/src/store.ts` with a managed database implementation.

### Frontend
- Root directory: `frontend`
- Build command: `npm install && npm run build`
- Start command: `npm start`
- Set `NEXT_PUBLIC_API_URL` to the deployed backend base URL, e.g. `https://your-api.example.com`.

## Demo admin API
Use these endpoints with an API client such as Postman:
- `GET /api/admin/orders`
- `POST /api/admin/products`
- `PATCH /api/admin/products/:id`
- `DELETE /api/admin/products/:id`

Example product body:
```json
{
  "name": "Canvas Tote",
  "description": "Everyday carry bag.",
  "price": 12000,
  "category": "Accessories",
  "image": "https://images.unsplash.com/photo-1544816155-12df9643f363?w=900",
  "stock": 12,
  "featured": true
}
```

Currency is configured as NGN in the UI. Edit `frontend/src/lib/format.ts` if you need a different currency.
