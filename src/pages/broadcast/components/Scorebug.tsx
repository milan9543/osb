import { useGameClock } from '@/hooks/useGameClock';
import { cn } from '@/lib/utils';
import { FootballGame, FootballGameTeam } from '@/types/football';
import dayjs from 'dayjs';
import { FC } from 'react';

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
        <div
          className={cn(
            'bg-slate-900',
            'bg-opacity-75',
            'rounded-lg',
            'text-white',
            'border-2',
            'border-white',
            'backdrop-blur-xl',
            'p-[2px]',
            'z-20'
          )}
        >
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
            '-bottom-9',
            'left-1/2',
            '-translate-x-1/2',
            'h-9',
            'bg-slate-900',
            'bg-opacity-75',
            'py-1',
            'px-4',
            'flex',
            'justify-center',
            'border-2',
            'border-white',
            'border-t-0',
            'rounded-bl-md',
            'rounded-br-md',
            'text-white',
            'backdrop-blur-xl'
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
        </div>
      </div>
    </div>
  );
};
