
import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import BottomNavbar from './BottomNavbar';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {!isMobile && <Sidebar />}
        <main className="flex-1 overflow-auto p-4 md:p-6 transition-all duration-300 ease-in-out pb-[4rem] md:pb-6">
          {children}
        </main>
      </div>
      {isMobile && <BottomNavbar />}
    </div>
  );
};

export default Layout;
