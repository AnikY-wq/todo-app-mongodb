# 🎨 Todo App Frontend Development Guide V2

## 📋 Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Setup](#project-setup)
3. [Project Structure](#project-structure)
4. [API Endpoints](#api-endpoints)
5. [State Management](#state-management)
6. [Authentication](#authentication)
7. [UI/UX Guidelines](#uiux-guidelines)
8. [Coding Standards](#coding-standards)
9. [Error Handling](#error-handling)

---

## 🛠 Tech Stack

### Core Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "@reduxjs/toolkit": "^2.0.0",
    "react-redux": "^9.0.0",
    "react-hook-form": "^7.48.2",
    "zod": "^3.22.4",
    "@hookform/resolvers": "^3.3.2",
    "date-fns": "^2.30.0",
    "react-toastify": "^9.1.3"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.8",
    "eslint": "^8.55.0",
    "prettier": "^3.1.1"
  }
}
```

### Key Libraries

- **HTTP Client**: Native Fetch API (no axios)
- **State Management**: Redux Toolkit
- **Form Handling**: React Hook Form with Zod
- **Routing**: React Router v6
- **Notifications**: React Toastify
- **Date Handling**: date-fns

---

## 🚀 Project Setup

1. Initialize project with Vite: `npm create vite@latest todo-app-frontend -- --template react`
2. Install dependencies listed above
3. Create `.env` file: `VITE_API_BASE_URL=http://localhost:3000`
4. Configure Redux store in `src/store/store.js`
5. Set up routing in `src/App.jsx`

---

## 📁 Project Structure

```
src/
├── api/
│   ├── config.js          # Fetch API configuration
│   ├── auth.js            # Auth endpoints
│   ├── tasks.js           # Task endpoints
│   ├── users.js           # User endpoints
│   └── audit.js           # Audit endpoints
├── store/
│   ├── store.js           # Redux store configuration
│   ├── slices/
│   │   ├── authSlice.js   # Auth state
│   │   ├── taskSlice.js   # Task state
│   │   └── uiSlice.js     # UI state
│   └── hooks.js           # Typed hooks
├── components/
│   ├── common/            # Reusable components
│   ├── auth/              # Auth components
│   ├── tasks/              # Task components
│   ├── users/              # User components
│   └── audit/              # Audit components
├── pages/
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── Dashboard.jsx
│   ├── Tasks.jsx
│   ├── Users.jsx
│   └── AuditLogs.jsx
├── hooks/
│   └── useAuth.js
├── utils/
│   ├── constants.js
│   └── helpers.js
├── App.jsx
└── main.jsx
```

---

## 📡 API Endpoints

### Base Configuration

- **Base URL**: `http://localhost:3000` (from `.env`)
- **Headers**: `Content-Type: application/json`
- **Auth Header**: `Authorization: Bearer {token}`

### Fetch API Configuration

Create `src/api/config.js`:
- Set base URL from environment variable
- Add request interceptor to attach token from localStorage
- Add response interceptor to handle 401 errors (logout on invalid token)

---

## 🔐 Authentication Endpoints

### POST /api/auth/signup

**Request:**
- Method: `POST`
- Endpoint: `/api/auth/signup`
- Body: `{ email: string, password: string }`

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "string",
      "email": "string",
      "roles": ["user"],
      "createdAt": "ISO date string"
    },
    "token": "JWT token string"
  }
}
```

**Error (409):**
```json
{
  "success": false,
  "message": "User already exists"
}
```

### POST /api/auth/login

**Request:**
- Method: `POST`
- Endpoint: `/api/auth/login`
- Body: `{ email: string, password: string }`

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "string",
      "email": "string",
      "roles": ["user" | "admin"],
      "createdAt": "ISO date string"
    },
    "token": "JWT token string"
  }
}
```

**Error (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

## ✅ Tasks Endpoints

### GET /api/tasks

**Request:**
- Method: `GET`
- Endpoint: `/api/tasks`
- Query Params (Admin only): `?user={userId}` - Filter by user
- Auth: Required (Bearer token)

**Response (200):**
```json
{
  "success": true,
  "message": "Tasks retrieved successfully",
  "data": {
    "tasks": [
      {
        "_id": "string",
        "title": "string",
        "description": "string",
        "completed": "boolean",
        "owner": {
          "_id": "string",
          "email": "string"
        },
        "createdAt": "ISO date string",
        "updatedAt": "ISO date string"
      }
    ]
  }
}
```

**Note**: Regular users see only their tasks. Admins see all tasks or can filter by user.

### GET /api/tasks/:id

**Request:**
- Method: `GET`
- Endpoint: `/api/tasks/{taskId}`
- Auth: Required (Bearer token)
- Access: Owner or Admin only

**Response (200):**
```json
{
  "success": true,
  "message": "Task retrieved successfully",
  "data": {
    "task": {
      "_id": "string",
      "title": "string",
      "description": "string",
      "completed": "boolean",
      "owner": {
        "_id": "string",
        "email": "string"
      },
      "createdAt": "ISO date string",
      "updatedAt": "ISO date string"
    }
  }
}
```

**Error (403):**
```json
{
  "success": false,
  "message": "Not authorized to access this task"
}
```

### POST /api/tasks

**Request:**
- Method: `POST`
- Endpoint: `/api/tasks`
- Body: `{ title: string, description?: string, owner?: string }`
- Auth: Required (Bearer token)
- Note: `owner` field only allowed for admins

**Response (201):**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "task": {
      "_id": "string",
      "title": "string",
      "description": "string",
      "completed": false,
      "owner": {
        "_id": "string",
        "email": "string"
      },
      "createdAt": "ISO date string",
      "updatedAt": "ISO date string"
    }
  }
}
```

**Error (400):**
```json
{
  "success": false,
  "message": "Task title is required"
}
```

**Error (403):**
```json
{
  "success": false,
  "message": "Only admins can assign tasks to other users"
}
```

### PUT /api/tasks/:id

**Request:**
- Method: `PUT`
- Endpoint: `/api/tasks/{taskId}`
- Body: `{ title?: string, description?: string, completed?: boolean, owner?: string }`
- Auth: Required (Bearer token)
- Access: Owner or Admin only
- Note: `owner` field only allowed for admins

**Response (200):**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "task": {
      "_id": "string",
      "title": "string",
      "description": "string",
      "completed": "boolean",
      "owner": {
        "_id": "string",
        "email": "string"
      },
      "createdAt": "ISO date string",
      "updatedAt": "ISO date string"
    }
  }
}
```

**Error (403):**
```json
{
  "success": false,
  "message": "Not authorized to update this task"
}
```

### DELETE /api/tasks/:id

**Request:**
- Method: `DELETE`
- Endpoint: `/api/tasks/{taskId}`
- Auth: Required (Bearer token)
- Access: Owner or Admin only

**Response (200):**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

**Error (403):**
```json
{
  "success": false,
  "message": "Not authorized to delete this task"
}
```

---

## 👥 Users Endpoints (Admin Only)

### GET /api/users

**Request:**
- Method: `GET`
- Endpoint: `/api/users`
- Auth: Required (Bearer token)
- Role: Admin only

**Response (200):**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "users": [
      {
        "id": "string",
        "email": "string",
        "roles": ["user" | "admin"],
        "createdAt": "ISO date string"
      }
    ]
  }
}
```

**Error (403):**
```json
{
  "success": false,
  "message": "Admin access required"
}
```

### POST /api/users

**Request:**
- Method: `POST`
- Endpoint: `/api/users`
- Body: `{ email: string, password: string, roles?: ["user" | "admin"] }`
- Auth: Required (Bearer token)
- Role: Admin only

**Response (201):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {
      "id": "string",
      "email": "string",
      "roles": ["user" | "admin"],
      "createdAt": "ISO date string"
    }
  }
}
```

**Error (409):**
```json
{
  "success": false,
  "message": "User already exists"
}
```

### POST /api/users/:id/role

**Request:**
- Method: `POST`
- Endpoint: `/api/users/{userId}/role`
- Body: `{ roles: ["user" | "admin"] }`
- Auth: Required (Bearer token)
- Role: Admin only

**Response (200):**
```json
{
  "success": true,
  "message": "User role updated successfully",
  "data": {
    "user": {
      "id": "string",
      "email": "string",
      "roles": ["user" | "admin"],
      "updatedAt": "ISO date string"
    }
  }
}
```

**Error (400):**
```json
{
  "success": false,
  "message": "Cannot remove your own admin role"
}
```

### DELETE /api/users/:id

**Request:**
- Method: `DELETE`
- Endpoint: `/api/users/{userId}`
- Auth: Required (Bearer token)
- Role: Admin only

**Response (200):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Error (400):**
```json
{
  "success": false,
  "message": "Cannot delete your own account"
}
```

---

## 📊 Audit Logs Endpoints (Admin Only)

### GET /api/audit-logs

**Request:**
- Method: `GET`
- Endpoint: `/api/audit-logs`
- Query Params:
  - `page` (optional, default: 1)
  - `limit` (optional, default: 20)
  - `taskId` (optional) - Filter by task
  - `userId` (optional) - Filter by user
  - `changeType` (optional) - Filter by change type: "create" | "update" | "delete"
- Auth: Required (Bearer token)
- Role: Admin only

**Response (200):**
```json
{
  "success": true,
  "message": "Audit logs retrieved successfully",
  "data": {
    "logs": [
      {
        "_id": "string",
        "model": "Task",
        "model_id": "string",
        "change_type": "create" | "update" | "delete",
        "logs": [
          {
            "field_name": "string",
            "from_value": "any",
            "to_value": "any"
          }
        ],
        "created_by": {
          "id": "string",
          "name": "string",
          "role": "string"
        },
        "created_at": "ISO date string"
      }
    ],
    "pagination": {
      "page": "number",
      "limit": "number",
      "total": "number",
      "pages": "number"
    }
  }
}
```

### GET /api/audit-logs/task/:taskId

**Request:**
- Method: `GET`
- Endpoint: `/api/audit-logs/task/{taskId}`
- Auth: Required (Bearer token)
- Role: Admin only

**Response (200):**
```json
{
  "success": true,
  "message": "Task audit logs retrieved successfully",
  "data": {
    "logs": [
      {
        "_id": "string",
        "model": "Task",
        "model_id": "string",
        "change_type": "create" | "update" | "delete",
        "logs": [
          {
            "field_name": "string",
            "from_value": "any",
            "to_value": "any"
          }
        ],
        "created_by": {
          "id": "string",
          "name": "string",
          "role": "string"
        },
        "created_at": "ISO date string"
      }
    ]
  }
}
```

---

## 📦 State Management (Redux)

### Store Structure

- **authSlice**: User data, token, isAuthenticated, isAdmin
- **taskSlice**: Tasks array, loading, error, filters
- **uiSlice**: Modal state, sidebar state, theme

### Redux Toolkit Setup

1. Create store with `configureStore` from `@reduxjs/toolkit`
2. Create slices with `createSlice`
3. Use `useSelector` and `useDispatch` hooks
4. Create async thunks for API calls with `createAsyncThunk`

### Auth State Structure

```javascript
{
  user: { id, email, roles, createdAt } | null,
  token: string | null,
  isAuthenticated: boolean,
  isAdmin: boolean,
  loading: boolean,
  error: string | null
}
```

### Task State Structure

```javascript
{
  tasks: [],
  currentTask: null,
  loading: boolean,
  error: string | null,
  filters: {
    userId: null,
    completed: null,
    search: ""
  }
}
```

---

## 🔐 Authentication Flow

### Login/Signup Process

1. Call API endpoint (signup/login)
2. On success, store token and user data in localStorage
3. Dispatch Redux action to update auth state
4. Redirect to dashboard
5. On error, show error message

### Protected Routes

- Check `isAuthenticated` from Redux state
- Redirect to `/login` if not authenticated
- For admin routes, check `isAdmin` flag
- Redirect to `/dashboard` if not admin

### Token Management

- Store token in localStorage on login/signup
- Attach token to all API requests via interceptor
- Remove token on logout
- Handle 401 errors by clearing token and redirecting to login

---

## 🎨 UI/UX Guidelines

### Design Principles

- **Minimal Design**: Clean, uncluttered interface with ample white space
- **Mobile-First**: Design for mobile (320px+), then scale up
- **Responsive Breakpoints**: 320px, 768px, 1024px, 1440px
- **Touch Targets**: Minimum 44x44px for interactive elements

### Color Palette

```css
--primary: #2563eb;
--primary-dark: #1e40af;
--success: #10b981;
--danger: #ef4444;
--warning: #f59e0b;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-600: #4b5563;
--gray-900: #111827;
--white: #ffffff;
```

### Typography

- Font: System fonts (San Francisco, Segoe UI, Roboto)
- Base size: 16px
- Line height: 1.5
- Headings: 1.25rem, 1.5rem, 2rem, 2.5rem

### Spacing Scale

- 4px, 8px, 16px, 24px, 32px, 48px

### Layout Components

- **Header**: User info, logout button, navigation
- **Sidebar**: Navigation menu (collapsible on mobile)
- **Main Content**: Page content area
- **Modal**: Reusable modal component for forms

---

## 📝 Coding Standards

### Component Structure

- Use functional components with hooks
- Keep components small and focused (Single Responsibility)
- Extract reusable logic into custom hooks
- Use composition over inheritance

### Naming Conventions

- Components: PascalCase (`TaskCard.jsx`)
- Functions: camelCase (`handleSubmit`)
- Constants: UPPER_SNAKE_CASE (`API_BASE_URL`)
- CSS Classes: kebab-case (`task-card`)

### Code Organization

1. React imports
2. Third-party libraries
3. Internal components
4. Utilities
5. Styles

### Best Practices

- Use `const/let`, avoid `var`
- Use arrow functions for callbacks
- Destructure props in function parameters
- Use early returns for conditional rendering
- Use template literals for strings
- Avoid direct state mutation
- Use immutability for state updates

### React Hooks

- Use hooks at top level only
- Extract custom hooks for reusable logic
- Use `useMemo` for expensive computations
- Use `useCallback` for memoized callbacks

### Form Handling

- Use React Hook Form with Zod validation
- Create Zod schemas for form validation
- Use `zodResolver` with React Hook Form
- Display validation errors below inputs

---

## ⚠️ Error Handling

### API Error Handling

- Check `response.success` flag in all API responses
- Handle HTTP status codes:
  - 400: Bad Request - Validation errors
  - 401: Unauthorized - Clear token, redirect to login
  - 403: Forbidden - Show access denied message
  - 404: Not Found - Show resource not found
  - 409: Conflict - Show conflict message
  - 500: Server Error - Show generic error message
- Display error messages using toast notifications
- Log errors to console in development

### Error Response Structure

```json
{
  "success": false,
  "message": "Error message string"
}
```

### Global Error Handler

- Create error boundary component for component errors
- Use try-catch for async operations
- Show user-friendly error messages
- Provide retry options where applicable

---

## 🚀 Implementation Checklist

### Setup Phase
- [ ] Initialize React project
- [ ] Install dependencies
- [ ] Configure Redux store
- [ ] Set up routing
- [ ] Configure Fetch API interceptors
- [ ] Create environment variables

### Authentication
- [ ] Login page and API integration
- [ ] Signup page and API integration
- [ ] Protected route component
- [ ] Token management
- [ ] Logout functionality

### Tasks
- [ ] Task list page
- [ ] Task detail page
- [ ] Create task form
- [ ] Update task form
- [ ] Delete task confirmation
- [ ] Filter and search functionality

### Users (Admin)
- [ ] User list page
- [ ] Create user form
- [ ] Change role functionality
- [ ] Delete user confirmation

### Audit Logs (Admin)
- [ ] Audit log list page
- [ ] Filter by task/user/type
- [ ] Pagination implementation
- [ ] Task audit log view

### UI/UX
- [ ] Responsive layout
- [ ] Mobile navigation
- [ ] Loading states
- [ ] Error states
- [ ] Toast notifications
- [ ] Form validation
- [ ] Accessibility basics

### Testing
- [ ] Component rendering tests
- [ ] API integration tests
- [ ] Form validation tests
- [ ] Error handling tests

---

## 📚 Key Points

1. **API Base URL**: Use `VITE_API_BASE_URL` from environment variables
2. **Authentication**: Store token in localStorage, attach to all requests
3. **Role-Based Access**: Check `isAdmin` from Redux state for admin features
4. **Error Handling**: Always check `success` flag and handle status codes
5. **State Management**: Use Redux Toolkit for all state management
6. **HTTP Client**: Use native Fetch API (no axios)
7. **Forms**: Use React Hook Form with Zod validation
8. **Responsive**: Mobile-first design with breakpoints at 320px, 768px, 1024px
9. **Minimal UI**: Clean, uncluttered design with ample white space
10. **Code Quality**: Follow naming conventions, keep components small, use hooks properly

---

**End of Guide**

