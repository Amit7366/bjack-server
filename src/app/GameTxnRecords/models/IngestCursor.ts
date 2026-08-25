import mongoose, { Schema, model, Model } from 'mongoose';

export const APIVEXO_INGEST_CURSOR_ID = 'apivexo';

export interface IIngestCursor {
  _id: string;
  lastTimestamp: string | null;
  lastSerial: string | null;
  leaseUntil: Date | null;
  leaseOwner: string | null;
  updatedAt?: Date;
}

const ingestCursorSchema = new Schema<IIngestCursor>(
  {
    _id: { type: String, required: true },
    lastTimestamp: { type: String, default: null },
    lastSerial: { type: String, default: null },
    leaseUntil: { type: Date, default: null },
    leaseOwner: { type: String, default: null },
  },
  { timestamps: true, versionKey: false },
);

const COLLECTION = 'ingest_cursors';

export const IngestCursor: Model<IIngestCursor> =
  (mongoose.models.IngestCursor as Model<IIngestCursor>) ||
  model<IIngestCursor>('IngestCursor', ingestCursorSchema, COLLECTION);
