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
exports.updateChurchInfo = exports.createChurchInfo = exports.getChurchInfo = void 0;
const churchInfoModel_1 = __importDefault(require("../models/churchInfoModel"));
// Get church information
const getChurchInfo = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield churchInfoModel_1.default.findOne();
});
exports.getChurchInfo = getChurchInfo;
// Create church information (if not exists)
const createChurchInfo = (data) => __awaiter(void 0, void 0, void 0, function* () {
    // Ensure only one record exists
    const existingInfo = yield churchInfoModel_1.default.findOne();
    if (existingInfo) {
        throw new Error('Church information already exists. Use update instead.');
    }
    const info = new churchInfoModel_1.default(data);
    return yield info.save();
});
exports.createChurchInfo = createChurchInfo;
// Update church information
const updateChurchInfo = (data) => __awaiter(void 0, void 0, void 0, function* () {
    let info = yield churchInfoModel_1.default.findOne();
    if (!info) {
        throw new Error('No church info found. Create it first.');
    }
    Object.assign(info, data);
    return yield info.save();
});
exports.updateChurchInfo = updateChurchInfo;
