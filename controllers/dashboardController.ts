import { Request, Response } from 'express';
import {
  getUserStats,
  getPostStats,
  getMediaCount,
} from '../models/dashboardModel';
import { getDonationStats } from '../models/donationModel';

export const getDashboardOverview = async (req: Request, res: Response) => {
  try {
    const [userStats, postStats, donationStats, mediaCount] = await Promise.all([
      getUserStats(),
      getPostStats(),
      getDonationStats(),
      getMediaCount(),
    ]);

    res.json({
      userStats,
      postStats,
      donationStats,
      mediaCount,
      // onlineUsers: onlineUserList, // Uncomment when needed
    });
  } catch (error) {
    console.error('❌ Dashboard Error:', error);
    res.status(500).json({ message: 'Error fetching dashboard metrics' });
  }
};
