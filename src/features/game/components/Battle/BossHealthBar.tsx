import { Skull } from 'lucide-react';

interface BossHealthBarProps {
  health: number; // 0-100
  maxHealth?: number;
  bossName?: string;
}

const BossHealthBar = ({ health, maxHealth = 100, bossName = 'Chefão' }: BossHealthBarProps) => {
  const healthPercentage = (health / maxHealth) * 100;
  
  // Intensidade do roxo baseada na vida
  const getHealthColor = () => {
    if (healthPercentage > 60) return 'bg-purple-500';
    if (healthPercentage > 30) return 'bg-purple-600';
    return 'bg-purple-700';
  };

  const getBarShadow = () => {
    if (healthPercentage > 60) return 'shadow-[0_0_10px_rgba(168,85,247,0.5)]';
    if (healthPercentage > 30) return 'shadow-[0_0_10px_rgba(147,51,234,0.5)]';
    return 'shadow-[0_0_15px_rgba(126,34,206,0.7)]';
  };

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className={`relative w-40 h-6 bg-gray-900/90 rounded-full overflow-hidden border-2 border-purple-400/50 ${getBarShadow()}`}>
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
      <Skull className="w-8 h-8 text-purple-500 drop-shadow-lg" />
    </div>
  );
};

export default BossHealthBar;
