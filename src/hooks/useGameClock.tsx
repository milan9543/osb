import { FootballPeriod } from '@/types/football';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';

const periodElapsedMinutes: Record<FootballPeriod, number> = {
  PRE_GAME: 0,
  FIRST_HALF: 0,
  HALF_TIME: 45,
  SECOND_HALF: 45,
  GAME_OVER: 90,
  EXTRA_FIRST: 90,
  FULL_TIME: 90,
  EXTRA_SECOND: 105,
  EXTRA_HALF_TIME: 105,
  PENALTIES: 120,
  AFTER_EXTRA_TIME: 120,
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
    showClock:
      period &&
      ['FIRST_HALF', 'SECOND_HALF', 'EXTRA_FIRST', 'EXTRA_SECOND'].includes(
        period
      ),
    clockString: `${elapsedTime.hours() * 60 + elapsedTime.minutes()}:${elapsedTime.seconds().toString().padStart(2, '0')}`,
  };
};
