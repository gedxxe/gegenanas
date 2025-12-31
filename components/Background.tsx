import React, { useEffect, useRef } from 'react';
import { Particle } from '../types';

const Background: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize handler
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.imageSmoothingEnabled = false; // Keep it pixelated
    };
    window.addEventListener('resize', resize);
    resize();

    // Game state
    let particles: Particle[] = [];
    let bunnyX = -50;
    let bunnyY = canvas.height - 100;
    let bunnyDirection = 1;
    let bunnyFrame = 0;

    // Helper: Draw Pixel Heart
    const drawHeart = (x: number, y: number, color: string, scale: number) => {
      ctx.fillStyle = color;
      const m = scale;
      // Simple 8-bit heart shape
      const heartPixels = [
        {x: 1, y: 0}, {x: 3, y: 0},
        {x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}, {x: 3, y: 1}, {x: 4, y: 1},
        {x: 0, y: 2}, {x: 1, y: 2}, {x: 2, y: 2}, {x: 3, y: 2}, {x: 4, y: 2},
        {x: 1, y: 3}, {x: 2, y: 3}, {x: 3, y: 3},
        {x: 2, y: 4}
      ];
      heartPixels.forEach(p => {
        ctx.fillRect(x + p.x * 4 * m, y + p.y * 4 * m, 4 * m, 4 * m);
      });
    };

    // Helper: Draw Pixel Bunny
    const drawBunny = (x: number, y: number, frame: number) => {
      ctx.fillStyle = '#FFFFFF'; // White bunny
      const scale = 3;
      // Offset Y for hop effect
      const hopY = frame % 2 === 0 ? 0 : -10;
      
      const body = [
        // Ears
        {x: 2, y: 0}, {x: 5, y: 0},
        {x: 2, y: 1}, {x: 5, y: 1},
        // Head
        {x: 1, y: 2}, {x: 2, y: 2}, {x: 3, y: 2}, {x: 4, y: 2}, {x: 5, y: 2}, {x: 6, y: 2},
        {x: 1, y: 3}, {x: 2, y: 3}, {x: 6, y: 3}, // Eyes (gaps)
        {x: 1, y: 4}, {x: 2, y: 4}, {x: 3, y: 4}, {x: 4, y: 4}, {x: 5, y: 4}, {x: 6, y: 4},
        // Body
        {x: 0, y: 5}, {x: 1, y: 5}, {x: 2, y: 5}, {x: 3, y: 5}, {x: 4, y: 5}, {x: 5, y: 5}, {x: 6, y: 5}, {x: 7, y: 5},
        {x: 0, y: 6}, {x: 1, y: 6}, {x: 2, y: 6}, {x: 3, y: 6}, {x: 4, y: 6}, {x: 5, y: 6}, {x: 6, y: 6}, {x: 7, y: 6},
        // Feet
        {x: 1, y: 7}, {x: 2, y: 7}, {x: 5, y: 7}, {x: 6, y: 7}
      ];

      body.forEach(p => {
        ctx.fillRect(x + p.x * 4 * scale, y + hopY + p.y * 4 * scale, 4 * scale, 4 * scale);
      });

      // Eyes (Pink)
      ctx.fillStyle = '#ff69b4';
      ctx.fillRect(x + 3 * 4 * scale, y + hopY + 3 * 4 * scale, 4 * scale, 4 * scale);
      ctx.fillRect(x + 5 * 4 * scale, y + hopY + 3 * 4 * scale, 4 * scale, 4 * scale);
    };

    // Animation Loop (Throttled to ~12 FPS for retro feel)
    let lastTime = 0;
    const fps = 12;
    const interval = 1000 / fps;

    const animate = (timestamp: number) => {
      requestAnimationFrame(animate);

      if (timestamp - lastTime < interval) return;
      lastTime = timestamp;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Spawn particles (Hearts)
      if (Math.random() < 0.1) {
        particles.push({
          x: Math.random() * canvas.width,
          y: canvas.height + 20,
          vx: (Math.random() - 0.5) * 2,
          vy: -(Math.random() * 5 + 2),
          color: Math.random() > 0.5 ? '#ff69b4' : '#ffc0cb',
          size: Math.random() * 0.5 + 0.5,
          life: 100
        });
      }

      // 2. Update and Draw Particles
      particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        drawHeart(p.x, p.y, p.color, p.size);
      });

      particles = particles.filter(p => p.life > 0 && p.y > -50);

      // 3. Bunny Logic
      bunnyX += 5 * bunnyDirection;
      bunnyFrame++;
      
      if (bunnyX > canvas.width + 50) {
        bunnyDirection = -1;
        // Flip logic not implemented in draw, just reset for simple loop
        bunnyX = -50; 
        bunnyDirection = 1; 
      }
      
      // Keep bunny on floor
      bunnyY = canvas.height - 120;
      drawBunny(bunnyX, bunnyY, bunnyFrame);

      // 4. Simple Stars
      ctx.fillStyle = '#fff';
      for(let i=0; i<10; i++) {
          const sx = (Math.sin(timestamp * 0.0001 + i) * canvas.width + canvas.width) / 2;
          const sy = (Math.cos(timestamp * 0.0002 + i) * canvas.height + canvas.height) / 2;
          ctx.fillRect(sx, sy, 4, 4);
      }
    };

    requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  );
};

export default Background;