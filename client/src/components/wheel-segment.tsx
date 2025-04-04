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
  
  // Calculate position based on number of segments
  // Adjust these values based on totalSegments to properly position the text
  let translateX = '50%';
  let translateY = '120%';
  
  // Adjust for different segment counts
  if (totalSegments === 12) {
    translateY = '130%';
  } else if (totalSegments >= 8 && totalSegments < 12) {
    translateY = '120%';
  } else if (totalSegments >= 16) {
    translateY = '140%';
  }
  
  return (
    <div
      className="wheel-segment absolute w-1/2 h-1/2 top-0 left-0 origin-bottom-right flex items-start justify-center overflow-hidden"
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
      
      {/* Text container with proper positioning */}
      <div 
        className="absolute origin-center"
        style={{
          top: '0',
          right: '0',
          transform: `rotate(${textRotation}deg) translate(${translateX}, ${translateY})`,
          width: '100%',
          textAlign: 'center',
        }}
      >
        <span 
          className="font-bold text-sm md:text-base whitespace-pre-wrap inline-block"
          style={{ 
            color: textColor,
            maxWidth: totalSegments > 8 ? '60px' : '80px',
            lineHeight: '1',
            textShadow: isWhiteSegment ? 'none' : '1px 1px 2px rgba(0,0,0,0.5)',
            fontFamily: "'Arial', sans-serif",
            fontWeight: 'bold',
            padding: '0 2px',
          }}
        >
          {segment.text || "Prize"}
        </span>
      </div>
    </div>
  );
};

export default WheelSegmentComponent;
