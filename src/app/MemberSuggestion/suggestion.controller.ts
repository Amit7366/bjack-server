import httpStatus from 'http-status';
import { Request, Response } from 'express';
import AppError from '../errors/AppError';
import catchAsync from '../utilis/catchAsync';
import sendResponse from '../utilis/sendResponse';
import { TSuggestionCategory, TSuggestionStatus } from './suggestion.constant';
import { SuggestionServices } from './suggestion.service';

const getCaptcha = catchAsync(async (_req: Request, res: Response) => {
  const result = SuggestionServices.getSuggestionCaptcha();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Captcha generated successfully',
    data: result,
  });
});

const submitSuggestion = catchAsync(async (req: Request, res: Response) => {
  const userId = String(req.user?.objectId ?? '').trim();
  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Login required');
  }

  const imageFile = (req.file as Express.Multer.File | undefined) ?? undefined;

  const result = await SuggestionServices.submitMemberSuggestion(
    userId,
    {
      category: req.body.category,
      message: req.body.message,
      captchaId: req.body.captchaId,
      captchaCode: req.body.captchaCode,
    },
    imageFile,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Suggestion submitted successfully',
    data: result,
  });
});

const listSuggestions = catchAsync(async (req: Request, res: Response) => {
  const result = await SuggestionServices.listSuggestionsForAdmin({
    status: req.query.status as TSuggestionStatus | undefined,
    category: req.query.category as TSuggestionCategory | undefined,
    page: req.query.page ? Number(req.query.page) : undefined,
    limit: req.query.limit ? Number(req.query.limit) : undefined,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Suggestions fetched successfully',
    meta: result.meta,
    data: result.result,
  });
});

const getSuggestion = catchAsync(async (req: Request, res: Response) => {
  const { suggestionId } = req.params;
  const result = await SuggestionServices.getSuggestionForAdmin(suggestionId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Suggestion fetched successfully',
    data: result,
  });
});

const updateSuggestionStatus = catchAsync(async (req: Request, res: Response) => {
  const adminUserId = String(req.user?.objectId ?? '').trim();
  const { suggestionId } = req.params;

  const result = await SuggestionServices.markSuggestionReviewed(
    suggestionId,
    adminUserId,
    req.body.adminNote,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Suggestion marked as reviewed',
    data: result,
  });
});

export const SuggestionControllers = {
  getCaptcha,
  submitSuggestion,
  listSuggestions,
  getSuggestion,
  updateSuggestionStatus,
};
