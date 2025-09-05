"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const feedbackController_1 = require("../controllers/feedbackController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// 📝 User submits feedback
router.post('/', authMiddleware_1.protect, feedbackController_1.submitFeedback);
// 🔍 Admin/SuperAdmin view all feedback
router.get('/', authMiddleware_1.protect, feedbackController_1.getAllFeedback);
// 🛠 Admin/SuperAdmin update feedback status
router.patch('/:id/status', authMiddleware_1.protect, feedbackController_1.updateFeedbackStatus);
exports.default = router;
