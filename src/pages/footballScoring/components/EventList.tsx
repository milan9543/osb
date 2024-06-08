import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export const EventList = () => (
  <Card className={cn('col-span-4', 'row-span-2')}>
    <CardHeader>
      <CardTitle>Events</CardTitle>
    </CardHeader>
    <CardContent>
      <ScrollArea className={cn('h-full')}></ScrollArea>
    </CardContent>
  </Card>
);
