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
        <label className="block text-gray-700 font-medium text-sm mb-1.5 tracking-wide uppercase">
          {label}
        </label>
      )}
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800 placeholder:text-gray-400 shadow-sm focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all"
      />
    </div>
  );
};

export default GameInput;
