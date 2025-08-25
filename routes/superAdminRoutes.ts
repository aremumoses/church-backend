
import express from 'express';
import { authorize, protect } from '../middleware/authMiddleware';
import { getAllAdmins, getAllUsers, getSuperadminDetails, toggleUserActiveStatus, toggleUserAdmin } from '../controllers/superAdminController';
import { catchAsync } from '../utils/catchAsync';

const router = express.Router();
router.patch('/make-admin', protect, authorize('superadmin'), catchAsync(toggleUserAdmin));
router.get('/admins', protect, authorize('superadmin'), catchAsync(getAllAdmins));
router.get('/users', protect, authorize('superadmin'), catchAsync(getAllUsers));
router.get('/superadmin-detail', protect, authorize('superadmin'), getSuperadminDetails);
router.post('/toggle-user-status/:userId', protect, authorize('superadmin'), toggleUserActiveStatus);
export default router;
