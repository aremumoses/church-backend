"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const superAdminController_1 = require("../controllers/superAdminController");
const catchAsync_1 = require("../utils/catchAsync");
const router = express_1.default.Router();
router.patch('/make-admin', authMiddleware_1.protect, (0, authMiddleware_1.authorize)('superadmin'), (0, catchAsync_1.catchAsync)(superAdminController_1.toggleUserAdmin));
router.get('/admins', authMiddleware_1.protect, (0, authMiddleware_1.authorize)('superadmin'), (0, catchAsync_1.catchAsync)(superAdminController_1.getAllAdmins));
router.get('/users', authMiddleware_1.protect, (0, authMiddleware_1.authorize)('superadmin'), (0, catchAsync_1.catchAsync)(superAdminController_1.getAllUsers));
router.get('/superadmin-detail', authMiddleware_1.protect, (0, authMiddleware_1.authorize)('superadmin'), superAdminController_1.getSuperadminDetails);
router.post('/toggle-user-status/:userId', authMiddleware_1.protect, (0, authMiddleware_1.authorize)('superadmin'), superAdminController_1.toggleUserActiveStatus);
exports.default = router;
