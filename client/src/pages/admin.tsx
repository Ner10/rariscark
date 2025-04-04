import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { WheelSegment, Ticket } from '@shared/schema';
import AdminSidebar from '@/components/admin-sidebar';
import WheelDesign from '@/components/admin-tabs/wheel-design';
import CreateTicket from '@/components/admin-tabs/create-ticket';
import WinnersList from '@/components/admin-tabs/winners-list';
import ThemeToggle from '@/components/theme-toggle';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { LogOut, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import backgroundImage from '@assets/bg5.jpg';

type Tab = 'wheel' | 'tickets' | 'winners';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('wheel');
  const { user, logoutMutation } = useAuth();
  
  // Fetch wheel segments
  const { 
    data: segments = [], 
    isLoading: isLoadingSegments 
  } = useQuery<WheelSegment[]>({
    queryKey: ['/api/wheel/segments'],
  });
  
  // Fetch tickets
  const { 
    data: tickets = [], 
    isLoading: isLoadingTickets 
  } = useQuery<Ticket[]>({
    queryKey: ['/api/tickets'],
  });
  
  const isLoading = isLoadingSegments || isLoadingTickets;
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  return (
    <div className="flex min-h-screen relative text-white">
      {/* Background image container */}
      <div 
        className="absolute inset-0 z-0" 
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}>
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
      
      {/* Content container */}
      <div className="relative z-10 flex w-full">
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">
              Yönetici Paneli
              {user && <span className="text-sm font-normal ml-2 text-white/70">
                {user.username} olarak giriş yapıldı
              </span>}
            </h1>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="border-[#800000] text-white hover:bg-[#800000]/20"
            >
              {logoutMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Çıkış yapılıyor...
                </>
              ) : (
                <>
                  <LogOut className="mr-2 h-4 w-4" />
                  Çıkış Yap
                </>
              )}
            </Button>
          </div>
          
          <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-[#800000]/30">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-1/4 bg-white/10" />
                <Skeleton className="h-[600px] w-full bg-white/10" />
              </div>
            ) : (
              <>
                {activeTab === 'wheel' && <WheelDesign segments={segments} />}
                {activeTab === 'tickets' && <CreateTicket segments={segments} tickets={tickets} />}
                {activeTab === 'winners' && <WinnersList segments={segments} />}
              </>
            )}
          </div>
        </main>

        {/* Theme Toggle Button */}
        <ThemeToggle className="bg-black/30 border border-[#800000]/30 text-white" />
      </div>
    </div>
  );
};

export default Admin;
