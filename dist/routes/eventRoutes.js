"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const eventController_1 = require("../controllers/eventController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get('/', eventController_1.fetchEvents);
router.post('/', authMiddleware_1.protect, eventController_1.postEvent);
router.put('/:id', authMiddleware_1.protect, eventController_1.putEvent);
router.delete('/:id', authMiddleware_1.protect, eventController_1.removeEvent);
exports.default = router;
