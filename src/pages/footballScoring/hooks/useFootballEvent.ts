import { useGameClock } from '@/hooks/useGameClock';
import { FootballEventType, FootballGame } from '@/types/football';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';

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

  return {
    selectedEventType,
    setSelectedEventType,
    search,
    setSearch,
    currentMinute: duration.get('hour') * 60 + duration.get('minute') + 1,
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
