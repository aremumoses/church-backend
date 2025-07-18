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
exports.editChurchInfo = exports.fetchChurchInfo = void 0;
const churchInfoService_1 = require("../services/churchInfoService");
// Fetch church info (public for all users)
const fetchChurchInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const info = yield (0, churchInfoService_1.getChurchInfo)();
        res.json(info);
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to fetch church info' });
    }
});
exports.fetchChurchInfo = fetchChurchInfo;
// Edit church info (admin/superadmin only)
const editChurchInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const role = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
    if (role !== 'admin' && role !== 'superadmin') {
        return res.status(403).json({ message: 'Unauthorized' });
    }
    try {
        yield (0, churchInfoService_1.updateChurchInfo)(req.body);
        res.json({ message: 'Church info updated successfully' });
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to update church info' });
    }
});
exports.editChurchInfo = editChurchInfo;
