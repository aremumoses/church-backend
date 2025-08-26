"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUsersByRole = void 0;
const userModel_1 = require("../models/userModel");
const listUsersByRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const roleParam = req.params.role.toLowerCase();
    const requesterRole = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
    // Admins can only request 'user' list
    if (requesterRole === 'admin' && roleParam !== 'user') {
        return res.status(403).json({ message: 'Admins can only view regular users' });
    }
    // Only superadmin can access other roles
    if (requesterRole === 'user') {
        return res.status(403).json({ message: 'Access denied' });
    }
    try {
        const users = yield (0, userModel_1.getUsersByRole)(roleParam);
        res.json(users);
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to fetch users by role' });
    }
});
exports.listUsersByRole = listUsersByRole;
