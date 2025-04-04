import React, { useState } from 'react';
import { Link } from 'wouter';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { celebrateWinner } from '@/lib/confetti';
import Wheel from '@/components/ui/wheel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useWheelContext } from '@/context/wheel-context';

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
  
  const bgStyle = settings?.background_color 
    ? { background: settings.background_color }
    : { background: 'linear-gradient(to bottom, #4F46E5, #4338CA)' };
  
  return (
    <div 
      className="min-h-screen flex flex-col text-white"
      style={bgStyle}
    >
      <header className="py-4 px-6 flex items-center justify-between">
        <div className="text-2xl font-bold">Prize Wheel Game</div>
        <div>
          <Link href="/admin" className="text-sm text-white/70 hover:text-white">
            Admin Login
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-xl w-full bg-white/10 backdrop-blur-sm rounded-xl p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-center mb-6">Spin the Wheel & Win!</h1>
          
          {/* Ticket Input */}
          <div className="mb-8">
            <label className="block text-lg mb-2">Enter your ticket code:</label>
            <div className="flex">
              <Input
                type="text"
                value={ticketCode}
                onChange={(e) => setTicketCode(e.target.value)}
                placeholder="PRIZE-2023-XXXX"
                className="flex-1 rounded-l-lg text-gray-800 border-0"
                disabled={codeValidated || isSpinning}
              />
              <Button
                onClick={verifyTicket}
                disabled={!ticketCode || codeValidated || isSpinning}
                className="bg-amber-500 hover:bg-amber-600 rounded-l-none rounded-r-lg"
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
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-medium py-6 px-8 rounded-full disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
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
    </div>
  );
};

export default Home;
