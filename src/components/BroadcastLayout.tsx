import { cn } from '@/lib/utils';
import { FC, PropsWithChildren } from 'react';

export const BroadcastLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className={cn('w-[1920px]', 'h-[1080px]', 'bg-transparent')}>
      {children}
    </div>
  );
};
