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
exports.deleteAnnouncement = exports.updateAnnouncement = exports.getAllActiveAnnouncements = exports.createAnnouncement = void 0;
const announcementsModel_1 = __importDefault(require("../models/announcementsModel"));
const createAnnouncement = (title, content, createdBy) => __awaiter(void 0, void 0, void 0, function* () {
    const announcement = new announcementsModel_1.default({ title, content, createdBy });
    return yield announcement.save();
});
exports.createAnnouncement = createAnnouncement;
const getAllActiveAnnouncements = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield announcementsModel_1.default.find({ status: 'active' }).sort({ created_at: -1 });
});
exports.getAllActiveAnnouncements = getAllActiveAnnouncements;
const updateAnnouncement = (id, title, content) => __awaiter(void 0, void 0, void 0, function* () {
    return yield announcementsModel_1.default.findByIdAndUpdate(id, { title, content });
});
exports.updateAnnouncement = updateAnnouncement;
const deleteAnnouncement = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield announcementsModel_1.default.findByIdAndDelete(id);
});
exports.deleteAnnouncement = deleteAnnouncement;
