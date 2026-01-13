interface GameFormCardProps {
  children: React.ReactNode;
  title?: string;
  variant?: 'blue' | 'green';
}

const GameFormCard = ({ children, title, variant = 'blue' }: GameFormCardProps) => {
  const bgClasses = {
    blue: 'bg-primary/80',
    green: 'bg-green-600/80'
  };

  return (
    <div className={`${bgClasses[variant]} backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-2xl border-2 border-white/20 w-full max-w-md mx-auto`}>
      {title && (
        <div className="bg-white rounded-xl px-6 py-3 mb-6 text-center shadow-md">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">{title}</h2>
        </div>
      )}
      {children}
    </div>
  );
};

export default GameFormCard;
