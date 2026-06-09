import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utilis/catchAsync';
import sendResponse from '../../utilis/sendResponse';
import { TransactionService } from '../services/transaction.service';
import { TxProviderSyncService } from '../services/txProviderSync.service';

export class TransactionsController {
  constructor(
    private svc = new TransactionService(),
    private syncSvc = new TxProviderSyncService()
  ) {}

  ingest = async (req: Request, res: Response) => {
    try {
      const stats = await this.svc.ingest(req.body);
      res.status(200).json({ status: true, message: 'Ingest complete', stats });
    } catch (e: any) {
      res.status(400).json({ status: false, message: e?.message ?? 'Bad request' });
    }
  };

  /** Authenticated user — fetch txserver pending rows + ingest + return wallet balance. */
  syncUser = catchAsync(async (req: Request, res: Response) => {
    const sbmId = String(req.user?.id ?? '').trim();
    if (!sbmId) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: 'Member id missing from session',
      });
    }

    const result = await this.syncSvc.syncForUser(sbmId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Game transactions synced',
      data: result,
    });
  });
}
