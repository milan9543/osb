import { FootballPeriod } from '@/types/football';

export const getPeriodLabel: Record<FootballPeriod, string> = {
  PRE_GAME: 'Pre-game',
  FIRST_HALF: 'First half',
  HALF_TIME: 'Halftime',
  SECOND_HALF: 'Second half',
  GAME_OVER: 'Game over',
  EXTRA_FIRST: 'Extra 1st',
  EXTRA_SECOND: 'Extra 2nd',
  PENALTIES: 'Penalties',
  FULL_TIME: 'Full time',
  EXTRA_HALF_TIME: 'Extra Halftime',
  AFTER_EXTRA_TIME: 'After extra time',
};
