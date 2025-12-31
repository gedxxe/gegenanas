import React, { useState } from 'react';
import Background from './components/Background';
import CoupleSection from './components/CoupleSection';
import AudioPlayer from './components/AudioPlayer';
import Modal from './components/Modal';
import BunnyCursor from './components/BunnyCursor';

const App: React.FC = () => {
  const [started, setStarted] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleStart = () => {
    // Flash effect logic could go here
    setStarted(true);
    setShowModal(true);
  };

  return (
    <div className="relative h-screen w-full overflow-x-hidden overflow-y-auto text-pink-500 selection:bg-pink-300 selection:text-white cursor-none">
      {/* Retro Effects Layer */}
      <div className="scanlines"></div>
      <div className="crt-flicker fixed inset-0 pointer-events-none bg-pink-900/10 mix-blend-overlay z-40"></div>
      
      {/* Custom Cursor */}
      <BunnyCursor />

      <Background />
      <AudioPlayer shouldPlay={started} />

      {/* Main Content */}
      <main className="relative z-30 flex flex-col items-center justify-center min-h-screen px-4 pt-4 pb-24 md:pb-4">
        
        {/* Title */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-5xl text-white drop-shadow-[4px_4px_0_#ff69b4] mb-4">
            LEVEL 2026
          </h1>
          <p className="text-pink-300 text-xs md:text-sm animate-pulse tracking-widest">
            READY FOR LEVEL 2026 — WITH YOU
          </p>
        </div>

        <CoupleSection />

        {/* Start Button */}
        {!started ? (
           <button
             onClick={handleStart}
             className="mt-8 mb-8 md:mb-0 group relative inline-flex items-center justify-center px-8 py-4 bg-pink-500 text-white font-bold uppercase tracking-wider text-sm md:text-base border-4 border-white hover:bg-pink-400 hover:border-pink-200 hover:shadow-[0_0_20px_#ff69b4] transition-all duration-200 active:scale-95 cursor-none"
           >
             <span className="absolute inset-0 border-b-4 border-r-4 border-black/30"></span>
             <span className="relative blink">PRESS START</span>
           </button>
        ) : (
          <button
             onClick={() => setShowModal(true)}
             className="mt-8 mb-8 md:mb-0 px-6 py-3 bg-white/10 backdrop-blur border-2 border-pink-400 text-pink-200 text-xs hover:bg-white/20 transition-all cursor-none"
          >
             VIEW MESSAGE AGAIN
          </button>
        )}
      </main>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} />
      
      {/* Footer */}
      <footer className="fixed bottom-2 w-full text-center text-[10px] text-pink-800/50 z-30 pointer-events-none">
        © 2026 GEDE & NASYWA • PLAYER 1 & PLAYER 2
      </footer>
    </div>
  );
};

export default App;