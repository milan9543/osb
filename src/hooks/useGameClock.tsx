import { shouldClockBeVisible } from '@/pages/footballScoring/util/footballHelper';
import { FootballPeriod } from '@/types/football';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';

const periodElapsedMinutes: Record<FootballPeriod, number> = {
  PRE_GAME: 0,
  FIRST_HALF: 0,
  HALF_TIME: 0,
  SECOND_HALF: 45,
  GAME_OVER: 45,
  FULL_TIME: 45,
  EXTRA_FIRST: 90,
  EXTRA_HALF_TIME: 90,
  EXTRA_SECOND: 105,
  AFTER_EXTRA_TIME: 105,
  PENALTIES: 120,
};

export const useGameClock = (
  referenceDate: Dayjs = dayjs(),
  period: FootballPeriod | null
) => {
  const [currentTime, setCurrentTime] = useState(dayjs());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const elapsedTime = dayjs.duration(currentTime.diff(referenceDate)).add({
    minutes: period ? periodElapsedMinutes[period] : 0,
  });

  return {
    duration: elapsedTime,
    isGameRunning: shouldClockBeVisible(period),
    clockString: `${(elapsedTime.hours() * 60 + elapsedTime.minutes()).toString().padStart(2, '0')}:${elapsedTime.seconds().toString().padStart(2, '0')}`,
  };
};
