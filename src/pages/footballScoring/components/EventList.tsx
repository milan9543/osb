import { pb } from '@/api/pocketbase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { FC, useEffect } from 'react';
import { EventListItem } from './EventListItem';
import { FootballGameEvent } from '@/types/football';

export const EventList: FC<{ gameId: string }> = ({ gameId }) => {
  const { data, refetch } = useQuery({
    queryKey: ['events', gameId],
    queryFn: () =>
      pb.collection('footballGameEvent').getFullList<FootballGameEvent>({
        filter: `game = "${gameId}"`,
        sort: '-minute,-created',
        expand: 'player,secondaryPlayer',
      }),
  });

  useEffect(() => {
    const unsubscribePromise = pb
      .collection('footballGameEvent')
      .subscribe('*', () => {
        refetch();
      });
    return () => {
      (async () => {
        (await unsubscribePromise)();
      })();
    };
  }, []);

  return (
    <Card className={cn('col-span-12', 'md:col-span-4', 'row-span-3')}>
      <CardHeader>
        <CardTitle>Events</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className={cn('h-[800px]', 'px-3')}>
          <ul className={cn('flex', 'flex-col', 'gap-2')}>
            {data &&
              data.map((item) => <EventListItem key={item.id} event={item} />)}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
