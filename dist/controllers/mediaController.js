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
exports.deleteMedia = exports.getCategoryMedia = exports.filterMedia = exports.searchMediaFiles = exports.getMediaList = exports.uploadMediaFile = void 0;
const mediaModel_1 = require("../models/mediaModel");
const uploadMediaFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin' && ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== 'superadmin') {
        return res.status(403).json({ message: 'Unauthorized' });
    }
    const { title, description, type, url, category } = req.body;
    try {
        yield (0, mediaModel_1.uploadMedia)({
            title,
            description,
            type,
            url,
            category,
            uploaded_by: (req.user.id),
        });
        res.status(201).json({ message: 'Media uploaded successfully' });
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to upload media' });
    }
});
exports.uploadMediaFile = uploadMediaFile;
const getMediaList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const media = yield (0, mediaModel_1.getAllMedia)();
        res.json(media);
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to fetch media' });
    }
});
exports.getMediaList = getMediaList;
const searchMediaFiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { q } = req.query;
    if (!q)
        return res.status(400).json({ message: 'Search query is required' });
    try {
        const results = yield (0, mediaModel_1.searchMedia)(q);
        res.json(results);
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to search media' });
    }
});
exports.searchMediaFiles = searchMediaFiles;
const filterMedia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { type } = req.params;
    try {
        const results = yield (0, mediaModel_1.filterMediaByType)(type);
        res.json(results);
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to filter media' });
    }
});
exports.filterMedia = filterMedia;
const getCategoryMedia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { category } = req.params;
    try {
        const results = yield (0, mediaModel_1.getMediaByCategory)(category);
        res.json(results);
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to fetch category media' });
    }
});
exports.getCategoryMedia = getCategoryMedia;
const deleteMedia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const id = (req.params.id);
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin' && ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== 'superadmin') {
        return res.status(403).json({ message: 'Unauthorized' });
    }
    try {
        yield (0, mediaModel_1.deleteMediaById)(id);
        res.json({ message: 'Media deleted successfully' });
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to delete media' });
    }
});
exports.deleteMedia = deleteMedia;
