// Sistema de som tipado para todo o projeto
export interface SoundSettings {
  volume: number; // 0-100
  isMuted: boolean;
  ambientEnabled: boolean;
}

export interface GameState {
  health: number; // 0-100
  currentEnvironment: 1 | 2 | 3;
  soundSettings: SoundSettings;
}

export type EnvironmentId = 1 | 2 | 3;

export interface EnvironmentData {
  id: EnvironmentId;
  name: string;
  background: string;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  damage: number;
}

export interface MenuOption {
  id: string;
  label: string;
  action: () => void;
}
