import { useEffect, useCallback } from 'react';
import { DrumType } from '../lib/constants';
import { useDrumStore } from '../stores/drumStore';
import { useAudio } from './useAudio';

export const useKeyBindings = () => {
  const { keyBindings, hitDrum, releaseDrum } = useDrumStore();
  const { playDrum } = useAudio();

  // Create a reverse mapping from key to drum type
  const keyToDrumMap = useCallback(() => {
    const map = new Map<string, DrumType>();
    Object.entries(keyBindings).forEach(([drumType, key]) => {
      map.set(key.toLowerCase(), drumType as DrumType);
    });
    return map;
  }, [keyBindings]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Prevent default browser behavior for drum keys
    const key = event.key.toLowerCase();
    const keyMap = keyToDrumMap();
    const drum = keyMap.get(key);

    if (drum && !event.repeat) {
      event.preventDefault();
      hitDrum(drum);
      playDrum(drum);
    }
  }, [keyToDrumMap, hitDrum, playDrum]);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    const keyMap = keyToDrumMap();
    const drum = keyMap.get(key);

    if (drum) {
      event.preventDefault();
      // Add a slight delay before releasing visual feedback
      setTimeout(() => releaseDrum(drum), 100);
    }
  }, [keyToDrumMap, releaseDrum]);

  // Set up global keyboard event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Manual trigger function for clicking drum pads
  const triggerDrum = useCallback((drum: DrumType) => {
    hitDrum(drum);
    playDrum(drum);
    // Release after visual feedback duration
    setTimeout(() => releaseDrum(drum), 150);
  }, [hitDrum, playDrum, releaseDrum]);

  return {
    triggerDrum,
    keyToDrumMap: keyToDrumMap(),
  };
}; 