import express from 'express';
import { getMyProfile, updateMyProfile } from '../controllers/profileController';
import { protect } from '../middleware/authMiddleware';
import { getUserPublicProfile } from '../controllers/profileController';
import { adminOnly } from '../middleware/roleMiddleware';
import { adminUpdateUserProfile } from '../controllers/profileController';
import { superAdminOnly } from '../middleware/roleMiddleware';
import { updateUserRoleController } from '../controllers/profileController';
import { updateUserStatusController } from '../controllers/profileController';



const router = express.Router();

router.get('/me', protect, getMyProfile);
router.patch('/update', protect, updateMyProfile);
router.get('/:id', protect, getUserPublicProfile);
router.patch('/admin-update/:id', protect, adminOnly, adminUpdateUserProfile);
router.patch('/role/:id', protect, superAdminOnly, updateUserRoleController);
router.patch('/deactivate/:id', protect, superAdminOnly, updateUserStatusController);

export default router;
