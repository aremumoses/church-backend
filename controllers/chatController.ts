import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { 
  sendMessage, 
  getConversationWithUser, 
  getConversationList,
  
  editMessage,
  deleteMessage,
  searchMessages,
  getUnreadMessageCount,
  blockUser,
  unblockUser,
  getBlockedUsers,
  reportMessage,
  pinMessage,
  unpinMessage,
  getPinnedMessages,
  markMessagesAsRead
} from '../models/chatModel';

// ✅ Your existing controllers
export const sendChatMessage = async (req: AuthRequest, res: Response) => {
  const { receiverId, message } = req.body;
  const senderId = req.user!.id;

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
  const senderId = req.user!.id;
  const receiverId = req.params.userId;

  try {
    const messages = await getConversationWithUser(senderId, receiverId);
    // Return empty array if no messages yet - this allows users to start new conversations
    res.json(messages || []);
  } catch (err) {
    console.error('Fetch chat error:', err);
    res.status(500).json({ message: 'Failed to fetch conversation' });
  }
};

export const fetchConversationsList = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;

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
    const messages = await getConversationWithUser(user1 as string, user2 as string);
    res.json(messages);
  } catch (error) {
    console.error('Chat history error:', error);
    res.status(500).json({ message: 'Server error fetching chat history' });
  }
};

// 📝 New controller functions

export const editChatMessage = async (req: AuthRequest, res: Response) => {
  const { messageId } = req.params;
  const { message: newMessage } = req.body;
  const userId = req.user!.id;

  if (!newMessage) {
    return res.status(400).json({ message: 'New message content is required' });
  }

  try {
    const updatedMessage = await editMessage(messageId, newMessage, userId);
    if (!updatedMessage) {
      return res.status(404).json({ message: 'Message not found or unauthorized' });
    }
    res.json({ message: 'Message updated successfully', data: updatedMessage });
  } catch (error) {
    console.error('Edit message error:', error);
    res.status(500).json({ message: 'Failed to edit message' });
  }
};

export const deleteChatMessage = async (req: AuthRequest, res: Response) => {
  const { messageId } = req.params;
  const userId = req.user!.id;

  try {
    const deletedMessage = await deleteMessage(messageId, userId);
    if (!deletedMessage) {
      return res.status(404).json({ message: 'Message not found or unauthorized' });
    }
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ message: 'Failed to delete message' });
  }
};

export const markMessageAsRead = async (req: AuthRequest, res: Response) => {
  const { userId } = req.body;
  const currentUserId = req.user!.id;

  try {
    // Mark all messages from userId to currentUserId as read
    await markMessagesAsRead(userId, currentUserId);
    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: 'Failed to mark messages as read' });
  }
};

export const searchChatMessages = async (req: AuthRequest, res: Response) => {
  const { userId } = req.params;
  const { q: searchTerm, limit } = req.query;
  const currentUserId = req.user!.id;

  if (!searchTerm) {
    return res.status(400).json({ message: 'Search term is required' });
  }

  try {
    const messages = await searchMessages(
      currentUserId,
      userId,
      searchTerm as string,
      limit ? parseInt(limit as string) : 50
    );
    res.json(messages);
  } catch (error) {
    console.error('Search messages error:', error);
    res.status(500).json({ message: 'Failed to search messages' });
  }
};

export const getUnreadCount = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;

  try {
    const count = await getUnreadMessageCount(userId);
    res.json({ unreadCount: count });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ message: 'Failed to get unread count' });
  }
};

export const blockChatUser = async (req: AuthRequest, res: Response) => {
  const { userId: blockedUserId } = req.params;
  const { reason } = req.body;
  const userId = req.user!.id;

  try {
    await blockUser(userId, blockedUserId, reason);
    res.json({ message: 'User blocked successfully' });
  } catch (error) {
    console.error('Block user error:', error);
    res.status(500).json({ message: 'Failed to block user' });
  }
};

export const unblockChatUser = async (req: AuthRequest, res: Response) => {
  const { userId: blockedUserId } = req.params;
  const userId = req.user!.id;

  try {
    await unblockUser(userId, blockedUserId);
    res.json({ message: 'User unblocked successfully' });
  } catch (error) {
    console.error('Unblock user error:', error);
    res.status(500).json({ message: 'Failed to unblock user' });
  }
};

export const fetchBlockedUsers = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;

  try {
    const blockedUsers = await getBlockedUsers(userId);
    res.json(blockedUsers);
  } catch (error) {
    console.error('Get blocked users error:', error);
    res.status(500).json({ message: 'Failed to get blocked users' });
  }
};

export const reportChatMessage = async (req: AuthRequest, res: Response) => {
  const { messageId } = req.params;
  const { reason, description } = req.body;
  const reporterId = req.user!.id;

  if (!reason) {
    return res.status(400).json({ message: 'Reason is required' });
  }

  try {
    await reportMessage(messageId, reporterId, reason, description);
    res.json({ message: 'Message reported successfully' });
  } catch (error) {
    console.error('Report message error:', error);
    res.status(500).json({ message: 'Failed to report message' });
  }
};

export const pinChatMessage = async (req: AuthRequest, res: Response) => {
  const { messageId } = req.params;
  const userId = req.user!.id;

  try {
    const pinnedMessage = await pinMessage(messageId, userId);
    if (!pinnedMessage) {
      return res.status(404).json({ message: 'Message not found or unauthorized' });
    }
    res.json({ message: 'Message pinned successfully', data: pinnedMessage });
  } catch (error) {
    console.error('Pin message error:', error);
    res.status(500).json({ message: 'Failed to pin message' });
  }
};

export const unpinChatMessage = async (req: AuthRequest, res: Response) => {
  const { messageId } = req.params;
  const userId = req.user!.id;

  try {
    const unpinnedMessage = await unpinMessage(messageId, userId);
    if (!unpinnedMessage) {
      return res.status(404).json({ message: 'Message not found or unauthorized' });
    }
    res.json({ message: 'Message unpinned successfully', data: unpinnedMessage });
  } catch (error) {
    console.error('Unpin message error:', error);
    res.status(500).json({ message: 'Failed to unpin message' });
  }
};

export const fetchPinnedMessages = async (req: AuthRequest, res: Response) => {
  const { userId: otherUserId } = req.params;
  const userId = req.user!.id;

  try {
    const pinnedMessages = await getPinnedMessages(userId, otherUserId);
    res.json(pinnedMessages);
  } catch (error) {
    console.error('Get pinned messages error:', error);
    res.status(500).json({ message: 'Failed to get pinned messages' });
  }
};

// Get or create conversation - useful for starting new chats
export const getOrCreateConversation = async (req: AuthRequest, res: Response) => {
  const senderId = req.user!.id;
  const { userId: receiverId } = req.params;

  try {
    const messages = await getConversationWithUser(senderId, receiverId);
    
    // Return conversation info
    res.json({
      conversationId: `${senderId}_${receiverId}`,
      messages: messages || [],
      participantIds: [senderId, receiverId],
      messageCount: messages?.length || 0,
      hasMessages: messages && messages.length > 0
    });
  } catch (error) {
    console.error('Get or create conversation error:', error);
    res.status(500).json({ message: 'Failed to get conversation' });
  }
};