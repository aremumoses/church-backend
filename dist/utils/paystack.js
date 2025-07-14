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
exports.verifyPayment = exports.initializePayment = void 0;
const axios_1 = __importDefault(require("axios"));
const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
const initializePayment = (email, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.post('https://api.paystack.co/transaction/initialize', {
        email,
        amount: amount * 100
    }, {
        headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET}`,
            'Content-Type': 'application/json'
        }
    });
    return response.data;
});
exports.initializePayment = initializePayment;
const verifyPayment = (reference) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.get(`https://api.paystack.co/transaction/verify/${reference}`, {
        headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET}`
        }
    });
    return response.data;
});
exports.verifyPayment = verifyPayment;
