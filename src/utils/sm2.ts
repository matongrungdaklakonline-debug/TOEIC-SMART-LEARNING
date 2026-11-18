import type { ReviewCardState, ReviewStatus } from '../types/toeic';

export type Sm2Rating = 'forgot' | 'hard' | 'good' | 'easy';

const RATING_Q: Record<Sm2Rating, number> = {
  forgot: 0,
  hard: 2,
  good: 4,
  easy: 5,
};

export function calculateSm2NextState(
  existing: ReviewCardState | undefined,
  targetId: string,
  targetType: 'vocab' | 'situation',
  rating: Sm2Rating,
  now: Date = new Date()
): ReviewCardState {
  const q = RATING_Q[rating];
  let repetitions = existing?.repetitions ?? 0;
  let intervalDays = existing?.intervalDays ?? 0;
  let ef = existing?.easinessFactor ?? 2.5;

  if (q < 3) {
    repetitions = 0;
    intervalDays = rating === 'forgot' ? 0 : 1;
  } else {
    if (repetitions === 0) {
      intervalDays = 1;
    } else if (repetitions === 1) {
      intervalDays = 6;
    } else {
      intervalDays = Math.round(intervalDays * ef);
    }
    if (rating === 'easy') {
      intervalDays = Math.max(4, Math.round(intervalDays * 1.3));
    }
    repetitions += 1;
  }

  ef = Math.max(1.3, Number((ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))).toFixed(2)));

  let status: ReviewStatus = 'learning';
  if (rating === 'forgot') {
    status = 'needs_review';
  } else if (rating === 'hard') {
    status = 'needs_review';
  } else if (repetitions >= 3 || (rating === 'easy' && repetitions >= 2)) {
    status = 'mastered';
  }

  const nextDate = new Date(now.getTime());
  nextDate.setDate(nextDate.getDate() + intervalDays);

  return {
    targetId,
    targetType,
    status,
    repetitions,
    intervalDays,
    easinessFactor: ef,
    lastReviewedAt: now.toISOString(),
    nextReviewAt: nextDate.toISOString(),
    isHard: existing?.isHard ?? (rating === 'forgot' || rating === 'hard'),
  };
}

export function isDueForReview(card: ReviewCardState | undefined, now: Date = new Date()): boolean {
  if (!card) return false;
  if (card.status === 'needs_review') return true;
  return new Date(card.nextReviewAt).getTime() <= now.getTime();
}
