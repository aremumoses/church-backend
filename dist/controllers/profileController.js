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
exports.updateUserStatusController = exports.updateUserRoleController = exports.adminUpdateUserProfile = exports.getUserPublicProfile = exports.updateMyProfile = exports.getMyProfile = void 0;
const userModel_1 = require("../models/userModel");
const userModel_2 = require("../models/userModel");
const getMyProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, userModel_1.getUserById)(req.user.id);
    if (!user)
        return res.status(404).json({ message: 'User not found' });
    res.json(user);
});
exports.getMyProfile = getMyProfile;
const updateMyProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, phone, gender, birthday, profile_pic } = req.body;
    yield (0, userModel_1.updateUserProfile)(req.user.id, { name, phone, gender, birthday, profile_pic });
    res.json({ message: 'Profile updated successfully' });
});
exports.updateMyProfile = updateMyProfile;
const getUserPublicProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield (0, userModel_1.getUserPublicProfileById)(id);
    if (!user)
        return res.status(404).json({ message: 'User not found' });
    res.json(user);
});
exports.getUserPublicProfile = getUserPublicProfile;
const adminUpdateUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const { id } = req.params;
    const { name, phone, gender, birthday, profile_pic, role } = req.body;
    const targetUser = yield (0, userModel_1.getUserById)(id);
    if (!targetUser) {
        return res.status(404).json({ message: 'User not found' });
    }
    // Admins can only update users, not admins/superadmins
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'admin' && targetUser.role !== 'user') {
        return res.status(403).json({ message: 'Admins can only update user profiles' });
    }
    // Superadmins cannot update another superadmin
    if (((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) === 'superadmin' && targetUser.role === 'superadmin') {
        return res.status(403).json({ message: 'Superadmins cannot update another superadmin' });
    }
    // Only superadmin can update roles
    if (role && ((_c = req.user) === null || _c === void 0 ? void 0 : _c.role) !== 'superadmin') {
        return res.status(403).json({ message: 'Only superadmin can update role' });
    }
    const updates = { name, phone, gender, birthday, profile_pic };
    if (((_d = req.user) === null || _d === void 0 ? void 0 : _d.role) === 'superadmin' && role)
        updates.role = role;
    yield (0, userModel_1.updateUserProfile)(id, updates);
    return res.json({ message: 'User profile updated successfully' });
});
exports.adminUpdateUserProfile = adminUpdateUserProfile;
const updateUserRoleController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
        return res.status(400).json({ message: 'Role must be "user" or "admin"' });
    }
    const targetUser = yield (0, userModel_1.getUserById)(id);
    if (!targetUser) {
        return res.status(404).json({ message: 'User not found' });
    }
    if (targetUser.role === 'superadmin') {
        return res.status(403).json({ message: 'Cannot change role of another superadmin' });
    }
    yield (0, userModel_2.updateUserRole)(id, role);
    return res.json({ message: `User role updated to ${role}` });
});
exports.updateUserRoleController = updateUserRoleController;
const updateUserStatusController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    if (!['active', 'inactive'].includes(status)) {
        return res.status(400).json({ message: 'Status must be "active" or "inactive"' });
    }
    const targetUser = yield (0, userModel_1.getUserById)(id);
    if (!targetUser) {
        return res.status(404).json({ message: 'User not found' });
    }
    if (targetUser.role === 'superadmin') {
        return res.status(403).json({ message: 'Cannot deactivate or reactivate another superadmin' });
    }
    yield (0, userModel_1.updateUserStatus)(id, status);
    res.json({ message: `User status updated to ${status}` });
});
exports.updateUserStatusController = updateUserStatusController;
