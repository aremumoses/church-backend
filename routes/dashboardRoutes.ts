import express from 'express';
import { getDashboardOverview } from '../controllers/dashboardController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

// router.get('/overview', protect, authorize(['admin', 'superadmin']), getDashboardOverview);

export default router;
