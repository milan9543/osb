import { FC } from 'react';

export const PenaltyIcon: FC<{
  className: string | undefined;
  size: number;
}> = ({ className, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <title>Penalty</title>
    <path
      d="M12 8.5c3.72 0 6.75 3.03 6.75 6.75S15.72 22 12 22s-6.75-3.03-6.75-6.75S8.28 8.5 12 8.5zm-.01 1.67c-1.29 0-2.47.5-3.37 1.3l.88.53-.64 2.39-1.94.69v.17c0 .65.13 1.26.35 1.83l.9-.46 1.5 1.67-.24 1.33a5.017 5.017 0 0 0 2.29.702l.276.008.198-.004a5.089 5.089 0 0 0 4.862-4.862l.004-.214c0-1.46-.62-2.77-1.61-3.7l-.84.78-2.62-1.11.28-1.04c-.1-.01-.19-.01-.28-.01zm2.42 3.95 1.34 2.46-2 2.2-2-.78v-2.91l2.66-.97zM22 2v9h-2V4H4v7H2V2h20z"
      fillRule="evenodd"
    ></path>
  </svg>
);
