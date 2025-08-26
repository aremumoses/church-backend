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
exports.removeAnnouncement = exports.putAnnouncement = exports.postAnnouncement = exports.fetchAnnouncements = void 0;
const announcementService_1 = require("../services/announcementService");
const fetchAnnouncements = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const announcements = yield (0, announcementService_1.getAllActiveAnnouncements)();
    res.json(announcements);
});
exports.fetchAnnouncements = fetchAnnouncements;
const postAnnouncement = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content } = req.body;
    yield (0, announcementService_1.createAnnouncement)(title, content, req.user.id);
    res.status(201).json({ message: 'Announcement created' });
});
exports.postAnnouncement = postAnnouncement;
const putAnnouncement = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content } = req.body;
    const { id } = req.params;
    yield (0, announcementService_1.updateAnnouncement)((id), title, content);
    res.json({ message: 'Announcement updated' });
});
exports.putAnnouncement = putAnnouncement;
const removeAnnouncement = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield (0, announcementService_1.deleteAnnouncement)(id);
    res.json({ message: 'Announcement deleted' });
});
exports.removeAnnouncement = removeAnnouncement;
