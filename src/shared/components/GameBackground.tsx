import universidadeImg from '@/assets/backgrounds/universidade.jpg';

interface GameBackgroundProps {
  children: React.ReactNode;
  image?: string;
}

const GameBackground = ({ children, image }: GameBackgroundProps) => {
  return (
    <div 
      className="relative w-full min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${image || universidadeImg})` }}
    >
      <div className="absolute inset-0 bg-black/10" />
      <div className="relative z-10 w-full min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default GameBackground;
