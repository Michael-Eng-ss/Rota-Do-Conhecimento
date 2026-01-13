import { Menu } from 'lucide-react';

interface MenuButtonProps {
  onClick?: () => void;
}

const MenuButton = ({ onClick }: MenuButtonProps) => {
  return (
    <button 
      className="vn-menu-button"
      onClick={onClick}
      aria-label="Menu"
    >
      <Menu className="w-6 h-6 text-primary-foreground" />
    </button>
  );
};

export default MenuButton;
