import { Volume2, VolumeX } from 'lucide-react';

interface SoundButtonProps {
  isMuted: boolean;
  onToggle: () => void;
}

const SoundButton = ({ isMuted, onToggle }: SoundButtonProps) => {
  return (
    <button
      onClick={onToggle}
      className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
      aria-label={isMuted ? 'Ativar som' : 'Desativar som'}
    >
      {isMuted ? (
        <VolumeX className="w-5 h-5 text-primary-foreground" />
      ) : (
        <Volume2 className="w-5 h-5 text-primary-foreground" />
      )}
    </button>
  );
};

export default SoundButton;
