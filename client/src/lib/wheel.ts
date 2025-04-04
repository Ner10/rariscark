import { WheelSegment } from "@shared/schema";

// Calculate the rotation angle for a specific segment based on its position
export function calculateSegmentRotation(position: number, totalSegments: number): number {
  const segmentAngle = 360 / totalSegments;
  return position * segmentAngle;
}

// Calculate the rotation needed to have a specific segment as the winner
export function calculateWinningRotation(
  segmentPosition: number, 
  totalSegments: number, 
  additionalSpins = 1 // Reduced to only 1 full rotation
): number {
  const segmentAngle = 360 / totalSegments;
  
  // Calculate the rotation needed to align the center of the segment with the pointer
  // This is the key change - we need to rotate to the center of the segment, not its edge
  const segmentMidpoint = segmentPosition * segmentAngle + (segmentAngle / 2);
  
  // For the pointer at the top (12 o'clock position), we want the segment to be at the bottom (6 o'clock)
  // This means the segment center should be at 270 degrees (bottom of wheel)
  const baseRotation = 270 - segmentMidpoint;
  
  // Normalize to positive angle and add additional spins
  const normalizedRotation = (baseRotation + 360) % 360;
  return normalizedRotation + (additionalSpins * 360);
}

// Get the segment colors in a gold-red alternating pattern
export function getSegmentColor(index: number): string {
  const colors = [
    'bg-amber-500', // Gold
    'bg-red-600'    // Red
  ];
  return colors[index % colors.length];
}

// Given a list of segments, rearrange their positions to be sequential
export function normalizeSegmentPositions(segments: WheelSegment[]): WheelSegment[] {
  return [...segments]
    .sort((a, b) => a.position - b.position)
    .map((segment, index) => ({
      ...segment,
      position: index
    }));
}
