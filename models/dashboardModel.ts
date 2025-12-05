import User from './userModel';
import MediaFile from './mediaFileModel';
import { Donation } from './donationModel';
import Post from './postModel';
import mongoose from 'mongoose';

// 📊 Get user stats
export const getUserStats = async () => {
  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ status: 'active' });
  const inactiveUsers = await User.countDocuments({ status: 'inactive' });
  
  // Get new users this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  
  const newUsersThisMonth = await User.countDocuments({
    created_at: { $gte: startOfMonth }
  });

  console.log('📊 User Stats:', { totalUsers, activeUsers, inactiveUsers, newUsersThisMonth });

  return {
    totalUsers,
    activeUsers,
    inactiveUsers,
    newUsersThisMonth,
  };
};

// 📊 Get post stats
export const getPostStats = async () => {
  const totalPosts = await Post.countDocuments();
  const pendingPosts = await Post.countDocuments({ status: 'pending' });
  const approvedPosts = await Post.countDocuments({ status: 'active' });
  const rejectedPosts = await Post.countDocuments({ status: 'deleted' });

  console.log('📊 Post Stats:', { totalPosts, pendingPosts, approvedPosts, rejectedPosts });

  return {
    totalPosts,
    pendingPosts,
    approvedPosts,
    rejectedPosts,
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
  // Try both Media and MediaFile collections
  const Media = mongoose.model('Media');
  
  let totalMedia = 0;
  let videos = 0;
  let audios = 0;
  let images = 0;
  let pdfs = 0;

  try {
    // Check Media collection first (main media library)
    totalMedia = await Media.countDocuments();
    videos = await Media.countDocuments({ type: 'video' });
    audios = await Media.countDocuments({ type: 'audio' });
    images = await Media.countDocuments({ type: 'image' });
    pdfs = await Media.countDocuments({ type: 'pdf' });
    
    console.log('📊 Media collection stats:', { totalMedia, videos, audios, images, pdfs });
  } catch (error) {
    console.log('⚠️ Media collection not found, trying MediaFile...');
    
    // Fallback to MediaFile collection
    totalMedia = await MediaFile.countDocuments();
    videos = await MediaFile.countDocuments({ type: 'video' });
    audios = await MediaFile.countDocuments({ type: 'audio' });
    images = await MediaFile.countDocuments({ type: 'image' });
    pdfs = await MediaFile.countDocuments({ type: 'pdf' });
    
    console.log('📊 MediaFile collection stats:', { totalMedia, videos, audios, images, pdfs });
  }

  console.log('📊 Final Media Stats:', { totalMedia, videos, audios, images, pdfs });

  return {
    totalMedia,
    videos,
    audios,
    images,
    pdfs,
  };
};
