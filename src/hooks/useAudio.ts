import { useEffect } from 'react';
import { AudioManager } from '../utils/AudioManager';

export const useAudio = (
  enabled: boolean,
  shouldPlay: boolean,
  soundType: 'flatline' | 'panic',
  interval: number = 0
) => {
  useEffect(() => {
    const audioManager = AudioManager.getInstance();

    const handleAudio = async () => {
      if (enabled && shouldPlay) {
        if (interval > 0) {
          await audioManager.playWithInterval(soundType, interval);
        } else {
          await audioManager.play(soundType, true);
        }
      } else {
        audioManager.stop(soundType);
      }
    };

    handleAudio();

    return () => {
      audioManager.stop(soundType);
    };
  }, [enabled, shouldPlay, soundType, interval]);
};