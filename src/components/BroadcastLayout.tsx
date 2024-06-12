import { cn } from '@/lib/utils';
import { FC, PropsWithChildren } from 'react';

export const BroadcastLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div
      className={cn('w-[1920px]', 'h-[1080px]', 'bg-transparent', 'relative')}
    >
      <div className={cn('absolute', 'z-[1]')}>{children}</div>

      <iframe
        className={cn('absolute', 'z-0')}
        width="1920"
        height="1080"
        src="https://www.youtube.com/embed/3oEdJH1mZ6Q?autoplay=1&rel=0&start=373"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
      ></iframe>
    </div>
  );
};
