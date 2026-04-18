// interfaces/IChat.ts

export interface IChat {
  id?: string;
  rideId?: string; // associado a uma corrida se for o caso
  participantIds: string[]; // ['driverId', 'userId']
  
  // Volatile data for cache/ux optimizations without additional DB queries
  passenger?: { id: string; name: string; avatar?: string };
  driver?: { id: string; name: string; avatar?: string };
  
  lastMessage?: string;
  lastMessageTimestamp?: Date;
  unreadCount?: Record<string, number>; // { 'userId': 2, 'driverId': 0 }
  created_at?: Date;
  updated_at?: Date;
}

export interface IMessage {
  id?: string;
  chatId: string;
  senderId: string;
  text: string;
  read: boolean;
  created_at?: Date;
}
