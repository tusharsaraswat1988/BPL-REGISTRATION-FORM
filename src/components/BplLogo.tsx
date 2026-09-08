import React from 'react';

interface BplLogoProps {
  className?: string;
  size?: number | string;
  alt?: string;
}

export const BplLogo: React.FC<BplLogoProps> = ({ 
  className = '', 
  size = 56,
  alt = 'BidWar Premier League — 1st Edition Kids Box Cricket Official Logo' 
}) => {
  const dimensionStyle = typeof size === 'number' ? { width: `${size}px`, height: `${size}px` } : { width: size, height: size };

  return (
    <div 
      className={`inline-flex items-center justify-center select-none flex-shrink-0 relative ${className}`}
      style={dimensionStyle}
    >
      <img
        src="/bpl-logo.jpg"
        alt={alt}
        className="w-full h-full object-contain rounded-lg drop-shadow-[0_4px_12px_rgba(0,102,255,0.25)]"
        loading="eager"
      />
    </div>
  );
};
