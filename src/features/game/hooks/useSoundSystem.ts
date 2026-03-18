import { useState, useCallback, useRef, useEffect } from 'react';
import { SoundSettings } from '@/types/game';

const DEFAULT_SETTINGS: SoundSettings = {
  volume: 50,
  isMuted: false,
  ambientEnabled: true,
};

export const useSoundSystem = () => {
  const [settings, setSettings] = useState<SoundSettings>(() => {
    const saved = localStorage.getItem('soundSettings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const ambientAudioRef = useRef<HTMLAudioElement | null>(null);

  // Salvar configurações no localStorage
  useEffect(() => {
    localStorage.setItem('soundSettings', JSON.stringify(settings));
  }, [settings]);

  const setVolume = useCallback((volume: number) => {
    setSettings(prev => ({ ...prev, volume: Math.max(0, Math.min(100, volume)) }));
    if (ambientAudioRef.current) {
      ambientAudioRef.current.volume = volume / 100;
    }
  }, []);

  const toggleMute = useCallback(() => {
    setSettings(prev => ({ ...prev, isMuted: !prev.isMuted }));
    if (ambientAudioRef.current) {
      ambientAudioRef.current.muted = !settings.isMuted;
    }
  }, [settings.isMuted]);

  const toggleAmbient = useCallback(() => {
    setSettings(prev => ({ ...prev, ambientEnabled: !prev.ambientEnabled }));
  }, []);

  const playAmbient = useCallback((src: string) => {
    if (ambientAudioRef.current) {
      ambientAudioRef.current.pause();
    }
    
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = settings.volume / 100;
    audio.muted = settings.isMuted;
    
    if (settings.ambientEnabled) {
      audio.play().catch(console.error);
    }
    
    ambientAudioRef.current = audio;
  }, [settings]);

  const stopAmbient = useCallback(() => {
    if (ambientAudioRef.current) {
      ambientAudioRef.current.pause();
      ambientAudioRef.current = null;
    }
  }, []);

  const playSfx = useCallback((src: string) => {
    if (settings.isMuted) return;
    
    const audio = new Audio(src);
    audio.volume = settings.volume / 100;
    audio.play().catch(console.error);
  }, [settings.isMuted, settings.volume]);

  return {
    settings,
    setVolume,
    toggleMute,
    toggleAmbient,
    playAmbient,
    stopAmbient,
    playSfx,
  };
};
