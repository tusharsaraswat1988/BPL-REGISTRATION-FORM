import { Router } from 'express';
import { saveDraft, getDraft, getLatestDraftByAuthUserId, deleteDraft } from '../db/drafts';
import { getRegistrationById } from '../db/registrations';
import { query } from '../db/index';
import { draftLimiter } from '../middleware/rateLimiter';
import { optionalAuth, AuthenticatedRequest } from '../middleware/auth';

export const draftRoutes = Router();

// Retrieve Latest Active Draft / Existing Registration for Authenticated User
draftRoutes.get('/drafts/active/latest', draftLimiter, optionalAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const authUserId = req.authIdentity?.userId;
    if (!authUserId) {
      res.json({ success: false, draft: null });
      return;
    }

    // 1. Check if user already owns an existing registration in PostgreSQL
    const regRes = await query(
      `SELECT id FROM registrations WHERE auth_user_id = $1 ORDER BY created_at DESC LIMIT 1`,
      [authUserId]
    );

    let existingReg: any = null;
    if (regRes.rows.length > 0) {
      existingReg = await getRegistrationById(regRes.rows[0].id);
    }

    // 2. Check for latest autosaved draft
    const draft = await getLatestDraftByAuthUserId(authUserId);

    if (existingReg) {
      const regPayload = {
        isExistingRegistration: true,
        registrationId: existingReg.id,
        teamCode: existingReg.teamCode,
        currentStep: draft?.currentStep ?? 0,
        category: existingReg.category,
        association: existingReg.association,
        mentor: existingReg.mentor,
        teamName: existingReg.teamName,
        includeBranding: existingReg.includeBranding,
        teamTagline: existingReg.branding?.teamTagline || '',
        players: existingReg.players,
        payment: {
          ...existingReg.payment,
          transactionReference: existingReg.payment.utrTransactionId,
          paymentProofUrl: existingReg.payment.paymentScreenshot,
          paymentStatus: existingReg.payment.paymentStatus,
          baseAmount: existingReg.payment.baseAmount,
          brandingAmount: existingReg.payment.brandingAmount,
          totalAmount: existingReg.payment.totalAmount,
        },
        updatedAt: existingReg.createdAt,
      };

      // If there is an unsaved newer draft, overlay draft edits onto existing registration
      if (draft && new Date(draft.updatedAt) > new Date(existingReg.createdAt)) {
        res.json({
          success: true,
          draft: {
            draftToken: draft.draftToken,
            ...regPayload,
            ...draft.data,
            isExistingRegistration: true,
            registrationId: existingReg.id,
            teamCode: existingReg.teamCode,
            payment: {
              ...regPayload.payment,
              ...(draft.data.payment || {}),
              paymentStatus: existingReg.payment.paymentStatus, // Authoritative status from DB
            },
            currentStep: draft.currentStep,
            updatedAt: draft.updatedAt,
          },
        });
        return;
      }

      res.json({
        success: true,
        draft: {
          draftToken: draft?.draftToken || `bpl_draft_${existingReg.id}`,
          ...regPayload,
        },
      });
      return;
    }

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
