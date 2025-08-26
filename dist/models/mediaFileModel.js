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
exports.getMediaCount = exports.deleteMediaFile = exports.getMediaFileById = exports.getMediaFiles = exports.uploadMediaFile = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// ----------------------
// 1. Media File Schema
// ----------------------
const mediaFileSchema = new mongoose_1.default.Schema({
    filename: { type: String, required: true },
    type: { type: String, enum: ['audio', 'video', 'image', 'pdf', 'document'], required: true },
    uploadedBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});
const MediaFile = mongoose_1.default.model('MediaFile', mediaFileSchema);
// ----------------------
// 2. Media File Functions
// ----------------------
/**
 * Upload a new media file
 */
const uploadMediaFile = (filename, type, uploadedBy) => __awaiter(void 0, void 0, void 0, function* () {
    const file = new MediaFile({ filename, type, uploadedBy });
    yield file.save();
    return file;
});
exports.uploadMediaFile = uploadMediaFile;
/**
 * Get all media files (optional: filter by type)
 */
const getMediaFiles = (type) => __awaiter(void 0, void 0, void 0, function* () {
    const query = type ? { type } : {};
    return yield MediaFile.find(query).sort({ created_at: -1 }).populate('uploadedBy', 'name');
});
exports.getMediaFiles = getMediaFiles;
/**
 * Get media file by ID
 */
const getMediaFileById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield MediaFile.findById(id).populate('uploadedBy', 'name');
});
exports.getMediaFileById = getMediaFileById;
/**
 * Delete a media file
 */
const deleteMediaFile = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield MediaFile.findByIdAndDelete(id);
});
exports.deleteMediaFile = deleteMediaFile;
/**
 * Get media file count (for dashboard stats)
 */
const getMediaCount = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield MediaFile.countDocuments();
});
exports.getMediaCount = getMediaCount;
exports.default = MediaFile;
