// src/types/socketTypes.ts
export interface SocketUser {
  id: number;
  name: string;
  role: string;
}

export interface MessageData {
  senderId: number;
  receiverId: number;
  message: string;
}

export interface TypingData {
  senderId: number;
  receiverId: number;
}

export interface ReadStatusData {
  senderId: number;
  receiverId: number;
}

export interface SocketEvents {
  // Client to Server events
  send_message: MessageData;
  typing: TypingData;
  stop_typing: TypingData;
  mark_as_read: ReadStatusData;
  mark_notifications_as_read: void;
  disconnect: void;

  // Server to Client events
  receive_message: {
    senderId: number;
    message: string;
    createdAt: string;
  };
  user_typing: { senderId: number };
  user_stop_typing: { senderId: number };
  messages_read_by_receiver: { from: number };
  chat_notifications: any[];
  online_users_list: { users: SocketUser[] };
  message_sent_confirmation: {
    senderId: number;
    receiverId: number;
    message: string;
    timestamp: string;
  };
  message_error: { error: string };
}