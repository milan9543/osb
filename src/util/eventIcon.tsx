import { GoalIcon } from '@/assets/extraIcons/GoalIcon';
import { OwnGoalIcon } from '@/assets/extraIcons/OwnGoalIcon';
import { PenaltyIcon } from '@/assets/extraIcons/PenaltyIcon';
import { PenaltyMissedIcon } from '@/assets/extraIcons/PenaltyMissedIcon';
import { cn } from '@/lib/utils';
import { FootballEventType } from '@/types/football';
import {
  CornerDownRight,
  CornerUpLeft,
  Cross,
  RectangleVertical,
} from 'lucide-react';

export const eventIcon: Record<FootballEventType, JSX.Element> = {
  GOAL: <GoalIcon className={cn('fill-green-600')} size={32} />,
  YELLOW_CARD: (
    <RectangleVertical
      className={cn('text-yellow-500', 'fill-yellow-500')}
      size={32}
    />
  ),
  RED_CARD: (
    <RectangleVertical
      className={cn('text-red-600', 'fill-red-600')}
      size={32}
    />
  ),
  INJURY: <Cross size={32} className={cn('text-red-400')} />,
  PENALTY_MISS: <PenaltyMissedIcon size={32} className={cn('fill-red-600')} />,
  PENALTY_SCORED: <PenaltyIcon className={cn('fill-green-600')} size={32} />,
  SUBSTITUTION: (
    <div className={cn('relative', 'w-8', 'h-8')}>
      <CornerUpLeft className={cn('absolute', '-top-0.5', 'text-green-600')} />
      <CornerDownRight
        className={cn('absolute', '-bottom-0.5', 'text-red-600')}
      />
    </div>
  ),
  OWN_GOAL: <OwnGoalIcon size={32} className={cn('fill-red-600')} />,
};
