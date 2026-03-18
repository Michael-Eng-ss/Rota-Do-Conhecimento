import { Input } from '@/components/ui/input';

interface GameInputProps {
  label?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const GameInput = ({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange,
  className = ''
}: GameInputProps) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-white font-bold text-lg mb-2 drop-shadow-md">
          {label}
        </label>
      )}
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-white/90 border-2 border-white/50 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground shadow-lg focus:ring-2 focus:ring-primary"
      />
    </div>
  );
};

export default GameInput;
