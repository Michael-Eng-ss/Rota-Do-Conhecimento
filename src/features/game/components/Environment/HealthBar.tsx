import { Heart } from 'lucide-react';

interface HealthBarProps {
  health: number; // 0-100
  maxHealth?: number;
}

const HealthBar = ({ health, maxHealth = 100 }: HealthBarProps) => {
  const healthPercentage = (health / maxHealth) * 100;
  
  // Intensidade do vermelho baseada na vida
  const getHealthColor = () => {
    if (healthPercentage > 60) return 'bg-red-500';
    if (healthPercentage > 30) return 'bg-red-600';
    return 'bg-red-700';
  };

  const getBarShadow = () => {
    if (healthPercentage > 60) return 'shadow-[0_0_10px_rgba(239,68,68,0.5)]';
    if (healthPercentage > 30) return 'shadow-[0_0_10px_rgba(220,38,38,0.5)]';
    return 'shadow-[0_0_15px_rgba(185,28,28,0.7)]';
  };

  return (
    <div className="flex items-center gap-3">
      <Heart className="w-8 h-8 text-red-500 fill-red-500 drop-shadow-lg" />
      <div className="relative">
        <div className={`relative w-40 h-6 bg-gray-900/90 rounded-full overflow-hidden border-2 border-red-400/50 ${getBarShadow()}`}>
          <div
            className={`absolute top-0 left-0 h-full transition-all duration-500 ${getHealthColor()}`}
            style={{ width: `${healthPercentage}%` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent" />
          {/* Numeração centralizada */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white font-bold text-sm drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              {Math.round(health)} / {maxHealth}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthBar;
