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
exports.getDashboardOverview = void 0;
const dashboardModel_1 = require("../models/dashboardModel");
const donationModel_1 = require("../models/donationModel");
const getDashboardOverview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [userStats, postStats, donationStats, mediaCount] = yield Promise.all([
            (0, dashboardModel_1.getUserStats)(),
            (0, dashboardModel_1.getPostStats)(),
            (0, donationModel_1.getDonationStats)(),
            (0, dashboardModel_1.getMediaCount)(),
        ]);
        res.json({
            userStats,
            postStats,
            donationStats,
            mediaCount,
            // onlineUsers: onlineUserList, // Uncomment when needed
        });
    }
    catch (error) {
        console.error('❌ Dashboard Error:', error);
        res.status(500).json({ message: 'Error fetching dashboard metrics' });
    }
});
exports.getDashboardOverview = getDashboardOverview;
