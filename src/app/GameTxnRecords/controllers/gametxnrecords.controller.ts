import { Request, Response } from 'express';
import { USER_ROLE } from '../../User/user.constant';
import { GameTxnRecordsService } from '../services/gametxnrecords.service';

export class GameTxnRecordsController {
  private service = new GameTxnRecordsService();

  /** GET /gameRecords-txns/gametxnrecords/user-bets — uses JWT sbmId for members */
  getUserBets = async (req: Request, res: Response): Promise<void> => {
    try {
      const sbmIdQuery = req.query.sbmId?.toString();
      const requester = req.user;

      if (!requester?.id && !sbmIdQuery) {
        res.status(400).json({ success: false, message: 'sbmId is required' });
        return;
      }

      let sbmId = sbmIdQuery || requester!.id;

      if (
        requester?.role === USER_ROLE.user &&
        sbmIdQuery &&
        sbmIdQuery !== requester.id
      ) {
        res.status(403).json({ success: false, message: 'Forbidden' });
        return;
      }

      if (requester?.role === USER_ROLE.user) {
        sbmId = requester.id;
      }

      const tab = req.query.tab?.toString();
      if (tab === 'unsettled') {
        res.status(200).json({
          success: true,
          statusCode: 200,
          data: {
            sbmId,
            total: 0,
            totalBets: 0,
            totalWins: 0,
            page: 1,
            limit: Math.min(Number(req.query.limit) || 20, 100),
            totalPages: 0,
            history: [],
          },
        });
        return;
      }

      const from = req.query.from?.toString();
      const to = req.query.to?.toString();
      const page = Number(req.query.page) || 1;
      const limit = Math.min(Number(req.query.limit) || 20, 100);

      const data = await this.service.getUserBets({
        sbmId: sbmId.trim().toLowerCase(),
        userId: requester?.objectId,
        from,
        to,
        page,
        limit,
      });

      res.status(200).json({
        success: true,
        statusCode: 200,
        data,
      });
    } catch (err) {
      console.error('Error in getUserBets controller:', err);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };
}
