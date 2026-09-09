import { Router } from 'express';
import { saveDraft, getDraft, getLatestDraftByAuthUserId, deleteDraft } from '../db/drafts';
import { draftLimiter } from '../middleware/rateLimiter';
import { optionalAuth, AuthenticatedRequest } from '../middleware/auth';

export const draftRoutes = Router();

// Retrieve Latest Active Draft for Authenticated User
draftRoutes.get('/drafts/active/latest', draftLimiter, optionalAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const authUserId = req.authIdentity?.userId;
    if (!authUserId) {
      res.json({ success: false, draft: null });
      return;
    }

    const draft = await getLatestDraftByAuthUserId(authUserId);
    if (!draft) {
      res.json({ success: false, draft: null });
      return;
    }

    res.json({
      success: true,
      draft: {
        draftToken: draft.draftToken,
        currentStep: draft.currentStep,
        ...draft.data,
        updatedAt: draft.updatedAt,
      },
    });
  } catch (err: any) {
    next(err);
  }
});

// Save / Autosave Draft
draftRoutes.post('/drafts', draftLimiter, optionalAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const tokenHeader = req.headers['x-draft-token'] as string;
    const { draftToken, currentStep, ...data } = req.body;

    const tokenToUse = (draftToken || tokenHeader || '').trim() || undefined;
    const step = typeof currentStep === 'number' ? currentStep : 0;
    const authUserId = req.authIdentity?.userId;

    const result = await saveDraft(tokenToUse, step, data, authUserId);

    res.json({
      success: true,
      draftToken: result.draftToken,
      status: 'DRAFT',
      updatedAt: result.updatedAt,
    });
  } catch (err: any) {
    next(err);
  }
});

// Retrieve Draft by Token
draftRoutes.get('/drafts/:draftToken', draftLimiter, optionalAuth, async (req: AuthenticatedRequest, res, next) => {

  try {
    const draftToken = req.params.draftToken;
    const authUserId = req.authIdentity?.userId;

    const draft = await getDraft(draftToken, authUserId);
    if (!draft) {
      res.status(404).json({
        success: false,
        error: 'DraftNotFound',
        message: 'No active draft was found for this session.',
      });
      return;
    }

    res.json({
      success: true,
      draft: {
        draftToken: draft.draftToken,
        currentStep: draft.currentStep,
        ...draft.data,
        updatedAt: draft.updatedAt,
      },
    });
  } catch (err: any) {
    next(err);
  }
});

// Delete Draft
draftRoutes.delete('/drafts/:draftToken', draftLimiter, async (req, res, next) => {
  try {
    const draftToken = req.params.draftToken;
    await deleteDraft(draftToken);
    res.json({ success: true, message: 'Draft cleared.' });
  } catch (err: any) {
    next(err);
  }
});
