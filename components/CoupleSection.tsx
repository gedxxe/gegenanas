import React from 'react';
import { IMAGES } from '../constants';

const Portrait: React.FC<{ src: string; name: string; alt: string }> = ({ src, name, alt }) => (
  <div className="flex flex-col items-center group">
    <div className="relative p-2 bg-pink-300 border-4 border-pink-600 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] transition-transform duration-300 group-hover:-translate-y-2">
      <div className="w-32 h-32 md:w-48 md:h-48 overflow-hidden bg-white border-2 border-pink-400">
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-cover pixelated rendering-pixelated" 
          style={{ imageRendering: 'pixelated' }}
        />
      </div>
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-2 h-2 bg-white"></div>
      <div className="absolute top-0 right-0 w-2 h-2 bg-white"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 bg-white"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 bg-white"></div>
    </div>
    <div className="mt-4 px-3 py-1 bg-black/50 backdrop-blur-sm border-2 border-pink-400 text-pink-200 text-xs md:text-sm uppercase tracking-widest opacity-80 group-hover:opacity-100 group-hover:text-white group-hover:shadow-[0_0_10px_#ff69b4] transition-all">
      {name}
    </div>
  </div>
);

const CoupleSection: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 mb-12 relative z-10">
      <Portrait src={IMAGES.gede} name="Gede" alt="Gede" />
      
      {/* Connecting Heart */}
      <div className="hidden md:block animate-pulse text-4xl text-pink-500">
        ❤️
      </div>

      <Portrait src={IMAGES.nasywa} name="Nasywa" alt="Nasywa" />
    </div>
  );
};

export default CoupleSection;