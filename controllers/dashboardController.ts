import { Request, Response } from 'express';
import { getMediaCount, getPostStats, getUserStats } from '../models/dashboardModel';
import { getDonationStats } from '../models/donationModel';
 

export const getDashboardOverview = async (req: Request, res: Response) => {
  try {
    const userStats = await getUserStats();
    const postStats = await getPostStats();
    const donationStats = await getDonationStats();
    const mediaCount = await getMediaCount();

    // const onlineUserList = Array.from(onlineUsers.entries()).map(([id, data]) => ({
    //   id,
    //   name: data.name,
    //   role: data.role,
    // }));

    res.json({
      userStats,
      postStats,
      donationStats,
      mediaCount,
    //   onlineUsers: onlineUserList,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching dashboard metrics' });
  }
};
