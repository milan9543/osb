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
  FootballPlayer,
} from '@/types/football';
import { eventIcon } from '@/util/eventIcon';
import { eventLabel } from '@/util/eventLabel';
import { clsx } from 'clsx';
import { HelpCircle, UserX } from 'lucide-react';
import { FC, useState } from 'react';
import { useFootballEvent } from '../hooks/useFootballEvent';
import { baseUrl } from '@/api/pocketbase';

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

const getSelectablePlayers = (
  selectedEventType: FootballEventType | null,
  search: string,
  primaryPlayer: FootballPlayer | null,
  game: FootballGame
): FootballPlayer[] => {
  let unSearchedArray: FootballPlayer[] = [];
  const homeOnField = game.expand.homeTeam.expand.onField;
  const homeSubs = game.expand.homeTeam.expand.subs;
  const visitorOnField = game.expand.visitorTeam.expand.onField;
  const visitorSubs = game.expand.visitorTeam.expand.subs;

  if (!selectedEventType) {
    return [];
  }
  if (!primaryPlayer) {
    unSearchedArray = [...homeOnField, ...visitorOnField];
  }
  if (primaryPlayer) {
    if (['INJURY', 'SUBSTITUTION'].includes(selectedEventType)) {
      unSearchedArray =
        primaryPlayer.team === game.expand.homeTeam.team
          ? [...(homeSubs || [])]
          : [...(visitorSubs || [])];
    } else {
      unSearchedArray =
        primaryPlayer.team === game.expand.homeTeam.team
          ? [...homeOnField]
          : [...visitorOnField];
    }
    unSearchedArray = unSearchedArray.filter(
      (item) => item.id !== primaryPlayer.id
    );
  }

  return search
    ? unSearchedArray.filter(
        (playerItem) =>
          playerItem.firstName.toLowerCase().includes(search.toLowerCase()) ||
          playerItem.middleName.toLowerCase().includes(search.toLowerCase()) ||
          playerItem.lastName.toLowerCase().includes(search.toLowerCase()) ||
          playerItem.number.toString() === search
      )
    : unSearchedArray;
};

export const EventHandler: FC<EventHandlerProps> = ({ game, onEvent }) => {
  const [primaryPlayer, setPrimaryPlayer] = useState<FootballPlayer | null>(
    null
  );
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

  const handleEventFinalize = (player: FootballPlayer | undefined) => {
    if (!selectedEventType) {
      return;
    }

    const needSecondPlayer =
      canSelectSecondaryPlayer.includes(selectedEventType);

    if (needSecondPlayer && !primaryPlayer && player) {
      setPrimaryPlayer(player);
      focusSearchInput();
    }
    if (!needSecondPlayer || primaryPlayer) {
      const primaryPlayerId = primaryPlayer
        ? primaryPlayer.id
        : (player as FootballPlayer).id;
      const secondaryPlayer = primaryPlayer
        ? player?.id || undefined
        : undefined;
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

  const teamData = {
    [game.expand.homeTeam.team]: {
      name: game.expand.homeTeam.expand.team.logo,
      logo: `${baseUrl}/api/files/${game.expand.homeTeam.expand.team.collectionId}/${game.expand.homeTeam.team}/${game.expand.homeTeam.expand.team.logo}?thumb=0x32`,
    },
    [game.expand.visitorTeam.team]: {
      name: game.expand.visitorTeam.expand.team.logo,
      logo: `${baseUrl}/api/files/${game.expand.homeTeam.expand.team.collectionId}/${game.expand.visitorTeam.team}/${game.expand.visitorTeam.expand.team.logo}?thumb=0x32`,
    },
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
                    {!!primaryPlayer &&
                      !['INJURY', 'SUBSTITUTION'].includes(
                        selectedEventType
                      ) && (
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
                    {getSelectablePlayers(
                      selectedEventType,
                      search,
                      primaryPlayer,
                      game
                    ).map((playerItem) => (
                      <li key={playerItem.id} className={cn('p-1')}>
                        <Button
                          variant="outline"
                          className={cn(
                            'py-8',
                            'w-full',
                            'text-left',
                            primaryPlayer?.id === playerItem.id
                              ? 'selected-button'
                              : ''
                          )}
                          onClick={() => handleEventFinalize(playerItem)}
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
                            <img
                              src={teamData[playerItem.team].logo}
                              width={32}
                            />
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
