"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/userRoutes.ts
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
// GET /api/users/role/:role (e.g. /api/users/role/admin)
router.get('/role/:role', authMiddleware_1.protect, (0, authMiddleware_1.authorize)(['admin', 'superadmin']), userController_1.listUsersByRole);
exports.default = router;
