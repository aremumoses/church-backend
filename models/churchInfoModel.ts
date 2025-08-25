import mongoose from 'mongoose';

const churchInfoSchema = new mongoose.Schema(
  {
    history: { type: String },
    mission: { type: String },
    vision: { type: String },
    doctrines: { type: String },
    leadership: { type: String },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

const ChurchInfo = mongoose.model('ChurchInfo', churchInfoSchema);
export default ChurchInfo;
