import express from 'express';
import {
  getUsers,
  createUser,
  changeUserRole,
  deleteUser,
} from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/rbac.js';

const router = express.Router();

// All user routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

router.route('/').get(getUsers).post(createUser);
router.route('/:id').delete(deleteUser);
router.route('/:id/role').post(changeUserRole);

export default router;

