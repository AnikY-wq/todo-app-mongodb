import TaskHistory from '../models/TaskHistory.js';
import { AppError } from '../utils/AppError.js';
import { successResponse } from '../utils/responseHandler.js';

/**
 * @desc    Get audit logs (admin only)
 * @route   GET /api/audit-logs
 * @access  Private (admin)
 */
export const getAuditLogs = async (req, res, next) => {
  try {

    // Build query filters
    const query = {};

    // Filter by model (if needed)
    if (req.query.model) {
      query.model = req.query.model;
    }

    // Filter by task ID
    if (req.query.taskId) {
      query.model_id = req.query.taskId;
    }

    // Filter by user who made the change
    if (req.query.userId) {
      query['created_by.id'] = req.query.userId;
    }

    // Filter by change type
    if (req.query.changeType) {
      query.change_type = req.query.changeType;
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Get total count
    const total = await TaskHistory.countDocuments(query);

    // Get audit logs
    const logs = await TaskHistory.find(query)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return successResponse(res, 200, 'Audit logs retrieved successfully', {
      logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get audit logs for a specific task
 * @route   GET /api/audit-logs/task/:taskId
 * @access  Private (admin)
 */
export const getTaskAuditLogs = async (req, res, next) => {
  try {
    const taskId = req.params.taskId;

    const logs = await TaskHistory.find({ model_id: taskId })
      .sort({ created_at: -1 })
      .lean();

    return successResponse(res, 200, 'Task audit logs retrieved successfully', { logs });
  } catch (error) {
    next(error);
  }
};

