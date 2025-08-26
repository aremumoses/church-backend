"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mediaController_1 = require("../controllers/mediaController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post('/upload', authMiddleware_1.protect, mediaController_1.uploadMediaFile);
router.get('/', mediaController_1.getMediaList);
router.get('/search', mediaController_1.searchMediaFiles);
router.get('/type/:type', mediaController_1.filterMedia);
router.get('/category/:category', mediaController_1.getCategoryMedia);
router.delete('/:id', authMiddleware_1.protect, mediaController_1.deleteMedia);
exports.default = router;
