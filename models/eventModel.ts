import mongoose from 'mongoose';

// -----------------------------
// 1. Event Schema
// -----------------------------
const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    date: { type: Date, required: true },
    location: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

const Event = mongoose.model('Event', eventSchema);

// -----------------------------
// 2. Event Functions
// -----------------------------

export const createEvent = async (
  title: string,
  description: string,
  date: string,
  location: string,
  createdBy: string
) => {
  const event = new Event({ title, description, date, location, createdBy });
  await event.save();
};

export const getUpcomingEvents = async () => {
  const today = new Date();
  return await Event.find({ date: { $gte: today } }).sort({ date: 1 });
};

export const updateEvent = async (
  id: string,
  title: string,
  description: string,
  date: string,
  location: string
) => {
  return await Event.findByIdAndUpdate(
    id,
    { title, description, date, location },
    { new: true }
  );
};

export const deleteEvent = async (id: string) => {
  await Event.findByIdAndDelete(id);
};
