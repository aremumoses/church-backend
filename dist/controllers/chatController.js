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
exports.fetchChatHistory = exports.fetchConversationsList = exports.fetchConversation = exports.sendChatMessage = void 0;
const chatModel_1 = require("../models/chatModel");
const chatModel_2 = require("../models/chatModel");
const sendChatMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { receiverId, message } = req.body;
    const senderId = (req.user.id);
    if (!receiverId || !message) {
        return res.status(400).json({ message: 'receiverId and message are required' });
    }
    try {
        yield (0, chatModel_1.sendMessage)(senderId, receiverId, message);
        res.status(201).json({ message: 'Message sent successfully' });
    }
    catch (err) {
        console.error('Send chat error:', err);
        res.status(500).json({ message: 'Failed to send message' });
    }
});
exports.sendChatMessage = sendChatMessage;
const fetchConversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const senderId = (req.user.id);
    const receiverId = (req.params.userId);
    try {
        const messages = yield (0, chatModel_1.getConversationWithUser)(senderId, receiverId);
        res.json(messages);
    }
    catch (err) {
        console.error('Fetch chat error:', err);
        res.status(500).json({ message: 'Failed to fetch conversation' });
    }
});
exports.fetchConversation = fetchConversation;
const fetchConversationsList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = (req.user.id);
    try {
        const list = yield (0, chatModel_1.getConversationList)(userId);
        res.json(list);
    }
    catch (err) {
        console.error('Conversation list error:', err);
        res.status(500).json({ message: 'Failed to fetch conversations' });
    }
});
exports.fetchConversationsList = fetchConversationsList;
const fetchChatHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user1, user2 } = req.query;
    if (!user1 || !user2) {
        return res.status(400).json({ message: 'Both user1 and user2 are required' });
    }
    try {
        const messages = yield (0, chatModel_2.getChatHistory)(user1, user2);
        res.json(messages);
    }
    catch (error) {
        console.error('Chat history error:', error);
        res.status(500).json({ message: 'Server error fetching chat history' });
    }
});
exports.fetchChatHistory = fetchChatHistory;
