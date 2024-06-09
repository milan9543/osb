import { pb } from '@/api/pocketbase';
import { FootballGameEvent, FootballGameEventCreate } from '@/types/football';
import { useMutation } from '@tanstack/react-query';

export const useFootballEventData = (
  onSuccess: (data: FootballGameEvent) => void
) => {
  const { mutate } = useMutation({
    mutationFn: (eventToAdd: FootballGameEventCreate) =>
      pb.collection('footballGameEvent').create(eventToAdd),
    onSuccess: (data) => onSuccess(data as FootballGameEvent),
  });

  const handleEventAdd = (event: FootballGameEventCreate) => {
    mutate(event);
  };

  return { handleEventAdd };
};
