import express from 'express';
import { getAuditLogs, getTaskAuditLogs } from '../controllers/auditController.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/rbac.js';

const router = express.Router();

// All audit routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

router.get('/', getAuditLogs);
router.get('/task/:taskId', getTaskAuditLogs);

export default router;

