import React, { useRef, useState, useEffect } from 'react';
import { WheelSegment } from '@shared/schema';
import { calculateSegmentRotation, calculateWinningRotation } from '@/lib/wheel';
import { playSpinSound } from '@/lib/confetti';
import WheelSegmentComponent from '../wheel-segment';
import WheelPointer from '../wheel-pointer';

interface WheelProps {
  segments: WheelSegment[];
  onSpinEnd?: (segment: WheelSegment) => void;
  isSpinning?: boolean;
  targetSegmentId?: number | null;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Wheel: React.FC<WheelProps> = ({
  segments,
  onSpinEnd,
  isSpinning = false,
  targetSegmentId = null,
  className = '',
  size = 'md',
}) => {
  const wheelRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  
  // Set wheel sizes based on the size prop
  const sizeClasses = {
    sm: 'w-64 h-64',
    md: 'w-80 h-80 md:w-96 md:h-96',
    lg: 'w-96 h-96 md:w-[450px] md:h-[450px]'
  };
  
  useEffect(() => {
    if (isSpinning && targetSegmentId !== null && segments.length > 0) {
      // Find the target segment
      const targetSegment = segments.find(segment => segment.id === targetSegmentId);
      
      if (targetSegment) {
        setSpinning(true);
        
        // Play the spinning sound
        playSpinSound();
        
        // Calculate the winning rotation
        const winRotation = calculateWinningRotation(
          targetSegment.position,
          segments.length,
          5 // 5 full rotations for effect
        );
        
        // Set the rotation
        setRotation(winRotation);
        
        // Call onSpinEnd when animation completes
        setTimeout(() => {
          setSpinning(false);
          if (onSpinEnd) {
            onSpinEnd(targetSegment);
          }
        }, 5000); // Match the CSS transition duration
      }
    }
  }, [isSpinning, targetSegmentId, segments, onSpinEnd]);
  
  return (
    <div className={`relative ${className}`}>
      {/* Glow effect around the wheel */}
      <div className="absolute -inset-10 bg-gradient-radial from-red-600/50 to-red-900/10 rounded-full blur-md"></div>
      
      <div className={`wheel-container ${sizeClasses[size]} relative z-10`}>
        {/* Outer burgundy ring with gold border */}
        <div 
          className="absolute inset-0 rounded-full border-2 border-amber-400 shadow-xl"
          style={{ 
            background: '#5A0511',
            boxShadow: '0 0 15px 5px rgba(139, 0, 0, 0.3), inset 0 0 10px rgba(0, 0, 0, 0.5)'
          }}
        >
          {/* Light bulbs around the ring */}
          {Array.from({ length: 16 }).map((_, i) => (
            <div 
              key={i} 
              className="absolute w-2 h-2 rounded-full" 
              style={{
                background: 'radial-gradient(circle, rgba(255,215,0,1) 0%, rgba(255,215,0,0.7) 50%, rgba(255,215,0,0) 100%)',
                boxShadow: '0 0 5px 2px rgba(255, 215, 0, 0.6)',
                left: `${50 + 45 * Math.cos(i * Math.PI / 8)}%`,
                top: `${50 + 45 * Math.sin(i * Math.PI / 8)}%`,
                transform: 'translate(-50%, -50%)'
              }}
            ></div>
          ))}
          
          {/* Inner golden trim */}
          <div 
            className="absolute inset-3 rounded-full" 
            style={{
              background: 'linear-gradient(145deg, #ffd700, #b8860b)',
              boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.5)'
            }}
          ></div>
        </div>
        
        {/* Wheel segments container */}
        <div 
          ref={wheelRef}
          className="absolute inset-8 rounded-full overflow-hidden transition-transform duration-5000 ease-out"
          style={{ 
            transform: `rotate(${rotation}deg)`,
            boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.4)'
          }}
        >
          {/* Center golden dot */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full z-20"
            style={{
              background: 'radial-gradient(circle, #ffd700 0%, #b8860b 100%)',
              boxShadow: '0 0 5px rgba(0, 0, 0, 0.5)'
            }}
          ></div>
          
          {/* Segments */}
          {segments.map((segment, index) => (
            <WheelSegmentComponent
              key={segment.id}
              segment={segment}
              rotation={calculateSegmentRotation(segment.position, segments.length)}
              totalSegments={segments.length}
              index={index}
            />
          ))}
        </div>
        
        {/* Pointer */}
        <WheelPointer />
      </div>
    </div>
  );
};

export default Wheel;
