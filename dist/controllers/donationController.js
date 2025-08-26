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
exports.getCategories = exports.addCategory = exports.allDonations = exports.userDonationHistory = exports.confirmDonation = exports.handlePaystackWebhook = exports.startDonation = exports.getDonationAnalytics = void 0;
const donationModel_1 = require("../models/donationModel");
const paystack_1 = require("../utils/paystack");
const crypto_1 = __importDefault(require("crypto"));
const donationModel_2 = require("../models/donationModel");
const getDonationAnalytics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stats = yield (0, donationModel_2.getDonationStats)();
        const categoryBreakdown = yield (0, donationModel_2.getDonationsByCategory)();
        const monthlyDonations = yield (0, donationModel_2.getMonthlyDonations)();
        res.json({
            totalDonations: stats.totalDonations,
            totalAmount: stats.totalAmount,
            categoryBreakdown,
            monthlyDonations
        });
    }
    catch (err) {
        console.error('Analytics Error:', err);
        res.status(500).json({ message: 'Failed to fetch analytics' });
    }
});
exports.getDonationAnalytics = getDonationAnalytics;
const startDonation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // if (!req.body) {
    //   console.error('❌ req.body is undefined!');
    //   return res.status(400).json({ message: 'Request body is missing.' });
    // }
    // const { amount, categoryId } = req.body;
    // if (!amount || !categoryId) {
    //   return res.status(400).json({ message: 'Amount and categoryId are required.' });
    // }
    // const { email, id: userId } = req.user!;
    // if (!email || !userId) {
    //   return res.status(400).json({ message: 'User email and ID are required to start a donation.' });
    // }
    // try {
    //   const init = await initializePayment(email, amount);
    //   const reference = init.data.reference;
    //   await createDonation((userId), categoryId, amount, reference);
    //   res.json({ authorization_url: init.data.authorization_url });
    // } catch (err) {
    //   console.error('💥 Error initializing donation:', err);
    //   res.status(500).json({ message: 'Donation initialization failed.' });
    // }
});
exports.startDonation = startDonation;
const handlePaystackWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    const hash = crypto_1.default.createHmac('sha512', secret).update(req.body).digest('hex');
    const signature = req.headers['x-paystack-signature'];
    if (hash !== signature) {
        return res.status(401).json({ message: 'Unauthorized webhook' });
    }
    const event = JSON.parse(req.body.toString());
    if (event.event === 'charge.success') {
        const { reference, status } = event.data;
        try {
            if (status === 'success') {
                yield (0, donationModel_1.updateDonationStatusByReference)(reference, 'success');
                console.log(`✅ Donation ${reference} verified`);
            }
        }
        catch (err) {
            console.error('Webhook error:', err);
        }
    }
    res.sendStatus(200); // Acknowledge receipt
});
exports.handlePaystackWebhook = handlePaystackWebhook;
const confirmDonation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reference } = req.query;
    const result = yield (0, paystack_1.verifyPayment)(reference);
    if (result.data.status === 'success') {
        yield (0, donationModel_1.updateDonationStatus)(reference, 'success');
        res.json({ message: 'Donation successful' });
    }
    else {
        yield (0, donationModel_1.updateDonationStatus)(reference, 'failed');
        res.status(400).json({ message: 'Donation failed or pending' });
    }
});
exports.confirmDonation = confirmDonation;
const userDonationHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const donations = yield (0, donationModel_1.getUserDonations)((req.user.id));
    res.json(donations);
});
exports.userDonationHistory = userDonationHistory;
const allDonations = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const donations = yield (0, donationModel_1.getAllDonations)();
    res.json(donations);
});
exports.allDonations = allDonations;
const addCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description } = req.body;
    yield (0, donationModel_1.createDonationCategory)(name, description);
    res.json({ message: 'Category added successfully' });
});
exports.addCategory = addCategory;
const getCategories = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield (0, donationModel_1.getDonationCategories)();
    res.json(categories);
});
exports.getCategories = getCategories;
