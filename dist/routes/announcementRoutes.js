"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const announcementController_1 = require("../controllers/announcementController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get('/', announcementController_1.fetchAnnouncements);
router.post('/', authMiddleware_1.protect, announcementController_1.postAnnouncement);
router.put('/:id', authMiddleware_1.protect, announcementController_1.putAnnouncement);
router.delete('/:id', authMiddleware_1.protect, announcementController_1.removeAnnouncement);
exports.default = router;
