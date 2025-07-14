import User from './userModel';
 
import MediaFile from './mediaFileModel';
import { Donation } from './donationModel';
import Post from './postModel';

// 📊 Get user stats
export const getUserStats = async () => {
  const total = await User.countDocuments();
  const active = await User.countDocuments({ status: 'active' });
  const inactive = await User.countDocuments({ status: 'inactive' });

  return {
    total,
    active,
    inactive,
  };
};

// 📊 Get post stats
export const getPostStats = async () => {
  const total = await Post.countDocuments();
  const pending = await Post.countDocuments({ status: 'pending' });
  const approved = await Post.countDocuments({ status: 'active' });

  return {
    total,
    pending,
    approved,
  };
};

// 📊 Get donation stats
export const getDonationStats = async () => {
  const donations = await Donation.aggregate([
    { $match: { status: 'success' } },
    {
      $group: {
        _id: null,
        successfulCount: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
      },
    },
  ]);

  return donations[0] || { successfulCount: 0, totalAmount: 0 };
};

// 📊 Get media count
export const getMediaCount = async () => {
  return await MediaFile.countDocuments();
};
