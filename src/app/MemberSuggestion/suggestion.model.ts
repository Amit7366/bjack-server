import { Schema, model } from 'mongoose';
import { SUGGESTION_CATEGORIES, SUGGESTION_STATUSES } from './suggestion.constant';
import { IMemberSuggestion } from './suggestion.interface';

const memberSuggestionSchema = new Schema<IMemberSuggestion>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    memberId: { type: String, trim: true },
    userName: { type: String, trim: true },
    contactNo: { type: String, trim: true },
    category: { type: String, enum: SUGGESTION_CATEGORIES, required: true, index: true },
    message: { type: String, required: true, trim: true, maxlength: 500 },
    imageUrl: { type: String, trim: true },
    status: { type: String, enum: SUGGESTION_STATUSES, default: 'pending', index: true },
    reviewedAt: { type: Date, default: null },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    adminNote: { type: String, trim: true, maxlength: 500 },
  },
  { timestamps: true },
);

memberSuggestionSchema.index({ createdAt: -1 });

export const MemberSuggestion = model<IMemberSuggestion>(
  'MemberSuggestion',
  memberSuggestionSchema,
);
