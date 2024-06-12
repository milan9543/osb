import { pb } from '@/api/pocketbase';
import { FootballGame, FootballGameEvent } from '@/types/football';
import { useQuery, useMutation } from '@tanstack/react-query';

export const useFootballData = (id: string) => {
  const { data, refetch } = useQuery({
    queryKey: [id],
    queryFn: () =>
      pb.collection('footballGame').getOne<FootballGame>(id, {
        expand:
          'homeTeam.onField,homeTeam.team,homeTeam.subs,visitorTeam.onField,visitorTeam.subs,visitorTeam.team',
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
    const isHomePlayer = !!data.expand.homeTeam.onField.find(
      (id) => id === event.player
    );
    const isVisitorPlayer = !!data.expand.visitorTeam.onField.find(
      (id) => id === event.player
    );
    if (!isHomePlayer && !isVisitorPlayer) {
      window.alert('Error, player not found in either teams!');
    }

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
