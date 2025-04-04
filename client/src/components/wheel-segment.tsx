import React from 'react';
import { WheelSegment } from '@shared/schema';

interface WheelSegmentProps {
  segment: WheelSegment;
  rotation: number;
  totalSegments: number;
}

const WheelSegmentComponent: React.FC<WheelSegmentProps> = ({
  segment,
  rotation,
  totalSegments,
}) => {
  // Calculate segment angle based on total segments
  const segmentAngle = 360 / totalSegments;
  
  // Calculate text rotation to keep it readable
  const textRotation = 90 - (segmentAngle / 2);
  
  return (
    <div
      className="wheel-segment absolute w-1/2 h-1/2 top-0 left-0 origin-bottom-right flex items-start justify-center pt-2 overflow-hidden"
      style={{
        transform: `rotate(${rotation}deg)`,
        backgroundColor: segment.color,
        clipPath: `polygon(100% 0%, 100% 100%, 0% 0%)`,
      }}
    >
      <span 
        className="text-white font-bold text-sm md:text-base whitespace-nowrap max-w-[80px] text-center leading-tight transform origin-center"
        style={{ 
          transform: `rotate(${textRotation}deg) translateY(20%)`,
          textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
        }}
      >
        {segment.text}
      </span>
    </div>
  );
};

export default WheelSegmentComponent;
