import { cn } from '@/lib/utils';

interface DifficultyCardProps {
  label: string;
  color: 'green' | 'yellow' | 'red';
  onClick?: () => void;
  className?: string;
}

const DifficultyCard = ({ label, color, onClick, className }: DifficultyCardProps) => {
  const colorClasses = {
    green: 'bg-green-600 hover:bg-green-500 border-green-400',
    yellow: 'bg-amber-500 hover:bg-amber-400 border-amber-300',
    red: 'bg-red-800 hover:bg-red-700 border-red-600'
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-32 md:w-40 h-48 md:h-64 rounded-xl border-4 shadow-2xl',
        'flex items-center justify-center',
        'transition-all duration-300 hover:scale-105 active:scale-95',
        'cursor-pointer',
        colorClasses[color],
        className
      )}
    >
      <span 
        className="text-2xl md:text-3xl font-bold text-white italic drop-shadow-lg"
        style={{ fontFamily: "'Brush Script MT', cursive, serif" }}
      >
        {label}
      </span>
    </button>
  );
};

export default DifficultyCard;
