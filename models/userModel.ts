import mongoose from 'mongoose';

// -----------------------------
// User Type & Schema
// -----------------------------

export interface UserDocument extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin' | 'superadmin';
  status: 'active' | 'inactive';
  phone?: string;
  gender?: 'male' | 'female' | 'other';
  birthday?: string;
  profile_pic?: string;
  created_at?: Date;
  otpForReset?: string;
  otpResetCreatedAt?: Date;
  otpVerifiedForReset?: boolean;
  adminPost?: string
}

const userSchema = new mongoose.Schema<UserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['user', 'admin', 'superadmin'],
      default: 'user', required: false 
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    phone: String,
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    birthday: String,
    profile_pic: String,
    otpForReset: { type: String },
    otpResetCreatedAt: { type: Date },
    otpVerifiedForReset: { type: Boolean, default: false },
    adminPost: { type: String, default: null } // reason or privilege note

  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

const User = mongoose.model<UserDocument>('User', userSchema);

// -----------------------------
// Model Functions
// -----------------------------

export const getUsersByRole = async (role: string): Promise<UserDocument[]> => {
  return await User.find({ role }, 'id name email role');
};

export const createUser = async (user: Partial<UserDocument>) => {
  const newUser = new User(user);
  return await newUser.save();
};

export const getUserByEmail = async (email: string): Promise<UserDocument | null> => {
  return await User.findOne({ email });
};

export const getUserById = async (id: string): Promise<UserDocument | null> => {
  return await User.findById(id);
};

export const updateUserPassword = async (email: string, newHashedPassword: string) => {
  return await User.findOneAndUpdate({ email }, { password: newHashedPassword }, { new: true });
};

export const updateUserProfile = async (
  id: string,
  updates: Partial<UserDocument>
) => {
  return await User.findByIdAndUpdate(id, updates, { new: true });
};

export const getUserPublicProfileById = async (
  id: string
): Promise<Partial<UserDocument> | null> => {
  return await User.findById(id).select('id name role profile_pic');
};

export const updateUserRole = async (
  id: string,
  role: 'user' | 'admin'
): Promise<UserDocument | null> => {
  return await User.findByIdAndUpdate(id, { role }, { new: true });
};

export const updateUserStatus = async (
  id: string,
  status: 'active' | 'inactive'
): Promise<UserDocument | null> => {
  return await User.findByIdAndUpdate(id, { status }, { new: true });
};

export default User;
