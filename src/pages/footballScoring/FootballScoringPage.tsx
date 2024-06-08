import { pb } from '../../api/pocketbase';
import { GameControl } from './components/GameControl';
import { GameInfo } from './components/GameInfo';
import { EventHandler } from './components/EventHandler';
import { useEffect } from 'react';
import { EventList } from './components/EventList';
import { getPeriodChangedData } from './util/footballHelper';
import { useFootballData } from './hooks/useFootballData';

export const FootballScoringPage = () => {
  const id = 'di6qpruvf56fplu';

  const { game, refetchGame, mutate } = useFootballData(id);

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
      mutate(getPeriodChangedData(game));
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
          <EventHandler game={game} onChange={console.log} />
        </>
      )}
    </>
  );
};
