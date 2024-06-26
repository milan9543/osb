import { PocketbaseFields } from './pocketbase';

const FootballPeriods = [
  'PRE_GAME',
  'FIRST_HALF',
  'HALF_TIME',
  'SECOND_HALF',
  'FULL_TIME',
  'EXTRA_FIRST',
  'EXTRA_HALF_TIME',
  'EXTRA_SECOND',
  'AFTER_EXTRA_TIME',
  'PENALTIES',
  'GAME_OVER',
] as const;
export type FootballPeriod = (typeof FootballPeriods)[number];

export const FootballEventTypes = [
  'GOAL',
  'OWN_GOAL',
  'SUBSTITUTION',
  'YELLOW_CARD',
  'RED_CARD',
  'INJURY',
  'PENALTY_MISS',
  'PENALTY_SCORED',
] as const;
export type FootballEventType = (typeof FootballEventTypes)[number];

export type FootballPlayer = {
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  number: number;
  team: string;
} & PocketbaseFields;

export type FootballGameEvent = {
  expand: {
    player: FootballPlayer;
    secondaryPlayer: FootballPlayer;
  };
} & PocketbaseFields &
  FootballGameEventCreate;

export type FootballGameEventCreate = {
  type: FootballEventType;
  player: string;
  secondaryPlayer?: string;
  minute: number;
  addedTimeMinute?: number;
  game: string;
};

export type FootballGame = {
  homeTeam: string;
  visitorTeam: string;
  currentPeriod: FootballPeriod | null;
  currentPeriodStarted: string;
  currentPeriodAddedTime: number;
  homeScore: number;
  visitorScore: number;
  hasExtraTime: boolean;
  hasPenalties: boolean;
  expand: {
    homeTeam: FootballGameTeamExpanded;
    visitorTeam: FootballGameTeamExpanded;
  };
} & PocketbaseFields;

export type FootballTeam = PocketbaseFields & {
  fullName: string;
  shortName: string;
  threeLetterName: string;
  logo: string;
  expand: {
    players: FootballPlayer[];
  };
};

export type FootballGameTeamBase = {
  team: string;
  onField: string[];
  subs: string[];
  goneOff: string[];
  primaryColor: string;
  secondaryColor?: string;
  coachName: string;
};

export type FootballGameTeam = PocketbaseFields & FootballGameTeamBase;

export type FootballGameTeamExpanded = FootballGameTeam & {
  expand: {
    team: FootballTeam;
    onField: FootballPlayer[];
    subs: FootballPlayer[];
    goneOff: FootballPlayer[];
  };
};
