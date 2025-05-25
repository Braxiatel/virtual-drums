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

// Country Rock pattern: Simple alternating kick-snare with hi-hat on every beat
// 1. hi-hat + kick, 2. hi-hat + snare, 3. hi-hat + kick, 4. hi-hat + snare,
// 5. hi-hat + kick, 6. hi-hat + snare, 7. hi-hat + kick, 8. hi-hat + snare
// BPM: 50 (same as Basic Rock for consistency) - Pattern repeats 4 times
// NOTE: Simpler pattern than Basic Rock - great for beginners learning steady rhythm
export const COUNTRY_ROCK_BEAT_MAP: BeatMap = {
  name: 'Country Rock',
  artist: 'Virtual Drums',
  bpm: 50,
  duration: 25000, // 25 seconds total: 3 seconds prep + 22 seconds track
  notes: [
    // Preparation time: 3 seconds of empty space before notes start
    
    // Bar 1 (3000-7800ms) - 8 eighth notes, 600ms apart
    { drum: 'kick', time: 3000, lane: 0 },           // 1. kick + hi-hat
    { drum: 'closedHiHat', time: 3000, lane: 1 },   
    { drum: 'snare', time: 3600, lane: 2 },         // 2. snare + hi-hat
    { drum: 'closedHiHat', time: 3600, lane: 1 },   
    { drum: 'kick', time: 4200, lane: 0 },           // 3. kick + hi-hat
    { drum: 'closedHiHat', time: 4200, lane: 1 },   
    { drum: 'snare', time: 4800, lane: 2 },         // 4. snare + hi-hat
    { drum: 'closedHiHat', time: 4800, lane: 1 },   
    { drum: 'kick', time: 5400, lane: 0 },           // 5. kick + hi-hat
    { drum: 'closedHiHat', time: 5400, lane: 1 },   
    { drum: 'snare', time: 6000, lane: 2 },         // 6. snare + hi-hat
    { drum: 'closedHiHat', time: 6000, lane: 1 },   
    { drum: 'kick', time: 6600, lane: 0 },           // 7. kick + hi-hat
    { drum: 'closedHiHat', time: 6600, lane: 1 },   
    { drum: 'snare', time: 7200, lane: 2 },         // 8. snare + hi-hat
    { drum: 'closedHiHat', time: 7200, lane: 1 },   

    // Bar 2 (7800-12600ms) - same pattern
    { drum: 'kick', time: 7800, lane: 0 },           // 1. kick + hi-hat
    { drum: 'closedHiHat', time: 7800, lane: 1 },   
    { drum: 'snare', time: 8400, lane: 2 },         // 2. snare + hi-hat
    { drum: 'closedHiHat', time: 8400, lane: 1 },   
    { drum: 'kick', time: 9000, lane: 0 },           // 3. kick + hi-hat
    { drum: 'closedHiHat', time: 9000, lane: 1 },   
    { drum: 'snare', time: 9600, lane: 2 },         // 4. snare + hi-hat
    { drum: 'closedHiHat', time: 9600, lane: 1 },   
    { drum: 'kick', time: 10200, lane: 0 },          // 5. kick + hi-hat
    { drum: 'closedHiHat', time: 10200, lane: 1 },  
    { drum: 'snare', time: 10800, lane: 2 },        // 6. snare + hi-hat
    { drum: 'closedHiHat', time: 10800, lane: 1 },  
    { drum: 'kick', time: 11400, lane: 0 },          // 7. kick + hi-hat
    { drum: 'closedHiHat', time: 11400, lane: 1 },  
    { drum: 'snare', time: 12000, lane: 2 },        // 8. snare + hi-hat
    { drum: 'closedHiHat', time: 12000, lane: 1 },  

    // Bar 3 (12600-17400ms) - same pattern
    { drum: 'kick', time: 12600, lane: 0 },          // 1. kick + hi-hat
    { drum: 'closedHiHat', time: 12600, lane: 1 },  
    { drum: 'snare', time: 13200, lane: 2 },        // 2. snare + hi-hat
    { drum: 'closedHiHat', time: 13200, lane: 1 },  
    { drum: 'kick', time: 13800, lane: 0 },          // 3. kick + hi-hat
    { drum: 'closedHiHat', time: 13800, lane: 1 },  
    { drum: 'snare', time: 14400, lane: 2 },        // 4. snare + hi-hat
    { drum: 'closedHiHat', time: 14400, lane: 1 },  
    { drum: 'kick', time: 15000, lane: 0 },          // 5. kick + hi-hat
    { drum: 'closedHiHat', time: 15000, lane: 1 },  
    { drum: 'snare', time: 15600, lane: 2 },        // 6. snare + hi-hat
    { drum: 'closedHiHat', time: 15600, lane: 1 },  
    { drum: 'kick', time: 16200, lane: 0 },          // 7. kick + hi-hat
    { drum: 'closedHiHat', time: 16200, lane: 1 },  
    { drum: 'snare', time: 16800, lane: 2 },        // 8. snare + hi-hat
    { drum: 'closedHiHat', time: 16800, lane: 1 },  

    // Bar 4 (17400-22200ms) - same pattern
    { drum: 'kick', time: 17400, lane: 0 },          // 1. kick + hi-hat
    { drum: 'closedHiHat', time: 17400, lane: 1 },  
    { drum: 'snare', time: 18000, lane: 2 },        // 2. snare + hi-hat
    { drum: 'closedHiHat', time: 18000, lane: 1 },  
    { drum: 'kick', time: 18600, lane: 0 },          // 3. kick + hi-hat
    { drum: 'closedHiHat', time: 18600, lane: 1 },  
    { drum: 'snare', time: 19200, lane: 2 },        // 4. snare + hi-hat
    { drum: 'closedHiHat', time: 19200, lane: 1 },  
    { drum: 'kick', time: 19800, lane: 0 },          // 5. kick + hi-hat
    { drum: 'closedHiHat', time: 19800, lane: 1 },  
    { drum: 'snare', time: 20400, lane: 2 },        // 6. snare + hi-hat
    { drum: 'closedHiHat', time: 20400, lane: 1 },  
    { drum: 'kick', time: 21000, lane: 0 },          // 7. kick + hi-hat
    { drum: 'closedHiHat', time: 21000, lane: 1 },  
    { drum: 'snare', time: 21600, lane: 2 },        // 8. snare + hi-hat
    { drum: 'closedHiHat', time: 21600, lane: 1 },  
  ],
};

// Heavy Rock pattern with open hi-hat: 8 parts per bar
// 1. open hi-hat + kick, 2. open hi-hat, 3. open hi-hat + snare, 4. open hi-hat,
// 5. open hi-hat + kick, 6. open hi-hat + kick, 7. open hi-hat + snare, 8. open hi-hat
// BPM: 50 (same as other tracks for consistency) - Pattern repeats 4 times
// NOTE: Uses open hi-hat for a heavier, more aggressive sound
export const HEAVY_ROCK_BEAT_MAP: BeatMap = {
  name: 'Heavy Rock',
  artist: 'Virtual Drums',
  bpm: 50,
  duration: 25000, // 25 seconds total: 3 seconds prep + 22 seconds track
  notes: [
    // Preparation time: 3 seconds of empty space before notes start
    
    // Bar 1 (3000-7800ms) - 8 eighth notes, 600ms apart
    { drum: 'kick', time: 3000, lane: 0 },           // 1. kick + open hi-hat
    { drum: 'openHiHat', time: 3000, lane: 1 },     
    { drum: 'openHiHat', time: 3600, lane: 1 },     // 2. open hi-hat
    { drum: 'snare', time: 4200, lane: 2 },         // 3. snare + open hi-hat
    { drum: 'openHiHat', time: 4200, lane: 1 },     
    { drum: 'openHiHat', time: 4800, lane: 1 },     // 4. open hi-hat
    { drum: 'kick', time: 5400, lane: 0 },           // 5. kick + open hi-hat
    { drum: 'openHiHat', time: 5400, lane: 1 },     
    { drum: 'kick', time: 6000, lane: 0 },           // 6. kick + open hi-hat
    { drum: 'openHiHat', time: 6000, lane: 1 },     
    { drum: 'snare', time: 6600, lane: 2 },         // 7. snare + open hi-hat
    { drum: 'openHiHat', time: 6600, lane: 1 },     
    { drum: 'openHiHat', time: 7200, lane: 1 },     // 8. open hi-hat

    // Bar 2 (7800-12600ms) - same pattern
    { drum: 'kick', time: 7800, lane: 0 },           // 1. kick + open hi-hat
    { drum: 'openHiHat', time: 7800, lane: 1 },     
    { drum: 'openHiHat', time: 8400, lane: 1 },     // 2. open hi-hat
    { drum: 'snare', time: 9000, lane: 2 },         // 3. snare + open hi-hat
    { drum: 'openHiHat', time: 9000, lane: 1 },     
    { drum: 'openHiHat', time: 9600, lane: 1 },     // 4. open hi-hat
    { drum: 'kick', time: 10200, lane: 0 },          // 5. kick + open hi-hat
    { drum: 'openHiHat', time: 10200, lane: 1 },    
    { drum: 'kick', time: 10800, lane: 0 },          // 6. kick + open hi-hat
    { drum: 'openHiHat', time: 10800, lane: 1 },    
    { drum: 'snare', time: 11400, lane: 2 },        // 7. snare + open hi-hat
    { drum: 'openHiHat', time: 11400, lane: 1 },    
    { drum: 'openHiHat', time: 12000, lane: 1 },    // 8. open hi-hat

    // Bar 3 (12600-17400ms) - same pattern
    { drum: 'kick', time: 12600, lane: 0 },          // 1. kick + open hi-hat
    { drum: 'openHiHat', time: 12600, lane: 1 },    
    { drum: 'openHiHat', time: 13200, lane: 1 },    // 2. open hi-hat
    { drum: 'snare', time: 13800, lane: 2 },        // 3. snare + open hi-hat
    { drum: 'openHiHat', time: 13800, lane: 1 },    
    { drum: 'openHiHat', time: 14400, lane: 1 },    // 4. open hi-hat
    { drum: 'kick', time: 15000, lane: 0 },          // 5. kick + open hi-hat
    { drum: 'openHiHat', time: 15000, lane: 1 },    
    { drum: 'kick', time: 15600, lane: 0 },          // 6. kick + open hi-hat
    { drum: 'openHiHat', time: 15600, lane: 1 },    
    { drum: 'snare', time: 16200, lane: 2 },        // 7. snare + open hi-hat
    { drum: 'openHiHat', time: 16200, lane: 1 },    
    { drum: 'openHiHat', time: 16800, lane: 1 },    // 8. open hi-hat

    // Bar 4 (17400-22200ms) - same pattern
    { drum: 'kick', time: 17400, lane: 0 },          // 1. kick + open hi-hat
    { drum: 'openHiHat', time: 17400, lane: 1 },    
    { drum: 'openHiHat', time: 18000, lane: 1 },    // 2. open hi-hat
    { drum: 'snare', time: 18600, lane: 2 },        // 3. snare + open hi-hat
    { drum: 'openHiHat', time: 18600, lane: 1 },    
    { drum: 'openHiHat', time: 19200, lane: 1 },    // 4. open hi-hat
    { drum: 'kick', time: 19800, lane: 0 },          // 5. kick + open hi-hat
    { drum: 'openHiHat', time: 19800, lane: 1 },    
    { drum: 'kick', time: 20400, lane: 0 },          // 6. kick + open hi-hat
    { drum: 'openHiHat', time: 20400, lane: 1 },    
    { drum: 'snare', time: 21000, lane: 2 },        // 7. snare + open hi-hat
    { drum: 'openHiHat', time: 21000, lane: 1 },    
    { drum: 'openHiHat', time: 21600, lane: 1 },    // 8. open hi-hat
  ],
};

export const BEAT_MAPS = {
  basicRock: BASIC_ROCK_BEAT_MAP,
  countryRock: COUNTRY_ROCK_BEAT_MAP,
  heavyRock: HEAVY_ROCK_BEAT_MAP,
}; 