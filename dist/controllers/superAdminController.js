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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSuperadminDetails = exports.toggleUserActiveStatus = exports.getAllUsers = exports.getAllAdmins = exports.toggleUserAdmin = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const toggleUserAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, adminPost } = req.body;
    const user = yield userModel_1.default.findById(userId);
    if (!user)
        return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') {
        // Revert admin to normal user
        user.role = 'user';
        user.adminPost = undefined;
        yield user.save();
        return res.json({ message: 'User reverted back to normal user', user });
    }
    else {
        // Promote user to admin
        user.role = 'admin';
        user.adminPost = adminPost || 'Granted by superadmin';
        yield user.save();
        return res.json({ message: 'User upgraded to admin successfully', user });
    }
});
exports.toggleUserAdmin = toggleUserAdmin;
// Superadmin → get all admins
const getAllAdmins = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const admins = yield userModel_1.default.find({ role: 'admin' });
    res.json(admins);
});
exports.getAllAdmins = getAllAdmins;
// Superadmin → get all users (excluding admins & superadmin)
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield userModel_1.default.find({ role: 'user' });
    res.json(users);
});
exports.getAllUsers = getAllUsers;
const toggleUserActiveStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const user = yield userModel_1.default.findById(userId);
    console.log(user);
    if (!user)
        return res.status(404).json({ message: 'User not found' });
    user.status = user.status === 'active' ? 'inactive' : 'active';
    yield user.save();
    res.json({
        message: `User account ${user.status === 'active' ? 'activated' : 'deactivated'} successfully`,
        user,
    });
});
exports.toggleUserActiveStatus = toggleUserActiveStatus;
const getSuperadminDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const superadminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const superadmin = yield userModel_1.default.findById(superadminId).select('-password');
    if (!superadmin)
        return res.status(404).json({ message: 'Superadmin not found' });
    res.json({ message: 'Superadmin details fetched successfully', superadmin });
});
exports.getSuperadminDetails = getSuperadminDetails;
