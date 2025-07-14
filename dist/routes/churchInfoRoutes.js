"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const churchInfoController_1 = require("../controllers/churchInfoController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get('/', churchInfoController_1.fetchChurchInfo);
router.put('/edit', authMiddleware_1.protect, churchInfoController_1.editChurchInfo);
exports.default = router;
