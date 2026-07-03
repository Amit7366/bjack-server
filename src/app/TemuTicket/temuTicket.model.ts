import { Schema, model, Types } from 'mongoose';

export interface ITemuTicketRecord {
  userId: Types.ObjectId;
  ticketName: string;
  condition: string;
  addedAmount: number;
  claimedAt: Date;
}

const temuTicketRecordSchema = new Schema<ITemuTicketRecord>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    ticketName: { type: String, required: true },
    condition: { type: String, required: true },
    addedAmount: { type: Number, required: true },
    claimedAt: { type: Date, required: true, default: Date.now, index: true },
  },
  { timestamps: true }
);

temuTicketRecordSchema.index({ userId: 1, claimedAt: -1 });

export const TemuTicketRecord = model<ITemuTicketRecord>(
  'TemuTicketRecord',
  temuTicketRecordSchema
);
