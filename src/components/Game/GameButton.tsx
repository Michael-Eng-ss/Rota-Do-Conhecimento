import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface GameButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'link';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

const GameButton = ({ 
  children, 
  onClick, 
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false
}: GameButtonProps) => {
  const baseClasses = "font-bold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg";
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-8 py-3 text-lg',
    lg: 'px-12 py-4 text-xl'
  };

  const variantClasses = {
    primary: 'bg-gradient-to-b from-primary to-primary/80 text-primary-foreground border-2 border-primary/60',
    secondary: 'bg-gradient-to-b from-white to-gray-100 text-foreground border-2 border-primary/40',
    outline: 'bg-transparent text-white border-2 border-white/50 hover:bg-white/10',
    link: 'bg-transparent text-white underline shadow-none hover:scale-100 hover:text-white/80'
  };

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {children}
    </Button>
  );
};

export default GameButton;
