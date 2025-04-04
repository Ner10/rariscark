import React from 'react';
import { WheelSegment } from '@shared/schema';

interface WheelSegmentProps {
  segment: WheelSegment;
  rotation: number;
  totalSegments: number;
  index: number;
}

const WheelSegmentComponent: React.FC<WheelSegmentProps> = ({
  segment,
  rotation,
  totalSegments,
  index
}) => {
  // Calculate segment angle based on total segments
  const segmentAngle = 360 / totalSegments;
  
  // Calculate text rotation to keep it readable
  const textRotation = 90 - (segmentAngle / 2);

  // Alternate between white and red backgrounds exactly as in the reference image
  const isWhiteSegment = index % 2 === 0;
  
  // Style that will match the reference image
  const segmentStyle = {
    transform: `rotate(${rotation}deg)`,
    clipPath: `polygon(100% 0%, 100% 100%, 0% 0%)`,
    background: isWhiteSegment ? '#FFFFFF' : '#B80000',
    borderRight: '1px solid #DAA520',
    borderTop: '1px solid #DAA520',
  };
  
  // Use red text for white segments and white text for red segments
  const textColor = isWhiteSegment ? '#B80000' : '#FFFFFF';
  
  return (
    <div
      className="wheel-segment absolute w-1/2 h-1/2 top-0 left-0 origin-bottom-right flex items-start justify-center pt-2 overflow-hidden"
      style={segmentStyle}
    >
      {/* Add subtle gradient effect */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: isWhiteSegment 
            ? 'linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)' 
            : 'linear-gradient(135deg, rgba(184,0,0,0) 0%, rgba(120,0,0,1) 100%)',
          clipPath: `polygon(100% 0%, 100% 100%, 0% 0%)`,
        }}
      ></div>
      
      <span 
        className="font-bold text-sm md:text-base whitespace-nowrap max-w-[80px] text-center leading-tight transform origin-center rotate-180"
        style={{ 
          color: textColor,
          transform: `rotate(${textRotation}deg) translateY(40%)`,
          textShadow: isWhiteSegment ? 'none' : '1px 1px 2px rgba(0,0,0,0.5)',
          fontFamily: "'Arial', sans-serif",
          fontWeight: 'bold',
        }}
      >
        {segment.text}
      </span>
    </div>
  );
};

export default WheelSegmentComponent;
