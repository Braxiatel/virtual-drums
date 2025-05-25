import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DrumType, DEFAULT_KEY_BINDINGS } from '../lib/constants';
import { KeyBindings, AudioState, GameState } from '../lib/types';

interface DrumStore {
  // Key bindings state
  keyBindings: KeyBindings;
  setKeyBinding: (drum: DrumType, key: string) => void;
  resetKeyBindings: () => void;

  // Audio state
  audio: AudioState;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setSoloTrack: (drum?: DrumType) => void;

  // Game state
  gameState: GameState;
  setGameState: (state: Partial<GameState>) => void;
  resetGame: () => void;

  // Settings
  latencyOffset: number;
  setLatencyOffset: (offset: number) => void;

  // Active drum hits (for visual feedback)
  activeDrums: Set<DrumType>;
  hitDrum: (drum: DrumType) => void;
  releaseDrum: (drum: DrumType) => void;
}

const initialGameState: GameState = {
  isPlaying: false,
  score: 0,
  combo: 0,
  currentBeat: 0,
  countdown: null,
};

const initialAudioState: AudioState = {
  volume: 0.8,
  muted: false,
};

export const useDrumStore = create<DrumStore>()(
  persist(
    (set) => ({
      // Key bindings
      keyBindings: DEFAULT_KEY_BINDINGS,
      setKeyBinding: (drum, key) =>
        set((state) => ({
          keyBindings: { ...state.keyBindings, [drum]: key.toLowerCase() },
        })),
      resetKeyBindings: () => set({ keyBindings: DEFAULT_KEY_BINDINGS }),

      // Audio
      audio: initialAudioState,
      setVolume: (volume) =>
        set((state) => ({
          audio: { ...state.audio, volume: Math.max(0, Math.min(1, volume)) },
        })),
      toggleMute: () =>
        set((state) => ({
          audio: { ...state.audio, muted: !state.audio.muted },
        })),
      setSoloTrack: (drum) =>
        set((state) => ({
          audio: { ...state.audio, soloTrack: drum },
        })),

      // Game state
      gameState: initialGameState,
      setGameState: (newState) =>
        set((state) => ({
          gameState: { ...state.gameState, ...newState },
        })),
      resetGame: () => set({ gameState: initialGameState }),

      // Settings
      latencyOffset: 0,
      setLatencyOffset: (offset) => set({ latencyOffset: offset }),

      // Active drums for visual feedback
      activeDrums: new Set(),
      hitDrum: (drum) =>
        set((state) => ({
          activeDrums: new Set([...state.activeDrums, drum]),
        })),
      releaseDrum: (drum) =>
        set((state) => {
          const newActiveDrums = new Set(state.activeDrums);
          newActiveDrums.delete(drum);
          return { activeDrums: newActiveDrums };
        }),
    }),
    {
      name: 'virtual-drums-storage',
      partialize: (state) => ({
        keyBindings: state.keyBindings,
        audio: state.audio,
        latencyOffset: state.latencyOffset,
      }),
    }
  )
); 