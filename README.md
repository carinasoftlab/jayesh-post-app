Blog App (MERN + GraphQL) – Project Guide & Documentation

Overview

Modern blog application with a redesigned UI, username-based auth, and GraphQL API. Posts are displayed as responsive cards, creation happens in a modal, and profile posts are editable via a popup. Caching ensures new posts appear instantly across Home and My Posts.

Key Features

- Username authentication: register/login with username + password (no email)
- JWT auth via HTTP-only cookie; session restored automatically
- Post feed as responsive cards grid (Home)
- Compose modal to create a post (with cache updates to show instantly)
- My Posts dashboard with edit/delete; edit in a modal popup
- Route guard for private pages
- Animated UI with framer-motion
- Toast notifications with sonner
- Tailwind-based design using teal/emerald palette

Monorepo Structure

```
.
├─ client/
│  ├─ src/
│  │  ├─ graphql/operations.js           # Apollo queries/mutations
│  │  ├─ ui/components/
│  │  │  ├─ Topbar.jsx                   # Top navigation; shows @username
│  │  │  ├─ PostGrid.jsx                 # Cards grid for posts (Home)
│  │  │  ├─ ComposeDialog.jsx            # Modal to compose a post
│  │  │  └─ AuthGate.jsx                 # Route protection helper
│  │  ├─ views/
│  │  │  ├─ HomeView.jsx                 # Landing (posts + compose)
│  │  │  ├─ AuthLogin.jsx                # Login (username+password)
│  │  │  ├─ AuthRegister.jsx             # Register (username+password)
│  │  │  └─ DashboardPosts.jsx           # /me - my posts (edit modal)
│  │  ├─ App.jsx                         # Routes + ApolloProvider
│  │  ├─ main.jsx                        # Mount + Toaster
│  │  └─ index.css                       # Tailwind
│  └─ package.json
└─ server/
   ├─ src/
   │  ├─ index.js                        # Express + Apollo setup
   │  ├─ typeDefs.js                     # GraphQL Schema (gql)
   │  ├─ api.js                          # Resolvers (Query/Mutation)
   │  ├─ auth.js                         # JWT + cookie helpers
   │  └─ models/
   │     ├─ Account.js                   # User model (username + passwordHash)
   │     └─ Article.js                   # Post model (title, content, author)
   └─ package.json
```

Tech Stack

- Client: React 18, Vite, Apollo Client, Tailwind CSS, framer-motion, sonner
- Server: Node.js, Express, Apollo Server, Mongoose, JWT (httpOnly cookie)
- DB: MongoDB (local or Atlas)

Auth Model

- Login/Registration uses username + password only
- JWT is issued and stored in cookie `jid`
- Cookie is httpOnly; in dev: sameSite=lax; in prod: sameSite=none, secure=true
- The server attaches `userId` to GraphQL context based on cookie

GraphQL API

Schema (simplified)

```
type Post {
  id: ID!
  title: String!
  content: String!
  createdAt: String!
  author: User
}

type User {
  id: ID!
  username: String!
  createdAt: String!
}

type Query {
  posts: [Post!]!
  me: User
  myPosts: [Post!]!
  post(id: ID!): Post
}

type Mutation {
  addPost(title: String!, content: String!): Post!
  updatePost(id: ID!, title: String, content: String): Post!
  deletePost(id: ID!): Boolean!
  register(username: String!, password: String!): User!
  login(username: String!, password: String!): User!
  logout: Boolean!
}
```

Resolvers (high level)

- posts: newest first, author populated
- myPosts: requires auth; filters by `author: userId`
- addPost/updatePost/deletePost: all require auth
- register: creates account with unique `username`
- login: validates credentials and sets cookie
- logout: clears cookie

Client Operations

- queries:
  - GET_POSTS → { id, title, content, createdAt, author { id, username } }
  - ME → { id, username }
  - MY_POSTS → { id, title, content, createdAt }
- mutations:
  - ADD_POST(title, content) → Post; updates GET_POSTS and MY_POSTS cache
  - UPDATE_POST(id, title?, content?) → Post
  - DELETE_POST(id) → Boolean
  - REGISTER(username, password) → User
  - LOGIN(username, password) → User
  - LOGOUT → Boolean

UI/UX Highlights

- Topbar: shows @username when logged in; includes Login/Logout
- HomeView: left column Compose; right column Latest Posts grid
- PostGrid: responsive 1/2/3 columns; card hover effects
- ComposeDialog: modal with title/content; updates Apollo cache for immediate UI
- DashboardPosts (/me): grid layout (1 col mobile, 2 cols ≥ sm); edit opens as modal
- Animations: subtle entrance/hover animations via framer-motion
- Toasts: success/error via sonner

Setup & Configuration

Prerequisites

- Node.js 18+ and npm
- MongoDB connection string

Server environment (.env or environment variables)

```
PORT=4000
MONGODB_URI=your-mongodb-uri # supports <PASSWORD> replacement with MONGODB_PASSWORD
MONGODB_PASSWORD=optional-password-token
JWT_SECRET=your-secret
NODE_ENV=development
```

Client environment (optional)

```
VITE_GRAPHQL_URL=http://localhost:4000/graphql
```

Install & Run

```bash
# from repo root
cd server && npm install && cd ..
cd client && npm install && cd ..

# run backend
cd server && npm run dev

# run frontend (in a second terminal)
cd client && npm run dev
```

Open `http://localhost:5173` (default Vite dev server). The API listens at `http://localhost:4000/graphql`.

Build & Deploy

- Backend: `npm run build` (if configured) or run `npm start` in production with `PORT`, `MONGODB_URI`, and `JWT_SECRET` set
- Frontend: `npm run build` → serve `client/dist` via any static host (Netlify, Vercel, Nginx, S3)
- CORS: the server enables `credentials: true`; ensure your production frontend origin is allowed
- Cookies: for cross-site, ensure HTTPS and `sameSite=none` (happens automatically in production mode)

Common Workflows

- Create a post: Login → Home → Compose → Publish → instantly visible on Home and My Posts
- Edit a post: /me → Edit → modal opens → Save Changes
- Delete a post: /me → Delete → toast confirms

Customization Points

- Theme: Tailwind classes in `views/` and `ui/components/`
- Animations: framer-motion props in components
- Toasts: calls to `toast.success|error` (sonner)
- GraphQL: extend `typeDefs.js` and `api.js`; update `operations.js`

Troubleshooting

- Cookies not set locally: ensure you’re accessing the client via http://localhost and server runs on http://localhost:4000; CORS credentials enabled
- Empty feeds: check MongoDB connection and that you’ve created at least one post
- Username taken: server enforces unique usernames; pick a different one

Security Notes

- Passwords are hashed with bcrypt
- JWT stored in httpOnly cookie to mitigate XSS token theft
- Avoid logging sensitive information

License

MIT

