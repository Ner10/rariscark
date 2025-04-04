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
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white">
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            Admin Dashboard
            {user && <span className="text-sm font-normal ml-2 text-muted-foreground">
              Logged in as {user.username}
            </span>}
          </h1>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            {logoutMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging out...
              </>
            ) : (
              <>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </>
            )}
          </Button>
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-[600px] w-full" />
          </div>
        ) : (
          <>
            {activeTab === 'wheel' && <WheelDesign segments={segments} />}
            {activeTab === 'tickets' && <CreateTicket segments={segments} tickets={tickets} />}
            {activeTab === 'winners' && <WinnersList segments={segments} />}
          </>
        )}
      </main>

      {/* Theme Toggle Button */}
      <ThemeToggle className="dark:bg-gray-800 dark:text-yellow-300" />
    </div>
  );
};

export default Admin;
