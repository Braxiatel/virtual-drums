import { DrumType } from './constants';

export type KeyBindings = Record<DrumType, string>;

export interface GameState {
  isPlaying: boolean;
  score: number;
  combo: number;
  currentBeat: number;
  countdown: number | null;
  // Rhythm game specific fields
  gameStartTime?: number;
  currentTime?: number;
  notesHit?: number;
  totalNotes?: number;
  maxCombo?: number;
  isComplete?: boolean;
  finalScore?: number;
}

export interface HitResult {
  drum: DrumType;
  timing: 'perfect' | 'good' | 'miss';
  score: number;
  timestamp: number;
}

export interface BeatMapNote {
  drum: DrumType;
  time: number; // milliseconds from start
  lane: number;
}

export interface BeatMap {
  name: string;
  artist: string;
  bpm: number;
  duration: number; // milliseconds
  notes: BeatMapNote[];
}

export interface AudioState {
  volume: number;
  muted: boolean;
  soloTrack?: DrumType;
}

export interface SettingsState {
  keyBindings: KeyBindings;
  audio: AudioState;
  latencyOffset: number; // milliseconds
} 