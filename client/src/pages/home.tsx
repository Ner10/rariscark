import React, { useState } from 'react';
import { Link } from 'wouter';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { celebrateWinner } from '@/lib/confetti';
import { playClickSound } from '@/lib/sounds';
import Wheel from '@/components/ui/wheel';
import ThemeToggle from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useWheelContext } from '@/context/wheel-context';
import backgroundImage from '@assets/bg5.jpg';

const Home: React.FC = () => {
  const [ticketCode, setTicketCode] = useState('');
  const [codeValidated, setCodeValidated] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [targetSegmentId, setTargetSegmentId] = useState<number | null>(null);
  const { toast } = useToast();
  const { segments, isLoading } = useWheelContext();
  
  // Settings for background colors
  const { data: settings } = useQuery<Record<string, string>>({
    queryKey: ['/api/settings'],
  });
  
  const spinMutation = useMutation({
    mutationFn: async (code: string) => {
      const response = await apiRequest('POST', '/api/spin', { code });
      return response.json();
    },
    onSuccess: (data) => {
      setIsSpinning(true);
      setTargetSegmentId(data.segment.id);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to spin the wheel',
        variant: 'destructive',
      });
      setCodeValidated(false);
    }
  });
  
  const verifyTicket = () => {
    playClickSound();
    
    if (!ticketCode.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a ticket code',
        variant: 'destructive',
      });
      return;
    }
    
    setCodeValidated(true);
  };
  
  const handleSpin = () => {
    playClickSound();
    spinMutation.mutate(ticketCode);
  };
  
  const handleSpinEnd = (segment: any) => {
    setIsSpinning(false);
    celebrateWinner(segment.text, () => {
      setCodeValidated(false);
      setTicketCode('');
      setTargetSegmentId(null);
    });
  };
  
  // Use the uploaded background image instead of settings
  const bgStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };
  
  return (
    <div className="min-h-screen flex flex-col text-white relative">
      {/* Background image container */}
      <div 
        className="absolute inset-0 z-0" 
        style={bgStyle}>
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      {/* Content container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="py-4 px-6 flex items-center justify-between">
          <div className="text-2xl font-bold">Prize Wheel Game</div>
          <div>
            <Link href="/admin" className="text-sm text-white/70 hover:text-white">
              Admin Login
            </Link>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="max-w-xl w-full bg-black/40 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-[#800000]/30">
            <h1 className="text-3xl font-bold text-center mb-6">Spin the Wheel & Win!</h1>
            
            {/* Ticket Input */}
            <div className="mb-8">
              <label className="block text-lg mb-2">Enter your ticket code:</label>
              <div className="flex">
                <Input
                  type="text"
                  value={ticketCode}
                  onChange={(e) => setTicketCode(e.target.value)}
                  placeholder="PRIZE-2025-XXXX"
                  className="flex-1 rounded-l-lg text-white bg-black/30 border-[#800000]/30"
                  disabled={codeValidated || isSpinning}
                />
                <Button
                  onClick={verifyTicket}
                  disabled={!ticketCode || codeValidated || isSpinning}
                  className="bg-[#800000] hover:bg-[#a00000] rounded-l-none rounded-r-lg"
                >
                  Verify
                </Button>
              </div>
              {spinMutation.isError && (
                <div className="mt-2 text-red-300 text-sm">
                  Invalid ticket code. Please check and try again.
                </div>
              )}
            </div>

            {/* Wheel Section */}
            <div className="flex flex-col items-center">
              {isLoading ? (
                <Skeleton className="w-80 h-80 rounded-full" />
              ) : (
                <Wheel 
                  segments={segments} 
                  isSpinning={isSpinning}
                  targetSegmentId={targetSegmentId}
                  onSpinEnd={handleSpinEnd}
                  size="lg"
                />
              )}
              
              <div className="mt-8">
                <Button
                  onClick={handleSpin}
                  disabled={!codeValidated || spinMutation.isPending || isSpinning}
                  className="bg-gradient-to-r from-[#800000] to-[#5c0000] hover:from-[#a00000] hover:to-[#700000] text-white text-lg font-medium py-6 px-8 rounded-full disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  size="lg"
                >
                  SPIN THE WHEEL
                </Button>
              </div>
            </div>
          </div>
        </main>

        <footer className="py-4 px-6 text-center text-white/70 text-sm">
          &copy; {new Date().getFullYear()} Prize Wheel Game. All rights reserved.
        </footer>

        {/* Theme Toggle Button */}
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Home;
