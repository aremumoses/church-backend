import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { createFeedback,
  getAllFeedbackEntries,
  updateFeedbackStatusById } from '../models/feedbackModel';
 
export const submitFeedback = async (req: AuthRequest, res: Response) => {
  const { subject, message } = req.body;
  const userId =  (req.user?.id);

  if (!userId || !subject || !message) {
    return res.status(400).json({ message: 'Subject and message are required' });
  }

  try {
    await createFeedback(userId, subject, message);
    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('❌ Error submitting feedback:', error);
    res.status(500).json({ message: 'Failed to submit feedback' });
  }
};


export const getAllFeedback = async (_req: Request, res: Response) => {
  const feedback = await getAllFeedbackEntries();
  res.json(feedback);
};

export const updateFeedbackStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  await updateFeedbackStatusById(id, status);
  res.json({ message: 'Feedback status updated' });
};
