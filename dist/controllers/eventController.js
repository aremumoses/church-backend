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
exports.removeEvent = exports.putEvent = exports.postEvent = exports.fetchEvents = void 0;
const eventModel_1 = require("../models/eventModel");
const fetchEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const events = yield (0, eventModel_1.getUpcomingEvents)();
    res.json(events);
});
exports.fetchEvents = fetchEvents;
const postEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, date, location } = req.body;
    yield (0, eventModel_1.createEvent)(title, description, date, location, (req.user.id));
    res.status(201).json({ message: 'Event created' });
});
exports.postEvent = postEvent;
const putEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, date, location } = req.body;
    const { id } = req.params;
    yield (0, eventModel_1.updateEvent)((id), title, description, date, location);
    res.json({ message: 'Event updated' });
});
exports.putEvent = putEvent;
const removeEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield (0, eventModel_1.deleteEvent)((id));
    res.json({ message: 'Event deleted' });
});
exports.removeEvent = removeEvent;
