import React from 'react';

export const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-brand-dark">
      {/* Main Radial Gradient */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-purple/20 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-brand-cyan/10 rounded-full blur-[100px] animate-pulse-slow delay-1000" />
      
      {/* Subtle Mesh/Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] opacity-20 pointer-events-none" />
      
      {/* Ambient center light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,231,255,0.03)_0%,transparent_70%)] pointer-events-none" />
    </div>
  );
};