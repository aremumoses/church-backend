// src/routes/userRoutes.ts
import express from 'express';
import { authorize, protect } from '../middleware/authMiddleware';
import { listUsersByRole } from '../controllers/userController';

const router = express.Router();

// GET /api/users/role/:role (e.g. /api/users/role/admin)
// router.get('/role/:role', protect, authorize(['admin', 'superadmin']), listUsersByRole);

export default router;
