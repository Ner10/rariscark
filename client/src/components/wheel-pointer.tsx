import React from 'react';

const WheelPointer: React.FC = () => {
  return (
    <div className="wheel-pointer absolute -top-12 left-1/2 -translate-x-1/2 w-12 h-20 z-20">
      {/* Golden diamond pointer with glowing effect */}
      <div className="w-full h-full">
        <svg width="100%" height="100%" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Glow effect */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          {/* Diamond shape */}
          <path 
            d="M20 0 L40 20 L20 60 L0 20 Z" 
            fill="url(#diamondGradient)"
            filter="url(#glow)"
            style={{ filter: 'drop-shadow(0px 0px 8px rgba(255, 215, 0, 0.8))' }}
          />
          
          {/* Highlight reflection */}
          <path 
            d="M20 5 L35 20 L20 50 L5 20 Z" 
            fill="url(#highlightGradient)"
            opacity="0.6"
          />
          
          <defs>
            <linearGradient id="diamondGradient" x1="20" y1="0" x2="20" y2="60" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#FFFFFF" />
              <stop offset="0.2" stopColor="#FFF7B5" />
              <stop offset="0.4" stopColor="#FFD700" />
              <stop offset="0.6" stopColor="#FDBB2D" />
              <stop offset="0.8" stopColor="#B8860B" />
              <stop offset="1" stopColor="#99712B" />
            </linearGradient>
            
            <linearGradient id="highlightGradient" x1="5" y1="5" x2="35" y2="50" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#FFFFFF" />
              <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export default WheelPointer;
