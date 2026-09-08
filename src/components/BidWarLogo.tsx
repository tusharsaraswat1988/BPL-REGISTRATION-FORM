import React from 'react';

interface BidWarLogoProps {
  className?: string;
  variant?: 'full' | 'compact' | 'footer';
  height?: number | string;
}

export const BidWarLogo: React.FC<BidWarLogoProps> = ({ 
  className = '', 
  variant = 'full',
  height = 42 
}) => {
  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <img
        src="/bidwar-logo.png"
        alt="BidWar — From Auction to Champion"
        className="h-auto w-auto max-h-[46px] object-contain drop-shadow-[0_2px_8px_rgba(255,184,0,0.15)]"
        style={{ height: typeof height === 'number' ? `${height}px` : height }}
        loading="eager"
        onError={(e) => {
          // Fallback to official remote URL if local asset has any issue
          const target = e.currentTarget;
          if (target.src !== 'https://bidwar.in/bidwar-primary-logo.png') {
            target.src = 'https://bidwar.in/bidwar-primary-logo.png';
          }
        }}
      />
    </div>
  );
};
