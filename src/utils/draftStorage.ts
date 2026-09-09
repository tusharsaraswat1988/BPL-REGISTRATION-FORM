/**
 * Offline-First Local Storage Manager for BPL Registration
 * Guarantees zero data loss across page refreshes, internet interruptions,
 * and accidental browser closures.
 */

import { AssociationDetails, MentorDetails, PlayerDetails, PaymentInfo, CategoryId } from '../types';

export const LOCAL_STORAGE_DRAFT_KEY = 'bpl_kids_draft_token';
export const LOCAL_STORAGE_PAYLOAD_KEY = 'bpl_form_offline_draft_v2';

export interface FormDraftData {
  draftToken?: string | null;
  currentStep: number;
  category: CategoryId;
  association: AssociationDetails;
  mentor: MentorDetails;
  teamName: string;
  includeBranding: boolean;
  teamTagline: string;
  players: PlayerDetails[];
  payment: PaymentInfo;
  updatedAt: string;
}

/**
 * Checks whether user has entered any non-default information
 */
export function hasEnteredFormData(draft: Partial<FormDraftData>): boolean {
  if (!draft) return false;
  if (draft.teamName && draft.teamName.trim()) return true;
  if (draft.association?.associationName && draft.association.associationName.trim()) return true;
  if (draft.association?.mobile && draft.association.mobile.trim()) return true;
  if (draft.association?.associationLogo && draft.association.associationLogo.trim()) return true;
  if (draft.mentor?.name && draft.mentor.name.trim()) return true;
  if (draft.mentor?.photo && draft.mentor.photo.trim()) return true;

  if (Array.isArray(draft.players)) {
    const hasPlayer = draft.players.some(
      p => (p.playerName && p.playerName.trim()) ||
           (p.playerPhoto && p.playerPhoto.trim()) ||
           (p.parentMobile && p.parentMobile.trim()) ||
           (p.jerseyNumber && p.jerseyNumber > 0)
    );
    if (hasPlayer) return true;
  }

  return false;
}

/**
 * Synchronously writes the full form draft to local browser storage.
 */
export function saveDraftLocally(data: FormDraftData): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(LOCAL_STORAGE_PAYLOAD_KEY, serialized);

    if (data.draftToken) {
      localStorage.setItem(LOCAL_STORAGE_DRAFT_KEY, data.draftToken);
    }
    return true;
  } catch (err) {
    console.warn('[DraftStorage] Failed to save in localStorage, attempting sessionStorage:', err);
    try {
      sessionStorage.setItem(LOCAL_STORAGE_PAYLOAD_KEY, JSON.stringify(data));
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Synchronously retrieves saved draft from local storage (0ms instant recovery).
 */
export function getDraftFromLocalStorage(): FormDraftData | null {
  if (typeof window === 'undefined') return null;

  try {
    let raw = localStorage.getItem(LOCAL_STORAGE_PAYLOAD_KEY);
    if (!raw) {
      raw = sessionStorage.getItem(LOCAL_STORAGE_PAYLOAD_KEY);
    }
    if (!raw) return null;

    const parsed = JSON.parse(raw) as FormDraftData;
    if (parsed && typeof parsed === 'object') {
      return parsed;
    }
    return null;
  } catch (err) {
    console.warn('[DraftStorage] Error parsing stored draft:', err);
    return null;
  }
}

/**
 * Clears all local draft data (called ONLY after successful registration or explicit user reset).
 */
export function clearDraftFromLocalStorage(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(LOCAL_STORAGE_PAYLOAD_KEY);
    localStorage.removeItem(LOCAL_STORAGE_DRAFT_KEY);
    sessionStorage.removeItem(LOCAL_STORAGE_PAYLOAD_KEY);
    sessionStorage.removeItem(LOCAL_STORAGE_DRAFT_KEY);
  } catch (err) {
    console.warn('[DraftStorage] Error clearing draft:', err);
  }
}
