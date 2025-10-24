Full Stack Blog (MERN + GraphQL)

Overview

Simple full-stack blog: React frontend, Node + GraphQL backend, MongoDB for storage. View posts and add new posts.

Stack

- React + Vite + Apollo Client
- Node + Express + Apollo Server
- MongoDB + Mongoose

Prerequisites

- Node.js 18+ and npm
- MongoDB running locally or a MongoDB Atlas connection string

Getting Started

1) Clone and install

```bash
git clone <your-repo-url> Blog_Application
cd Blog_Application

```

2) Configure backend

Create `server/.env` with:

```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/blog_app
```

3) Install dependencies


install in each app:

```bash
cd server && npm install && cd ..
cd client && npm install && cd ..
```

4) Run apps

In two terminals:

```bash
cd server && npm run dev
```

```bash
cd client && npm run dev
```

Open the app at `http://localhost:5173`. GraphQL endpoint is `http://localhost:4000/graphql`.

Deployment

- Backend: Provide `MONGODB_URI` and run `npm start` in `server`.
- Frontend: Run `npm run build` in `client`, then serve `client/dist`.

Notes

- CORS is enabled on the backend for local development.
- You can override the frontend GraphQL URL via `VITE_GRAPHQL_URL`.


