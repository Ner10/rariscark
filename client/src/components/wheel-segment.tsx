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

  // Alternate between gold and red colors only
  const baseColors = [
    'bg-amber-500', // Gold
    'bg-red-600',   // Red
  ];
  
  // If a specific color is set in the DB, use it, otherwise alternate between gold and red
  const backgroundColor = segment.color || baseColors[index % baseColors.length];
  
  return (
    <div
      className={`wheel-segment absolute w-1/2 h-1/2 top-0 left-0 origin-bottom-right flex items-start justify-center pt-2 overflow-hidden ${backgroundColor}`}
      style={{
        transform: `rotate(${rotation}deg)`,
        clipPath: `polygon(100% 0%, 100% 100%, 0% 0%)`,
      }}
    >
      {/* Add inner white border */}
      <div 
        className="absolute inset-0.5 border-t border-r border-white opacity-30"
        style={{
          clipPath: `polygon(100% 0%, 100% 100%, 0% 0%)`,
        }}
      ></div>
      
      <span 
        className="text-white font-bold text-sm md:text-base whitespace-nowrap max-w-[80px] text-center leading-tight transform origin-center"
        style={{ 
          transform: `rotate(${textRotation}deg) translateY(30%)`,
          textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
        }}
      >
        {segment.text}
      </span>
    </div>
  );
};

export default WheelSegmentComponent;
