import { FC } from 'react';
import dayjs from 'dayjs';
import { FootballGame } from '@/types/football';
import { useGameClock } from '@/hooks/useGameClock';
import { getPeriodLabel } from '@/util/periodLabel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export const GameInfo: FC<{ game: FootballGame }> = ({ game }) => {
  const { clockString, showClock } = useGameClock(
    dayjs(game.currentPeriodStarted),
    game.currentPeriod
  );
  return (
    <Card className={cn('col-span-3')}>
      <CardHeader>
        <CardTitle>Game info</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={cn('flex', 'flex-col', 'gap-6')}>
          <div className={cn('flex flex-row', 'justify-between')}>
            <div
              className={cn(
                'relative',
                'text-2xl',
                'font-bold',
                'border',
                'rounded-md',
                'p-2',
                showClock ? 'border-red-500' : 'border-neutral-500'
              )}
            >
              {showClock && (
                <>
                  <div
                    className={cn(
                      '-top-1',
                      '-left-1',
                      'absolute',
                      'bg-red-500',
                      'animate-ping',
                      'w-3',
                      'h-3',
                      'rounded-full'
                    )}
                  />
                  <div
                    className={cn(
                      '-top-1',
                      '-left-1',
                      'absolute',
                      'bg-red-500',
                      'w-3',
                      'h-3',
                      'rounded-full'
                    )}
                  />
                </>
              )}
              {!!game.currentPeriod && getPeriodLabel[game.currentPeriod]}
            </div>
            {showClock && <p className={cn('text-xl')}>{clockString}</p>}
          </div>
          <table className={cn('w-full')}>
            <tbody>
              <tr>
                <td>{game.expand.homeTeam.shortName}</td>
                <td
                  className={cn('w-10', 'text-4xl', 'font-medium')}
                  align="center"
                >
                  {game.homeScore}
                </td>
                <td
                  className={cn('w-4', 'text-4xl', 'font-thin')}
                  align="center"
                >
                  -
                </td>
                <td
                  className={cn('w-10', 'text-4xl', 'font-medium')}
                  align="center"
                >
                  {game.visitorScore}
                </td>
                <td align="right">{game.expand.visitorTeam.shortName}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
