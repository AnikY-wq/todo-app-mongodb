# 🧩 To-Do App Backend – User Stories & Requirements

**Figure:** Simplified architecture – a Node.js/Express REST API server interacting with a MongoDB database
**References:** [sohamkamani.com](https://sohamkamani.com), [corbado.com](https://corbado.com)

---

## 🏗 Overview

The backend will be a **RESTful API** built with **Node.js** and **Express**, using **MongoDB** as the database.
We’ll follow a clear **MVC/feature-based structure** — separate folders for models, controllers, routes, config, etc.

The server will:

* Listen for **HTTP requests (JSON)**
* Perform **CRUD operations** on tasks and users
* Store data in **MongoDB collections**

---

## 🔐 Authentication & Authorization

* **JWT (JSON Web Tokens)** will be used for authentication.
* On **signup/login**, a JWT is issued to the client.
* The token (sent in the header as `Authorization: Bearer <token>`) lets the server verify requests **without server-side sessions**.

This **stateless** approach:

* Scales well for REST APIs
* Avoids session storage
* Is widely adopted in Node/Express apps

**Protected routes**:

* Use middleware to verify JWT signatures and expiration.
* Each user has a role (`user` or `admin`).
* Implement **RBAC (Role-Based Access Control)**:

  * Admins can access all endpoints.
  * Regular users are restricted to their own resources.

---

## 👤 User Stories – Regular User

### 🧾 Authentication

* As a User, I can **register and log in**.
* On **signup**, I provide credentials (email & password) and get a JWT.
* On **login**, I receive a new JWT.
* Passwords are **securely stored** (hashed).
* JWTs must be included in future requests for authentication.

### ✏️ Create Tasks

* As a User, I can **create tasks** via `POST /tasks`.
* Payload: `{ title, description? }`
* Response: created task with fields like `{ id, title, description, completed }`.
* Schema remains simple — it’s a minimal “Hello World” backend example ([fadamakis.com](https://fadamakis.com)).

### 📜 View Tasks

* As a User, I can **view my tasks** via `GET /tasks` or `GET /tasks?user=<my_id>`.
* Response: list of user’s tasks with timestamps (`createdAt`, `updatedAt`).
* Only the **authenticated user’s** tasks are visible (checked via JWT).

### 🔄 Update or Delete Tasks

* As a User, I can:

  * **Update** tasks via `PUT/PATCH /tasks/:id`
  * **Delete** tasks via `DELETE /tasks/:id`
* Only the **owner or an admin** can modify or delete a task.

### ✅ Mark Tasks Completed

* Each task has a `completed` flag.
* I can **toggle completion** via the update endpoint.

### 🕒 Task Timestamps & Audit Trail

* Use Mongoose’s `timestamps: true` to auto-generate `createdAt` and `updatedAt`.
* Every create/update action should be logged using a plugin like **mongoose-log-history** ([dev.to](https://dev.to)):

  * Records before/after values
  * Includes the acting user and timestamp

---

## 🛠 User Stories – Admin

### 🧮 View All Tasks

* Admins can view **all users’ tasks** via `GET /tasks` or an admin endpoint.
* Only admins can see others’ data.

### 👥 Assign Tasks

* Admins can assign tasks to any user.
* When creating or updating a task, the `owner` field can be set.
* Regular users cannot assign tasks to others.

### 🧑‍💼 Manage Users & Roles

* Admins can:

  * Create or delete user accounts
  * Change user roles (`user` ↔ `admin`)
* Role management is critical for enforcing RBAC.

### 🕵️ View Audit Logs

* Admins can access the **audit trail** of all task changes.
* Each log shows:

  * Who made the change
  * What was changed
  * When it occurred

**Example audit log:**

```json
{
  "model": "Task",
  "model_id": "...",
  "change_type": "update",
  "logs": [
    {
      "field_name": "completed",
      "from_value": false,
      "to_value": true
    }
  ],
  "created_by": {
    "id": "...",
    "name": "Bob",
    "role": "admin"
  },
  "created_at": "..."
}
```

---

## 🧩 Data Model & API Design

### 🧱 Task Model

```js
{
  title: String,
  description: String,
  completed: Boolean,
  owner: ObjectId, // reference to User
  timestamps: true
}
```

### 👤 User Model

```js
{
  email: String,
  passwordHash: String,
  roles: [String] // e.g. ["user"] or ["admin"]
}
```

New users default to `role: "user"`.

---

## 🌐 API Routes

| Method        | Endpoint              | Description               | Auth Required | Role        |
| ------------- | --------------------- | ------------------------- | ------------- | ----------- |
| **POST**      | `/api/auth/signup`    | Register a new user       | ❌             | –           |
| **POST**      | `/api/auth/login`     | Login and get JWT         | ❌             | –           |
| **GET**       | `/api/tasks`          | Get user’s (or all) tasks | ✅             | user/admin  |
| **POST**      | `/api/tasks`          | Create a task             | ✅             | user/admin  |
| **GET**       | `/api/tasks/:id`      | Get one task              | ✅             | owner/admin |
| **PUT/PATCH** | `/api/tasks/:id`      | Update a task             | ✅             | owner/admin |
| **DELETE**    | `/api/tasks/:id`      | Delete a task             | ✅             | owner/admin |
| **GET**       | `/api/users`          | List users                | ✅             | admin       |
| **POST**      | `/api/users/:id/role` | Change user role          | ✅             | admin       |
| **DELETE**    | `/api/users/:id`      | Delete a user             | ✅             | admin       |

---

## 🧰 Validation & Security

* Validate and sanitize **all input**.
* Store **hashed passwords**.
* Use **HTTPS** in production.
* Implement **JWT expiration** and possibly a **refresh-token** strategy.
* Add **rate limiting** and **error handling** for robustness.
* Protect against common vulnerabilities (XSS, injection, etc.).

---

## 🕓 Audit & Timestamps

* Enable Mongoose’s `timestamps: true` for automatic `createdAt`/`updatedAt`.
* Use a plugin like **mongoose-log-history** for automatic audit logging:

  * Logs all create, update, and delete operations.
  * Tracks model, document ID, change type, modified fields, user, and timestamp.
  * Ensures accountability and traceability.

---

## 🧭 Best Practices & Development Standards

To ensure maintainability, readability, and production readiness, the following best practices should be followed:

### 1. Consistent API Response Format

All responses (success or error) should follow a consistent JSON schema:

```json
{
  "success": true,
  "message": "Task created successfully",
  "data": { ... }
}
```

Define a global utility or middleware (e.g., `responseHandler.js`) to standardize this structure across all routes.

### 2. Centralized Error Handling

Use a global Express error middleware for handling exceptions.
Define custom error classes (e.g. `AppError`) to carry status codes and messages.
Ensure production errors never leak stack traces or sensitive details.

### 3. Structured Logging (Pino Async)

Implement structured, asynchronous logging using **Pino**:

* Use `pino.transport({ target: 'pino/file', options: { destination: 'logs/app.log' } })` for async logging.
* Include metadata (timestamp, userId, route, method).
* Use levels (`info`, `warn`, `error`) consistently across the app.

### 4. Environment Management via `config.js`

Instead of hardcoding environment variables, create a `config.js` file that reads from `.env` and exposes environment-specific settings:

```js
// config.js
export default {
  env: process.env.NODE_ENV || 'local',
  port: process.env.PORT || 3000,
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
};
```

Support multiple environments — **local**, **dev**, and **prod** — through `.env` or environment variables.

### 5. Code Style & Linting

Use **ESLint** and **Prettier** for code consistency.
Optionally integrate **Husky** for pre-commit hooks to run linting automatically before pushing code.

### 6. Modular & Scalable Structure

Keep controllers minimal and move business logic into dedicated **service** or **helper** files.
If the project grows, evolve from classic MVC to a **feature-based modular structure** like:

```
/modules
  /tasks
    controller.js
    model.js
    routes.js
    service.js
  /users
    controller.js
    model.js
    routes.js
    service.js
```

---

## ✅ Summary

With these user stories and requirements, a developer can build a **minimal yet fully functional To-Do app backend**.
It includes all essential features:

* JWT-based authentication
* Task CRUD
* Admin oversight
* Role-based access control
* Timestamps and audit logs
* Senior-level engineering best practices

The design is **scalable, clear, and production-ready**.
