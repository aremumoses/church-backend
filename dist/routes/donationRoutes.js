"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const donationController_1 = require("../controllers/donationController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Protected Routes
router.post('/start', authMiddleware_1.protect, donationController_1.startDonation);
router.get('/verify', donationController_1.confirmDonation);
router.get('/my', authMiddleware_1.protect, donationController_1.userDonationHistory);
router.get('/all', authMiddleware_1.protect, donationController_1.allDonations);
router.get('/categories', donationController_1.getCategories);
router.post('/categories', authMiddleware_1.protect, donationController_1.addCategory);
router.post('/webhook', express_1.default.raw({ type: 'application/json' }), donationController_1.handlePaystackWebhook);
// router.get('/analytics', protect, authorize(['admin', 'superadmin']), getDonationAnalytics);
exports.default = router;
