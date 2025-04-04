import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { WheelSegment, Ticket } from '@shared/schema';
import AdminSidebar from '@/components/admin-sidebar';
import WheelDesign from '@/components/admin-tabs/wheel-design';
import CreateTicket from '@/components/admin-tabs/create-ticket';
import WinnersList from '@/components/admin-tabs/winners-list';
import ThemeToggle from '@/components/theme-toggle';
import { Skeleton } from '@/components/ui/skeleton';

type Tab = 'wheel' | 'tickets' | 'winners';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('wheel');
  
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
  
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white">
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto p-6">
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
