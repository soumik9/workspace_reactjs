import React from 'react';
import Sidebar from '../sidebar/Sidebar';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import { logout } from '../../libs/redux/feature/auth/auth.slice';
import type { AppDispatch } from '../../libs/redux/store/store.redux';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 text-gray-900 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 shrink-0 flex flex-col">
        <div className="flex-1 min-h-0 overflow-hidden">
          <Sidebar />
        </div>
        <div className="shrink-0 border-t border-gray-200 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center space-x-2 rounded-md border border-purple-200 bg-purple-50 px-4 py-2 text-sm font-medium text-purple-700 transition-colors hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            <FaSignOutAlt className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 flex flex-col bg-white overflow-hidden relative">
        {children}
      </main>
    </div>
  );
};
