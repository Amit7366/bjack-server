import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utilis/catchAsync';
import sendResponse from '../../utilis/sendResponse';
import { TransactionService } from '../services/transaction.service';
import { TxProviderSyncService } from '../services/txProviderSync.service';
import { getGgrBalance } from '../services/ggrBalance.service';

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

  getGgrBalance = catchAsync(async (_req: Request, res: Response) => {
    const data = await getGgrBalance();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'GGR balance',
      data,
    });
  });

  /** Legacy blocking sync — admin/debug fallback. */
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

  /** Fast preview — compute balance delta without Mongo ingest. */
  previewSyncUser = catchAsync(async (req: Request, res: Response) => {
    const sbmId = String(req.user?.id ?? '').trim();
    if (!sbmId) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: 'Member id missing from session',
      });
    }

    const result = await this.syncSvc.previewForUser(sbmId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Game balance preview ready',
      data: result,
    });
  });

  /** Fire-and-forget silent persist to MongoDB. */
  persistSyncUser = catchAsync(async (req: Request, res: Response) => {
    const sbmId = String(req.user?.id ?? '').trim();
    if (!sbmId) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: 'Member id missing from session',
      });
    }

    const syncToken = typeof req.body?.syncToken === 'string' ? req.body.syncToken : undefined;
    const queued = this.syncSvc.enqueuePersist(sbmId, syncToken);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.ACCEPTED,
      message: 'Game transaction persist queued',
      data: queued,
    });
  });

  /** Optional drift check after silent persist. */
  persistSyncStatus = catchAsync(async (req: Request, res: Response) => {
    const syncToken = String(req.query.syncToken ?? '').trim();
    if (!syncToken) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: 'syncToken query param required',
      });
    }

    const job = this.syncSvc.getPersistStatus(syncToken);
    if (!job) {
      return res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: 'Persist job not found',
      });
    }

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Persist job status',
      data: job,
    });
  });
}
