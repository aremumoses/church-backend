import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import {
  createDonation,
  updateDonationStatus,
  getUserDonations,
  getAllDonations,
  createDonationCategory,
  getDonationCategories,
  updateDonationStatusByReference
} from '../models/donationModel';
import { initializePayment, verifyPayment } from '../utils/paystack';
import crypto from 'crypto';
import {
  getDonationStats,
  getDonationsByCategory,
  getMonthlyDonations
} from '../models/donationModel';

export const getDonationAnalytics = async (req: Request, res: Response) => {
  try {
    const stats = await getDonationStats();
    const categoryBreakdown = await getDonationsByCategory();
    const monthlyDonations = await getMonthlyDonations();

    res.json({
      totalDonations: stats.totalDonations,
      totalAmount: stats.totalAmount,
      categoryBreakdown,
      monthlyDonations
    });
  } catch (err) {
    console.error('Analytics Error:', err);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
};



export const startDonation = async (req: AuthRequest, res: Response) => {
  if (!req.body) {
    console.error('❌ req.body is undefined!');
    return res.status(400).json({ message: 'Request body is missing.' });
  }

  const { amount, categoryId } = req.body;

  if (!amount || !categoryId) {
    return res.status(400).json({ message: 'Amount and categoryId are required.' });
  }

  const { email, id: userId } = req.user!;

  if (!email || !userId) {
    return res.status(400).json({ message: 'User email and ID are required to start a donation.' });
  }

  try {
    const init = await initializePayment(email, amount);
    const reference = init.data.reference;

    await createDonation((userId), categoryId, amount, reference);

    res.json({ authorization_url: init.data.authorization_url });
  } catch (err) {
    console.error('💥 Error initializing donation:', err);
    res.status(500).json({ message: 'Donation initialization failed.' });
  }
};

export const handlePaystackWebhook = async (req: Request, res: Response) => {
  const secret = process.env.PAYSTACK_SECRET_KEY!;
  const hash = crypto.createHmac('sha512', secret).update(req.body).digest('hex');

  const signature = req.headers['x-paystack-signature'] as string;
  if (hash !== signature) {
    return res.status(401).json({ message: 'Unauthorized webhook' });
  }

  const event = JSON.parse(req.body.toString());

  if (event.event === 'charge.success') {
    const { reference, status } = event.data;

    try {
      if (status === 'success') {
        await updateDonationStatusByReference(reference, 'success');
        console.log(`✅ Donation ${reference} verified`);
      }
    } catch (err) {
      console.error('Webhook error:', err);
    }
  }

  res.sendStatus(200); // Acknowledge receipt
};


export const confirmDonation = async (req: Request, res: Response) => {
  const { reference } = req.query;

  const result = await verifyPayment(reference as string);
  if (result.data.status === 'success') {
    await updateDonationStatus(reference as string, 'success');
    res.json({ message: 'Donation successful' });
  } else {
    await updateDonationStatus(reference as string, 'failed');
    res.status(400).json({ message: 'Donation failed or pending' });
  }
};

export const userDonationHistory = async (req: AuthRequest, res: Response) => {
  const donations = await getUserDonations((req.user!.id));
  res.json(donations);
};

export const allDonations = async (_req: Request, res: Response) => {
  const donations = await getAllDonations();
  res.json(donations);
};

export const addCategory = async (req: AuthRequest, res: Response) => {
  const { name, description } = req.body;
  await createDonationCategory(name, description);
  res.json({ message: 'Category added successfully' });
};

export const getCategories = async (_req: Request, res: Response) => {
  const categories = await getDonationCategories();
  res.json(categories);
};
