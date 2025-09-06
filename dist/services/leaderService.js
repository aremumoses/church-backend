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
exports.deleteLeader = exports.updateLeader = exports.createLeader = exports.getLeaderById = exports.getAllLeaders = void 0;
// Mock database - replace with your actual database implementation
let leaders = [];
const getAllLeaders = () => __awaiter(void 0, void 0, void 0, function* () {
    return leaders;
});
exports.getAllLeaders = getAllLeaders;
const getLeaderById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return leaders.find(leader => leader.id === id) || null;
});
exports.getLeaderById = getLeaderById;
const createLeader = (name, role, image, bio) => __awaiter(void 0, void 0, void 0, function* () {
    const newLeader = {
        id: Date.now().toString(), // Replace with proper ID generation
        name,
        role,
        image,
        bio
    };
    leaders.push(newLeader);
    return newLeader;
});
exports.createLeader = createLeader;
const updateLeader = (id, name, role, image, bio) => __awaiter(void 0, void 0, void 0, function* () {
    const leaderIndex = leaders.findIndex(leader => leader.id === id);
    if (leaderIndex === -1) {
        return null;
    }
    leaders[leaderIndex] = {
        id,
        name,
        role,
        image,
        bio
    };
    return leaders[leaderIndex];
});
exports.updateLeader = updateLeader;
const deleteLeader = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const leaderIndex = leaders.findIndex(leader => leader.id === id);
    if (leaderIndex === -1) {
        return false;
    }
    leaders.splice(leaderIndex, 1);
    return true;
});
exports.deleteLeader = deleteLeader;
