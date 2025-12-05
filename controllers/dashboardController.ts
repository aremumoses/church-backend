import { Request, Response } from 'express';
import {
  getUserStats,
  getPostStats,
  getMediaCount,
  getEventStats,
} from '../models/dashboardModel';
import { getDonationStats } from '../models/donationModel';

export const getDashboardOverview = async (req: Request, res: Response) => {
  try {
    console.log('📊 Fetching dashboard overview...');
    
    const [userStats, postStats, donationStats, mediaCount, eventStats] = await Promise.all([
      getUserStats(),
      getPostStats(),
      getDonationStats(),
      getMediaCount(),
      getEventStats(),
    ]);

    const dashboardData = {
      userStats,
      postStats,
      donationStats: {
        totalDonations: donationStats.successfulCount || 0,
        totalAmount: donationStats.totalAmount || 0,
        thisMonthAmount: 0, // Add logic if needed
      },
      mediaCount,
      eventStats,
    };

    console.log('✅ Dashboard data prepared:', JSON.stringify(dashboardData, null, 2));

    res.json(dashboardData);
  } catch (error) {
    console.error('❌ Dashboard Error:', error);
    res.status(500).json({ message: 'Error fetching dashboard metrics' });
  }
};
