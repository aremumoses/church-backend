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
exports.removeLeader = exports.putLeader = exports.postLeader = exports.fetchLeaderById = exports.fetchLeaders = void 0;
const leaderService_1 = require("../services/leaderService");
const fetchLeaders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const leaders = yield (0, leaderService_1.getAllLeaders)();
        res.json(leaders);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching leaders' });
    }
});
exports.fetchLeaders = fetchLeaders;
const fetchLeaderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const leader = yield (0, leaderService_1.getLeaderById)(id);
        if (!leader) {
            return res.status(404).json({ message: 'Leader not found' });
        }
        res.json(leader);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching leader' });
    }
});
exports.fetchLeaderById = fetchLeaderById;
const postLeader = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, role, image, bio } = req.body;
        if (!name || !role || !image || !bio) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const newLeader = yield (0, leaderService_1.createLeader)(name, role, image, bio);
        res.status(201).json({ message: 'Leader created successfully', leader: newLeader });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating leader' });
    }
});
exports.postLeader = postLeader;
const putLeader = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, role, image, bio } = req.body;
        const { id } = req.params;
        if (!name || !role || !image || !bio) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const updatedLeader = yield (0, leaderService_1.updateLeader)(id, name, role, image, bio);
        if (!updatedLeader) {
            return res.status(404).json({ message: 'Leader not found' });
        }
        res.json({ message: 'Leader updated successfully', leader: updatedLeader });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating leader' });
    }
});
exports.putLeader = putLeader;
const removeLeader = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deleted = yield (0, leaderService_1.deleteLeader)(id);
        if (!deleted) {
            return res.status(404).json({ message: 'Leader not found' });
        }
        res.json({ message: 'Leader deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting leader' });
    }
});
exports.removeLeader = removeLeader;
