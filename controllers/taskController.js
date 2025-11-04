import Task from '../models/Task.js';
import { AppError } from '../utils/AppError.js';
import { successResponse } from '../utils/responseHandler.js';
import logger from '../utils/logger.js';

/**
 * @desc    Get all tasks (user's own tasks or all tasks if admin)
 * @route   GET /api/tasks
 * @access  Private
 */
export const getTasks = async (req, res, next) => {
  try {
    const query = {};
    const isAdmin = req.user.roles.includes('admin');

    // Regular users only see their own tasks
    // Admins see all tasks by default, but can filter by user
    if (!isAdmin) {
      query.owner = req.user._id;
    } else if (req.query.user) {
      // Admin can filter by specific user
      query.owner = req.query.user;
    }

    const tasks = await Task.find(query).populate('owner', 'email').sort('-createdAt');

    return successResponse(res, 200, 'Tasks retrieved successfully', { tasks });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single task by ID
 * @route   GET /api/tasks/:id
 * @access  Private (owner/admin)
 */
export const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate('owner', 'email');

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    // Check if user is owner or admin
    const isAdmin = req.user.roles.includes('admin');
    const isOwner = task.owner._id.toString() === req.user._id.toString();

    if (!isOwner && !isAdmin) {
      throw new AppError('Not authorized to access this task', 403);
    }

    return successResponse(res, 200, 'Task retrieved successfully', { task });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new task
 * @route   POST /api/tasks
 * @access  Private
 */
export const createTask = async (req, res, next) => {
  try {
    const { title, description, owner } = req.body;
    const isAdmin = req.user.roles.includes('admin');

    // Validation
    if (!title) {
      throw new AppError('Task title is required', 400);
    }

    // Determine task owner
    let taskOwner = req.user._id; // Default to current user

    // Only admins can assign tasks to other users
    if (owner && isAdmin) {
      taskOwner = owner;
    } else if (owner && !isAdmin) {
      throw new AppError('Only admins can assign tasks to other users', 403);
    }

    // Create task with user context for audit logging
    const taskData = {
      title,
      description: description || '',
      owner: taskOwner,
    };
    
    const taskDoc = new Task(taskData);
    // Attach user context to document locals for audit logging
    taskDoc.$locals = {
      auditUser: {
        id: req.user._id,
        name: req.user.email,
        role: req.user.roles[0] || 'user',
      },
    };
    
    const createdTask = await taskDoc.save();

    await createdTask.populate('owner', 'email');

    logger.info({
      message: 'Task created',
      taskId: createdTask._id,
      userId: req.user._id,
      title: createdTask.title,
    });

    return successResponse(res, 201, 'Task created successfully', { task: createdTask });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update task
 * @route   PUT /api/tasks/:id
 * @access  Private (owner/admin)
 */
export const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    // Check authorization
    const isAdmin = req.user.roles.includes('admin');
    const isOwner = task.owner.toString() === req.user._id.toString();

    if (!isOwner && !isAdmin) {
      throw new AppError('Not authorized to update this task', 403);
    }

    // Check if admin is trying to change owner
    if (req.body.owner && !isAdmin) {
      throw new AppError('Only admins can reassign tasks', 403);
    }

    // Update task
    const updateData = {};
    if (req.body.title !== undefined) updateData.title = req.body.title;
    if (req.body.description !== undefined) updateData.description = req.body.description;
    if (req.body.completed !== undefined) updateData.completed = req.body.completed;
    if (req.body.owner !== undefined && isAdmin) updateData.owner = req.body.owner;

    // Attach user context for audit logging via mongoose options
    const options = {
      new: true,
      runValidators: true,
      auditUser: {
        id: req.user._id,
        name: req.user.email,
        role: req.user.roles[0] || 'user',
      },
    };

    task = await Task.findByIdAndUpdate(req.params.id, updateData, options).populate('owner', 'email');

    logger.info({
      message: 'Task updated',
      taskId: task._id,
      userId: req.user._id,
      changes: updateData,
    });

    return successResponse(res, 200, 'Task updated successfully', { task });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete task
 * @route   DELETE /api/tasks/:id
 * @access  Private (owner/admin)
 */
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    // Check authorization
    const isAdmin = req.user.roles.includes('admin');
    const isOwner = task.owner.toString() === req.user._id.toString();

    if (!isOwner && !isAdmin) {
      throw new AppError('Not authorized to delete this task', 403);
    }

    // Delete task with user context for audit logging
    const options = {
      auditUser: {
        id: req.user._id,
        name: req.user.email,
        role: req.user.roles[0] || 'user',
      },
    };

    await Task.findByIdAndDelete(req.params.id, options);

    logger.info({
      message: 'Task deleted',
      taskId: task._id,
      userId: req.user._id,
    });

    return successResponse(res, 200, 'Task deleted successfully');
  } catch (error) {
    next(error);
  }
};

