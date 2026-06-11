import { useCallback, useRef } from 'react';
import { SoundEffect } from '@/types';

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioContext) {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioContext = new AudioCtx();
      }
    } catch {
      return null;
    }
  }
  return audioContext;
}

export function useSoundEffects() {
  const activeNodesRef = useRef<{ osc: OscillatorNode; gain: GainNode }[]>([]);

  const stopAll = useCallback(() => {
    activeNodesRef.current.forEach(({ osc, gain }) => {
      try {
        gain.gain.cancelScheduledValues(audioContext!.currentTime);
        gain.gain.setValueAtTime(gain.gain.value, audioContext!.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioContext!.currentTime + 0.05);
        osc.stop(audioContext!.currentTime + 0.05);
      } catch {}
    });
    activeNodesRef.current = [];
  }, []);

  const playSound = useCallback((sound: SoundEffect) => {
    if (!sound || sound.volume === 0 || sound.duration === 0) return;

    const ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    try {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = sound.type;
      oscillator.frequency.setValueAtTime(sound.frequencyStart, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        Math.max(sound.frequencyEnd, 1),
        ctx.currentTime + sound.duration
      );

      gainNode.gain.setValueAtTime(0.0001, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(sound.volume, ctx.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + sound.duration);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + sound.duration + 0.05);

      activeNodesRef.current.push({ osc: oscillator, gain: gainNode });

      setTimeout(() => {
        activeNodesRef.current = activeNodesRef.current.filter(
          (n) => n.osc !== oscillator
        );
      }, (sound.duration + 0.1) * 1000);
    } catch {}
  }, []);

  const playRollSound = useCallback((sound: SoundEffect) => {
    playSound(sound);
    if (sound.volume > 0 && sound.duration > 0) {
      setTimeout(() => playSound(sound), 400);
      setTimeout(() => playSound(sound), 800);
    }
  }, [playSound]);

  const playStopSound = useCallback((sound: SoundEffect) => {
    stopAll();
    playSound(sound);
  }, [playSound, stopAll]);

  const previewSound = useCallback((sound: SoundEffect) => {
    stopAll();
    playSound(sound);
  }, [playSound, stopAll]);

  return {
    playSound,
    playRollSound,
    playStopSound,
    previewSound,
    stopAll,
  };
}
