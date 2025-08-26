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
exports.getMediaCount = exports.getDonationStats = exports.getPostStats = exports.getUserStats = void 0;
const userModel_1 = __importDefault(require("./userModel"));
const mediaFileModel_1 = __importDefault(require("./mediaFileModel"));
const donationModel_1 = require("./donationModel");
const postModel_1 = __importDefault(require("./postModel"));
// 📊 Get user stats
const getUserStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const total = yield userModel_1.default.countDocuments();
    const active = yield userModel_1.default.countDocuments({ status: 'active' });
    const inactive = yield userModel_1.default.countDocuments({ status: 'inactive' });
    return {
        total,
        active,
        inactive,
    };
});
exports.getUserStats = getUserStats;
// 📊 Get post stats
const getPostStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const total = yield postModel_1.default.countDocuments();
    const pending = yield postModel_1.default.countDocuments({ status: 'pending' });
    const approved = yield postModel_1.default.countDocuments({ status: 'active' });
    return {
        total,
        pending,
        approved,
    };
});
exports.getPostStats = getPostStats;
// 📊 Get donation stats
const getDonationStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const donations = yield donationModel_1.Donation.aggregate([
        { $match: { status: 'success' } },
        {
            $group: {
                _id: null,
                successfulCount: { $sum: 1 },
                totalAmount: { $sum: '$amount' },
            },
        },
    ]);
    return donations[0] || { successfulCount: 0, totalAmount: 0 };
});
exports.getDonationStats = getDonationStats;
// 📊 Get media count
const getMediaCount = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield mediaFileModel_1.default.countDocuments();
});
exports.getMediaCount = getMediaCount;
