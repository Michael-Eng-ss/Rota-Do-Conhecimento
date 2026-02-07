import { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface EnvironmentMenuProps {
  onBackToPatio: () => void;
  onHelp: () => void;
}

const EnvironmentMenu = ({ onBackToPatio, onHelp }: EnvironmentMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
        aria-label="Menu"
      >
        {isOpen ? (
          <X className="w-5 h-5 text-primary-foreground" />
        ) : (
          <Menu className="w-5 h-5 text-primary-foreground" />
        )}
      </button>

      {isOpen && (
        <div className="absolute top-12 left-0 bg-white rounded-xl shadow-xl overflow-hidden min-w-40 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
          <button
            onClick={() => {
              onBackToPatio();
              setIsOpen(false);
            }}
            className="w-full px-4 py-3 text-left text-gray-800 font-semibold hover:bg-gray-100 transition-colors border-b border-gray-100"
          >
            Voltar ao Pátio
          </button>
          <button
            onClick={() => {
              onHelp();
              setIsOpen(false);
            }}
            className="w-full px-4 py-3 text-left text-gray-800 font-semibold hover:bg-gray-100 transition-colors"
          >
            Ajuda
          </button>
        </div>
      )}
    </div>
  );
};

export default EnvironmentMenu;
