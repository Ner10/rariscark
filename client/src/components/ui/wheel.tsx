import React, { useRef, useState, useEffect } from 'react';
import { WheelSegment } from '@shared/schema';
import { calculateWinningRotation } from '@/lib/wheel';
import { playSpinSound, stopSpinSound, playWinSound, adjustSpinSoundRate } from '@/lib/sounds';
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
        
        // Play the spinning sound - ratchet clicking effect
        playSpinSound();
        
        // Calculate the winning rotation with just one full rotation
        const winRotation = calculateWinningRotation(
          targetSegment.position,
          segments.length,
          1 // Only 1 full rotation for slower effect
        );
        
        // Set the rotation
        setRotation(winRotation);
        
        // Animation duration is 7 seconds (matches CSS duration-5000 class)
        const spinDuration = 7000;
        
        // Decelerate the spinning sound near the end to simulate wheel slowing down
        setTimeout(() => {
          // Slow down the spinning sound in the last 2 seconds
          adjustSpinSoundRate(0.7);
        }, spinDuration - 2000);
        
        // Call onSpinEnd when animation completes
        setTimeout(() => {
          setSpinning(false);
          // Stop the spinning sound and play the celebratory win sound
          stopSpinSound();
          
          // Short delay before playing win sound to create better timing
          setTimeout(() => {
            playWinSound();
          }, 300);
          
          // Wait 3 seconds before showing the prize popup (as requested)
          setTimeout(() => {
            if (onSpinEnd) {
              onSpinEnd(targetSegment);
            }
          }, 3000);
          
        }, spinDuration); // Match the CSS transition duration
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
            boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.4)',
            background: '#FFFFFF' // Set a base background
          }}
        >
          {/* Center golden dot */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full z-20"
            style={{
              background: 'radial-gradient(circle, #ffd700 0%, #b8860b 100%)',
              boxShadow: '0 0 5px rgba(0, 0, 0, 0.5)'
            }}
          ></div>
          
          {/* Redesigned wheel segments for equal spacing */}
          {segments.map((segment, index) => {
            const segmentAngle = 360 / segments.length;
            const startAngle = index * segmentAngle;
            const endAngle = (index + 1) * segmentAngle;
            
            // Alternate between white and red for segment colors
            const isWhiteSegment = index % 2 === 0;
            // Use a brighter red and slightly off-white to match reference image
            const segmentColor = isWhiteSegment ? '#FFFAF0' : '#D20000';
            // Dark red text on white segments, white text on red segments
            const textColor = isWhiteSegment ? '#8B0000' : '#FFFFFF';
            
            return (
              <div key={segment.id} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                {/* Create a wedge using conic-gradient */}
                <div 
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: `conic-gradient(from ${startAngle}deg, ${segmentColor} 0deg, ${segmentColor} ${segmentAngle}deg, transparent ${segmentAngle}deg)`,
                    borderRadius: '50%'
                  }}
                >
                  {/* Gold divider lines */}
                  <div 
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      width: '50%',
                      height: '2px',
                      background: '#DAA520',
                      transformOrigin: 'left center',
                      transform: `rotate(${startAngle}deg)`,
                      zIndex: 2,
                      boxShadow: '0 0 2px rgba(218, 165, 32, 0.7)'
                    }}
                  ></div>
                  
                  {/* Text for this segment - completely redesigned to be upright and readable */}
                  <div 
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      pointerEvents: 'none',
                      zIndex: 3
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        /* Position text in the middle of the segment, but 60% from center of wheel */
                        left: `${50 + 35 * Math.cos((startAngle + segmentAngle/2) * Math.PI / 180)}%`,
                        top: `${50 + 35 * Math.sin((startAngle + segmentAngle/2) * Math.PI / 180)}%`,
                        transform: 'translate(-50%, -50%)',
                        color: textColor,
                        fontWeight: 'bold',
                        fontSize: '18px',
                        letterSpacing: '0.5px',
                        lineHeight: '1.1',
                        textAlign: 'center',
                        width: '80px',
                        // Add text shadow only to white text for better contrast
                        textShadow: isWhiteSegment ? 'none' : '0px 1px 2px rgba(0,0,0,0.7)',
                        fontFamily: "'Arial', sans-serif",
                        // Match the dollar sign style from reference image
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      {segment.text || "Prize"}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Pointer */}
        <WheelPointer />
      </div>
    </div>
  );
};

export default Wheel;
