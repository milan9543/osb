import { FC } from 'react';

export const OwnGoalIcon: FC<{
  className: string | undefined;
  size: number;
}> = ({ className, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <title>Own goal</title>
    <path
      d="M7 2v3h10l2 2 .001 3.461A6.73 6.73 0 0 1 21 15.25c0 3.72-3.03 6.75-6.75 6.75S7.5 18.97 7.5 15.25s3.03-6.75 6.75-6.75c.979 0 1.91.21 2.751.587L17 7H7v3H6L2 6l4-4h1zm7.24 8.17c-1.29 0-2.47.5-3.37 1.3l.88.53-.64 2.39-1.94.69v.17c0 .65.13 1.26.35 1.83l.9-.46 1.5 1.67-.24 1.33a5.017 5.017 0 0 0 2.29.702l.276.008.198-.004a5.089 5.089 0 0 0 4.862-4.862l.004-.214c0-1.46-.62-2.77-1.61-3.7l-.84.78-2.62-1.11.28-1.04c-.1-.01-.19-.01-.28-.01zm2.42 3.95L18 16.58l-2 2.2-2-.78v-2.91l2.66-.97z"
      fillRule="evenodd"
    ></path>
  </svg>
);
