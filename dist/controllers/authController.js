"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.updatePassword = exports.verifyOtp = exports.forgotPassword = exports.getCurrentUser = exports.login = exports.register = void 0;
const userModel_1 = __importStar(require("../models/userModel"));
const generateToken_1 = require("../utils/generateToken");
const hashUtils_1 = require("../utils/hashUtils");
const helper_1 = require("../middleware/helper");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    const existingUser = yield (0, userModel_1.getUserByEmail)(email);
    if (existingUser) {
        return res.status(400).json({ message: 'User already created' });
    }
    const hashed = yield (0, hashUtils_1.hashPassword)(password);
    const newUser = yield userModel_1.default.create({ name, email, password: hashed });
    const token = (0, generateToken_1.generateToken)({ id: newUser._id, role: newUser.role });
    yield (0, helper_1.sendOtpToEmail)(email, name);
    return res.status(201).json({ message: 'Registration successful', token });
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield userModel_1.default.findOne({ email });
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
    const token = (0, generateToken_1.generateToken)({ id: user.id, role: user === null || user === void 0 ? void 0 : user.role });
    // console.log('Generated Token:', token);
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
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    user.otpForReset = otp;
    user.otpResetCreatedAt = new Date();
    user.otpVerifiedForReset = false;
    yield user.save({ validateBeforeSave: false });
    yield (0, helper_1.sendForgetOtpToEmail)(email, user === null || user === void 0 ? void 0 : user.name, otp);
    return res.json({ message: 'An otp has been be sent to your mail. kindly check' });
});
exports.forgotPassword = forgotPassword;
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { email, otp } = req.body;
    const user = yield userModel_1.default.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }
    if (!user.otpForReset || user.otpForReset !== otp) {
        return res.status(400).json({ message: 'Invalid otp' });
    }
    const now = Date.now();
    const createdAt = (_b = (_a = user.otpResetCreatedAt) === null || _a === void 0 ? void 0 : _a.getTime()) !== null && _b !== void 0 ? _b : 0;
    const TWO_MINUTES = 2 * 60 * 1000;
    if (now - createdAt > TWO_MINUTES) {
        user.otpForReset = '';
        user.otpResetCreatedAt = undefined;
        yield user.save({ validateBeforeSave: false });
        return res.status(400).json({ message: 'Otp has expired' });
    }
    user.otpForReset = '';
    user.otpResetCreatedAt = undefined;
    user.otpVerifiedForReset = true;
    yield user.save({ validateBeforeSave: false });
    return res.json({ message: 'OTP verified. You can now reset your password.' });
});
exports.verifyOtp = verifyOtp;
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, newPassword } = req.body;
    const user = yield userModel_1.default.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    if (!user.otpVerifiedForReset) {
        return res.status(400).json({ message: 'Not authorized, pls verify OTP' });
    }
    const hashed = yield (0, hashUtils_1.hashPassword)(newPassword);
    user.password = hashed;
    user.otpVerifiedForReset = false;
    yield user.save();
    return res.json({ message: 'Password reset successfully, proceed to login' });
});
exports.updatePassword = updatePassword;
