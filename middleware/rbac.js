import { AppError } from '../utils/AppError.js';

/**
 * Role-Based Access Control Middleware
 * Checks if user has required role (admin or owner)
 */

/**
 * Admin only access
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Authentication required', 401));
  }

  if (!req.user.roles.includes('admin')) {
    return next(new AppError('Admin access required', 403));
  }

  next();
};

/**
 * Owner or Admin access
 * For resource-level authorization
 */
export const requireOwnerOrAdmin = (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Authentication required', 401));
  }

  // Admins can access everything
  if (req.user.roles.includes('admin')) {
    return next();
  }

  // Check if user is the owner
  // This will be used in controllers where we check resource ownership
  req.requireOwnerCheck = true;
  next();
};

