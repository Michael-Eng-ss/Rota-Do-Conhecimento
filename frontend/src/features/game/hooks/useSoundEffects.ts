import { useCallback, useRef } from 'react';

type SoundType = 'correct' | 'wrong' | 'click' | 'victory' | 'defeat';

export const useSoundEffects = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3) => {
    const audioContext = getAudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  }, [getAudioContext]);

  const playCorrectSound = useCallback(() => {
    const audioContext = getAudioContext();
    const now = audioContext.currentTime;
    
    // Acorde ascendente alegre (C-E-G)
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, now + i * 0.08);
      
      gainNode.gain.setValueAtTime(0, now + i * 0.08);
      gainNode.gain.linearRampToValueAtTime(0.25, now + i * 0.08 + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.3);
      
      oscillator.start(now + i * 0.08);
      oscillator.stop(now + i * 0.08 + 0.3);
    });

    // Som de "bling" adicional
    setTimeout(() => {
      playTone(1046.50, 0.15, 'sine', 0.2);
    }, 200);
  }, [getAudioContext, playTone]);

  const playWrongSound = useCallback(() => {
    const audioContext = getAudioContext();
    const now = audioContext.currentTime;
    
    // Som de erro (buzzer descendente)
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(200, now);
    oscillator.frequency.exponentialRampToValueAtTime(100, now + 0.3);
    
    gainNode.gain.setValueAtTime(0.15, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    
    oscillator.start(now);
    oscillator.stop(now + 0.3);

    // Segundo tom para efeito de "buzzz"
    setTimeout(() => {
      const osc2 = audioContext.createOscillator();
      const gain2 = audioContext.createGain();
      
      osc2.connect(gain2);
      gain2.connect(audioContext.destination);
      
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(150, audioContext.currentTime);
      
      gain2.gain.setValueAtTime(0.1, audioContext.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      
      osc2.start(audioContext.currentTime);
      osc2.stop(audioContext.currentTime + 0.2);
    }, 100);
  }, [getAudioContext]);

  const playVictorySound = useCallback(() => {
    const audioContext = getAudioContext();
    const now = audioContext.currentTime;
    
    // Fanfarra de vitória
    const notes = [523.25, 659.25, 783.99, 1046.50, 783.99, 1046.50];
    const durations = [0.15, 0.15, 0.15, 0.3, 0.15, 0.4];
    
    let time = 0;
    notes.forEach((freq, i) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, now + time);
      
      gainNode.gain.setValueAtTime(0.25, now + time);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + time + durations[i]);
      
      oscillator.start(now + time);
      oscillator.stop(now + time + durations[i]);
      
      time += durations[i] * 0.8;
    });
  }, [getAudioContext]);

  const playDefeatSound = useCallback(() => {
    const audioContext = getAudioContext();
    const now = audioContext.currentTime;
    
    // Som triste descendente
    const notes = [392, 349.23, 329.63, 293.66];
    
    notes.forEach((freq, i) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, now + i * 0.25);
      
      gainNode.gain.setValueAtTime(0.2, now + i * 0.25);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + i * 0.25 + 0.4);
      
      oscillator.start(now + i * 0.25);
      oscillator.stop(now + i * 0.25 + 0.4);
    });
  }, [getAudioContext]);

  const playClickSound = useCallback(() => {
    playTone(800, 0.05, 'sine', 0.1);
  }, [playTone]);

  const playSound = useCallback((type: SoundType) => {
    switch (type) {
      case 'correct':
        playCorrectSound();
        break;
      case 'wrong':
        playWrongSound();
        break;
      case 'victory':
        playVictorySound();
        break;
      case 'defeat':
        playDefeatSound();
        break;
      case 'click':
        playClickSound();
        break;
    }
  }, [playCorrectSound, playWrongSound, playVictorySound, playDefeatSound, playClickSound]);

  return {
    playSound,
    playCorrectSound,
    playWrongSound,
    playVictorySound,
    playDefeatSound,
    playClickSound,
  };
};
