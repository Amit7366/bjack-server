import { Types } from 'mongoose';
import { TemuTicketRecord } from './temuTicket.model';

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

export type TemuTicketHistoryItem = {
  id: string;
  date: string;
  ticketName: string;
  condition: string;
  addedAmount: number;
};

export type TemuTicketHistory = {
  totalClaimed: number;
  items: TemuTicketHistoryItem[];
};

function formatHistoryDate(value: Date): string {
  const y = value.getFullYear();
  const m = String(value.getMonth() + 1).padStart(2, '0');
  const d = String(value.getDate()).padStart(2, '0');
  const hh = String(value.getHours()).padStart(2, '0');
  const mm = String(value.getMinutes()).padStart(2, '0');
  const ss = String(value.getSeconds()).padStart(2, '0');
  return `${y}/${m}/${d} ${hh}:${mm}:${ss}`;
}

export async function getTemuTicketHistory(userId: string): Promise<TemuTicketHistory> {
  const userObjectId = new Types.ObjectId(userId);

  const [totalRow, records] = await Promise.all([
    TemuTicketRecord.aggregate<{ total: number }>([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, total: { $sum: '$addedAmount' } } },
    ]),
    TemuTicketRecord.find({ userId: userObjectId })
      .sort({ claimedAt: -1, createdAt: -1 })
      .limit(50)
      .lean(),
  ]);

  return {
    totalClaimed: roundMoney(Number(totalRow[0]?.total ?? 0)),
    items: records.map((row) => ({
      id: String(row._id),
      date: formatHistoryDate(new Date(row.claimedAt)),
      ticketName: row.ticketName,
      condition: row.condition,
      addedAmount: roundMoney(Number(row.addedAmount ?? 0)),
    })),
  };
}
