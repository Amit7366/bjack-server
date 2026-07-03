import { Schema, model } from 'mongoose';
import { IChatRoom } from './chatRoom.interface';

const chatRoomSchema = new Schema<IChatRoom>(
  {
    roomId: { type: String, required: true, unique: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    memberObjectId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    assignedOfficerId: { type: String, default: null, index: true },
    unreadForMember: { type: Number, default: 0 },
    unreadForOfficer: { type: Number, default: 0 },
    lastMessage: { type: String },
    lastMessageAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const ChatRoom = model<IChatRoom>('ChatRoom', chatRoomSchema);
