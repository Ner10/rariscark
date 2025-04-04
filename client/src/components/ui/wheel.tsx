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
      <div className={`wheel-container ${sizeClasses[size]}`}>
        <WheelPointer />
        
        <div 
          ref={wheelRef}
          className={`wheel rounded-full overflow-hidden border-4 border-gray-800 shadow-lg transition-transform duration-5000 ease-out`}
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {segments.map((segment, index) => (
            <WheelSegmentComponent
              key={segment.id}
              segment={segment}
              rotation={calculateSegmentRotation(segment.position, segments.length)}
              totalSegments={segments.length}
            />
          ))}
        </div>
      </div>
      

    </div>
  );
};

export default Wheel;
