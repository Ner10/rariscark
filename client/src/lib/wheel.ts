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
  additionalSpins = 5
): number {
  const segmentAngle = 360 / totalSegments;
  const segmentRotation = segmentPosition * segmentAngle;
  
  // To have the segment at the top (winner position), we need to rotate
  // the wheel so that the segment is at 270 degrees (bottom becomes top)
  // We add multiple full rotations for animation effect
  const baseRotation = 270 - segmentRotation;
  
  // Normalize to positive angle and add additional spins
  const normalizedRotation = (baseRotation + 360) % 360;
  return normalizedRotation + (additionalSpins * 360);
}

// Get the segment colors in a cycling pattern
export function getSegmentColor(index: number): string {
  const colors = ['#F59E0B', '#10B981', '#4F46E5', '#F43F5E', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];
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
