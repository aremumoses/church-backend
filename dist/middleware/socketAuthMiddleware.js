"use strict";
// import { Socket } from 'socket.io';
// import jwt from 'jsonwebtoken';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectSocket = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const protectSocket = (socket, next) => {
    var _a;
    const token = (_a = socket.handshake.auth) === null || _a === void 0 ? void 0 : _a.token;
    if (!token)
        return next(new Error('Authentication token missing'));
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        socket.data.userId = decoded.id;
        socket.data.name = decoded.name; // ✅ this MUST be here
        socket.data.role = decoded.role;
        next();
    }
    catch (error) {
        return next(new Error('Invalid token'));
    }
};
exports.protectSocket = protectSocket;
