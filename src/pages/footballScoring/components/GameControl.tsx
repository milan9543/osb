import { SkipForward, X } from 'lucide-react';
import { getPeriodLabel } from '@/util/periodLabel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { clsx } from 'clsx';
import { Input } from '@/components/ui/input';
import { FC, useState } from 'react';
import { FootballGame, FootballPeriod } from '@/types/football';
import { getNextPeriod } from '../util/footballHelper';

export const GameControl: FC<{
  game: FootballGame;
  onPeriodChange: () => void;
  onExtraTimeChange: (time: number) => void;
}> = ({ game, onPeriodChange, onExtraTimeChange }) => {
  const [customExtra, setCustomExtra] = useState<string>('');
  const [isConfirming, setIsConfirming] = useState(false);

  const nextPeriod = getNextPeriod(game);

  return (
    <Card className={clsx('col-span-5')}>
      <CardHeader>
        <CardTitle>Game control</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={clsx('flex flex-col', 'gap-4')}>
          <div className={clsx('flex', 'flex-row', 'justify-between')}>
            <p>Next period:</p>
            <p>{nextPeriod ? getPeriodLabel[nextPeriod] : '-'}</p>
          </div>

          <div>
            <p className={clsx('text-muted-foreground')}>Extra time</p>
            <div className={clsx('flex', 'flex-row', 'gap-2')}>
              {[...Array(7).keys()].map((item) => (
                <Button
                  key={item}
                  variant={item ? 'secondary' : 'destructive'}
                  size="icon"
                  className={clsx('min-w-8')}
                  onClick={() => onExtraTimeChange(item)}
                >
                  {item ? `+${item}` : <X size="16" />}
                </Button>
              ))}
              <form
                onSubmit={(ev) => {
                  ev.preventDefault();
                  setCustomExtra('');
                }}
              >
                <Input
                  type="number"
                  placeholder="Custom value"
                  value={customExtra}
                  onChange={(ev) => setCustomExtra(ev.currentTarget.value)}
                />
              </form>
            </div>
          </div>
          {!isConfirming && !!nextPeriod && (
            <Button
              variant="secondary"
              size="lg"
              onClick={() => setIsConfirming(true)}
            >
              <div
                className={clsx(
                  'w-full',
                  'flex',
                  'flex-row',
                  'w-full',
                  'justify-center',
                  'items-center'
                )}
              >
                <p>Jump to next period</p>
                <SkipForward />
              </div>
            </Button>
          )}
          {isConfirming && (
            <div>
              <p
                className={clsx('text-center', 'font-bold', 'text-2xl', 'p-4')}
              >
                Are you sure?
              </p>
              <div className={clsx('flex', 'flex-row', 'gap-2')}>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => setIsConfirming(false)}
                  className={clsx('w-full')}
                >
                  Cancel
                </Button>
                <Button
                  size="lg"
                  onClick={() => {
                    setIsConfirming(false);
                    onPeriodChange();
                  }}
                  className={clsx('w-full')}
                >
                  Confirm
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
