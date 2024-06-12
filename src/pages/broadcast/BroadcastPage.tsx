import { pb } from '@/api/pocketbase';
import { useParams } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useFootballData } from '../footballScoring/hooks/useFootballData';
import { Scorebug } from './components/Scorebug';

export const BroadcastPage = () => {
  const { id } = useParams({ strict: false });

  const { game, refetchGame } = useFootballData(id || '');

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

  return <>{game && <Scorebug game={game} />}</>;
};
