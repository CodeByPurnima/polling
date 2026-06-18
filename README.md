# 🗳️ Polling API — Real-Time Polls with Live Updates

A feature-rich **REST API** for creating, voting on, and analyzing polls — with **real-time vote updates** powered by Socket.IO. Built with Express 5, MongoDB, and JWT authentication.

---

## ✨ Features

- **🔐 Authentication** — Secure signup/login with bcrypt-hashed passwords and JWT tokens
- **📝 Poll Management** — Create, list, view, and delete polls with multiple options
- **🗳️ Voting** — Cast and update votes with ownership and expiry validation
- **📊 Analytics** — Poll creators can view live/closed status and total response counts
- **⚡ Real-Time Updates** — Socket.IO broadcasts vote changes instantly to all connected clients
- **🛡️ Input Validation** — Request schemas validated with Zod
- **🕒 Poll Expiry** — Automatic active/closed filtering based on `endsAt` timestamps
- **🧩 Modular Architecture** — Clean separation of routes, controllers, models, DTOs, and middleware

---

## 🛠️ Tech Stack

| Layer          | Technology                          |
| -------------- | ----------------------------------- |
| Runtime        | Node.js (ES Modules)                |
| Framework      | Express 5                           |
| Database       | MongoDB via Mongoose 9              |
| Authentication | JWT (`jsonwebtoken`) + bcrypt        |
| Validation     | Zod 4                               |
| Real-Time      | Socket.IO 4                         |
| Package Mgr    | pnpm                                |

---

## 📁 Project Structure

```
polling/
└── backend/
    ├── server.js                         # Entry point — HTTP server + Socket.IO init
    ├── package.json
    ├── .env                              # Environment variables (not committed)
    └── src/
        ├── modules/
        │   ├── app.js                    # Express app factory & route mounting
        │   ├── controllers/
        │   │   ├── auth.controller.js    # Signup, login, profile
        │   │   ├── poll.controller.js    # CRUD operations on polls
        │   │   ├── vote.controller.js    # Vote casting, updating, listing
        │   │   └── analytics.controller.js  # Poll analytics
        │   ├── routes/
        │   │   ├── auth.routes.js        # POST /signup, /login — GET /me
        │   │   ├── poll.routes.js        # Poll CRUD routes
        │   │   ├── vote.routes.js        # Vote routes
        │   │   └── analytics.routes.js   # Analytics route
        │   ├── models/
        │   │   ├── user.model.js         # User schema
        │   │   ├── poll.model.js         # Poll schema with embedded options
        │   │   └── vote.model.js         # Vote reference schema
        │   ├── dto/
        │   │   └── auth.dto.js           # Zod schemas for signup/login
        │   └── middlewares/
        │       └── auth.middleware.js     # JWT verification middleware
        └── common/
            ├── config/
            │   ├── db.js                 # MongoDB connection
            │   └── socket.js             # Socket.IO setup & room management
            └── utils/
                ├── api-error.js          # Custom ApiError class
                ├── api-response.js       # Standardized ApiResponse class
                └── token.js              # JWT token helpers
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **pnpm** ≥ 11 (auto-downloaded if missing via `devEngines`)
- **MongoDB** instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/polling.git
cd polling/backend
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Create a `.env` file in the `backend/` directory:

```env
PORT=8000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<db-name>
JWT_SECRET=your_super_secret_key
```

### 4. Start the server

```bash
node server.js
```

The server will start at **`http://localhost:8000`** (or your configured `PORT`).

---

## 📡 API Reference

All endpoints are prefixed with `/api`. Protected routes require a `Bearer` token in the `Authorization` header.

### Auth

| Method | Endpoint      | Auth | Description               |
| ------ | ------------- | ---- | ------------------------- |
| POST   | `/api/signup` | ❌   | Register a new user       |
| POST   | `/api/login`  | ❌   | Login & receive JWT token |
| GET    | `/api/me`     | ✅   | Get current user profile  |

<details>
<summary><strong>Request / Response Examples</strong></summary>

**POST `/api/signup`**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepass123"
}
```

**POST `/api/login`**
```json
{
  "email": "john@example.com",
  "password": "securepass123"
}
// Response → { "success": true, "message": "User logged in", "data": "<jwt_token>" }
```

</details>

---

### Polls

| Method | Endpoint          | Auth | Description                          |
| ------ | ----------------- | ---- | ------------------------------------ |
| POST   | `/api/poll`       | ✅   | Create a new poll                    |
| GET    | `/api/polls`      | ❌   | List all polls (`?filter=active` or `?filter=closed`) |
| GET    | `/api/my-polls`   | ✅   | List polls created by current user   |
| GET    | `/api/poll/:id`   | ❌   | Get poll details by ID               |
| DELETE | `/api/poll/:id`   | ✅   | Delete a poll (owner only)           |

<details>
<summary><strong>Request / Response Examples</strong></summary>

**POST `/api/poll`**
```json
{
  "question": "What's your favorite programming language?",
  "description": "Pick the language you use the most",
  "options": [
    { "text": "JavaScript" },
    { "text": "Python" },
    { "text": "Go" },
    { "text": "Rust" }
  ],
  "allowMultipleVotes": false,
  "endsAt": "2026-07-01T00:00:00.000Z"
}
```

**GET `/api/polls?filter=active`**
```json
{
  "success": true,
  "message": "Polls fetched",
  "data": [ { "question": "...", "options": [...], "endsAt": "...", ... } ]
}
```

</details>

---

### Voting

| Method | Endpoint              | Auth | Description                     |
| ------ | --------------------- | ---- | ------------------------------- |
| POST   | `/api/poll/:id/vote`  | ✅   | Cast a vote on a poll           |
| PUT    | `/api/poll/:id/vote`  | ✅   | Update an existing vote         |
| GET    | `/api/poll/:id/votes` | ✅   | Get all votes for a poll (owner only) |

<details>
<summary><strong>Request / Response Examples</strong></summary>

**POST `/api/poll/:id/vote`**
```json
{
  "option": "667a1b2c3d4e5f6a7b8c9d0e"
}
// Response → { "success": true, "message": "Voted successfully", "data": { ... } }
```

</details>

---

### Analytics

| Method | Endpoint                    | Auth | Description                         |
| ------ | --------------------------- | ---- | ----------------------------------- |
| GET    | `/api/poll/:id/analytics`   | ✅   | Get poll analytics (owner only)     |

<details>
<summary><strong>Response Example</strong></summary>

```json
{
  "success": true,
  "message": "Analytics fetched",
  "data": {
    "status": "live",
    "totalResponse": 42
  }
}
```

</details>

---

## ⚡ Real-Time Events (Socket.IO)

The server uses Socket.IO to push live vote updates to connected clients.

### Client → Server Events

| Event         | Payload    | Description                       |
| ------------- | ---------- | --------------------------------- |
| `join-poll`   | `pollId`   | Subscribe to a poll's live updates |
| `leave-poll`  | `pollId`   | Unsubscribe from a poll room      |

### Server → Client Events

| Event          | Payload                                          | Description                          |
| -------------- | ------------------------------------------------ | ------------------------------------ |
| `vote-updated` | `{ pollId, options, totalResponses }` | Broadcast when a vote is cast/updated |

### Example Client Usage

```javascript
import { io } from "socket.io-client";

const socket = io("http://localhost:8000");

// Join a poll room
socket.emit("join-poll", "667a1b2c3d4e5f6a7b8c9d0e");

// Listen for live vote updates
socket.on("vote-updated", (data) => {
  console.log("Poll updated:", data.options);
  console.log("Total responses:", data.totalResponses);
});

// Leave when done
socket.emit("leave-poll", "667a1b2c3d4e5f6a7b8c9d0e");
```

---

## 🔒 Authentication Flow

```
1. User signs up     →  POST /api/signup  →  User created (password hashed with bcrypt)
2. User logs in      →  POST /api/login   →  JWT token returned
3. Protected request →  Authorization: Bearer <token>  →  Middleware verifies & attaches user
```

All protected routes use the `authenticate` middleware, which:
- Extracts the JWT from the `Authorization: Bearer <token>` header
- Verifies the token using `JWT_SECRET`
- Attaches `req.user` with `id`, `username`, and `email`

---

## 🧾 Error Handling

The API uses a custom `ApiError` class for consistent error responses:

| Status Code | Method         | Usage                              |
| ----------- | -------------- | ---------------------------------- |
| `400`       | `badRequest`   | Invalid input or missing fields    |
| `401`       | `unauthorized` | Invalid credentials or missing JWT |
| `403`       | `forbidden`    | Accessing another user's resources |
| `404`       | `notfound`     | Resource doesn't exist             |
| `409`       | `conflict`     | Duplicate resource (e.g., email)   |

---

## 📝 License

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).
