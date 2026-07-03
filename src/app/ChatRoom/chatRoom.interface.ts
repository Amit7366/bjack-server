import { Document, Types } from 'mongoose';

export interface IChatRoom extends Document {
  roomId: string;
  members: Types.ObjectId[];
  memberObjectId?: Types.ObjectId;
  assignedOfficerId?: string | null;
  unreadForMember?: number;
  unreadForOfficer?: number;
  lastMessage: string;
  lastMessageAt: Date;
}

export type SupportRoomSummary = {
  roomId: string;
  memberObjectId: string;
  assignedOfficerId: string | null;
  officerAssigned: boolean;
  unreadForMember: number;
  unreadForOfficer: number;
  lastMessage: string;
  lastMessageAt: Date;
  member?: {
    objectId: string;
    userName: string;
    memberId: string;
    contactNo: string;
  };
};
