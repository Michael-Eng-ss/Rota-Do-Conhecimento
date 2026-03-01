import { forwardRef } from 'react';
import { MapPin } from 'lucide-react';

const GameHeader = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div ref={ref} className="flex justify-center animate-fade-in">
      <div className="relative bg-gradient-to-b from-white to-gray-100 rounded-2xl px-10 md:px-14 py-5 md:py-6 shadow-[0_4px_30px_rgba(0,0,0,0.15)] border border-gray-200/80">
        {/* Subtle top accent line */}
        <div className="absolute top-0 left-8 right-8 h-[3px] bg-gradient-to-r from-transparent via-red-600 to-transparent rounded-full" />
        
        <div className="flex items-center gap-5">
          <MapPin className="w-7 h-7 md:w-8 md:h-8 text-red-600 fill-red-500" />
          
          <div className="flex flex-col items-center">
            <h1 className="text-2xl md:text-4xl font-bold tracking-wide text-gray-800"
              style={{ fontFamily: "'Georgia', 'Times New Roman', serif", letterSpacing: '0.05em' }}
            >
              Rota do Conhecimento
            </h1>
            <div className="w-24 h-[2px] bg-red-600/60 mt-1 rounded-full" />
          </div>
          
          <MapPin className="w-7 h-7 md:w-8 md:h-8 text-red-600 fill-red-500" />
        </div>
      </div>
    </div>
  );
});

GameHeader.displayName = 'GameHeader';

export default GameHeader;
