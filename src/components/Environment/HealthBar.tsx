import { Heart } from 'lucide-react';

interface HealthBarProps {
  health: number; // 0-100
  maxHealth?: number;
}

const HealthBar = ({ health, maxHealth = 100 }: HealthBarProps) => {
  const healthPercentage = (health / maxHealth) * 100;
  
  // Cores baseadas na vida
  const getHealthColor = () => {
    if (healthPercentage > 60) return 'bg-green-500';
    if (healthPercentage > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex items-center gap-2">
      <Heart className="w-6 h-6 text-red-500 fill-red-500" />
      <div className="relative w-32 h-4 bg-gray-800/80 rounded-full overflow-hidden border-2 border-white/30">
        <div
          className={`absolute top-0 left-0 h-full transition-all duration-500 ${getHealthColor()}`}
          style={{ width: `${healthPercentage}%` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
      </div>
    </div>
  );
};

export default HealthBar;
