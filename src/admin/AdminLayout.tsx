import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  User, 
  FolderKanban, 
  Cpu, 
  GraduationCap, 
  Mail, 
  Database, 
  LogOut, 
  ExternalLink,
  Menu,
  X
} from 'lucide-react';
import { AuthUser } from '../types';

interface AdminLayoutProps {
  user: AuthUser;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  onViewPublic: () => void;
  unreadCount?: number;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  user,
  activeTab,
  onTabChange,
  onLogout,
  onViewPublic,
  unreadCount = 0,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'profile', label: 'Profile & Bio', icon: User },
    { id: 'projects', label: 'Projects & Case Studies', icon: FolderKanban },
    { id: 'skills', label: 'Technical Skills', icon: Cpu },
    { id: 'education', label: 'Education Info', icon: GraduationCap },
    { id: 'contact', label: 'Contact & Messages', icon: Mail, badge: unreadCount > 0 ? unreadCount : undefined },
    { id: 'database', label: 'Backend & Supabase', icon: Database },
  ];

  const handleSelectTab = (tabId: string) => {
    onTabChange(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-warmWhite flex flex-col">
      
      {/* Top Header */}
      <header className="bg-white border-b border-subtleBorder sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-neutralGray hover:text-nearBlack focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wider text-nearBlack">
                Admin Console
              </span>
              <span className="text-[11px] text-neutralGray">
                John Yestin F. Cruz — Portfolio
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            <button
              onClick={onViewPublic}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-neutralGray hover:text-nearBlack border border-subtleBorder px-3 py-1.5 rounded-sm transition-colors"
            >
              <span>Public Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <div className="hidden sm:flex items-center space-x-2 text-xs text-neutralGray border-l border-subtleBorder pl-4">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="truncate max-w-[140px] font-mono text-[11px]">{user.email}</span>
            </div>

            <button
              onClick={onLogout}
              className="inline-flex items-center space-x-1 text-xs font-semibold uppercase tracking-wider text-rose-600 hover:text-rose-800 p-1.5 transition-colors"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Admin Workspace with Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col lg:flex-row gap-8">
        
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-white border border-subtleBorder rounded-sm p-3 sticky top-24 space-y-1">
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-neutralGray">
              Navigation
            </div>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-sm text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-nearBlack text-warmWhite font-semibold'
                      : 'text-neutralGray hover:text-nearBlack hover:bg-warmWhite'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-accentBlue' : 'text-neutralGray'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-accentBlue text-white font-mono">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border border-subtleBorder rounded-sm p-3 space-y-1 mb-4 animate-in slide-in-from-top duration-200">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-sm text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-nearBlack text-warmWhite font-semibold'
                      : 'text-neutralGray hover:text-nearBlack hover:bg-warmWhite'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-accentBlue text-white font-mono">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Tab Content Panel */}
        <main className="flex-1 min-w-0">
          {children}
        </main>

      </div>

    </div>
  );
};
