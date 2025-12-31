export interface CoupleProps {
  name: string;
  imageSrc: string;
}

export type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
};