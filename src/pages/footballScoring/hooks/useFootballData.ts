import { pb } from '@/api/pocketbase';
import { FootballGame } from '@/types/football';
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

  return { game: data, refetchGame: refetch, mutate };
};
