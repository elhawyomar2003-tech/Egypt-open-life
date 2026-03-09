import React, { useRef, useState } from 'react';

export const Joystick = ({ onMove }: { onMove: (x: number, y: number) => void }) => {
  const joystickRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  const handleMove = (e: React.PointerEvent) => {
    if (!active) return;
    const rect = joystickRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    onMove(Math.max(-1, Math.min(1, x)), Math.max(-1, Math.min(1, y)));
  };

  return (
    <div 
      ref={joystickRef}
      className="absolute bottom-10 left-10 w-32 h-32 bg-white/20 rounded-full border-2 border-white/30 touch-none"
      onPointerDown={() => setActive(true)}
      onPointerUp={() => { setActive(false); onMove(0, 0); }}
      onPointerMove={handleMove}
      onPointerLeave={() => { setActive(false); onMove(0, 0); }}
    >
      <div className="absolute top-1/2 left-1/2 w-12 h-12 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
    </div>
  );
};
