import { Request, Response } from 'express';
import { SpinService } from './spin.service';

export class SpinController {
  static async status(req: Request, res: Response) {
    const sbmId = String(req.params.id || '').trim();

    const result = await SpinService.getStatus(sbmId);
    return res.status(result.code).json({
      success: result.ok,
      message: result.ok ? 'OK' : result.message,
      ...(result.ok ? { data: result.data } : {}),
    });
  }

  static async meStatus(req: Request, res: Response) {
    const sbmId = String(req.user?.id || '').trim();
    const userObjectId = String(req.user?.objectId || '').trim();

    const result = await SpinService.getStatusForUser(userObjectId, sbmId);
    return res.status(result.code).json({
      success: result.ok,
      message: result.ok ? 'OK' : result.message,
      ...(result.ok ? { data: result.data } : {}),
    });
  }

  static async play(req: Request, res: Response) {
    const sbmId = String(req.user?.id || '').trim();
    const userObjectId = String(req.user?.objectId || '').trim();

    const result = await SpinService.playSpin({
      userObjectId,
      sbmId,
      ip: req.ip,
      ua: req.headers['user-agent'] as string | undefined,
    });

    return res.status(result.code).json({
      success: result.ok,
      message: result.message,
      ...('data' in result && result.data ? { data: result.data } : {}),
    });
  }

  static async claim(req: Request, res: Response) {
    const sbmId = String(req.body?.id || '').trim();
    const amount = Number(req.body?.spinWinAmount);

    const result = await SpinService.claimSpin({
      sbmId,
      amount,
      ip: req.ip,
      ua: req.headers['user-agent'] as string | undefined,
    });

    return res.status(result.code).json({
      success: result.ok,
      message: result.message,
      ...('data' in result && result.data ? { data: result.data } : {}),
    });
  }
}
