import User from '../models/User.js';
import Task from '../models/Task.js';
import { AppError } from '../utils/AppError.js';
import { successResponse } from '../utils/responseHandler.js';
import logger from '../utils/logger.js';

/**
 * @desc    Get all users (admin only)
 * @route   GET /api/users
 * @access  Private (admin)
 */
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-passwordHash').sort('-createdAt');

    return successResponse(res, 200, 'Users retrieved successfully', { users });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create user account (admin only)
 * @route   POST /api/users
 * @access  Private (admin)
 */
export const createUser = async (req, res, next) => {
  try {
    const { email, password, roles } = req.body;

    // Validation
    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('User already exists', 409);
    }

    // Validate roles
    if (roles && Array.isArray(roles)) {
      const validRoles = ['user', 'admin'];
      const invalidRoles = roles.filter((role) => !validRoles.includes(role));
      if (invalidRoles.length > 0) {
        throw new AppError(`Invalid roles: ${invalidRoles.join(', ')}`, 400);
      }
    }

    // Create user
    const userData = {
      email,
      passwordHash: password, // Will be hashed by pre-save middleware
      roles: roles || ['user'],
    };

    const user = await User.create(userData);

    logger.info({
      message: 'User created by admin',
      userId: user._id,
      createdBy: req.user._id,
    });

    const userResponse = {
      id: user._id,
      email: user.email,
      roles: user.roles,
      createdAt: user.createdAt,
    };

    return successResponse(res, 201, 'User created successfully', { user: userResponse });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Change user role (admin only)
 * @route   POST /api/users/:id/role
 * @access  Private (admin)
 */
export const changeUserRole = async (req, res, next) => {
  try {
    const { roles } = req.body;

    if (!roles || !Array.isArray(roles)) {
      throw new AppError('Roles array is required', 400);
    }

    // Validate roles
    const validRoles = ['user', 'admin'];
    const invalidRoles = roles.filter((role) => !validRoles.includes(role));
    if (invalidRoles.length > 0) {
      throw new AppError(`Invalid roles: ${invalidRoles.join(', ')}`, 400);
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Prevent admin from removing their own admin role
    if (user._id.toString() === req.user._id.toString() && !roles.includes('admin')) {
      throw new AppError('Cannot remove your own admin role', 400);
    }

    user.roles = roles;
    await user.save();

    logger.info({
      message: 'User role changed',
      userId: user._id,
      newRoles: roles,
      changedBy: req.user._id,
    });

    const userResponse = {
      id: user._id,
      email: user.email,
      roles: user.roles,
      updatedAt: user.updatedAt,
    };

    return successResponse(res, 200, 'User role updated successfully', { user: userResponse });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete user (admin only)
 * @route   DELETE /api/users/:id
 * @access  Private (admin)
 */
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      throw new AppError('Cannot delete your own account', 400);
    }

    // Delete user's tasks
    await Task.deleteMany({ owner: user._id });

    // Delete user
    await User.findByIdAndDelete(req.params.id);

    logger.info({
      message: 'User deleted',
      deletedUserId: user._id,
      deletedBy: req.user._id,
    });

    return successResponse(res, 200, 'User deleted successfully');
  } catch (error) {
    next(error);
  }
};

