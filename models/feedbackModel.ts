import mongoose from 'mongoose';

// ------------------------------
// 1. Feedback Schema
// ------------------------------
const feedbackSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['pending', 'resolved'], default: 'pending' },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

const Feedback = mongoose.model('Feedback', feedbackSchema);

// ------------------------------
// 2. Feedback Functions
// ------------------------------

export const createFeedback = async (userId: string, subject: string, message: string) => {
  if (!userId || !subject || !message) {
    throw new Error('Missing required fields for feedback');
  }

  const feedback = new Feedback({ userId, subject, message });
  await feedback.save();
};

export const getAllFeedbackEntries = async () => {
  return await Feedback.find()
    .populate('userId', 'name')
    .sort({ created_at: -1 });
};

export const updateFeedbackStatusById = async (id: string, status: string) => {
  await Feedback.findByIdAndUpdate(id, { status });
};
