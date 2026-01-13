import { MapPin } from 'lucide-react';

const GameHeader = () => {
  return (
    <div className="flex justify-center">
      <div className="relative bg-white/90 backdrop-blur-sm rounded-full px-8 py-4 shadow-xl flex items-center gap-4">
        <MapPin className="w-8 h-8 text-red-500 fill-red-400" />
        <h1 
          className="text-3xl md:text-4xl font-bold italic text-foreground"
          style={{ fontFamily: "'Brush Script MT', cursive, serif" }}
        >
          Rota do Conhecimento
        </h1>
        <MapPin className="w-8 h-8 text-red-500 fill-red-400" />
      </div>
    </div>
  );
};

export default GameHeader;
