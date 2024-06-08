import { FC } from 'react';

export const PenaltyMissedIcon: FC<{
  className: string | undefined;
  size: number;
}> = ({ className, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <title>Missed Penalty</title>
    <path
      d="M21 2H2v9h2V4h16v7h2V2h-1zm-5.09 9.34-3.92 3.93-3.88-3.88-1.41 1.42 3.87 3.87-3.9 3.91L8.09 22l3.9-3.9 3.9 3.9 1.41-1.41-3.9-3.91 3.93-3.92-1.42-1.42z"
      fillRule="evenodd"
    ></path>
  </svg>
);
