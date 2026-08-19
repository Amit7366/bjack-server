import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import config from '../config';
import catchAsync from '../utilis/catchAsync';
import AppError from '../errors/AppError';
import { TUserRole } from '../User/user.interface';
import { USER_ROLE } from '../User/user.constant';
import mongoose from 'mongoose';
import { CustomJwtPayload } from '../Auth/CustomJwtPayload';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

/** Session-only mutations a viewer may still perform. */
const VIEWER_MUTATION_ALLOWLIST = [
  '/api/v1/auth/logout',
  '/api/v1/auth/refresh-token',
  '/api/v1/auth/change-password',
];

function requestPath(req: Request): string {
  return (req.originalUrl || req.url || '').split('?')[0];
}

function isViewerAllowlisted(req: Request): boolean {
  const path = requestPath(req);
  return VIEWER_MUTATION_ALLOWLIST.some(
    (allowed) => path === allowed || path.endsWith(allowed),
  );
}

function viewerMayAccessAdminRoute(req: Request): boolean {
  if (SAFE_METHODS.has(req.method.toUpperCase())) return true;
  if (config.admin_viewer_mutations_enabled) return true;
  return isViewerAllowlisted(req);
}

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;

    if (!header) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized Access');
    }

    const token = header.startsWith('Bearer ') ? header.slice(7) : header;

    const decoded = jwt.verify(token, config.jwt_access_secret as string) as CustomJwtPayload;

    if (!mongoose.Types.ObjectId.isValid(decoded.objectId)) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid objectId in token');
    }

    const role = decoded.role as TUserRole;
    const isViewer = role === USER_ROLE.viewer;
    const routeAllowsAdminPanel =
      requiredRoles.includes(USER_ROLE.admin) ||
      requiredRoles.includes(USER_ROLE.superAdmin);

    if (requiredRoles.length) {
      const directlyAllowed = requiredRoles.includes(role);
      const viewerInherits = isViewer && routeAllowsAdminPanel;

      if (!directlyAllowed && !viewerInherits) {
        throw new AppError(httpStatus.FORBIDDEN, 'Access Denied');
      }

      if (isViewer && viewerInherits && !viewerMayAccessAdminRoute(req)) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          'View-only account: this action is disabled',
        );
      }

      if (
        isViewer &&
        directlyAllowed &&
        !SAFE_METHODS.has(req.method.toUpperCase()) &&
        !config.admin_viewer_mutations_enabled &&
        !isViewerAllowlisted(req)
      ) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          'View-only account: this action is disabled',
        );
      }
    }

    req.user = decoded;
    console.log('Authenticated user:', req.user);

    next();
  });
};

export default auth;
