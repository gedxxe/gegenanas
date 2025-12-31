import React from 'react';
import { MESSAGE } from '../constants';
import Typewriter from './Typewriter';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-[#fff0f5] border-4 border-pink-500 p-1 shadow-[10px_10px_0px_0px_rgba(0,0,0,0.5)] animate-[popIn_0.3s_ease-out]">
        <div className="border-2 border-pink-300 p-4 md:p-8 max-h-[80vh] overflow-y-auto">
          
          <div className="mb-6 text-center border-b-4 border-pink-200 pb-4">
            <h2 className="text-pink-600 text-lg md:text-xl">MESSAGE FROM GEDE</h2>
          </div>

          <div className="text-pink-900 text-xs md:text-sm font-bold">
            <Typewriter text={MESSAGE} speed={40} />
            <span className="inline-block w-2 h-4 bg-pink-500 ml-1 animate-pulse"></span>
          </div>

          <div className="mt-8 text-center">
             <button 
               onClick={onClose}
               className="bg-pink-500 hover:bg-pink-600 text-white py-3 px-6 text-xs uppercase border-b-4 border-r-4 border-pink-800 active:border-0 active:translate-y-1"
             >
               Close Message
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;