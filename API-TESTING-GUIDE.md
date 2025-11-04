# 🧪 Todo App API - Sequential Testing Guide

This document provides step-by-step instructions for testing all API endpoints in the correct sequence.

## 📋 Prerequisites

1. **Server is running**: Make sure the Todo App backend server is running on `http://localhost:3000`
2. **MongoDB is running**: Ensure MongoDB is running and accessible
3. **Postman or Similar Tool**: Use Postman, Insomnia, or curl for testing
4. **Postman Collection**: Import `Todo-App-API.postman_collection.json` into Postman for easier testing

---

## 🚀 Testing Sequence

### Phase 1: Initial Setup & Authentication

#### Step 1: Health Check
**Purpose**: Verify the server is running

**Request**:
```http
GET http://localhost:3000/health
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**✅ Verification**: Should return success message

---

#### Step 2: Register Regular User
**Purpose**: Create a regular user account

**Request**:
```http
POST http://localhost:3000/api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Expected Response** (201 Created):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "email": "user@example.com",
      "roles": ["user"],
      "createdAt": "..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**📝 Important**: 
- Save the `token` from response → use as `userToken` for subsequent requests
- Save the `user.id` → use as `userId` for subsequent requests

---

#### Step 3: Register Admin User
**Purpose**: Create an admin user account

**Request**:
```http
POST http://localhost:3000/api/auth/signup
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Expected Response** (201 Created):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "email": "admin@example.com",
      "roles": ["user"],
      "createdAt": "..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**📝 Important**: 
- Save the `token` from response → use as `adminToken` for subsequent requests
- Note: User will have `["user"]` role initially. We'll change it to admin later.

---

#### Step 4: Login as Regular User
**Purpose**: Test login endpoint

**Request**:
```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "email": "user@example.com",
      "roles": ["user"],
      "createdAt": "..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**✅ Verification**: Should return token and user data

---

### Phase 2: Task Management (Regular User)

#### Step 5: Create Task
**Purpose**: Create a new task as regular user

**Request**:
```http
POST http://localhost:3000/api/tasks
Content-Type: application/json
Authorization: Bearer {userToken}

{
  "title": "Complete project documentation",
  "description": "Write comprehensive documentation for the Todo App API"
}
```

**Expected Response** (201 Created):
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "task": {
      "_id": "...",
      "title": "Complete project documentation",
      "description": "Write comprehensive documentation for the Todo App API",
      "completed": false,
      "owner": {
        "_id": "...",
        "email": "user@example.com"
      },
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
}
```

**📝 Important**: 
- Save the `task._id` from response → use as `taskId` for subsequent requests

---

#### Step 6: Get All Tasks (User's Own Tasks)
**Purpose**: Retrieve all tasks for the authenticated user

**Request**:
```http
GET http://localhost:3000/api/tasks
Authorization: Bearer {userToken}
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Tasks retrieved successfully",
  "data": {
    "tasks": [
      {
        "_id": "...",
        "title": "Complete project documentation",
        "description": "...",
        "completed": false,
        "owner": {
          "_id": "...",
          "email": "user@example.com"
        },
        "createdAt": "...",
        "updatedAt": "..."
      }
    ]
  }
}
```

**✅ Verification**: Should return only the tasks owned by the authenticated user

---

#### Step 7: Get Single Task
**Purpose**: Retrieve a specific task by ID

**Request**:
```http
GET http://localhost:3000/api/tasks/{taskId}
Authorization: Bearer {userToken}
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Task retrieved successfully",
  "data": {
    "task": {
      "_id": "...",
      "title": "Complete project documentation",
      "description": "...",
      "completed": false,
      "owner": {
        "_id": "...",
        "email": "user@example.com"
      },
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
}
```

**✅ Verification**: Should return the specific task details

---

#### Step 8: Update Task
**Purpose**: Update task details

**Request**:
```http
PUT http://localhost:3000/api/tasks/{taskId}
Content-Type: application/json
Authorization: Bearer {userToken}

{
  "title": "Updated task title",
  "description": "Updated description",
  "completed": true
}
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "task": {
      "_id": "...",
      "title": "Updated task title",
      "description": "Updated description",
      "completed": true,
      "owner": {
        "_id": "...",
        "email": "user@example.com"
      },
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
}
```

**✅ Verification**: 
- Task title, description, and completed status should be updated
- `updatedAt` timestamp should be updated

---

#### Step 9: Create Another Task
**Purpose**: Create a second task for testing

**Request**:
```http
POST http://localhost:3000/api/tasks
Content-Type: application/json
Authorization: Bearer {userToken}

{
  "title": "Review code",
  "description": "Review all code changes"
}
```

**Expected Response** (201 Created):
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "task": {
      "_id": "...",
      "title": "Review code",
      "description": "Review all code changes",
      "completed": false,
      "owner": {
        "_id": "...",
        "email": "user@example.com"
      },
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
}
```

---

### Phase 3: User Management (Admin Only)

**⚠️ Important**: Before proceeding, we need to make the admin user an actual admin.

#### Step 10: Login as Admin User
**Purpose**: Get admin token

**Request**:
```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "email": "admin@example.com",
      "roles": ["user"],
      "createdAt": "..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**📝 Note**: The user still has `["user"]` role. We need to change it to admin first.

---

#### Step 11: Create Admin User via Admin Endpoint
**Purpose**: Create a user with admin role (if previous admin doesn't work)

**Alternative**: If you can't access admin endpoints yet, manually update the database:

**MongoDB Shell**:
```javascript
use todo-app
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { roles: ["admin"] } }
)
```

Then login again to get a token with admin role.

**OR** if you have access, continue with admin endpoints:

---

#### Step 12: Get All Users (Admin Only)
**Purpose**: Retrieve all users (requires admin role)

**Request**:
```http
GET http://localhost:3000/api/users
Authorization: Bearer {adminToken}
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "users": [
      {
        "id": "...",
        "email": "user@example.com",
        "roles": ["user"],
        "createdAt": "..."
      },
      {
        "id": "...",
        "email": "admin@example.com",
        "roles": ["user"],
        "createdAt": "..."
      }
    ]
  }
}
```

**❌ Expected Error** (403 Forbidden) if user is not admin:
```json
{
  "success": false,
  "message": "Admin access required"
}
```

**✅ Verification**: Should return list of users if admin, or 403 if not admin

---

#### Step 13: Create User (Admin Only)
**Purpose**: Admin creates a new user account

**Request**:
```http
POST http://localhost:3000/api/users
Content-Type: application/json
Authorization: Bearer {adminToken}

{
  "email": "newuser@example.com",
  "password": "password123",
  "roles": ["user"]
}
```

**Expected Response** (201 Created):
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {
      "id": "...",
      "email": "newuser@example.com",
      "roles": ["user"],
      "createdAt": "..."
    }
  }
}
```

**📝 Important**: Save the `user.id` → use as `createdUserId` for deletion test

---

#### Step 14: Change User Role (Admin Only)
**Purpose**: Change a user's role (make user an admin)

**Request**:
```http
POST http://localhost:3000/api/users/{userId}/role
Content-Type: application/json
Authorization: Bearer {adminToken}

{
  "roles": ["admin"]
}
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "User role updated successfully",
  "data": {
    "user": {
      "id": "...",
      "email": "admin@example.com",
      "roles": ["admin"],
      "updatedAt": "..."
    }
  }
}
```

**✅ Verification**: User role should be updated to `["admin"]`

---

#### Step 15: Delete User (Admin Only)
**Purpose**: Admin deletes a user account

**Request**:
```http
DELETE http://localhost:3000/api/users/{createdUserId}
Authorization: Bearer {adminToken}
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**✅ Verification**: User should be deleted from database

---

### Phase 4: Admin Task Operations

#### Step 16: Get All Tasks as Admin
**Purpose**: Admin can see all users' tasks

**Request**:
```http
GET http://localhost:3000/api/tasks
Authorization: Bearer {adminToken}
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Tasks retrieved successfully",
  "data": {
    "tasks": [
      {
        "_id": "...",
        "title": "Complete project documentation",
        "description": "...",
        "completed": true,
        "owner": {
          "_id": "...",
          "email": "user@example.com"
        },
        "createdAt": "...",
        "updatedAt": "..."
      },
      {
        "_id": "...",
        "title": "Review code",
        "description": "...",
        "completed": false,
        "owner": {
          "_id": "...",
          "email": "user@example.com"
        },
        "createdAt": "...",
        "updatedAt": "..."
      }
    ]
  }
}
```

**✅ Verification**: Admin should see all tasks from all users

---

#### Step 17: Filter Tasks by User (Admin Only)
**Purpose**: Admin can filter tasks by specific user

**Request**:
```http
GET http://localhost:3000/api/tasks?user={userId}
Authorization: Bearer {adminToken}
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Tasks retrieved successfully",
  "data": {
    "tasks": [
      {
        "_id": "...",
        "title": "Complete project documentation",
        "description": "...",
        "completed": true,
        "owner": {
          "_id": "...",
          "email": "user@example.com"
        },
        "createdAt": "...",
        "updatedAt": "..."
      }
    ]
  }
}
```

**✅ Verification**: Should return only tasks for the specified user

---

#### Step 18: Create Task and Assign to User (Admin Only)
**Purpose**: Admin can assign tasks to any user

**Request**:
```http
POST http://localhost:3000/api/tasks
Content-Type: application/json
Authorization: Bearer {adminToken}

{
  "title": "Admin assigned task",
  "description": "This task was assigned by admin",
  "owner": "{userId}"
}
```

**Expected Response** (201 Created):
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "task": {
      "_id": "...",
      "title": "Admin assigned task",
      "description": "This task was assigned by admin",
      "completed": false,
      "owner": {
        "_id": "...",
        "email": "user@example.com"
      },
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
}
```

**✅ Verification**: Task should be assigned to the specified user

---

#### Step 19: Update Task as Admin
**Purpose**: Admin can update any task

**Request**:
```http
PUT http://localhost:3000/api/tasks/{taskId}
Content-Type: application/json
Authorization: Bearer {adminToken}

{
  "title": "Admin updated task",
  "completed": false
}
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "task": {
      "_id": "...",
      "title": "Admin updated task",
      "description": "...",
      "completed": false,
      "owner": {
        "_id": "...",
        "email": "user@example.com"
      },
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
}
```

**✅ Verification**: Admin can update tasks owned by other users

---

#### Step 20: Delete Task as Admin
**Purpose**: Admin can delete any task

**Request**:
```http
DELETE http://localhost:3000/api/tasks/{taskId}
Authorization: Bearer {adminToken}
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

**✅ Verification**: Admin can delete tasks owned by other users

---

### Phase 5: Audit Logs (Admin Only)

#### Step 21: Get All Audit Logs
**Purpose**: Admin can view all audit logs

**Request**:
```http
GET http://localhost:3000/api/audit-logs?page=1&limit=20
Authorization: Bearer {adminToken}
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Audit logs retrieved successfully",
  "data": {
    "logs": [
      {
        "_id": "...",
        "model": "Task",
        "model_id": "...",
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
            "to_value": "..."
          }
        ],
        "created_by": {
          "id": "...",
          "name": "user@example.com",
          "role": "user"
        },
        "created_at": "..."
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5,
      "pages": 1
    }
  }
}
```

**✅ Verification**: Should return paginated list of audit logs

---

#### Step 22: Filter Audit Logs by Task
**Purpose**: Get audit logs for a specific task

**Request**:
```http
GET http://localhost:3000/api/audit-logs?taskId={taskId}
Authorization: Bearer {adminToken}
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Audit logs retrieved successfully",
  "data": {
    "logs": [
      {
        "_id": "...",
        "model": "Task",
        "model_id": "{taskId}",
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
          "name": "user@example.com",
          "role": "user"
        },
        "created_at": "..."
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1,
      "pages": 1
    }
  }
}
```

**✅ Verification**: Should return only logs for the specified task

---

#### Step 23: Get Task Audit Logs by Task ID
**Purpose**: Get all audit logs for a specific task using task endpoint

**Request**:
```http
GET http://localhost:3000/api/audit-logs/task/{taskId}
Authorization: Bearer {adminToken}
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Task audit logs retrieved successfully",
  "data": {
    "logs": [
      {
        "_id": "...",
        "model": "Task",
        "model_id": "{taskId}",
        "change_type": "create",
        "logs": [...],
        "created_by": {...},
        "created_at": "..."
      },
      {
        "_id": "...",
        "model": "Task",
        "model_id": "{taskId}",
        "change_type": "update",
        "logs": [...],
        "created_by": {...},
        "created_at": "..."
      }
    ]
  }
}
```

**✅ Verification**: Should return all audit logs for the specified task

---

### Phase 6: Error Handling & Edge Cases

#### Step 24: Test Unauthorized Access
**Purpose**: Test access without token

**Request**:
```http
GET http://localhost:3000/api/tasks
```

**Expected Response** (401 Unauthorized):
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

**✅ Verification**: Should return 401 error

---

#### Step 25: Test Invalid Token
**Purpose**: Test access with invalid token

**Request**:
```http
GET http://localhost:3000/api/tasks
Authorization: Bearer invalid_token_here
```

**Expected Response** (401 Unauthorized):
```json
{
  "success": false,
  "message": "Invalid token"
}
```

**✅ Verification**: Should return 401 error

---

#### Step 26: Test Accessing Other User's Task (Regular User)
**Purpose**: Regular user cannot access other user's tasks

**Request**:
```http
GET http://localhost:3000/api/tasks/{otherUserTaskId}
Authorization: Bearer {userToken}
```

**Expected Response** (403 Forbidden):
```json
{
  "success": false,
  "message": "Not authorized to access this task"
}
```

**✅ Verification**: Regular user should not be able to access other user's tasks

---

#### Step 27: Test Regular User Trying to Assign Task
**Purpose**: Regular user cannot assign tasks to others

**Request**:
```http
POST http://localhost:3000/api/tasks
Content-Type: application/json
Authorization: Bearer {userToken}

{
  "title": "Test task",
  "owner": "{otherUserId}"
}
```

**Expected Response** (403 Forbidden):
```json
{
  "success": false,
  "message": "Only admins can assign tasks to other users"
}
```

**✅ Verification**: Regular user should not be able to assign tasks to others

---

#### Step 28: Test Regular User Trying to Access Admin Endpoints
**Purpose**: Regular user cannot access admin-only endpoints

**Request**:
```http
GET http://localhost:3000/api/users
Authorization: Bearer {userToken}
```

**Expected Response** (403 Forbidden):
```json
{
  "success": false,
  "message": "Admin access required"
}
```

**✅ Verification**: Regular user should not be able to access admin endpoints

---

#### Step 29: Test Creating Task Without Required Fields
**Purpose**: Test validation

**Request**:
```http
POST http://localhost:3000/api/tasks
Content-Type: application/json
Authorization: Bearer {userToken}

{
  "description": "Task without title"
}
```

**Expected Response** (400 Bad Request):
```json
{
  "success": false,
  "message": "Task title is required"
}
```

**✅ Verification**: Should return validation error

---

#### Step 30: Test Duplicate Email Registration
**Purpose**: Test duplicate email validation

**Request**:
```http
POST http://localhost:3000/api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Expected Response** (409 Conflict):
```json
{
  "success": false,
  "message": "User already exists"
}
```

**✅ Verification**: Should return conflict error for duplicate email

---

## 📊 Testing Checklist

Use this checklist to ensure all features are tested:

### Authentication
- [ ] Register user
- [ ] Login user
- [ ] Register with duplicate email (error)
- [ ] Login with invalid credentials (error)

### Task Management (Regular User)
- [ ] Create task
- [ ] Get all tasks (user's own)
- [ ] Get single task
- [ ] Update task
- [ ] Delete task
- [ ] Access other user's task (error - should fail)
- [ ] Try to assign task to others (error - should fail)

### Task Management (Admin)
- [ ] Get all tasks (all users)
- [ ] Filter tasks by user
- [ ] Create task and assign to user
- [ ] Update any task
- [ ] Delete any task

### User Management (Admin Only)
- [ ] Get all users
- [ ] Create user
- [ ] Change user role
- [ ] Delete user
- [ ] Try to delete own account (error - should fail)

### Audit Logs (Admin Only)
- [ ] Get all audit logs
- [ ] Filter audit logs by task
- [ ] Filter audit logs by user
- [ ] Filter audit logs by change type
- [ ] Get task audit logs by task ID

### Error Handling
- [ ] Unauthorized access (no token)
- [ ] Invalid token
- [ ] Missing required fields
- [ ] Invalid request data

---

## 🔧 Tips for Testing

1. **Save Variables**: Use Postman environment variables to save tokens and IDs for easy reuse
2. **Check Responses**: Verify status codes, response structure, and data accuracy
3. **Test Edge Cases**: Don't forget to test error scenarios and edge cases
4. **Verify Database**: Check MongoDB directly to verify data changes
5. **Check Logs**: Review server logs for any errors or warnings

---

## 📝 Notes

- **Base URL**: `http://localhost:3000`
- **Default Port**: `3000` (can be changed via `.env` file)
- **Token Expiration**: 7 days (configurable via `JWT_EXPIRES_IN`)
- **Password Hashing**: Passwords are automatically hashed using bcryptjs
- **Audit Logging**: All task create/update/delete operations are automatically logged

---

## 🎯 Quick Start Commands

### Using curl:

```bash
# Health Check
curl http://localhost:3000/health

# Register User
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Create Task (replace TOKEN with actual token)
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"title":"My Task","description":"Task description"}'
```

---

**Happy Testing! 🚀**

