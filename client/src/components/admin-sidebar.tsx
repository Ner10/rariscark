import React from 'react';
import { Link, useLocation } from 'wouter';

type Tab = 'wheel' | 'tickets' | 'winners';

interface AdminSidebarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, onTabChange }) => {
  const [location, setLocation] = useLocation();
  
  return (
    <aside className="w-64 bg-black/60 text-white h-screen flex flex-col border-r border-[#800000]/30 backdrop-blur-sm">
      <div className="p-4 flex items-center border-b border-[#800000]/50">
        <svg className="w-8 h-8 mr-2 text-[#FFD700]" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z"></path>
        </svg>
        <h1 className="text-xl font-semibold">Prize Wheel Admin</h1>
      </div>
      
      <nav className="mt-6 flex-1">
        <div 
          className={`flex items-center px-4 py-3 cursor-pointer ${
            activeTab === 'wheel' 
              ? 'bg-[#800000] text-white' 
              : 'hover:bg-[#800000]/40 transition-colors'
          }`}
          onClick={() => onTabChange('wheel')}
        >
          <i className="fas fa-dharmachakra mr-3"></i>
          <span>Edit Wheel Design</span>
        </div>
        
        <div 
          className={`flex items-center px-4 py-3 cursor-pointer ${
            activeTab === 'tickets' 
              ? 'bg-[#800000] text-white' 
              : 'hover:bg-[#800000]/40 transition-colors'
          }`}
          onClick={() => onTabChange('tickets')}
        >
          <i className="fas fa-ticket-alt mr-3"></i>
          <span>Create Tickets</span>
        </div>
        
        <div 
          className={`flex items-center px-4 py-3 cursor-pointer ${
            activeTab === 'winners' 
              ? 'bg-[#800000] text-white' 
              : 'hover:bg-[#800000]/40 transition-colors'
          }`}
          onClick={() => onTabChange('winners')}
        >
          <i className="fas fa-trophy mr-3"></i>
          <span>Winners List</span>
        </div>
      </nav>
      
      <div className="p-4 border-t border-[#800000]/50">
        <Link href="/" className="flex items-center px-4 py-2 text-sm hover:bg-[#800000]/40 rounded transition-colors">
          <i className="fas fa-arrow-left mr-2"></i>
          <span>Back to Website</span>
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
