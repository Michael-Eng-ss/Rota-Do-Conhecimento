export interface Character {
  id: string;
  name: string;
  image: string;
  position: 'left' | 'center' | 'right';
}

export interface Scene {
  id: number;
  background: string;
  characters: Character[];
  speaker?: string;
  dialogue?: string;
  showButtons?: boolean;
  buttonLabels?: {
    advance?: string;
    skip?: string;
  };
}

export interface VisualNovelState {
  currentSceneIndex: number;
  isTransitioning: boolean;
}
