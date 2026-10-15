import React, { useEffect, useState } from 'react';

interface ReadingRulerProps {
  enabled: boolean;
  height: number;
}

export const ReadingRuler: React.FC<ReadingRulerProps> = ({ enabled, height }) => {
  const [mouseY, setMouseY] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    if (!enabled) {
      setIsVisible(false);
      setMouseY(null);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMouseY(e.clientY);
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      setMouseY(null);
    };

    const handleMouseEnter = (e: MouseEvent) => {
      setMouseY(e.clientY);
      setIsVisible(true);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        setMouseY(e.touches[0].clientY);
        setIsVisible(true);
      }
    };

    const handleTouchEnd = () => {
      setIsVisible(false);
      setMouseY(null);
    };

    const handleBlur = () => {
      setIsVisible(false);
      setMouseY(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleTouchEnd);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
      window.removeEventListener('blur', handleBlur);
    };
  }, [enabled]);

  // If ruler is not enabled, or pointer has not entered screen, or mouse is out:
  // Render absolutely nothing so no dimming overlay ever stays on screen!
  if (!enabled || !isVisible || mouseY === null) {
    return null;
  }

  const halfHeight = height / 2;
  const topCutoff = Math.max(0, mouseY - halfHeight);
  const bottomStart = mouseY + halfHeight;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-35 transition-opacity duration-150"
      aria-hidden="true"
    >
      {/* Top shaded veil */}
      <div
        className="absolute top-0 left-0 right-0 bg-stone-900/35 backdrop-blur-[0.5px] transition-all duration-75"
        style={{ height: `${topCutoff}px` }}
      />

      {/* Focus guide window */}
      <div
        className="absolute left-0 right-0 border-y-2 border-amber-500/80 bg-amber-400/10 shadow-[0_0_12px_rgba(245,158,11,0.2)] transition-all duration-75 pointer-events-none"
        style={{
          top: `${topCutoff}px`,
          height: `${height}px`,
        }}
      >
        <div className="absolute right-4 top-1 text-[11px] font-semibold uppercase tracking-wider text-amber-700 bg-amber-100/90 px-2 py-0.5 rounded shadow-xs">
          Reading Guide
        </div>
      </div>

      {/* Bottom shaded veil */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-stone-900/35 backdrop-blur-[0.5px] transition-all duration-75"
        style={{ top: `${bottomStart}px` }}
      />
    </div>
  );
};
