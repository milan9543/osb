import { baseUrl } from '@/api/pocketbase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  FootballEventType,
  FootballEventTypes,
  FootballGame,
} from '@/types/football';
import { eventIcon } from '@/util/eventIcon';
import { eventLabel } from '@/util/eventLabel';
import { clsx } from 'clsx';
import { HelpCircle } from 'lucide-react';
import { FC, useEffect, useState } from 'react';

type EventHandlerProps = {
  game: FootballGame;
  onChange: (event: FootballEventType | null) => void;
};

export const EventHandler: FC<EventHandlerProps> = ({ game, onChange }) => {
  const [selectedEventType, setSelectedEventType] =
    useState<FootballEventType | null>(null);
  const [search, setSearch] = useState('');
  useEffect(() => {
    if (!selectedEventType) {
      return;
    }
    const inputEl = document.getElementById('player-selector-search');
    if (inputEl) {
      inputEl.focus();
    }
  }, [selectedEventType]);

  const homeTeam = game.expand.homeTeam;
  const visitorTeam = game.expand.visitorTeam;
  return (
    <Card className={clsx('col-span-8')}>
      <div className={cn('flex', 'flex-row', 'gap-2')}>
        <div className={cn('w-full')}>
          <CardHeader>
            <CardTitle>Event handler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={clsx('grid', 'grid-cols-4', 'gap-2', 'w-full')}>
              {FootballEventTypes.map((item) => (
                <Button
                  key={item}
                  variant="secondary"
                  className={clsx(
                    'col-span-1',
                    'h-24',
                    'transition-all',
                    'duration-150',
                    selectedEventType === item ? 'selected-button' : ''
                  )}
                  onClick={() =>
                    setSelectedEventType(
                      item === selectedEventType ? null : item
                    )
                  }
                >
                  <div
                    className={cn('flex', 'flex-col', 'gap-2', 'items-center')}
                  >
                    {eventIcon[item]}
                    <p
                      className={clsx(
                        'text-muted-foreground',
                        'whitespace-normal',
                        'text-xs'
                      )}
                    >
                      {eventLabel[item]}
                    </p>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </div>
        <div className={cn('w-full')}>
          <CardHeader>
            <CardTitle>Player selector</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={cn('w-full', 'gap-4', 'flex', 'flex-col')}>
              <Input
                id="player-selector-search"
                placeholder="Search for name or number"
                disabled={!selectedEventType}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              {!selectedEventType && (
                <div
                  className={cn(
                    'w-full',
                    'h-52',
                    'flex',
                    'flex-col',
                    'items-center',
                    'justify-center',
                    'text-muted-foreground',
                    'font-thin',
                    'gap-6'
                  )}
                >
                  <HelpCircle size={50} strokeWidth={0.5} />
                  <p>Select event type first!</p>
                </div>
              )}
              {selectedEventType && (
                <ScrollArea className={cn('h-52')}>
                  <ul>
                    {[
                      ...(homeTeam?.expand?.players.map((item) => ({
                        id: item.id,
                        firstName: item.firstName,
                        middleName: item.middleName,
                        lastName: item.lastName,
                        teamId: homeTeam.id,
                        teamName: homeTeam.fullName,
                        number: item.number,
                        image: `${baseUrl}/api/files/${homeTeam.collectionId}/${homeTeam.id}/${homeTeam.logo}?thumb=0x32`,
                      })) || []),
                      ...(visitorTeam?.expand?.players.map((item) => ({
                        id: item.id,
                        firstName: item.firstName,
                        middleName: item.middleName,
                        lastName: item.lastName,
                        teamId: visitorTeam.id,
                        teamName: visitorTeam.fullName,
                        number: item.number,
                        image: `${baseUrl}/api/files/${visitorTeam.collectionId}/${visitorTeam.id}/${visitorTeam.logo}?thumb=0x32`,
                      })) || []),
                    ]
                      .filter(
                        (playerItem) =>
                          playerItem.firstName
                            .toLowerCase()
                            .includes(search.toLowerCase()) ||
                          playerItem.middleName
                            .toLowerCase()
                            .includes(search.toLowerCase()) ||
                          playerItem.lastName
                            .toLowerCase()
                            .includes(search.toLowerCase()) ||
                          playerItem.number.toString() === search
                      )
                      .map((playerItem) => (
                        <li key={playerItem.id} className={cn('p-1')}>
                          <Button
                            variant="outline"
                            className={cn('py-8', 'w-full', 'text-left')}
                          >
                            <div
                              className={cn(
                                'flex',
                                'flex-row',
                                'gap-4',
                                'justify-start',
                                'items-center',
                                'w-full'
                              )}
                            >
                              <img src={playerItem.image} />
                              <div
                                className={cn(
                                  'flex',
                                  'flex-col',
                                  'gap-0.5',
                                  'items-start',
                                  'w-full'
                                )}
                              >
                                <p className={cn('text-lg')}>
                                  <span className={cn('font-thin')}>
                                    {playerItem.firstName}{' '}
                                  </span>
                                  <span className={cn('font-thin')}>
                                    {playerItem.middleName}{' '}
                                  </span>
                                  <span className={cn('font-bold')}>
                                    {playerItem.lastName}
                                  </span>
                                </p>
                                <p
                                  className={cn(
                                    'text-sm',
                                    'text-muted-foreground',
                                    'font-light'
                                  )}
                                >
                                  {playerItem.teamName}
                                </p>
                              </div>
                              <p
                                className={cn(
                                  'text-3xl',
                                  'font-thin',
                                  'text-muted-foreground'
                                )}
                              >
                                #{playerItem.number}
                              </p>
                            </div>
                          </Button>
                        </li>
                      ))}
                  </ul>
                </ScrollArea>
              )}
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
};
