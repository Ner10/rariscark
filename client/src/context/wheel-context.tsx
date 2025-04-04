import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { WheelSegment } from '@shared/schema';
import { normalizeSegmentPositions } from '@/lib/wheel';

interface WheelContextType {
  segments: WheelSegment[];
  isLoading: boolean;
  isError: boolean;
}

const WheelContext = createContext<WheelContextType>({
  segments: [],
  isLoading: false,
  isError: false,
});

export const useWheelContext = () => useContext(WheelContext);

interface WheelProviderProps {
  children: ReactNode;
}

export const WheelProvider: React.FC<WheelProviderProps> = ({ children }) => {
  const { 
    data: segments = [], 
    isLoading,
    isError,
  } = useQuery<WheelSegment[]>({
    queryKey: ['/api/wheel/segments'],
  });
  
  // Sort and normalize segments positions for consistent wheel rendering
  const normalizedSegments = normalizeSegmentPositions(segments);
  
  return (
    <WheelContext.Provider value={{ 
      segments: normalizedSegments,
      isLoading,
      isError,
    }}>
      {children}
    </WheelContext.Provider>
  );
};
