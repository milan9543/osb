import { useEffect } from 'react';
import { pb } from '../../api/pocketbase';
import { EventHandler } from './components/EventHandler';
import { EventList } from './components/EventList';
import { GameControl } from './components/GameControl';
import { GameInfo } from './components/GameInfo';
import { useFootballData } from './hooks/useFootballData';
import { useFootballEventData } from './hooks/useFootballEventData';
import { getPeriodChangedData } from './util/footballHelper';
import { useFootballGameTeamData } from './hooks/useFootballGameTeamData';
import { useParams } from '@tanstack/react-router';

export const FootballScoringPage = () => {
  const { id } = useParams({ strict: false });

  const {
    game,
    refetchGame,
    mutate: updatGame,
    updateGameWithEvent,
  } = useFootballData(id || '');

  const { handleGameTeamChangeByEvent } = useFootballGameTeamData();

  const { handleEventAdd } = useFootballEventData((createdEvent) => {
    updateGameWithEvent(createdEvent);
    handleGameTeamChangeByEvent(createdEvent, game);
  });

  useEffect(() => {
    const unsubscribePromise = pb
      .collection('footballGame')
      .subscribe(id || '', () => {
        refetchGame();
      });
    return () => {
      (async () => {
        (await unsubscribePromise)();
      })();
    };
  }, [id]);

  const handlePeriodChange = () => {
    if (game) {
      updatGame(getPeriodChangedData(game));
    }
  };

  const handleAddedTimeChange = (addedTime: number) => {
    if (game) {
      updatGame({ ...game, currentPeriodAddedTime: addedTime });
    }
  };

  return (
    <>
      {game && (
        <>
          <GameInfo game={game} />
          <GameControl
            game={game}
            onPeriodChange={handlePeriodChange}
            onExtraTimeChange={handleAddedTimeChange}
          />
          <EventList gameId={game.id} />
          <EventHandler game={game} onEvent={handleEventAdd} />
        </>
      )}
    </>
  );
};
