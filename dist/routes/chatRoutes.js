"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chatController_1 = require("../controllers/chatController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const chatController_2 = require("../controllers/chatController");
const router = express_1.default.Router();
router.post('/send', authMiddleware_1.protect, chatController_1.sendChatMessage);
router.get('/conversations', authMiddleware_1.protect, chatController_1.fetchConversationsList);
router.get('/conversation/:userId', authMiddleware_1.protect, chatController_1.fetchConversation);
router.get('/history', chatController_2.fetchChatHistory);
exports.default = router;
