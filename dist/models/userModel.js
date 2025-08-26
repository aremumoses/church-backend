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
exports.updateUserStatus = exports.updateUserRole = exports.getUserPublicProfileById = exports.updateUserProfile = exports.updateUserPassword = exports.getUserById = exports.getUserByEmail = exports.createUser = exports.getUsersByRole = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['user', 'admin', 'superadmin'],
        default: 'user', required: false
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
    phone: String,
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
    },
    birthday: String,
    profile_pic: String,
    otpForReset: { type: String },
    otpResetCreatedAt: { type: Date },
    otpVerifiedForReset: { type: Boolean, default: false },
    adminPost: { type: String, default: null } // reason or privilege note
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});
const User = mongoose_1.default.model('User', userSchema);
// -----------------------------
// Model Functions
// -----------------------------
const getUsersByRole = (role) => __awaiter(void 0, void 0, void 0, function* () {
    return yield User.find({ role }, 'id name email role');
});
exports.getUsersByRole = getUsersByRole;
const createUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = new User(user);
    return yield newUser.save();
});
exports.createUser = createUser;
const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield User.findOne({ email });
});
exports.getUserByEmail = getUserByEmail;
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield User.findById(id);
});
exports.getUserById = getUserById;
const updateUserPassword = (email, newHashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    return yield User.findOneAndUpdate({ email }, { password: newHashedPassword }, { new: true });
});
exports.updateUserPassword = updateUserPassword;
const updateUserProfile = (id, updates) => __awaiter(void 0, void 0, void 0, function* () {
    return yield User.findByIdAndUpdate(id, updates, { new: true });
});
exports.updateUserProfile = updateUserProfile;
const getUserPublicProfileById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield User.findById(id).select('id name role profile_pic');
});
exports.getUserPublicProfileById = getUserPublicProfileById;
const updateUserRole = (id, role) => __awaiter(void 0, void 0, void 0, function* () {
    return yield User.findByIdAndUpdate(id, { role }, { new: true });
});
exports.updateUserRole = updateUserRole;
const updateUserStatus = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    return yield User.findByIdAndUpdate(id, { status }, { new: true });
});
exports.updateUserStatus = updateUserStatus;
exports.default = User;
