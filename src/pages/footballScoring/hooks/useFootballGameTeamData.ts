import { pb } from '@/api/pocketbase';
import {
  FootballGame,
  FootballGameEvent,
  FootballGameTeamBase,
} from '@/types/football';
import { useMutation } from '@tanstack/react-query';
import { isHomePlayer } from '../util/footballHelper';

export const useFootballGameTeamData = () => {
  const { mutate } = useMutation({
    mutationFn: (data: { id: string; updatedGame: FootballGameTeamBase }) =>
      pb.collection('footballGameTeam').update(data.id, data.updatedGame),
  });

  const handleGameTeamChangeByEvent = (
    event: FootballGameEvent,
    game: FootballGame | undefined
  ) => {
    if (!game || !['INJURY', 'SUBSTITUTION', 'RED_CARD'].includes(event.type)) {
      return;
    }
    const gameTeamToUpdate = isHomePlayer(event.player, game)
      ? game.expand.homeTeam
      : game.expand.visitorTeam;
    const playerIdGoneOff = event.player;
    const playerIdComeOn = ['INJURY', 'SUBSTITUTION'].includes(event.type)
      ? event.secondaryPlayer
      : undefined;

    mutate({
      id: gameTeamToUpdate.id,
      updatedGame: {
        ...gameTeamToUpdate,
        onField: [
          ...gameTeamToUpdate.onField.filter(
            (item) => item !== playerIdGoneOff
          ),
          ...(playerIdComeOn ? [playerIdComeOn] : []),
        ],
        subs: playerIdComeOn
          ? gameTeamToUpdate.subs.filter((item) => item !== playerIdComeOn)
          : gameTeamToUpdate.subs,
        goneOff: [...gameTeamToUpdate.goneOff, playerIdGoneOff],
      },
    });
  };

  return { handleGameTeamChangeByEvent };
};
