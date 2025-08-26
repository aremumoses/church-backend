"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const announcementSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, default: 'active' },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});
const Announcement = mongoose_1.default.model('Announcement', announcementSchema);
exports.default = Announcement;
