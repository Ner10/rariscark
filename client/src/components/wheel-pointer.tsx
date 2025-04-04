import React from 'react';

const WheelPointer: React.FC = () => {
  return (
    <div className="wheel-pointer absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 z-10">
      {/* Gold triangle pointer */}
      <div className="w-full h-full">
        <svg width="100%" height="100%" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M30 60 L0 10 L60 10 Z" 
            fill="url(#goldGradient)"
            filter="drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))"
          />
          <defs>
            <linearGradient id="goldGradient" x1="30" y1="10" x2="30" y2="60" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#F6E27A" />
              <stop offset="0.5" stopColor="#F9D423" />
              <stop offset="1" stopColor="#D4AF37" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export default WheelPointer;
