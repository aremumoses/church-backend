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
    image: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

const Event = mongoose.model('Event', eventSchema);
export default Event;

// -----------------------------
// 2. Event Functions
// -----------------------------

export const createEvent = async (
  title: string,
  description: string,
  date: string,
  location: string,
  createdBy: string,
  image?: string
) => {
  const event = new Event({ title, description, date, location, image, createdBy });
  await event.save();
};

export const getUpcomingEvents = async () => {
  try {
    console.log('🔍 Fetching upcoming events...');
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to beginning of today
    console.log('📅 Today date:', today);
    
    const events = await Event.find({ date: { $gte: today } })
      .populate('createdBy', 'name email')
      .sort({ date: 1 });
    
    console.log(`✅ Found ${events.length} upcoming events`);
    return events;
  } catch (error) {
    console.error('❌ Error fetching upcoming events:', error);
    throw error;
  }
};

export const getAllEvents = async () => {
  try {
    console.log('🔍 Fetching all events...');
    const events = await Event.find()
      .populate('createdBy', 'name email')
      .sort({ date: -1 });
    console.log(`✅ Found ${events.length} total events`);
    return events;
  } catch (error) {
    console.error('❌ Error fetching all events:', error);
    throw error;
  }
};

export const updateEvent = async (
  id: string,
  title: string,
  description: string,
  date: string,
  location: string,
  image?: string
) => {
  const updateData: any = { title, description, date, location };
  if (image !== undefined) {
    updateData.image = image;
  }
  return await Event.findByIdAndUpdate(id, updateData, { new: true });
};

export const deleteEvent = async (id: string) => {
  await Event.findByIdAndDelete(id);
};
