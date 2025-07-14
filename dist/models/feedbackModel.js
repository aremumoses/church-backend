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
exports.updateFeedbackStatusById = exports.getAllFeedbackEntries = exports.createFeedback = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// ------------------------------
// 1. Feedback Schema
// ------------------------------
const feedbackSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['pending', 'resolved'], default: 'pending' },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});
const Feedback = mongoose_1.default.model('Feedback', feedbackSchema);
// ------------------------------
// 2. Feedback Functions
// ------------------------------
const createFeedback = (userId, subject, message) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId || !subject || !message) {
        throw new Error('Missing required fields for feedback');
    }
    const feedback = new Feedback({ userId, subject, message });
    yield feedback.save();
});
exports.createFeedback = createFeedback;
const getAllFeedbackEntries = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield Feedback.find()
        .populate('userId', 'name')
        .sort({ created_at: -1 });
});
exports.getAllFeedbackEntries = getAllFeedbackEntries;
const updateFeedbackStatusById = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    yield Feedback.findByIdAndUpdate(id, { status });
});
exports.updateFeedbackStatusById = updateFeedbackStatusById;
