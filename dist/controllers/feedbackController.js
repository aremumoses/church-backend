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
exports.updateFeedbackStatus = exports.getAllFeedback = exports.submitFeedback = void 0;
const feedbackModel_1 = require("../models/feedbackModel");
const submitFeedback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { subject, message } = req.body;
    const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
    if (!userId || !subject || !message) {
        return res.status(400).json({ message: 'Subject and message are required' });
    }
    try {
        yield (0, feedbackModel_1.createFeedback)(userId, subject, message);
        res.status(201).json({ message: 'Feedback submitted successfully' });
    }
    catch (error) {
        console.error('❌ Error submitting feedback:', error);
        res.status(500).json({ message: 'Failed to submit feedback' });
    }
});
exports.submitFeedback = submitFeedback;
const getAllFeedback = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const feedback = yield (0, feedbackModel_1.getAllFeedbackEntries)();
    res.json(feedback);
});
exports.getAllFeedback = getAllFeedback;
const updateFeedbackStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    yield (0, feedbackModel_1.updateFeedbackStatusById)(id, status);
    res.json({ message: 'Feedback status updated' });
});
exports.updateFeedbackStatus = updateFeedbackStatus;
