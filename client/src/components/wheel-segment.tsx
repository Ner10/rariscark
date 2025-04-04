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
    background: isWhiteSegment ? '#FFFAF0' : '#D20000', // Slightly adjusted colors for better contrast
    borderRight: '1px solid #DAA520',
    borderTop: '1px solid #DAA520',
  };
  
  // Use red text for white segments and white text for red segments
  // Using a slightly darker red for better readability on white background
  const textColor = isWhiteSegment ? '#990000' : '#FFFFFF';
  
  // Calculate position adjustments for vertical text based on number of segments
  let radialPosition = '40%';  // Default radial position along the segment
  let textWidth = '25px';      // Default text container width
  let letterSpacingValue = '-2px';
  let fontSizeValue = '0.75rem';
  const horizontalPosition = '50%';  // Center horizontally
  
  // Adjust for different segment counts
  if (totalSegments <= 8) {
    radialPosition = '45%';
    textWidth = '35px'; 
    letterSpacingValue = '-1px';
    fontSizeValue = '0.85rem';
  } else if (totalSegments <= 12) {
    radialPosition = '40%';
    textWidth = '30px';
    letterSpacingValue = '-1.5px';
    fontSizeValue = '0.78rem';
  } else if (totalSegments <= 16) {
    radialPosition = '35%';
    textWidth = '25px';
    letterSpacingValue = '-2px';
    fontSizeValue = '0.7rem';
  } else {
    radialPosition = '30%';
    textWidth = '20px';
    letterSpacingValue = '-3px';
    fontSizeValue = '0.65rem';
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
      
      {/* Text container with vertical text */}
      <div 
        className="absolute origin-center"
        style={{
          top: '0',
          right: '0',
          transform: `rotate(${textRotation}deg) translate(${horizontalPosition}, ${radialPosition})`,
          width: '50%',
          height: '50%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          className="vertical-text"
          style={{ 
            color: textColor,
            width: textWidth,
            letterSpacing: letterSpacingValue,
            fontSize: fontSizeValue,
            fontWeight: 'bold',
            lineHeight: '1',
            textShadow: isWhiteSegment ? 'none' : '1px 1px 2px rgba(0,0,0,0.5)',
            fontFamily: "'Arial', sans-serif",
            padding: '2px',
            textAlign: 'center',
            transform: 'rotate(180deg)',
            textTransform: 'uppercase',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {segment.text || "Prize"}
        </div>
      </div>
    </div>
  );
};

export default WheelSegmentComponent;
