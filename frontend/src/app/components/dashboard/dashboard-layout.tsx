import React, { ReactNode } from 'react';
import { DashboardSidebar } from './dashboard-sidebar';
import { DashboardHeader } from './dashboard-header';

interface DashboardLayoutProps {
  children: ReactNode;
  userRole: 'student' | 'teacher' | 'staff' | 'admin';
  userName?: string;
  userInitials?: string;
  notificationCount?: number;
  breadcrumb?: string;
  activePage?: string;
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
  onHelpClick?: () => void;
  showSystemStatus?: boolean;
}

export function DashboardLayout({
  children,
  userRole,
  userName,
  userInitials,
  notificationCount,
  breadcrumb,
  activePage,
  onNavigate,
  onLogout,
  onHelpClick,
  showSystemStatus,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0B0F1A] flex relative overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-cyan-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-indigo-500/10 to-purple-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Sidebar */}
      <div className="relative z-10">
        <DashboardSidebar
          userRole={userRole}
          activePage={activePage}
          onNavigate={onNavigate}
          onLogout={onLogout}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 relative z-10">
        {/* Header */}
        <DashboardHeader
          userName={userName}
          userInitials={userInitials}
          notificationCount={notificationCount}
          breadcrumb={breadcrumb}
          onHelpClick={onHelpClick}
          onNavigate={onNavigate}
          onLogout={onLogout}
          showSystemStatus={showSystemStatus}
        />

        {/* Page Content */}
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}