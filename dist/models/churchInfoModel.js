"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const churchInfoSchema = new mongoose_1.default.Schema({
    history: { type: String },
    mission: { type: String },
    vision: { type: String },
    doctrines: { type: String },
    leadership: { type: String },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});
const ChurchInfo = mongoose_1.default.model('ChurchInfo', churchInfoSchema);
exports.default = ChurchInfo;
