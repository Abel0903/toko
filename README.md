# Webshop Project (frontend + backend)

This is a minimal example project for a game product storefront with:
- React + Vite frontend
- Node.js + Express backend
- MongoDB models and Midtrans integration (example)
- Admin routes (JWT), basic security middleware

See .env.example in backend for required environment variables.

To build frontend:
- cd frontend
- npm install
- npm run build

To run backend locally:
- cd backend
- npm install
- set MONGO_URI in .env
- node server.js

This project is prepared for quick deploy to Vercel (frontend) and Render/Railway (backend).
