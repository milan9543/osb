import { useEffect } from 'react';
import { pb } from '../../api/pocketbase';
import { EventHandler } from './components/EventHandler';
import { EventList } from './components/EventList';
import { GameControl } from './components/GameControl';
import { GameInfo } from './components/GameInfo';
import { useFootballData } from './hooks/useFootballData';
import { useFootballEventData } from './hooks/useFootballEventData';
import { getPeriodChangedData } from './util/footballHelper';

export const FootballScoringPage = () => {
  const id = 'di6qpruvf56fplu';

  const {
    game,
    refetchGame,
    mutate: updatGame,
    updateGameWithEvent,
  } = useFootballData(id);

  const { handleEventAdd } = useFootballEventData(updateGameWithEvent);

  useEffect(() => {
    const unsubscribePromise = pb
      .collection('footballGame')
      .subscribe(id, (data) => {
        console.log(data);
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleExtraTimeChange = (extraTime: number) => {
    // TODO
  };

  return (
    <>
      {game && (
        <>
          <GameInfo game={game} />
          <GameControl
            game={game}
            onPeriodChange={handlePeriodChange}
            onExtraTimeChange={handleExtraTimeChange}
          />
          <EventList />
          <EventHandler game={game} onEvent={handleEventAdd} />
        </>
      )}
    </>
  );
};
