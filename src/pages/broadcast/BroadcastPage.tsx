import { pb } from '@/api/pocketbase';
import { useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useFootballData } from '../footballScoring/hooks/useFootballData';
import { Scorebug } from './components/Scorebug';
import { CustomInfo } from './components/CustomInfo';

export const BroadcastPage = () => {
  const [show, setShow] = useState<boolean>(false);
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

  useEffect(() => {
    const interval = setInterval(
      () => {
        console.log('running');
        setShow(!show);
      },
      show ? 5000 : 2000
    );
    return () => clearInterval(interval);
  }, [show]);

  return (
    <>
      {game && (
        <>
          <Scorebug game={game} />
          <CustomInfo
            title="Horváth Milán"
            message="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
            show={show}
          />
        </>
      )}
    </>
  );
};
