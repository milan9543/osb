import { useGameClock } from '@/hooks/useGameClock';
import { cn } from '@/lib/utils';
import { FootballGame, FootballGameTeam } from '@/types/football';
import dayjs from 'dayjs';
import { FC } from 'react';
import { scoreboardCommonClass } from '../util/classes';

const teamName = cn(
  'font-thin',
  'text-2xl',
  'px-2',
  'align-center',
  'tracking-widest',
  'text-shadow',
  'shadow-black'
);
const score = cn(
  'font-medium',
  'text-4xl',
  'px-2',
  'align-bottom',
  'text-shadow',
  'shadow-black',
  'py-1'
);

const TeamColorIndicator: FC<{ team: FootballGameTeam }> = ({ team }) => {
  return (
    <td
      className={cn('min-w-3', 'h-10', 'p-0', 'rounded-sm', 'overflow-hidden')}
    >
      <div
        style={{ backgroundColor: team.primaryColor }}
        className={cn(team.secondaryColor ? 'h-1/2' : 'h-full')}
      ></div>
      {!!team.secondaryColor && (
        <div
          style={{ backgroundColor: team.secondaryColor }}
          className={cn('h-1/2')}
        ></div>
      )}
    </td>
  );
};

export const Scorebug: FC<{ game: FootballGame }> = ({ game }) => {
  const { clockString, isGameRunning } = useGameClock(
    dayjs(game.currentPeriodStarted),
    game.currentPeriod
  );

  return (
    <div
      className={cn(
        isGameRunning ? 'opacity-100' : 'opacity-0',
        'transition-all',
        'duration-1000',
        'absolute',
        'top-10',
        'left-10'
      )}
    >
      <div className={cn('relative')}>
        <div className={cn(scoreboardCommonClass, 'p-[2px]', 'z-20')}>
          <table>
            <tr>
              <TeamColorIndicator team={game.expand.homeTeam} />
              <td className={teamName}>
                {game.expand.homeTeam.expand.team.threeLetterName}
              </td>
              <td className={score}>{game.homeScore}</td>
              <td className={score}>-</td>
              <td className={score}>{game.visitorScore}</td>
              <td className={teamName}>
                {game.expand.visitorTeam.expand.team.threeLetterName}
              </td>
              <TeamColorIndicator team={game.expand.visitorTeam} />
            </tr>
          </table>
        </div>
        <div
          className={cn(
            'absolute',
            scoreboardCommonClass,
            '-bottom-12',
            'left-1/2',
            '-translate-x-1/2',
            'h-12',
            'py-1',
            'px-2',
            'flex',
            'justify-center',
            'items-center',
            'border-t-0',
            'rounded-tl-none',
            'rounded-tr-none'
          )}
        >
          <p
            className={cn(
              'text-2xl',
              'shadow-black',
              'font-thin',
              'text-shadow'
            )}
          >
            {clockString}
          </p>
          <div
            className={cn(
              'transition-all',
              game.currentPeriodAddedTime ? 'w-10' : 'w-0',
              'overflow-hidden',
              'bg-white',
              'text-slate-900',
              'font-medium',
              'text-xl',
              'text-center',
              'rounded-sm',
              game.currentPeriodAddedTime ? 'ml-4' : 'm-0'
            )}
          >
            +{game.currentPeriodAddedTime}
          </div>
        </div>
      </div>
    </div>
  );
};
