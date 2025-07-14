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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEvent = exports.updateEvent = exports.getUpcomingEvents = exports.createEvent = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// -----------------------------
// 1. Event Schema
// -----------------------------
const eventSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    description: String,
    date: { type: Date, required: true },
    location: String,
    createdBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});
const Event = mongoose_1.default.model('Event', eventSchema);
// -----------------------------
// 2. Event Functions
// -----------------------------
const createEvent = (title, description, date, location, createdBy) => __awaiter(void 0, void 0, void 0, function* () {
    const event = new Event({ title, description, date, location, createdBy });
    yield event.save();
});
exports.createEvent = createEvent;
const getUpcomingEvents = () => __awaiter(void 0, void 0, void 0, function* () {
    const today = new Date();
    return yield Event.find({ date: { $gte: today } }).sort({ date: 1 });
});
exports.getUpcomingEvents = getUpcomingEvents;
const updateEvent = (id, title, description, date, location) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Event.findByIdAndUpdate(id, { title, description, date, location }, { new: true });
});
exports.updateEvent = updateEvent;
const deleteEvent = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield Event.findByIdAndDelete(id);
});
exports.deleteEvent = deleteEvent;
