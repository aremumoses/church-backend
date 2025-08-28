import express from 'express';
import {
  startDonation,
  confirmDonation,
  userDonationHistory,
  allDonations,
  addCategory,
  getCategories,
  handlePaystackWebhook
} from '../controllers/donationController';
import { protect,authorize } from '../middleware/authMiddleware';
import { getDonationAnalytics } from '../controllers/donationController';

const router = express.Router();

// Protected Routes
router.post('/start', protect, startDonation);
router.get('/verify', confirmDonation);
router.get('/my', protect, userDonationHistory);
router.get('/all', protect, allDonations);
router.get('/categories', getCategories);
router.post('/categories', protect, addCategory);
router.post('/webhook', express.raw({ type: 'application/json' }), handlePaystackWebhook);

router.get('/analytics', protect, getDonationAnalytics);
export default router;
