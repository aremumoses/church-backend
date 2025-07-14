import mongoose from 'mongoose';

// ------------------------------
// 1. Donation Category Schema
// ------------------------------
const donationCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
});

const DonationCategory = mongoose.model('DonationCategory', donationCategorySchema);

// ------------------------------
// 2. Donation Schema
// ------------------------------
export const donationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'DonationCategory', required: true },
    amount: { type: Number, required: true },
    reference: { type: String, required: true, unique: true },
    status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export const Donation = mongoose.model('Donation', donationSchema);

// ------------------------------
// 3. Donation Operations
// ------------------------------

export const createDonation = async (
  userId: string,
  categoryId: string,
  amount: number,
  reference: string
) => {
  const donation = new Donation({ userId, categoryId, amount, reference, status: 'pending' });
  await donation.save();
};

export const updateDonationStatus = async (reference: string, status: string) => {
  await Donation.findOneAndUpdate({ reference }, { status });
};

export const updateDonationStatusByReference = updateDonationStatus;

export const getUserDonations = async (userId: string) => {
  return await Donation.find({ userId })
    .populate('categoryId', 'name')
    .sort({ created_at: -1 });
};

export const getAllDonations = async () => {
  return await Donation.find()
    .populate('userId', 'name')
    .populate('categoryId', 'name')
    .sort({ created_at: -1 });
};

// ------------------------------
// 4. Donation Category Operations
// ------------------------------

export const createDonationCategory = async (name: string, description: string) => {
  const category = new DonationCategory({ name, description });
  await category.save();
};

export const getDonationCategories = async () => {
  return await DonationCategory.find().sort({ name: 1 });
};

// ------------------------------
// 5. Stats and Reports
// ------------------------------

export const getDonationStats = async () => {
  const stats = await Donation.aggregate([
    { $match: { status: 'success' } },
    {
      $group: {
        _id: null,
        totalDonations: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
      },
    },
  ]);
  return stats[0] || { totalDonations: 0, totalAmount: 0 };
};

export const getDonationsByCategory = async () => {
  const stats = await Donation.aggregate([
    { $match: { status: 'success' } },
    {
      $group: {
        _id: '$categoryId',
        count: { $sum: 1 },
        total: { $sum: '$amount' },
      },
    },
    {
      $lookup: {
        from: 'donationcategories',
        localField: '_id',
        foreignField: '_id',
        as: 'category',
      },
    },
    {
      $unwind: '$category',
    },
    {
      $project: {
        category: '$category.name',
        count: 1,
        total: 1,
      },
    },
  ]);
  return stats;
};

export const getMonthlyDonations = async () => {
  return await Donation.aggregate([
    { $match: { status: 'success' } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$created_at' } },
        count: { $sum: 1 },
        total: { $sum: '$amount' },
      },
    },
    { $sort: { _id: -1 } },
    { $limit: 6 },
  ]);
};
