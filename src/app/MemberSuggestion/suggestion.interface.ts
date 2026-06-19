import { Types } from 'mongoose';
import { TSuggestionCategory, TSuggestionStatus } from './suggestion.constant';

export interface IMemberSuggestion {
  userId: Types.ObjectId;
  memberId?: string | null;
  userName?: string | null;
  contactNo?: string | null;
  category: TSuggestionCategory;
  message: string;
  imageUrl?: string | null;
  status: TSuggestionStatus;
  reviewedAt?: Date | null;
  reviewedBy?: Types.ObjectId | null;
  adminNote?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
