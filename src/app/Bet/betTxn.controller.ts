import { Request, Response } from 'express';
import { USER_ROLE } from '../User/user.constant';
import { adminGetAllBetHistoryService, getUserBetHistoryService } from './betTxn.service';


export const BetTxnController = {
  getUserBetHistory: async (req: Request, res: Response) => {
    try {
      const {
        userId: userIdQuery,
        page,
        limit,
        type,
        status,
        provider,
        game_type,
        from,
        to,
        search,
      } = req.query as Record<string, string | undefined>;

      const requesterId = req.user?.objectId;
      const userId = userIdQuery || requesterId;

      if (!requesterId || !userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      if (
        req.user?.role === USER_ROLE.user &&
        String(requesterId) !== String(userId)
      ) {
        return res.status(403).json({ message: 'Forbidden: cannot read other user history' });
      }

      const result = await getUserBetHistoryService({
        userId: String(userId),
        page: Number(page) || 1,
        limit: Number(limit) || 20,
        type: type as 'win' | 'lose' | 'refund' | undefined,
        status: status as 'pending' | 'completed' | 'failed' | undefined,
        provider,
        game_type,
        from,
        to,
        search,
      });

      res.status(200).json({ success: true, ...result });
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to fetch user bet history', error: error.message });
    }
  },

  adminGetAllBetHistory: async (req: Request, res: Response) => {
    try {
      const {
        page,
        limit,
        userId,
        type,
        provider,
        game_type,
        from,
        to,
        search,
      } = req.query as any;

      const result = await adminGetAllBetHistoryService({
        page: Number(page) || 1,
        limit: Number(limit) || 20,
        userId,
        type,
        provider,
        game_type,
        from,
        to,
        search,
      });

      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to fetch admin bet history', error: error.message });
    }
  },
};
