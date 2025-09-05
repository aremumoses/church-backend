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
// Works with any of these shapes:
// 1) { data: { status: true, data: { authorization_url, reference } } }  // raw axios response
// 2) { status: true, data: { authorization_url, reference } }            // already unwrapped once
// 3) { authorization_url, reference }                                    // fully unwrapped (your logs show this)
const startDonation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    if (!req.body) {
        return res.status(400).json({ message: 'Request body is missing.' });
    }
    const { amount, categoryId } = req.body;
    if (!amount || !categoryId) {
        return res.status(400).json({ message: 'Amount and categoryId are required.' });
    }
    const { email, id: userId } = req.user || {};
    if (!email || !userId) {
        return res.status(400).json({ message: 'User email and ID are required to start a donation.' });
    }
    try {
        console.log(`🔹 Initializing payment for ${email}, Amount: ${amount}, Category: ${categoryId}`);
        const init = yield (0, paystack_1.initializePayment)(email, amount); // ensure initializePayment handles kobo conversion
        // --- Normalize Paystack init response shape ---
        let authorization_url;
        let reference;
        if ((init === null || init === void 0 ? void 0 : init.authorization_url) && (init === null || init === void 0 ? void 0 : init.reference)) {
            // fully unwrapped object (what your console showed)
            ({ authorization_url, reference } = init);
        }
        else if (((_a = init === null || init === void 0 ? void 0 : init.data) === null || _a === void 0 ? void 0 : _a.authorization_url) && ((_b = init === null || init === void 0 ? void 0 : init.data) === null || _b === void 0 ? void 0 : _b.reference)) {
            // unwrapped one level
            ({ authorization_url, reference } = init.data);
        }
        else if (((_d = (_c = init === null || init === void 0 ? void 0 : init.data) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.authorization_url) && ((_f = (_e = init === null || init === void 0 ? void 0 : init.data) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.reference)) {
            // raw axios shape
            ({ authorization_url, reference } = init.data.data);
            // optional: if you want to keep a status check, accept true OR undefined
            if (init.data.status === false) {
                return res.status(502).json({ message: init.data.message || 'Payment initialization failed.' });
            }
        }
        if (!authorization_url || !reference) {
            console.error('❌ Unexpected Paystack init response shape:', init);
            return res.status(502).json({ message: 'Payment initialization failed.' });
        }
        // --- end normalization ---
        // Save the donation (store original amount you showed the user)
        yield (0, donationModel_1.createDonation)(userId, categoryId, amount, reference);
        return res.status(201).json({
            message: 'Payment initialized successfully.',
            authorization_url,
            reference,
        });
    }
    catch (err) {
        console.error('💥 Error initializing donation:', ((_g = err === null || err === void 0 ? void 0 : err.response) === null || _g === void 0 ? void 0 : _g.data) || (err === null || err === void 0 ? void 0 : err.message) || err);
        return res.status(500).json({ message: 'Donation initialization failed.' });
    }
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
