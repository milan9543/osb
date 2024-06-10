import { pb } from '@/api/pocketbase';
import { FootballGame, FootballGameEvent } from '@/types/football';
import { useQuery, useMutation } from '@tanstack/react-query';

export const useFootballData = (id: string) => {
  const { data, refetch } = useQuery({
    queryKey: [id],
    queryFn: () =>
      pb.collection('footballGame').getOne<FootballGame>(id, {
        expand:
          'events,homeTeam,visitorTeam,homeTeam.players,visitorTeam.players',
      }),
  });

  const { mutate } = useMutation({
    mutationFn: (updatedData: FootballGame) =>
      pb.collection('footballGame').update(id, updatedData),
  });

  const updateGameWithEvent = (event: FootballGameEvent) => {
    if (!data) {
      return;
    }
    const isHomePlayer = !!data.expand.homeTeam.expand.players.find(
      (item) => item.id === event.player
    );
    let homeScore = data.homeScore;
    let visitorScore = data.visitorScore;
    if (['GOAL', 'PENALTY_SCORED'].includes(event.type)) {
      if (isHomePlayer) {
        homeScore += 1;
      } else {
        visitorScore += 1;
      }
    }
    if (event.type === 'OWN_GOAL') {
      if (isHomePlayer) {
        visitorScore += 1;
      } else {
        homeScore += 1;
      }
    }

    mutate({
      ...data,
      homeScore,
      visitorScore,
    });
  };

  return { game: data, refetchGame: refetch, mutate, updateGameWithEvent };
};
