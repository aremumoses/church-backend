"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const catchAsync_1 = require("../utils/catchAsync");
const router = express_1.default.Router();
router.post('/register', (0, catchAsync_1.catchAsync)(authController_1.register));
router.post('/login', (0, catchAsync_1.catchAsync)(authController_1.login));
router.get('/me', authMiddleware_1.protect, (0, catchAsync_1.catchAsync)(authController_1.getCurrentUser));
router.post('/forgot-password', (0, catchAsync_1.catchAsync)(authController_1.forgotPassword));
router.post('/verify-password', (0, catchAsync_1.catchAsync)(authController_1.verifyOtp));
router.patch('/update-password', (0, catchAsync_1.catchAsync)(authController_1.updatePassword));
exports.default = router;
