import React from 'react';
import Sidebar from '../sidebar/Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen w-full bg-gray-50 text-gray-900 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 shrink-0 flex flex-col">
        <Sidebar />
      </aside>

      {/* Main Panel */}
      <main className="flex-1 flex flex-col bg-white overflow-hidden relative">
        {children}
      </main>
    </div>
  );
};
