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
  FootballGameEventCreate,
} from '@/types/football';
import { eventIcon } from '@/util/eventIcon';
import { eventLabel } from '@/util/eventLabel';
import { clsx } from 'clsx';
import { HelpCircle, UserX } from 'lucide-react';
import { FC, useState } from 'react';
import { useFootballEvent } from '../hooks/useFootballEvent';

type EventHandlerProps = {
  game: FootballGame;
  onEvent: (event: FootballGameEventCreate) => void;
};

const canSelectSecondaryPlayer: FootballEventType[] = [
  'GOAL',
  'INJURY',
  'SUBSTITUTION',
];

const getPlayerSelectorTitle = (
  type: FootballEventType | null,
  hasPrimaryPlayerSelected: boolean
): string => {
  switch (type) {
    case 'GOAL':
    case 'PENALTY_SCORED':
      return hasPrimaryPlayerSelected ? 'Player assisted' : 'Player scored';
    case 'OWN_GOAL':
      return 'Own goal scorer';
    case 'SUBSTITUTION':
      return hasPrimaryPlayerSelected
        ? 'Player coming on'
        : 'Player coming off';
    case 'YELLOW_CARD':
      return 'Yellow card recipient';
    case 'RED_CARD':
      return 'Red card recipient';
    case 'INJURY':
      return hasPrimaryPlayerSelected
        ? 'Player coming on'
        : 'Injured player coming off';
    case 'PENALTY_MISS':
      return 'Player who missed the penalty';
    default:
      return 'Player selector';
  }
};

export const EventHandler: FC<EventHandlerProps> = ({ game, onEvent }) => {
  const [primaryPlayer, setPrimaryPlayer] = useState<string | null>(null);
  const {
    selectedEventType,
    setSelectedEventType,
    search,
    setSearch,
    isGameRunning,
    currentMinute,
    currentMinuteAddedTime,
    focusSearchInput,
  } = useFootballEvent(game);

  const homeTeam = game.expand.homeTeam;
  const visitorTeam = game.expand.visitorTeam;

  const handleEventFinalize = (playerId: string | undefined) => {
    if (!selectedEventType) {
      return;
    }

    const needSecondPlayer =
      canSelectSecondaryPlayer.includes(selectedEventType);

    if (needSecondPlayer && !primaryPlayer && playerId) {
      setPrimaryPlayer(playerId);
      focusSearchInput();
    }
    if (!needSecondPlayer || primaryPlayer) {
      const primaryPlayerId = primaryPlayer ?? (playerId as string);
      const secondaryPlayer = primaryPlayer ? playerId : undefined;
      onEvent({
        type: selectedEventType,
        minute: currentMinute,
        addedTimeMinute: currentMinuteAddedTime,
        player: primaryPlayerId,
        secondaryPlayer: secondaryPlayer,
        game: game.id,
      });
      setPrimaryPlayer(null);
      setSelectedEventType(null);
    }

    setSearch('');
  };

  return (
    <Card className={clsx('col-span-12', 'md:col-span-8')}>
      <div className={cn('flex', 'flex-col', 'md:flex-row', 'gap-2')}>
        <div className={cn('w-full')}>
          <CardHeader>
            <CardTitle>Event handler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={clsx('grid', 'grid-cols-4', 'gap-2', 'w-full')}>
              {FootballEventTypes.map((item) => (
                <Button
                  key={item}
                  disabled={!isGameRunning || !!primaryPlayer}
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
            <CardTitle>
              {getPlayerSelectorTitle(selectedEventType, !!primaryPlayer)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={cn('w-full', 'gap-4', 'flex', 'flex-col')}>
              <Input
                id="player-selector-search"
                placeholder="Search for name or number"
                disabled={!selectedEventType}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                autoComplete="off"
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
                    {!!primaryPlayer && (
                      <Button
                        variant="outline"
                        className={cn('py-8', 'w-full', 'text-left')}
                        onClick={() => handleEventFinalize(undefined)}
                      >
                        <div
                          className={cn(
                            'w-full',
                            'text-xl',
                            'font-thin',
                            'text-muted-foreground',
                            'flex',
                            'items-center',
                            'gap-4'
                          )}
                        >
                          <UserX />
                          <p>No assisting player</p>
                        </div>
                      </Button>
                    )}
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
                            className={cn(
                              'py-8',
                              'w-full',
                              'text-left',
                              primaryPlayer === playerItem.id
                                ? 'selected-button'
                                : ''
                            )}
                            onClick={() => handleEventFinalize(playerItem.id)}
                            disabled={playerItem.id === primaryPlayer}
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
