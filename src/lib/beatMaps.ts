import { BeatMap } from './types';

// Basic Rock pattern with 8th note hi-hats: 8 parts per bar
// 1. hi-hat + kick, 2. hi-hat, 3. hi-hat + snare, 4. hi-hat + kick, 
// 5. hi-hat + kick, 6. hi-hat, 7. hi-hat + snare, 8. hi-hat
// BPM: 50 (very slow tempo for learning) - Pattern repeats 4 times
// NOTE: Spacing between notes is 3x the visual size of each note for better readability
export const BASIC_ROCK_BEAT_MAP: BeatMap = {
  name: 'Basic Rock',
  artist: 'Virtual Drums',
  bpm: 50,
  duration: 25000, // 25 seconds total: 3 seconds prep + 22 seconds track (slower tempo)
  notes: [
    // Preparation time: 3 seconds of empty space before notes start
    
    // Bar 1 (3000-7800ms) - 8 eighth notes, 600ms apart (3x spacing for visual clarity)
    { drum: 'kick', time: 3000, lane: 0 },           // 1. kick + hi-hat
    { drum: 'closedHiHat', time: 3000, lane: 1 },   
    { drum: 'closedHiHat', time: 3600, lane: 1 },   // 2. hi-hat
    { drum: 'snare', time: 4200, lane: 2 },         // 3. snare + hi-hat
    { drum: 'closedHiHat', time: 4200, lane: 1 },   
    { drum: 'kick', time: 4800, lane: 0 },           // 4. kick + hi-hat
    { drum: 'closedHiHat', time: 4800, lane: 1 },   
    { drum: 'kick', time: 5400, lane: 0 },           // 5. kick + hi-hat
    { drum: 'closedHiHat', time: 5400, lane: 1 },   
    { drum: 'closedHiHat', time: 6000, lane: 1 },   // 6. hi-hat
    { drum: 'snare', time: 6600, lane: 2 },         // 7. snare + hi-hat
    { drum: 'closedHiHat', time: 6600, lane: 1 },   
    { drum: 'closedHiHat', time: 7200, lane: 1 },   // 8. hi-hat

    // Bar 2 (7800-12600ms) - same pattern with increased spacing
    { drum: 'kick', time: 7800, lane: 0 },           // 1. kick + hi-hat
    { drum: 'closedHiHat', time: 7800, lane: 1 },   
    { drum: 'closedHiHat', time: 8400, lane: 1 },   // 2. hi-hat
    { drum: 'snare', time: 9000, lane: 2 },         // 3. snare + hi-hat
    { drum: 'closedHiHat', time: 9000, lane: 1 },   
    { drum: 'kick', time: 9600, lane: 0 },           // 4. kick + hi-hat
    { drum: 'closedHiHat', time: 9600, lane: 1 },   
    { drum: 'kick', time: 10200, lane: 0 },          // 5. kick + hi-hat
    { drum: 'closedHiHat', time: 10200, lane: 1 },  
    { drum: 'closedHiHat', time: 10800, lane: 1 },  // 6. hi-hat
    { drum: 'snare', time: 11400, lane: 2 },        // 7. snare + hi-hat
    { drum: 'closedHiHat', time: 11400, lane: 1 },  
    { drum: 'closedHiHat', time: 12000, lane: 1 },  // 8. hi-hat

    // Bar 3 (12600-17400ms) - same pattern with increased spacing
    { drum: 'kick', time: 12600, lane: 0 },          // 1. kick + hi-hat
    { drum: 'closedHiHat', time: 12600, lane: 1 },  
    { drum: 'closedHiHat', time: 13200, lane: 1 },  // 2. hi-hat
    { drum: 'snare', time: 13800, lane: 2 },        // 3. snare + hi-hat
    { drum: 'closedHiHat', time: 13800, lane: 1 },  
    { drum: 'kick', time: 14400, lane: 0 },          // 4. kick + hi-hat
    { drum: 'closedHiHat', time: 14400, lane: 1 },  
    { drum: 'kick', time: 15000, lane: 0 },          // 5. kick + hi-hat
    { drum: 'closedHiHat', time: 15000, lane: 1 },  
    { drum: 'closedHiHat', time: 15600, lane: 1 },  // 6. hi-hat
    { drum: 'snare', time: 16200, lane: 2 },        // 7. snare + hi-hat
    { drum: 'closedHiHat', time: 16200, lane: 1 },  
    { drum: 'closedHiHat', time: 16800, lane: 1 },  // 8. hi-hat

    // Bar 4 (17400-22200ms) - same pattern with increased spacing
    { drum: 'kick', time: 17400, lane: 0 },          // 1. kick + hi-hat
    { drum: 'closedHiHat', time: 17400, lane: 1 },  
    { drum: 'closedHiHat', time: 18000, lane: 1 },  // 2. hi-hat
    { drum: 'snare', time: 18600, lane: 2 },        // 3. snare + hi-hat
    { drum: 'closedHiHat', time: 18600, lane: 1 },  
    { drum: 'kick', time: 19200, lane: 0 },          // 4. kick + hi-hat
    { drum: 'closedHiHat', time: 19200, lane: 1 },  
    { drum: 'kick', time: 19800, lane: 0 },          // 5. kick + hi-hat
    { drum: 'closedHiHat', time: 19800, lane: 1 },  
    { drum: 'closedHiHat', time: 20400, lane: 1 },  // 6. hi-hat
    { drum: 'snare', time: 21000, lane: 2 },        // 7. snare + hi-hat
    { drum: 'closedHiHat', time: 21000, lane: 1 },  
    { drum: 'closedHiHat', time: 21600, lane: 1 },  // 8. hi-hat
  ],
};

export const BEAT_MAPS = {
  basicRock: BASIC_ROCK_BEAT_MAP,
}; 