interface SkipButtonProps {
  label?: string;
  onClick?: () => void;
}

const SkipButton = ({ label = 'Pular', onClick }: SkipButtonProps) => {
  return (
    <button 
      className="vn-skip-button"
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default SkipButton;
