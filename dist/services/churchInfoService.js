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
exports.updateChurchInfo = exports.getChurchInfo = void 0;
const churchInfoModel_1 = __importDefault(require("../models/churchInfoModel"));
const getChurchInfo = () => __awaiter(void 0, void 0, void 0, function* () {
    const info = yield churchInfoModel_1.default.findOne();
    return info;
});
exports.getChurchInfo = getChurchInfo;
const updateChurchInfo = (data) => __awaiter(void 0, void 0, void 0, function* () {
    let info = yield churchInfoModel_1.default.findOne();
    if (!info) {
        // Create new record if none exists
        info = new churchInfoModel_1.default(data);
    }
    else {
        // Update existing record
        Object.assign(info, data);
    }
    return yield info.save();
});
exports.updateChurchInfo = updateChurchInfo;
