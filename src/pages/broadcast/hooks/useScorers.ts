import { FootballGame, FootballGameEvent } from '@/types/football';

type ScorerMap = Record<string, { lastName: string; goalMinutes: string[] }>;

export type ScorerInfo = {
  home: ScorerMap;
  visitor: ScorerMap;
};

export const useScorers = (
  game: FootballGame,
  events: FootballGameEvent[] | undefined
) => {
  const getScoringPlayers = (home: boolean): ScorerMap | null => {
    if (!events) return null;
    const gameTeam = home ? game.expand.homeTeam : game.expand.visitorTeam;
    const resultMap: ScorerMap = {};
    const playerIds = [
      ...gameTeam.onField,
      ...gameTeam.subs,
      ...gameTeam.goneOff,
    ];

    events
      .filter((eventItem) => {
        if (['GOAL', 'PENALTY_SCORED'].includes(eventItem.type)) {
          return playerIds.includes(eventItem.player);
        }
        if (eventItem.type === 'OWN_GOAL') {
          return !playerIds.includes(eventItem.player);
        }
      })
      .forEach((eventItem) => {
        if (resultMap[eventItem.player]) {
          resultMap[eventItem.player].goalMinutes.push(
            getGoalMinute(eventItem)
          );
        } else {
          resultMap[eventItem.player] = {
            lastName: eventItem.expand.player.lastName,
            goalMinutes: [getGoalMinute(eventItem)],
          };
        }
      });

    return resultMap;
  };

  const getGoalMinute = (event: FootballGameEvent): string => {
    let result = `${event.minute}`;
    if (event.addedTimeMinute) {
      result += `+${event.addedTimeMinute}`;
    }
    result += "'";
    if (event.type === 'OWN_GOAL') {
      result += ` (OG)`;
    }
    if (event.type === 'PENALTY_SCORED') {
      result += ` (P)`;
    }
    return result;
  };

  return {
    home: getScoringPlayers(true),
    visitor: getScoringPlayers(false),
  };
};
