"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const leaderController_1 = require("../controllers/leaderController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const router = express_1.default.Router();
// Public routes - anyone can access
router.get('/', leaderController_1.fetchLeaders);
router.get('/:id', leaderController_1.fetchLeaderById);
// Protected routes - only superadmin can access
router.post('/', authMiddleware_1.protect, roleMiddleware_1.superAdminOnly, leaderController_1.postLeader);
router.put('/:id', authMiddleware_1.protect, roleMiddleware_1.superAdminOnly, leaderController_1.putLeader);
router.delete('/:id', authMiddleware_1.protect, roleMiddleware_1.superAdminOnly, leaderController_1.removeLeader);
exports.default = router;
