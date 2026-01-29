import { useState } from 'react';
import { Menu, X, LogOut } from 'lucide-react';

interface MenuButtonProps {
  onClick?: () => void;
  onExit?: () => void;
}

const MenuButton = ({ onClick, onExit }: MenuButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    onClick?.();
  };

  const handleExit = () => {
    setIsOpen(false);
    onExit?.();
  };

  return (
    <div className="relative">
      <button 
        className="vn-menu-button"
        onClick={handleToggle}
        aria-label="Menu"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-primary-foreground" />
        ) : (
          <Menu className="w-6 h-6 text-primary-foreground" />
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-background/95 backdrop-blur-sm rounded-lg shadow-xl border border-border overflow-hidden min-w-[150px] z-50">
          {onExit && (
            <button
              onClick={handleExit}
              className="flex items-center gap-2 w-full px-4 py-3 text-left text-foreground hover:bg-muted transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MenuButton;
