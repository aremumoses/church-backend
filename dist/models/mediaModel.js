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
exports.getMediaCount = exports.deleteMediaById = exports.getMediaByCategory = exports.filterMediaByType = exports.searchMedia = exports.getAllMedia = exports.uploadMedia = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// -----------------------------
// Media Schema
// -----------------------------
const mediaSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    description: { type: String },
    type: {
        type: String,
        enum: ['video', 'audio', 'pdf', 'image'],
        required: true,
    },
    url: { type: String, required: true },
    category: { type: String },
    uploaded_by: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});
const Media = mongoose_1.default.model('Media', mediaSchema);
// -----------------------------
// Media Functions
// -----------------------------
const uploadMedia = (media) => __awaiter(void 0, void 0, void 0, function* () {
    const newMedia = new Media(media);
    yield newMedia.save();
    return newMedia;
});
exports.uploadMedia = uploadMedia;
const getAllMedia = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield Media.find().sort({ created_at: -1 }).populate('uploaded_by', 'name');
});
exports.getAllMedia = getAllMedia;
const searchMedia = (query) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Media.find({
        $or: [
            { title: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } },
        ],
    }).sort({ created_at: -1 });
});
exports.searchMedia = searchMedia;
const filterMediaByType = (type) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Media.find({ type }).sort({ created_at: -1 });
});
exports.filterMediaByType = filterMediaByType;
const getMediaByCategory = (category) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Media.find({ category }).sort({ created_at: -1 });
});
exports.getMediaByCategory = getMediaByCategory;
const deleteMediaById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Media.findByIdAndDelete(id);
});
exports.deleteMediaById = deleteMediaById;
const getMediaCount = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield Media.countDocuments();
});
exports.getMediaCount = getMediaCount;
exports.default = Media;
