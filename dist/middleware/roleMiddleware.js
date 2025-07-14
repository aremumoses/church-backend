"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.superAdminOnly = exports.adminOnly = void 0;
const adminOnly = (req, res, next) => {
    var _a, _b;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'admin' || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) === 'superadmin') {
        return next();
    }
    return res.status(403).json({ message: 'Admin access only' });
};
exports.adminOnly = adminOnly;
const superAdminOnly = (req, res, next) => {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'superadmin') {
        return next();
    }
    return res.status(403).json({ message: 'Superadmin access only' });
};
exports.superAdminOnly = superAdminOnly;
