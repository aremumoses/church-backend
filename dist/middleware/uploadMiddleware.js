"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (_req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter: (_req, file, cb) => {
        const allowedTypes = ['video/', 'audio/', 'image/', 'application/pdf'];
        if (allowedTypes.some(type => file.mimetype.startsWith(type))) {
            cb(null, true);
        }
        else {
            cb(new Error('Invalid file type'));
        }
    },
});
