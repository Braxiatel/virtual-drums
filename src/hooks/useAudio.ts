import { useEffect, useRef, useCallback } from 'react';
import { Howl } from 'howler';
import { DrumType, DRUM_KIT_CONFIG } from '../lib/constants';
import { useDrumStore } from '../stores/drumStore';

type AudioManager = Record<DrumType, Howl>;

export const useAudio = () => {
  const audioManagerRef = useRef<AudioManager | null>(null);
  const { audio, latencyOffset } = useDrumStore();

  // Initialize audio samples
  useEffect(() => {
    const audioManager = {} as AudioManager;

    // Load each drum sample
    (Object.entries(DRUM_KIT_CONFIG) as [DrumType, typeof DRUM_KIT_CONFIG[DrumType]][]).forEach(([drumType, config]) => {
      audioManager[drumType] = new Howl({
        src: [config.audioFile],
        volume: audio.volume,
        preload: true,
        format: ['wav'],
        html5: false, // Use Web Audio API for lower latency
      });
    });

    audioManagerRef.current = audioManager;

    // Cleanup function
    return () => {
      Object.values(audioManager).forEach((howl) => {
        howl.unload();
      });
    };
  }, [audio.volume]);

  // Update volume when audio settings change
  useEffect(() => {
    if (!audioManagerRef.current) return;

    Object.values(audioManagerRef.current).forEach((howl) => {
      howl.volume(audio.muted ? 0 : audio.volume);
    });
  }, [audio.volume, audio.muted]);

  // Handle solo track
  useEffect(() => {
    if (!audioManagerRef.current) return;

    (Object.entries(audioManagerRef.current) as [DrumType, Howl][]).forEach(([drumType, howl]) => {
      const isSolo = audio.soloTrack === drumType;
      const shouldMute = audio.soloTrack && !isSolo;
      howl.volume(shouldMute ? 0 : audio.muted ? 0 : audio.volume);
    });
  }, [audio.soloTrack, audio.volume, audio.muted]);

  const playDrum = useCallback((drum: DrumType) => {
    if (!audioManagerRef.current) return;

    const howl = audioManagerRef.current[drum];
    if (howl) {
      // Apply latency offset
      if (latencyOffset > 0) {
        setTimeout(() => howl.play(), latencyOffset);
      } else {
        howl.play();
      }
    }
  }, [latencyOffset]);

  const stopDrum = useCallback((drum: DrumType) => {
    if (!audioManagerRef.current) return;

    const howl = audioManagerRef.current[drum];
    if (howl) {
      howl.stop();
    }
  }, []);

  const stopAllDrums = useCallback(() => {
    if (!audioManagerRef.current) return;

    Object.values(audioManagerRef.current).forEach((howl) => {
      howl.stop();
    });
  }, []);

  return {
    playDrum,
    stopDrum,
    stopAllDrums,
    isLoaded: !!audioManagerRef.current,
  };
}; 