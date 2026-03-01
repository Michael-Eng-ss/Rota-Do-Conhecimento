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
  const baseClasses = "font-semibold rounded-lg transition-all duration-200 tracking-wide";
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-8 py-3 text-base',
    lg: 'px-12 py-4 text-lg'
  };

  const variantClasses = {
    primary: 'bg-gray-800 hover:bg-gray-900 text-white border border-gray-700 shadow-md hover:shadow-lg active:scale-[0.98]',
    secondary: 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 shadow-md hover:shadow-lg active:scale-[0.98]',
    outline: 'bg-transparent text-white border border-white/40 hover:bg-white/10 active:scale-[0.98]',
    link: 'bg-transparent text-white underline underline-offset-4 shadow-none hover:text-white/80 decoration-white/50'
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
