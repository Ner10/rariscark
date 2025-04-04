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
  
  // Define segment background colors with high contrast
  const whiteSegmentColor = '#FFFAF0'; // Off-white
  const redSegmentColor = '#D20000';   // Bright red
  
  // Style that will match the reference image
  const segmentStyle = {
    transform: `rotate(${rotation}deg)`,
    clipPath: `polygon(100% 0%, 100% 100%, 0% 0%)`,
    background: isWhiteSegment ? whiteSegmentColor : redSegmentColor,
    borderRight: '1px solid #DAA520',
    borderTop: '1px solid #DAA520',
  };
  
  // Calculate exact opposite/complementary colors for maximum contrast
  // For red segment (D20000), the opposite is cyan-ish (#2DFFFF)
  // For white segment (FFFAF0), the opposite is dark blue-purple (#000510)
  const textColor = isWhiteSegment 
    ? '#000000'     // Pure black text on off-white background
    : '#FFFFFF';    // Pure white text on red background
  
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
      {/* Add enhanced gradient effect for better segment visibility */}
      <div 
        className="absolute inset-0"
        style={{
          background: isWhiteSegment 
            ? 'linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,250,230,0.8) 100%)' 
            : 'linear-gradient(135deg, rgba(210,0,0,0.8) 0%, rgba(120,0,0,1) 100%)',
          clipPath: `polygon(100% 0%, 100% 100%, 0% 0%)`,
          opacity: 0.3,
        }}
      ></div>
      
      {/* Add highlight edges for better segment definition */}
      <div 
        className="absolute"
        style={{
          top: 0,
          right: 0,
          width: '2px',
          height: '100%',
          background: '#FFD700', // Gold trim
          opacity: 0.8,
        }}
      ></div>
      <div 
        className="absolute"
        style={{
          top: 0,
          right: 0,
          width: '100%',
          height: '2px',
          background: '#FFD700', // Gold trim
          opacity: 0.8,
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
            // Add shadow effects for better contrast and readability
            textShadow: isWhiteSegment 
              ? '0.5px 0.5px 0 #333, -0.5px -0.5px 0 #333, 0.5px -0.5px 0 #333, -0.5px 0.5px 0 #333' 
              : '0px 0px 5px rgba(255,255,255,0.5), 0px 0px 7px rgba(255,255,255,0.3)',
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
