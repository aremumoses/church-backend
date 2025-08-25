import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { sendMessage, getConversationWithUser, getConversationList } from '../models/chatModel';
import { getChatHistory } from '../models/chatModel';

export const sendChatMessage = async (req: AuthRequest, res: Response) => {
  const { receiverId, message } = req.body;
  const senderId = (req.user!.id);

  if (!receiverId || !message) {
    return res.status(400).json({ message: 'receiverId and message are required' });
  }

  try {
    await sendMessage(senderId, receiverId, message);
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (err) {
    console.error('Send chat error:', err);
    res.status(500).json({ message: 'Failed to send message' });
  }
};

export const fetchConversation = async (req: AuthRequest, res: Response) => {
  const senderId = (req.user!.id);
  const receiverId = (req.params.userId);

  try {
    const messages = await getConversationWithUser(senderId, receiverId);
    res.json(messages);
  } catch (err) {
    console.error('Fetch chat error:', err);
    res.status(500).json({ message: 'Failed to fetch conversation' });
  }
};

export const fetchConversationsList = async (req: AuthRequest, res: Response) => {
  const userId = (req.user!.id);

  try {
    const list = await getConversationList(userId);
    res.json(list);
  } catch (err) {
    console.error('Conversation list error:', err);
    res.status(500).json({ message: 'Failed to fetch conversations' });
  }
};


export const fetchChatHistory = async (req: Request, res: Response) => {
  const { user1, user2 } = req.query;

  if (!user1 || !user2) {
    return res.status(400).json({ message: 'Both user1 and user2 are required' });
  }

  try {
    const messages = await getChatHistory(user1 as string, user2 as string);
    res.json(messages);
  } catch (error) {
    console.error('Chat history error:', error);
    res.status(500).json({ message: 'Server error fetching chat history' });
  }
};

