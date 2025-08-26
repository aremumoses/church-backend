"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/userRoutes.ts
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// GET /api/users/role/:role (e.g. /api/users/role/admin)
// router.get('/role/:role', protect, authorize(['admin', 'superadmin']), listUsersByRole);
exports.default = router;
