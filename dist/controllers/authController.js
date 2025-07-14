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
exports.updatePassword = exports.resetPassword = exports.forgotPassword = exports.getCurrentUser = exports.login = exports.register = void 0;
const userModel_1 = require("../models/userModel");
const generateToken_1 = require("../utils/generateToken");
const hashUtils_1 = require("../utils/hashUtils");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, role } = req.body;
    const existingUser = yield (0, userModel_1.getUserByEmail)(email);
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }
    const hashed = yield (0, hashUtils_1.hashPassword)(password);
    yield (0, userModel_1.createUser)({ name, email, password: hashed, role });
    return res.status(201).json({ message: 'Registration successful' });
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield (0, userModel_1.getUserByEmail)(email);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    // Check if account is deactivated
    if (user.status === 'inactive') {
        return res.status(403).json({ message: 'Account is deactivated. Please contact admin.' });
    }
    const isMatch = yield (0, hashUtils_1.comparePassword)(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = (0, generateToken_1.generateToken)(user.id, user.role, user.name, user.email);
    console.log('Generated Token:', token);
    return res.json({
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    });
});
exports.login = login;
const getCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, userModel_1.getUserById)(req.user.id);
    return res.json(user);
});
exports.getCurrentUser = getCurrentUser;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield (0, userModel_1.getUserByEmail)(email);
    if (!user) {
        return res.status(404).json({ message: 'Email not found' });
    }
    // TODO: Send actual email in production
    return res.json({ message: 'Password reset link would be sent here (mock).' });
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, newPassword } = req.body;
    const hashed = yield (0, hashUtils_1.hashPassword)(newPassword);
    yield (0, userModel_1.updateUserPassword)(email, hashed);
    return res.json({ message: 'Password updated successfully' });
});
exports.resetPassword = resetPassword;
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { currentPassword, newPassword } = req.body;
    // 1. Get the current user
    const user = yield (0, userModel_1.getUserById)(req.user.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    // 2. Check if current password is correct
    const isMatch = yield (0, hashUtils_1.comparePassword)(currentPassword, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Current password is incorrect' });
    }
    // 3. Hash new password and update
    const hashed = yield (0, hashUtils_1.hashPassword)(newPassword);
    yield (0, userModel_1.updateUserPassword)(user.email, hashed);
    // 4. Return success message
    return res.json({ message: 'Password updated successfully' });
});
exports.updatePassword = updatePassword;
