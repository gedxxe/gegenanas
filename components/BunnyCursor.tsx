import React, { useEffect, useRef } from 'react';

const BunnyCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    // 1. Track actual mouse position
    const moveHandler = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', moveHandler);

    // 2. Animation loop with 12 FPS throttle for retro feel
    const animate = (time: number) => {
      if (time - lastTimeRef.current > 1000 / 12) { // ~83ms
        if (cursorRef.current) {
          cursorRef.current.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px)`;
        }
        lastTimeRef.current = time;
      }
      requestRef.current = requestAnimationFrame(animate);
    };
    
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', moveHandler);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div 
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
      style={{ 
        willChange: 'transform',
        marginTop: '-12px', // Offset to center bunny on pointer
        marginLeft: '-12px'
      }}
    >
      {/* SVG Pixel Bunny */}
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path d="M7 2H10V4H11V7H13V4H14V2H17V5H18V7H19V8H20V12H21V18H18V19H17V21H14V22H10V21H7V19H6V18H3V12H4V8H5V7H6V5H7V2Z" fill="white"/>
         <path d="M11 10H13V12H11V10Z" fill="#FF69B4"/>
         <path d="M15 10H17V12H15V10Z" fill="#FF69B4"/>
      </svg>
    </div>
  );
};

export default BunnyCursor;