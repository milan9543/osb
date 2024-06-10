import { useGameClock } from '@/hooks/useGameClock';
import {
  FootballEventType,
  FootballGame,
  FootballPeriod,
} from '@/types/football';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';

const getPeriodMaxMinute = (period: FootballPeriod | null): number => {
  switch (period) {
    case 'FIRST_HALF':
      return 45;
    case 'SECOND_HALF':
      return 90;
    case 'EXTRA_FIRST':
      return 105;
    case 'EXTRA_SECOND':
      return 120;
    default:
      return 200;
  }
};

export const useFootballEvent = (game: FootballGame) => {
  const [selectedEventType, setSelectedEventType] =
    useState<FootballEventType | null>(null);
  const [search, setSearch] = useState('');
  const { duration } = useGameClock(
    dayjs(game.currentPeriodStarted),
    game.currentPeriod
  );

  useEffect(() => {
    if (!selectedEventType) {
      return;
    }
    focusSearchInput();
  }, [selectedEventType]);

  const focusSearchInput = () => {
    const inputEl = document.getElementById('player-selector-search');
    if (inputEl) {
      inputEl.focus();
    }
  };

  const currentMinuteExact =
    duration.get('hour') * 60 + duration.get('minute') + 1;
  const periodMaxMinute = getPeriodMaxMinute(game.currentPeriod);
  return {
    selectedEventType,
    setSelectedEventType,
    search,
    setSearch,
    currentMinute: Math.min(currentMinuteExact, periodMaxMinute),
    currentMinuteAddedTime:
      currentMinuteExact > periodMaxMinute
        ? currentMinuteExact - periodMaxMinute
        : undefined,
    isGameRunning:
      game.currentPeriod &&
      [
        'FIRST_HALF',
        'SECOND_HALF',
        'EXTRA_FIRST',
        'EXTRA_SECOND',
        'PENALTIES',
      ].includes(game.currentPeriod),
    focusSearchInput,
  };
};
