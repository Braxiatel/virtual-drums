// Default key bindings from README
export const DEFAULT_KEY_BINDINGS = {
  kick: 'f',
  snare: 'j',
  highTom: 'r',
  midTom: 't',
  floorTom: 'g',
  closedHiHat: 'h',
  openHiHat: 'y',
  crash: 'u',
  ride: 'k',
} as const;

// Drum kit configuration with much larger sizes and compact positioning
export const DRUM_KIT_CONFIG = {
  kick: {
    label: 'Kick',
    defaultKey: 'f',
    audioFile: '/audio/kick.wav',
    imageFile: '/images/kick-drum.svg',
    position: { x: 50, y: 70 }, // moved higher, away from instruction panel
    size: { width: 220, height: 220 }, // much larger
  },
  snare: {
    label: 'Snare',
    defaultKey: 'j',
    audioFile: '/audio/snare.wav',
    imageFile: '/images/snare-drum.svg',
    position: { x: 35, y: 55 }, // closer positioning
    size: { width: 160, height: 160 }, // larger
  },
  highTom: {
    label: 'High Tom',
    defaultKey: 'r',
    audioFile: '/audio/high-tom.wav',
    imageFile: '/images/tom-drum.svg',
    position: { x: 30, y: 30 }, // closer positioning
    size: { width: 150, height: 150 }, // increased size for better visibility
  },
  midTom: {
    label: 'Mid Tom',
    defaultKey: 't',
    audioFile: '/audio/mid-tom.wav',
    imageFile: '/images/tom-drum.svg',
    position: { x: 50, y: 25 }, // closer positioning
    size: { width: 160, height: 160 }, // increased size, slightly larger than high tom
  },
  floorTom: {
    label: 'Floor Tom',
    defaultKey: 'g',
    audioFile: '/audio/floor-tom.wav',
    imageFile: '/images/floor-tom.svg',
    position: { x: 70, y: 55 }, // closer positioning
    size: { width: 170, height: 170 }, // larger
  },
  closedHiHat: {
    label: 'Closed Hi-Hat',
    defaultKey: 'h',
    audioFile: '/audio/closed-hihat.wav',
    imageFile: '/images/hihat.svg',
    position: { x: 18, y: 40 }, // closer positioning
    size: { width: 120, height: 120 }, // larger
  },
  openHiHat: {
    label: 'Open Hi-Hat',
    defaultKey: 'y',
    audioFile: '/audio/open-hihat.wav',
    imageFile: '/images/hihat.svg',
    position: { x: 18, y: 60 }, // closer positioning
    size: { width: 120, height: 120 }, // larger
  },
  crash: {
    label: 'Crash Cymbal',
    defaultKey: 'u',
    audioFile: '/audio/crash.wav',
    imageFile: '/images/crash-cymbal.svg',
    position: { x: 20, y: 15 }, // closer positioning
    size: { width: 140, height: 140 }, // larger
  },
  ride: {
    label: 'Ride Cymbal',
    defaultKey: 'k',
    audioFile: '/audio/ride.wav',
    imageFile: '/images/ride-cymbal.svg',
    position: { x: 80, y: 25 }, // closer positioning
    size: { width: 160, height: 160 }, // larger
  },
} as const;

export type DrumType = keyof typeof DRUM_KIT_CONFIG;

// Game constants
export const GAME_CONFIG = {
  COUNTDOWN_DURATION: 3,
  NOTE_HIGHWAY_SPEED: 2, // pixels per frame
  HIT_WINDOW_MS: 100, // milliseconds for perfect hit
  MISS_WINDOW_MS: 200, // milliseconds for miss
} as const; 