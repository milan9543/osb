import { cn } from '@/lib/utils';
import { FC } from 'react';
import { scoreboardCommonClass } from '../util/classes';

export type LowerThirdInfo = {
  title: string;
  message: string;
  show?: boolean;
};

export const CustomInfo: FC<LowerThirdInfo> = ({ title, message, show }) => {
  return (
    <div
      className={cn(
        scoreboardCommonClass,
        'absolute',
        'bottom-20',
        'left-20',
        'overflow-hidden',
        show ? 'opacity-100' : 'opacity-0',
        'transition-all',
        'duration-500',
        'text-clip',
        show ? 'w-[600px]' : 'w-0',
        'text-nowrap'
      )}
    >
      <div className={cn('text-4xl', 'p-3')}>{title}</div>
      <div className={cn('p-1', 'bg-white', 'text-slate-900')}>{message}</div>
    </div>
  );
};
