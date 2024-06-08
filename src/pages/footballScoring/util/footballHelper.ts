import { FootballGame, FootballPeriod } from '@/types/football';

export const getNextPeriod = (data: FootballGame): FootballPeriod | null => {
  switch (data.currentPeriod) {
    case 'PRE_GAME':
      return 'FIRST_HALF';
    case 'FIRST_HALF':
      return 'HALF_TIME';
    case 'HALF_TIME':
      return 'SECOND_HALF';
    case 'SECOND_HALF': {
      if (
        data.homeScore !== data.visitorScore ||
        (!data.hasExtraTime && !data.hasPenalties)
      ) {
        return 'GAME_OVER';
      }
      return 'FULL_TIME';
    }
    case 'FULL_TIME': {
      if (data.hasExtraTime) {
        return 'EXTRA_FIRST';
      }
      return 'PENALTIES';
    }
    case 'EXTRA_FIRST':
      return 'EXTRA_HALF_TIME';
    case 'EXTRA_HALF_TIME':
      return 'EXTRA_SECOND';
    case 'EXTRA_SECOND': {
      if (data.homeScore !== data.visitorScore) {
        return 'GAME_OVER';
      }
      return 'AFTER_EXTRA_TIME';
    }
    case 'AFTER_EXTRA_TIME':
      return 'PENALTIES';
    case 'PENALTIES':
      return 'GAME_OVER';
    default:
      return null;
  }
};

export const getPeriodChangedData = (data: FootballGame): FootballGame => {
  return {
    ...data,
    currentPeriod: data.currentPeriod ? getNextPeriod(data) : null,
    currentPeriodStarted: new Date().toUTCString(),
  };
};
