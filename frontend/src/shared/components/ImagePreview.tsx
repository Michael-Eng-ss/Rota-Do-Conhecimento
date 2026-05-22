import { useState } from 'react';
import { ImageIcon, X, ZoomIn, Loader2 } from 'lucide-react';

interface ImagePreviewProps {
  src: string | null | undefined;
  alt?: string;
  className?: string;
  /** Se true, exibe em tamanho pequeno (thumbnail) */
  thumbnail?: boolean;
  /** Se true, permite lightbox/zoom ao clicar */
  zoomable?: boolean;
}

/**
 * Componente reutilizável para preview de imagens.
 * - Exibe thumbnail ou tamanho normal
 * - Suporta lightbox/zoom em tela cheia
 * - Fallback para ícone quando sem imagem
 * - Animação de loading
 */
const ImagePreview = ({ src, alt = 'Imagem', className = '', thumbnail = false, zoomable = true }: ImagePreviewProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  if (!src || hasError) {
    return (
      <div className={`flex items-center justify-center bg-slate-800/50 border border-slate-700/50 rounded-lg ${
        thumbnail ? 'w-12 h-12' : 'w-full h-48'
      } ${className}`}>
        <ImageIcon className={`text-slate-500 ${thumbnail ? 'w-5 h-5' : 'w-10 h-10'}`} />
      </div>
    );
  }

  return (
    <>
      <div
        className={`relative overflow-hidden rounded-lg border border-slate-700/50 bg-slate-800/50 group ${
          thumbnail ? 'w-12 h-12' : 'w-full'
        } ${zoomable ? 'cursor-pointer' : ''} ${className}`}
        onClick={() => zoomable && setIsZoomed(true)}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-800/80 z-10">
            <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
          </div>
        )}
        <img
          src={src}
          alt={alt}
          className={`object-cover transition-all duration-300 ${
            thumbnail ? 'w-full h-full' : 'w-full max-h-64'
          } ${isLoading ? 'opacity-0' : 'opacity-100'} group-hover:scale-105`}
          onLoad={() => setIsLoading(false)}
          onError={() => { setHasError(true); setIsLoading(false); }}
        />
        {zoomable && !thumbnail && !isLoading && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100">
            <ZoomIn className="w-8 h-8 text-white drop-shadow-lg" />
          </div>
        )}
      </div>

      {/* Lightbox */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsZoomed(false)}
        >
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <img
            src={src}
            alt={alt}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};

export default ImagePreview;
