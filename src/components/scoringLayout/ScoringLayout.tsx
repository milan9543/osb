import { clsx } from 'clsx';
import { FC, PropsWithChildren } from 'react';

export const ScoringLayout: FC<PropsWithChildren> = ({ children }) => (
  <div className={clsx('w-screen', 'h-screen')} id="scoring-layout">
    <div
      className={clsx('grid', 'grid-cols-12', 'auto-rows-min', 'p-3', 'gap-3')}
    >
      {children}
    </div>
  </div>
);
