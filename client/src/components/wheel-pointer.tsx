import React from 'react';

const WheelPointer: React.FC = () => {
  return (
    <div className="wheel-pointer absolute -top-10 left-1/2 -translate-x-1/2 w-14 h-20 z-20">
      {/* Golden triangle pointer with glowing effect - rotated to point inward */}
      <div className="w-full h-full rotate-180">
        <svg width="100%" height="100%" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Glow effect */}
          <filter id="pointerGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          {/* Triangle shape - enlarged and pointing inward, perfectly centered */}
          <path 
            d="M20 0 L40 30 L0 30 Z" 
            fill="url(#pointerGradient)"
            filter="url(#pointerGlow)"
            style={{ filter: 'drop-shadow(0px 0px 6px rgba(255, 215, 0, 0.8))' }}
          />
          
          {/* Highlight reflection */}
          <path 
            d="M20 5 L35 25 L5 25 Z" 
            fill="url(#pointerHighlight)"
            opacity="0.7"
          />
          
          {/* Add a small circle/screw at the top of the pointer */}
          <circle 
            cx="20" 
            cy="5" 
            r="4" 
            fill="url(#screwGradient)"
            stroke="#B8860B"
            strokeWidth="0.5"
          />
          
          <defs>
            <linearGradient id="pointerGradient" x1="20" y1="0" x2="20" y2="25" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#FFF7D6" />
              <stop offset="0.3" stopColor="#FFD700" />
              <stop offset="0.7" stopColor="#DAA520" />
              <stop offset="1" stopColor="#B8860B" />
            </linearGradient>
            
            <linearGradient id="pointerHighlight" x1="20" y1="5" x2="20" y2="22" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#FFFFFF" />
              <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
            
            <radialGradient id="screwGradient" cx="20" cy="5" r="3" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#FFFFFF" />
              <stop offset="0.5" stopColor="#FFD700" />
              <stop offset="1" stopColor="#B8860B" />
            </radialGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export default WheelPointer;
