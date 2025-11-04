# 🧩 To-Do App Backend

A RESTful API backend for a To-Do application built with Node.js, Express, and MongoDB. Features JWT authentication, role-based access control (RBAC), audit logging, and comprehensive task management.

## 🚀 Features

- **JWT Authentication** - Secure token-based authentication
- **Role-Based Access Control** - User and Admin roles with different permissions
- **Task CRUD Operations** - Create, read, update, and delete tasks
- **User Management** - Admin-only user management endpoints
- **Audit Logging** - Complete audit trail for all task changes
- **Structured Logging** - Pino-based async logging
- **Error Handling** - Centralized error handling middleware
- **Input Validation** - Request validation and sanitization
- **Best Practices** - ESLint, Prettier, and modular structure

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (running locally or remote instance)
- npm or yarn

## 🛠 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd todo-app-mongodb
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
NODE_ENV=local
PORT=3000
MONGO_URI=mongodb://localhost:27017/todo-app
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
```

4. Start the MongoDB server (if running locally):
```bash
# Make sure MongoDB is running on your system
```

5. Run the application:
```bash
# Development mode (with watch)
npm run dev

# Production mode
npm start
```

## 📚 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register a new user | ❌ |
| POST | `/api/auth/login` | Login and get JWT | ❌ |

### Tasks

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/tasks` | Get user's (or all) tasks | ✅ | user/admin |
| POST | `/api/tasks` | Create a task | ✅ | user/admin |
| GET | `/api/tasks/:id` | Get one task | ✅ | owner/admin |
| PUT | `/api/tasks/:id` | Update a task | ✅ | owner/admin |
| DELETE | `/api/tasks/:id` | Delete a task | ✅ | owner/admin |

### Users (Admin Only)

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/users` | List users | ✅ | admin |
| POST | `/api/users` | Create a user | ✅ | admin |
| POST | `/api/users/:id/role` | Change user role | ✅ | admin |
| DELETE | `/api/users/:id` | Delete a user | ✅ | admin |

### Audit Logs (Admin Only)

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/audit-logs` | Get audit logs | ✅ | admin |
| GET | `/api/audit-logs/task/:taskId` | Get task audit logs | ✅ | admin |

## 📖 Usage Examples

### Register a User

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Create a Task

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{
    "title": "Complete project",
    "description": "Finish the todo app backend"
  }'
```

### Get Tasks

```bash
curl -X GET http://localhost:3000/api/tasks \
  -H "Authorization: Bearer <your-jwt-token>"
```

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

The token is obtained from the `/api/auth/login` or `/api/auth/signup` endpoints.

## 👥 Roles

### User Role
- Create, view, update, and delete their own tasks
- Cannot access other users' tasks
- Cannot manage users

### Admin Role
- All user permissions
- View all users' tasks
- Assign tasks to any user
- Create, update, and delete user accounts
- Change user roles
- View audit logs

## 📁 Project Structure

```
todo-app-mongodb/
├── config/
│   ├── config.js          # Environment configuration
│   └── database.js        # MongoDB connection
├── controllers/
│   ├── authController.js  # Authentication logic
│   ├── taskController.js  # Task CRUD logic
│   ├── userController.js  # User management logic
│   └── auditController.js # Audit log logic
├── middleware/
│   ├── auth.js           # JWT authentication
│   ├── rbac.js           # Role-based access control
│   └── errorHandler.js   # Error handling
├── models/
│   ├── User.js           # User model
│   ├── Task.js           # Task model
│   └── TaskHistory.js    # Audit log model
├── routes/
│   ├── authRoutes.js     # Auth routes
│   ├── taskRoutes.js     # Task routes
│   ├── userRoutes.js     # User routes
│   └── auditRoutes.js    # Audit routes
├── utils/
│   ├── logger.js         # Pino logger
│   ├── responseHandler.js # API response utilities
│   ├── AppError.js       # Custom error class
│   └── generateToken.js  # JWT token generator
├── logs/                 # Log files directory
├── .env                  # Environment variables
├── .gitignore
├── .eslintrc.json        # ESLint configuration
├── .prettierrc.json      # Prettier configuration
├── package.json
├── server.js             # Main server file
└── README.md
```

## 🧪 Testing

The API can be tested using tools like:
- Postman
- Insomnia
- curl
- HTTPie

## 🔧 Development

### Linting
```bash
npm run lint
npm run lint:fix
```

### Formatting
```bash
npm run format
```

## 📝 Response Format

All API responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": "..."
}
```

## 📄 License

ISC

## 👤 Author

Built following best practices for Node.js/Express REST API development.

