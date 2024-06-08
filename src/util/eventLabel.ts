import { FootballEventType } from '@/types/football';

export const eventLabel: Record<FootballEventType, string> = {
  GOAL: 'Goal',
  YELLOW_CARD: 'Yellow card',
  RED_CARD: 'Red card',
  INJURY: 'Injury',
  PENALTY_MISS: 'Penalty missed',
  PENALTY_SCORED: 'Penalty scored',
  SUBSTITUTION: 'Sub',
  OWN_GOAL: 'Own goal',
};
