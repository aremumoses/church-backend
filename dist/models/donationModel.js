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
exports.getMonthlyDonations = exports.getDonationsByCategory = exports.getDonationStats = exports.getDonationCategories = exports.createDonationCategory = exports.getAllDonations = exports.getUserDonations = exports.updateDonationStatusByReference = exports.updateDonationStatus = exports.createDonation = exports.Donation = exports.donationSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// ------------------------------
// 1. Donation Category Schema
// ------------------------------
const donationCategorySchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    description: String,
});
const DonationCategory = mongoose_1.default.model('DonationCategory', donationCategorySchema);
// ------------------------------
// 2. Donation Schema
// ------------------------------
exports.donationSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    categoryId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'DonationCategory', required: true },
    amount: { type: Number, required: true },
    reference: { type: String, required: true, unique: true },
    status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });
exports.Donation = mongoose_1.default.model('Donation', exports.donationSchema);
// ------------------------------
// 3. Donation Operations
// ------------------------------
const createDonation = (userId, categoryId, amount, reference) => __awaiter(void 0, void 0, void 0, function* () {
    const donation = new exports.Donation({ userId, categoryId, amount, reference, status: 'pending' });
    yield donation.save();
});
exports.createDonation = createDonation;
const updateDonationStatus = (reference, status) => __awaiter(void 0, void 0, void 0, function* () {
    yield exports.Donation.findOneAndUpdate({ reference }, { status });
});
exports.updateDonationStatus = updateDonationStatus;
exports.updateDonationStatusByReference = exports.updateDonationStatus;
const getUserDonations = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield exports.Donation.find({ userId })
        .populate('categoryId', 'name')
        .sort({ created_at: -1 });
});
exports.getUserDonations = getUserDonations;
const getAllDonations = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield exports.Donation.find()
        .populate('userId', 'name')
        .populate('categoryId', 'name')
        .sort({ created_at: -1 });
});
exports.getAllDonations = getAllDonations;
// ------------------------------
// 4. Donation Category Operations
// ------------------------------
const createDonationCategory = (name, description) => __awaiter(void 0, void 0, void 0, function* () {
    const category = new DonationCategory({ name, description });
    yield category.save();
});
exports.createDonationCategory = createDonationCategory;
const getDonationCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield DonationCategory.find().sort({ name: 1 });
});
exports.getDonationCategories = getDonationCategories;
// ------------------------------
// 5. Stats and Reports
// ------------------------------
const getDonationStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const stats = yield exports.Donation.aggregate([
        { $match: { status: 'success' } },
        {
            $group: {
                _id: null,
                totalDonations: { $sum: 1 },
                totalAmount: { $sum: '$amount' },
            },
        },
    ]);
    return stats[0] || { totalDonations: 0, totalAmount: 0 };
});
exports.getDonationStats = getDonationStats;
const getDonationsByCategory = () => __awaiter(void 0, void 0, void 0, function* () {
    const stats = yield exports.Donation.aggregate([
        { $match: { status: 'success' } },
        {
            $group: {
                _id: '$categoryId',
                count: { $sum: 1 },
                total: { $sum: '$amount' },
            },
        },
        {
            $lookup: {
                from: 'donationcategories',
                localField: '_id',
                foreignField: '_id',
                as: 'category',
            },
        },
        {
            $unwind: '$category',
        },
        {
            $project: {
                category: '$category.name',
                count: 1,
                total: 1,
            },
        },
    ]);
    return stats;
});
exports.getDonationsByCategory = getDonationsByCategory;
const getMonthlyDonations = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield exports.Donation.aggregate([
        { $match: { status: 'success' } },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m', date: '$created_at' } },
                count: { $sum: 1 },
                total: { $sum: '$amount' },
            },
        },
        { $sort: { _id: -1 } },
        { $limit: 6 },
    ]);
});
exports.getMonthlyDonations = getMonthlyDonations;
