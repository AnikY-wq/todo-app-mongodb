# 🎨 Todo App Frontend Development Guide

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Setup](#project-setup)
4. [Project Structure](#project-structure)
5. [API Integration](#api-integration)
6. [Authentication Flow](#authentication-flow)
7. [Component Architecture](#component-architecture)
8. [State Management](#state-management)
9. [UI/UX Guidelines](#uiux-guidelines)
10. [Coding Standards](#coding-standards)
11. [Error Handling](#error-handling)
12. [Testing Strategy](#testing-strategy)
13. [Deployment Checklist](#deployment-checklist)

---

## 🎯 Project Overview

This document provides a comprehensive guide for developing a React.js frontend application for the Todo App backend. The frontend will be:

- **Technology**: React.js (JavaScript)
- **UI Style**: Minimal and clean design
- **Responsiveness**: Mobile-first, fully responsive
- **Functionality**: Complete integration with all backend features

### Core Features

1. **Authentication**
   - User registration
   - User login
   - JWT token management
   - Protected routes

2. **Task Management**
   - Create, read, update, delete tasks
   - Mark tasks as complete/incomplete
   - Filter and search tasks
   - Task ownership handling

3. **User Management (Admin Only)**
   - View all users
   - Create new users
   - Change user roles
   - Delete users

4. **Audit Logs (Admin Only)**
   - View audit logs
   - Filter by task, user, or change type
   - Pagination support

5. **Role-Based Access Control**
   - User role features
   - Admin role features
   - Dynamic UI based on roles

---

## 🛠 Tech Stack

### Core Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.2",
    "@tanstack/react-query": "^5.12.0",
    "zustand": "^4.4.7",
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
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "prettier": "^3.1.1",
    "@testing-library/react": "^14.1.2",
    "@testing-library/jest-dom": "^6.1.5",
    "vitest": "^1.0.4"
  }
}
```

### Recommended Libraries

- **HTTP Client**: Axios for API calls
- **State Management**: Zustand (lightweight) or React Query for server state
- **Form Handling**: React Hook Form with Zod validation
- **Routing**: React Router v6
- **Styling**: 
  - CSS Modules or Styled Components
  - Tailwind CSS (optional, for rapid development)
- **Notifications**: React Toastify
- **Date Handling**: date-fns
- **Build Tool**: Vite (recommended) or Create React App

---

## 🚀 Project Setup

### Step 1: Initialize Project

```bash
# Using Vite (Recommended)
npm create vite@latest todo-app-frontend -- --template react
cd todo-app-frontend

# Or using Create React App
npx create-react-app todo-app-frontend
cd todo-app-frontend
```

### Step 2: Install Dependencies

```bash
npm install react-router-dom axios @tanstack/react-query zustand react-hook-form zod @hookform/resolvers date-fns react-toastify

# Development dependencies
npm install -D @vitejs/plugin-react vite eslint eslint-plugin-react eslint-plugin-react-hooks prettier
```

### Step 3: Environment Configuration

Create `.env` file in project root:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_NAME=Todo App
```

### Step 4: Project Structure

```
todo-app-frontend/
├── public/
├── src/
│   ├── api/
│   │   ├── axios.js
│   │   ├── auth.js
│   │   ├── tasks.js
│   │   ├── users.js
│   │   └── audit.js
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── Modal/
│   │   │   ├── Loading/
│   │   │   └── ErrorBoundary/
│   │   ├── layout/
│   │   │   ├── Header/
│   │   │   ├── Sidebar/
│   │   │   └── Layout/
│   │   ├── auth/
│   │   │   ├── LoginForm/
│   │   │   └── SignupForm/
│   │   ├── tasks/
│   │   │   ├── TaskList/
│   │   │   ├── TaskCard/
│   │   │   ├── TaskForm/
│   │   │   └── TaskFilters/
│   │   ├── users/
│   │   │   ├── UserList/
│   │   │   ├── UserForm/
│   │   │   └── UserCard/
│   │   └── audit/
│   │       ├── AuditLogList/
│   │       └── AuditLogCard/
│   ├── pages/
│   │   ├── Login/
│   │   ├── Signup/
│   │   ├── Dashboard/
│   │   ├── Tasks/
│   │   ├── Users/
│   │   └── AuditLogs/
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useTasks.js
│   │   └── useApi.js
│   ├── store/
│   │   ├── authStore.js
│   │   └── uiStore.js
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── validators.js
│   ├── context/
│   │   └── AuthContext.js
│   ├── styles/
│   │   ├── globals.css
│   │   └── variables.css
│   ├── App.jsx
│   ├── main.jsx
│   └── routes.jsx
├── .env
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

---

## 📡 API Integration

### Base Configuration

**File: `src/api/axios.js`**

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## 🔐 Authentication API

### Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register new user | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |

### API Implementation

**File: `src/api/auth.js`**

```javascript
import api from './axios';

export const authAPI = {
  // Register new user
  signup: async (email, password) => {
    const response = await api.post('/api/auth/signup', {
      email,
      password,
    });
    return response;
  },

  // Login user
  login: async (email, password) => {
    const response = await api.post('/api/auth/login', {
      email,
      password,
    });
    return response;
  },
};
```

### Request/Response Formats

#### 1. Signup

**Request:**
```javascript
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "roles": ["user"],
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (409):**
```json
{
  "success": false,
  "message": "User already exists"
}
```

#### 2. Login

**Request:**
```javascript
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "roles": ["user"],
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

## ✅ Tasks API

### Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/tasks` | Get all tasks | ✅ | user/admin |
| GET | `/api/tasks?user={userId}` | Filter tasks by user (admin only) | ✅ | admin |
| POST | `/api/tasks` | Create task | ✅ | user/admin |
| GET | `/api/tasks/:id` | Get single task | ✅ | owner/admin |
| PUT | `/api/tasks/:id` | Update task | ✅ | owner/admin |
| DELETE | `/api/tasks/:id` | Delete task | ✅ | owner/admin |

### API Implementation

**File: `src/api/tasks.js`**

```javascript
import api from './axios';

export const tasksAPI = {
  // Get all tasks
  getTasks: async (userId = null) => {
    const params = userId ? { user: userId } : {};
    const response = await api.get('/api/tasks', { params });
    return response;
  },

  // Get single task
  getTask: async (taskId) => {
    const response = await api.get(`/api/tasks/${taskId}`);
    return response;
  },

  // Create task
  createTask: async (taskData) => {
    const response = await api.post('/api/tasks', taskData);
    return response;
  },

  // Update task
  updateTask: async (taskId, taskData) => {
    const response = await api.put(`/api/tasks/${taskId}`, taskData);
    return response;
  },

  // Delete task
  deleteTask: async (taskId) => {
    const response = await api.delete(`/api/tasks/${taskId}`);
    return response;
  },
};
```

### Request/Response Formats

#### 1. Get All Tasks

**Request:**
```javascript
GET /api/tasks
Authorization: Bearer {token}

// Admin can filter by user
GET /api/tasks?user={userId}
Authorization: Bearer {adminToken}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Tasks retrieved successfully",
  "data": {
    "tasks": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "title": "Complete project documentation",
        "description": "Write comprehensive documentation",
        "completed": false,
        "owner": {
          "_id": "507f1f77bcf86cd799439012",
          "email": "user@example.com"
        },
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
}
```

#### 2. Get Single Task

**Request:**
```javascript
GET /api/tasks/{taskId}
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Task retrieved successfully",
  "data": {
    "task": {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Complete project documentation",
      "description": "Write comprehensive documentation",
      "completed": false,
      "owner": {
        "_id": "507f1f77bcf86cd799439012",
        "email": "user@example.com"
      },
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

#### 3. Create Task

**Request:**
```javascript
POST /api/tasks
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "New task",
  "description": "Task description (optional)",
  "owner": "507f1f77bcf86cd799439012"  // Admin only - optional
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "task": {
      "_id": "507f1f77bcf86cd799439011",
      "title": "New task",
      "description": "Task description",
      "completed": false,
      "owner": {
        "_id": "507f1f77bcf86cd799439012",
        "email": "user@example.com"
      },
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Task title is required"
}
```

**Error Response (403 - Regular user trying to assign):**
```json
{
  "success": false,
  "message": "Only admins can assign tasks to other users"
}
```

#### 4. Update Task

**Request:**
```javascript
PUT /api/tasks/{taskId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated title",      // Optional
  "description": "Updated desc",  // Optional
  "completed": true,              // Optional
  "owner": "507f1f77bcf86cd799439012"  // Admin only - optional
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "task": {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Updated title",
      "description": "Updated desc",
      "completed": true,
      "owner": {
        "_id": "507f1f77bcf86cd799439012",
        "email": "user@example.com"
      },
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T11:00:00.000Z"
    }
  }
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Not authorized to update this task"
}
```

#### 5. Delete Task

**Request:**
```javascript
DELETE /api/tasks/{taskId}
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

---

## 👥 Users API (Admin Only)

### Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/users` | Get all users | ✅ | admin |
| POST | `/api/users` | Create user | ✅ | admin |
| POST | `/api/users/:id/role` | Change user role | ✅ | admin |
| DELETE | `/api/users/:id` | Delete user | ✅ | admin |

### API Implementation

**File: `src/api/users.js`**

```javascript
import api from './axios';

export const usersAPI = {
  // Get all users
  getUsers: async () => {
    const response = await api.get('/api/users');
    return response;
  },

  // Create user
  createUser: async (userData) => {
    const response = await api.post('/api/users', userData);
    return response;
  },

  // Change user role
  changeUserRole: async (userId, roles) => {
    const response = await api.post(`/api/users/${userId}/role`, { roles });
    return response;
  },

  // Delete user
  deleteUser: async (userId) => {
    const response = await api.delete(`/api/users/${userId}`);
    return response;
  },
};
```

### Request/Response Formats

#### 1. Get All Users

**Request:**
```javascript
GET /api/users
Authorization: Bearer {adminToken}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "users": [
      {
        "id": "507f1f77bcf86cd799439011",
        "email": "user@example.com",
        "roles": ["user"],
        "createdAt": "2024-01-15T10:30:00.000Z"
      },
      {
        "id": "507f1f77bcf86cd799439012",
        "email": "admin@example.com",
        "roles": ["admin"],
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Admin access required"
}
```

#### 2. Create User

**Request:**
```javascript
POST /api/users
Authorization: Bearer {adminToken}
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "password123",
  "roles": ["user"]  // Optional, defaults to ["user"]
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439013",
      "email": "newuser@example.com",
      "roles": ["user"],
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

#### 3. Change User Role

**Request:**
```javascript
POST /api/users/{userId}/role
Authorization: Bearer {adminToken}
Content-Type: application/json

{
  "roles": ["admin"]
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User role updated successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "roles": ["admin"],
      "updatedAt": "2024-01-15T11:00:00.000Z"
    }
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Cannot remove your own admin role"
}
```

#### 4. Delete User

**Request:**
```javascript
DELETE /api/users/{userId}
Authorization: Bearer {adminToken}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Cannot delete your own account"
}
```

---

## 📊 Audit Logs API (Admin Only)

### Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/audit-logs` | Get all audit logs | ✅ | admin |
| GET | `/api/audit-logs?taskId={taskId}` | Filter by task | ✅ | admin |
| GET | `/api/audit-logs?userId={userId}` | Filter by user | ✅ | admin |
| GET | `/api/audit-logs?changeType={type}` | Filter by change type | ✅ | admin |
| GET | `/api/audit-logs?page={page}&limit={limit}` | Pagination | ✅ | admin |
| GET | `/api/audit-logs/task/:taskId` | Get task audit logs | ✅ | admin |

### API Implementation

**File: `src/api/audit.js`**

```javascript
import api from './axios';

export const auditAPI = {
  // Get all audit logs with filters
  getAuditLogs: async (filters = {}) => {
    const params = {
      page: filters.page || 1,
      limit: filters.limit || 20,
      ...(filters.taskId && { taskId: filters.taskId }),
      ...(filters.userId && { userId: filters.userId }),
      ...(filters.changeType && { changeType: filters.changeType }),
    };
    const response = await api.get('/api/audit-logs', { params });
    return response;
  },

  // Get audit logs for a specific task
  getTaskAuditLogs: async (taskId) => {
    const response = await api.get(`/api/audit-logs/task/${taskId}`);
    return response;
  },
};
```

### Request/Response Formats

#### 1. Get All Audit Logs

**Request:**
```javascript
GET /api/audit-logs?page=1&limit=20&taskId={taskId}&userId={userId}&changeType={type}
Authorization: Bearer {adminToken}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Audit logs retrieved successfully",
  "data": {
    "logs": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "model": "Task",
        "model_id": "507f1f77bcf86cd799439012",
        "change_type": "create",
        "logs": [
          {
            "field_name": "title",
            "from_value": null,
            "to_value": "Complete project documentation"
          },
          {
            "field_name": "description",
            "from_value": null,
            "to_value": "Write comprehensive documentation"
          }
        ],
        "created_by": {
          "id": "507f1f77bcf86cd799439013",
          "name": "user@example.com",
          "role": "user"
        },
        "created_at": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "pages": 3
    }
  }
}
```

#### 2. Get Task Audit Logs

**Request:**
```javascript
GET /api/audit-logs/task/{taskId}
Authorization: Bearer {adminToken}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Task audit logs retrieved successfully",
  "data": {
    "logs": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "model": "Task",
        "model_id": "507f1f77bcf86cd799439012",
        "change_type": "update",
        "logs": [
          {
            "field_name": "completed",
            "from_value": false,
            "to_value": true
          }
        ],
        "created_by": {
          "id": "507f1f77bcf86cd799439013",
          "name": "user@example.com",
          "role": "user"
        },
        "created_at": "2024-01-15T11:00:00.000Z"
      }
    ]
  }
}
```

---

## 🔐 Authentication Flow

### Auth Context/Hook

**File: `src/hooks/useAuth.js`**

```javascript
import { useState, useEffect } from 'react';
import { authAPI } from '../api/auth';
import { toast } from 'react-toastify';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      const { user: userData, token } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      setIsAuthenticated(true);
      
      toast.success('Login successful');
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return { success: false, error };
    }
  };

  const signup = async (email, password) => {
    try {
      const response = await authAPI.signup(email, password);
      const { user: userData, token } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      setIsAuthenticated(true);
      
      toast.success('Registration successful');
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return { success: false, error };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    toast.info('Logged out successfully');
  };

  const isAdmin = () => {
    return user?.roles?.includes('admin') || false;
  };

  return {
    user,
    loading,
    isAuthenticated,
    login,
    signup,
    logout,
    isAdmin,
  };
};
```

### Protected Route Component

**File: `src/components/common/ProtectedRoute.jsx`**

```javascript
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loading from './Loading';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
```

---

## 🎨 Component Architecture

### Component Structure Guidelines

1. **Component Organization**
   - Use functional components with hooks
   - Keep components small and focused (Single Responsibility Principle)
   - Extract reusable logic into custom hooks
   - Use composition over inheritance

2. **Component Naming**
   - Use PascalCase for component files
   - Match component name with file name
   - Use descriptive names

3. **Props Validation**
   - Use PropTypes or TypeScript (if using TS)
   - Document props in JSDoc comments

### Example: TaskCard Component

**File: `src/components/tasks/TaskCard/TaskCard.jsx`**

```javascript
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import './TaskCard.css';

const TaskCard = ({ task, onEdit, onDelete, onToggleComplete, isAdmin }) => {
  return (
    <div className={`task-card ${task.completed ? 'completed' : ''}`}>
      <div className="task-card__header">
        <h3>{task.title}</h3>
        <div className="task-card__actions">
          <button onClick={() => onToggleComplete(task._id)}>
            {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
          </button>
          <button onClick={() => onEdit(task)}>Edit</button>
          <button onClick={() => onDelete(task._id)}>Delete</button>
        </div>
      </div>
      
      {task.description && (
        <p className="task-card__description">{task.description}</p>
      )}
      
      <div className="task-card__footer">
        <span className="task-card__owner">
          Owner: {task.owner?.email || 'Unknown'}
        </span>
        <span className="task-card__date">
          Created: {format(new Date(task.createdAt), 'MMM dd, yyyy')}
        </span>
      </div>
    </div>
  );
};

TaskCard.propTypes = {
  task: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    completed: PropTypes.bool.isRequired,
    owner: PropTypes.shape({
      _id: PropTypes.string,
      email: PropTypes.string,
    }),
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onToggleComplete: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool,
};

export default TaskCard;
```

---

## 📦 State Management

### Recommended Approach: React Query + Zustand

**React Query** for server state (API data)
**Zustand** for client state (UI state, auth state)

### Example: Using React Query for Tasks

**File: `src/hooks/useTasks.js`**

```javascript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksAPI } from '../api/tasks';
import { toast } from 'react-toastify';

export const useTasks = (userId = null) => {
  const queryClient = useQueryClient();

  // Get tasks query
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['tasks', userId],
    queryFn: () => tasksAPI.getTasks(userId),
    select: (response) => response.data.tasks,
  });

  // Create task mutation
  const createMutation = useMutation({
    mutationFn: (taskData) => tasksAPI.createTask(taskData),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
      toast.success('Task created successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create task');
    },
  });

  // Update task mutation
  const updateMutation = useMutation({
    mutationFn: ({ taskId, taskData }) => tasksAPI.updateTask(taskId, taskData),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
      toast.success('Task updated successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update task');
    },
  });

  // Delete task mutation
  const deleteMutation = useMutation({
    mutationFn: (taskId) => tasksAPI.deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
      toast.success('Task deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete task');
    },
  });

  return {
    tasks: data || [],
    isLoading,
    error,
    refetch,
    createTask: createMutation.mutate,
    updateTask: updateMutation.mutate,
    deleteTask: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
```

### Example: Zustand Store for UI State

**File: `src/store/uiStore.js`**

```javascript
import { create } from 'zustand';

const useUIStore = create((set) => ({
  // Modal state
  isModalOpen: false,
  modalContent: null,
  openModal: (content) => set({ isModalOpen: true, modalContent: content }),
  closeModal: () => set({ isModalOpen: false, modalContent: null }),

  // Sidebar state
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  // Theme state
  theme: 'light',
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
}));

export default useUIStore;
```

---

## 🎨 UI/UX Guidelines

### Design Principles

1. **Minimal Design**
   - Clean, uncluttered interface
   - Ample white space
   - Focus on content hierarchy
   - Subtle shadows and borders

2. **Mobile-First Responsive Design**
   - Design for mobile first, then scale up
   - Breakpoints: 320px, 768px, 1024px, 1440px
   - Touch-friendly targets (min 44x44px)
   - Responsive typography

3. **Color Palette (Example)**
   ```css
   :root {
     --primary: #2563eb;
     --primary-dark: #1e40af;
     --success: #10b981;
     --danger: #ef4444;
     --warning: #f59e0b;
     --gray-100: #f3f4f6;
     --gray-200: #e5e7eb;
     --gray-300: #d1d5db;
     --gray-600: #4b5563;
     --gray-900: #111827;
     --white: #ffffff;
   }
   ```

4. **Typography**
   - Font: System fonts or Inter/Roboto
   - Base size: 16px
   - Line height: 1.5
   - Headings: 1.25rem, 1.5rem, 2rem, 2.5rem

5. **Spacing**
   - Use consistent spacing scale (4px, 8px, 16px, 24px, 32px, 48px)

### Responsive Layout Example

**File: `src/components/layout/Layout/Layout.jsx`**

```javascript
import { useState } from 'react';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import './Layout.css';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="layout">
      <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="layout__content">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="layout__main">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
```

**File: `src/components/layout/Layout/Layout.css`**

```css
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.layout__content {
  display: flex;
  flex: 1;
}

.layout__main {
  flex: 1;
  padding: 1.5rem;
  overflow-x: hidden;
}

/* Mobile */
@media (max-width: 768px) {
  .layout__main {
    padding: 1rem;
  }
}

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px) {
  .layout__main {
    padding: 1.25rem;
  }
}

/* Desktop */
@media (min-width: 1025px) {
  .layout__main {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

---

## 📝 Coding Standards

### 1. Code Organization

- **File Structure**: One component per file
- **Import Order**: 
  1. React and React libraries
  2. Third-party libraries
  3. Internal components
  4. Utilities and helpers
  5. Styles
  6. Types/Constants

### 2. Naming Conventions

```javascript
// Components - PascalCase
const TaskCard = () => {};

// Functions - camelCase
const handleSubmit = () => {};

// Constants - UPPER_SNAKE_CASE
const API_BASE_URL = 'http://localhost:3000';

// CSS Classes - kebab-case
<div className="task-card">...</div>

// Files - Match component name
TaskCard.jsx
taskCard.js  // utilities
task-card.css
```

### 3. JavaScript Best Practices

```javascript
// ✅ Good: Use const/let, avoid var
const handleClick = () => {
  // Logic
};

// ✅ Good: Use arrow functions for callbacks
tasks.map(task => <TaskCard key={task._id} task={task} />);

// ✅ Good: Destructure props
const TaskCard = ({ task, onEdit, onDelete }) => {
  // Component logic
};

// ✅ Good: Early returns
const renderTask = (task) => {
  if (!task) return null;
  return <TaskCard task={task} />;
};

// ✅ Good: Use template literals
const message = `Task ${task.title} created successfully`;

// ❌ Bad: Don't mutate state directly
// tasks.push(newTask); // Wrong!

// ✅ Good: Use immutability
setTasks([...tasks, newTask]);
```

### 4. React Best Practices

```javascript
// ✅ Good: Use hooks at top level
const MyComponent = () => {
  const [state, setState] = useState(null);
  const { data } = useQuery();
  
  // Effects
  useEffect(() => {
    // Side effects
  }, [dependencies]);
  
  return <div>...</div>;
};

// ✅ Good: Extract custom hooks for reusable logic
const useTaskOperations = () => {
  // Logic
  return { createTask, updateTask, deleteTask };
};

// ✅ Good: Memoize expensive computations
const filteredTasks = useMemo(() => {
  return tasks.filter(task => task.completed);
}, [tasks]);

// ✅ Good: Memoize callbacks
const handleClick = useCallback(() => {
  // Logic
}, [dependencies]);
```

### 5. Error Handling

```javascript
// ✅ Good: Try-catch in async functions
const handleSubmit = async (data) => {
  try {
    await createTask(data);
    toast.success('Task created');
  } catch (error) {
    toast.error(error.response?.data?.message || 'Error occurred');
  }
};

// ✅ Good: Error boundaries for component errors
<ErrorBoundary>
  <TaskList />
</ErrorBoundary>
```

### 6. Form Handling

```javascript
// ✅ Good: Use React Hook Form with Zod validation
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(1000).optional(),
});

const TaskForm = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(taskSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('title')} />
      {errors.title && <span>{errors.title.message}</span>}
      
      <textarea {...register('description')} />
      {errors.description && <span>{errors.description.message}</span>}
      
      <button type="submit">Submit</button>
    </form>
  );
};
```

### 7. Performance Optimization

```javascript
// ✅ Good: Memoize components
const TaskCard = React.memo(({ task }) => {
  return <div>{task.title}</div>;
});

// ✅ Good: Code splitting
const AdminPanel = lazy(() => import('./pages/Admin/AdminPanel'));

// ✅ Good: Virtual scrolling for long lists
import { FixedSizeList } from 'react-window';
```

---

## ⚠️ Error Handling

### Global Error Handler

**File: `src/utils/errorHandler.js`**

```javascript
export const handleAPIError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return data.message || 'Bad request';
      case 401:
        return 'Unauthorized. Please login again.';
      case 403:
        return data.message || 'Access denied';
      case 404:
        return data.message || 'Resource not found';
      case 409:
        return data.message || 'Conflict';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return data.message || 'An error occurred';
    }
  } else if (error.request) {
    // Request made but no response
    return 'Network error. Please check your connection.';
  } else {
    // Error setting up request
    return 'An unexpected error occurred';
  }
};
```

### Error Boundary Component

**File: `src/components/common/ErrorBoundary/ErrorBoundary.jsx`**

```javascript
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

---

## 🧪 Testing Strategy

### Testing Libraries

- **Vitest**: Unit and integration testing
- **React Testing Library**: Component testing
- **MSW (Mock Service Worker)**: API mocking

### Example Test

**File: `src/components/tasks/TaskCard/TaskCard.test.jsx`**

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import TaskCard from './TaskCard';

const mockTask = {
  _id: '1',
  title: 'Test Task',
  description: 'Test Description',
  completed: false,
  owner: { _id: '2', email: 'user@example.com' },
  createdAt: '2024-01-15T10:30:00.000Z',
};

describe('TaskCard', () => {
  it('renders task information', () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
        onToggleComplete={jest.fn()}
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('calls onToggleComplete when button is clicked', () => {
    const onToggleComplete = jest.fn();
    render(
      <TaskCard
        task={mockTask}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
        onToggleComplete={onToggleComplete}
      />
    );

    fireEvent.click(screen.getByText('Mark Complete'));
    expect(onToggleComplete).toHaveBeenCalledWith('1');
  });
});
```

---

## 📱 Mobile Responsiveness Checklist

- [ ] Touch targets are at least 44x44px
- [ ] Forms are easy to fill on mobile
- [ ] Navigation is accessible on mobile
- [ ] Text is readable without zooming
- [ ] Images scale properly
- [ ] Buttons and inputs are properly sized
- [ ] Sidebar/drawer for mobile navigation
- [ ] No horizontal scrolling
- [ ] Tested on real devices (iOS and Android)

---

## 🚀 Deployment Checklist

### Pre-Deployment

- [ ] Environment variables configured
- [ ] API base URL updated for production
- [ ] Build optimization enabled
- [ ] Error tracking configured (e.g., Sentry)
- [ ] Analytics configured (if needed)
- [ ] SEO meta tags added
- [ ] Favicon and app icons added
- [ ] Performance audit passed
- [ ] Accessibility audit passed
- [ ] Cross-browser testing completed

### Build Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Test
npm run test
```

### Environment Variables

```env
# Production .env
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_APP_NAME=Todo App
```

---

## 📚 Additional Resources

### Documentation
- [React Documentation](https://react.dev/)
- [React Router v6](https://reactrouter.com/)
- [React Query](https://tanstack.com/query/latest)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)

### Best Practices
- [React Best Practices](https://react.dev/learn)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Mobile-First Design](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Responsive/Mobile_first)

---

## 🎯 Development Roadmap

### Phase 1: Foundation (Week 1)
- [ ] Project setup and configuration
- [ ] API integration layer
- [ ] Authentication flow
- [ ] Basic routing structure

### Phase 2: Core Features (Week 2)
- [ ] Task CRUD operations
- [ ] Task list and detail views
- [ ] Basic UI components

### Phase 3: Enhanced Features (Week 3)
- [ ] User management (admin)
- [ ] Audit logs (admin)
- [ ] Advanced filtering and search
- [ ] Role-based UI

### Phase 4: Polish (Week 4)
- [ ] Mobile responsiveness
- [ ] Error handling
- [ ] Loading states
- [ ] Testing
- [ ] Performance optimization

---

## 📝 Notes

- Always handle loading and error states
- Use optimistic updates for better UX
- Implement proper error messages
- Follow accessibility guidelines
- Test on multiple devices and browsers
- Keep components small and focused
- Use TypeScript if possible (recommended for production)

---

**Happy Coding! 🚀**

