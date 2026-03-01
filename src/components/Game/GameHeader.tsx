import { MapPin, Sparkles } from 'lucide-react';

const GameHeader = () => {
  return (
    <div className="flex justify-center animate-fade-in">
      <div className="relative group">
        {/* Glow effect behind */}
        <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 rounded-full opacity-60 blur-lg group-hover:opacity-80 transition-opacity duration-500 animate-pulse" />
        
        {/* Main container */}
        <div className="relative bg-gradient-to-br from-white via-white to-yellow-50 backdrop-blur-sm rounded-full px-8 md:px-12 py-4 md:py-5 shadow-2xl flex items-center gap-4 border-2 border-yellow-300/50">
          {/* Decorative sparkles */}
          <Sparkles className="absolute -top-2 -left-1 w-5 h-5 text-yellow-400 animate-pulse" />
          <Sparkles className="absolute -bottom-1 -right-2 w-4 h-4 text-yellow-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
          
          <MapPin className="w-8 h-8 md:w-10 md:h-10 text-red-500 fill-red-400 drop-shadow-md animate-bounce" style={{ animationDuration: '2s' }} />
          
          <h1 className="text-3xl md:text-5xl font-extrabold italic bg-gradient-to-r from-gray-800 via-red-700 to-gray-800 bg-clip-text text-transparent drop-shadow-sm tracking-tight"
            style={{ fontFamily: "'Brush Script MT', cursive, serif" }}
          >
            Rota do Conhecimento
          </h1>
          
          <MapPin className="w-8 h-8 md:w-10 md:h-10 text-red-500 fill-red-400 drop-shadow-md animate-bounce" style={{ animationDuration: '2s', animationDelay: '0.3s' }} />
        </div>
      </div>
    </div>
  );
};

export default GameHeader;
