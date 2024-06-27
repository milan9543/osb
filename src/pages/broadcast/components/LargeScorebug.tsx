import { cn } from '@/lib/utils';
import { FootballGame, FootballGameEvent } from '@/types/football';
import { FC, useEffect } from 'react';
import { scoreboardCommonClass } from '../util/classes';
import { useScorers } from '../hooks/useScorers';
import { pb } from '@/api/pocketbase';
import { useQuery } from '@tanstack/react-query';

const score = cn('text-5xl');

export const LargeScoreBug: FC<{ game: FootballGame }> = ({ game }) => {
  const { data, refetch } = useQuery({
    queryKey: ['events', game.id],
    queryFn: () =>
      pb.collection('footballGameEvent').getFullList<FootballGameEvent>({
        filter: `game = "${game.id}"`,
        sort: '-minute,-created',
        expand: 'player,secondaryPlayer',
      }),
  });

  useEffect(() => {
    const unsubscribePromise = pb
      .collection('footballGameEvent')
      .subscribe('*', () => {
        refetch();
      });
    return () => {
      (async () => {
        (await unsubscribePromise)();
      })();
    };
  }, []);

  const { home, visitor } = useScorers(game, data);

  return (
    <div
      className={cn(
        'absolute',
        'left-1/2',
        'bottom-24',
        '-translate-x-1/2',
        'text-2xl',
        'z-20',
        'text-shadow',
        'shadow-black',
        'flex',
        'flex-col',
        'items-center'
      )}
    >
      {data && data.length > 0 && (
        <div
          className={cn(
            scoreboardCommonClass,
            'border-b-0',
            'rounded-bl-none',
            'rounded-br-none',
            'text-lg',
            'flex',
            'flex-row',
            'justify-between',
            'gap-4',
            'p-2',
            'w-4/5',
            'font-medium'
          )}
        >
          <div>
            {home &&
              Object.entries(home).map(([k, v]) => (
                <div key={k}>
                  {v.lastName}{' '}
                  <span className={cn('font-thin')}>
                    {v.goalMinutes.join(', ')}
                  </span>
                </div>
              ))}
          </div>

          <div className={cn('text-right')}>
            {visitor &&
              Object.entries(visitor).map(([k, v]) => (
                <div key={k}>
                  {v.lastName}{' '}
                  <span className={cn('font-thin')}>
                    {v.goalMinutes.join(', ')}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
      <div className={cn('px-4', 'py-2', 'border-2', scoreboardCommonClass)}>
        <div className={cn('flex', 'flex-row', 'gap-4', 'items-center')}>
          <p className={cn('text-left', 'w-48')}>
            {game.expand.homeTeam.expand.team.shortName}
          </p>
          <div className={cn('flex', 'flex-row', 'gap-2', score)}>
            <p>{game.homeScore}</p>
            <p>-</p>
            <p>{game.visitorScore}</p>
          </div>
          <p className={cn('text-right', 'w-48')}>
            {game.expand.visitorTeam.expand.team.shortName}
          </p>
        </div>
      </div>
    </div>
  );
};
