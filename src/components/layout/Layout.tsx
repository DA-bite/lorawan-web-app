import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import BottomNavbar from './BottomNavbar';
import { useIsMobile } from '@/hooks/use-mobile';
const Layout: React.FC = () => {
  const isMobile = useIsMobile();
  return <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {!isMobile && <Sidebar />}
        <main className="flex-1 overflow-auto p-4 md:p-6 transition-all duration-300 ease-in-out pb-24 md:pb-6 px-0 py-0">
          <div className="animate-fade-in max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      {isMobile && <BottomNavbar />}
    </div>;
};
export default Layout;