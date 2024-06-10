import { GoalIcon } from '@/assets/extraIcons/GoalIcon';
import { OwnGoalIcon } from '@/assets/extraIcons/OwnGoalIcon';
import { PenaltyIcon } from '@/assets/extraIcons/PenaltyIcon';
import { PenaltyMissedIcon } from '@/assets/extraIcons/PenaltyMissedIcon';
import { cn } from '@/lib/utils';
import { FootballEventType, FootballGameEvent } from '@/types/football';
import { eventLabel } from '@/util/eventLabel';
import { CornerDownRight, Cross, RectangleVertical } from 'lucide-react';
import { FC } from 'react';

const mainIcon: Record<FootballEventType, JSX.Element> = {
  GOAL: <GoalIcon size={32} className={cn('fill-green-600')} />,
  OWN_GOAL: <OwnGoalIcon size={32} className={cn('fill-red-600')} />,
  SUBSTITUTION: <CornerDownRight className={cn('text-red-600')} size={32} />,
  YELLOW_CARD: (
    <RectangleVertical
      className={cn('fill-yellow-500', 'text-yellow-500')}
      size={32}
    />
  ),
  RED_CARD: (
    <RectangleVertical
      className={cn('text-red-600', 'fill-red-600')}
      size={32}
    />
  ),
  INJURY: <Cross size={32} className={cn('text-red-400')} strokeWidth={1} />,
  PENALTY_MISS: <PenaltyMissedIcon size={32} className={cn('fill-red-600')} />,
  PENALTY_SCORED: <PenaltyIcon className={cn('fill-green-600')} size={32} />,
};

const getSecondaryText = (type: FootballEventType): string => {
  switch (type) {
    case 'SUBSTITUTION':
    case 'INJURY':
      return 'In:';
    case 'GOAL':
      return 'Assist:';
    default:
      return '';
  }
};

export const EventListItem: FC<{ event: FootballGameEvent }> = ({ event }) => {
  return (
    <li>
      <div
        className={cn('p-2', 'bg-neutral-800', 'rounded-sm', 'items-center')}
      >
        <div className={cn('flex', 'gap-4', 'items-center')}>
          {mainIcon[event.type]}
          <div className={cn('w-full', 'flex', 'flex-col')}>
            <p className={cn('text-xl')}>{event.expand.player.lastName}</p>
            <div className={cn('text-xs', 'flex', 'gap-2')}>
              <p className={cn('text-muted-foreground')}>
                {eventLabel[event.type]}
              </p>
              {event.secondaryPlayer && (
                <>
                  <span>&bull;</span>
                  <p>
                    <span className={cn('text-muted-foreground')}>
                      {getSecondaryText(event.type)}{' '}
                    </span>
                    <span>{event.expand.secondaryPlayer.lastName}</span>
                  </p>
                </>
              )}
            </div>
          </div>
          <div className={cn('text-2xl', 'font-thin', 'text-muted-foreground')}>
            <div className={cn('flex', 'items-start')}>
              {event.minute}'
              {!!event.addedTimeMinute && (
                <span className={cn('text-sm')}>+{event.addedTimeMinute}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};
