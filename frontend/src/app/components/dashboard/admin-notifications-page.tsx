import React from 'react';
import { DashboardLayout } from './dashboard-layout';
import { GlassCard } from '../glass-card';
import { Bell, Clock, CheckCircle, AlertCircle, MessageSquare, Info, BookOpen } from 'lucide-react';

interface AdminNotificationsPageProps {
  onLogout?: () => void;
  onNavigate?: (page: string, data?: any) => void;
}

export function AdminNotificationsPage({ onLogout, onNavigate }: AdminNotificationsPageProps) {
  const notifications = [
    {
      id: 1,
      type: 'approval',
      title: 'New Class Proposal',
      message: 'Mr. Amila Dasanayake submitted a new Chemistry Theory Class proposal for approval.',
      time: '10 minutes ago',
      status: 'unread',
      icon: BookOpen
    },
    {
      id: 2,
      type: 'alert',
      title: 'Database Sync Warning',
      message: 'Automatic database synchronization experienced a minor delay. System is now stable.',
      time: '1 hour ago',
      status: 'unread',
      icon: AlertCircle
    },
    {
      id: 3,
      type: 'payment',
      title: 'Bulk Payment Verified',
      message: 'A batch of 50 student payments has been successfully verified by the staff team.',
      time: '2 hours ago',
      status: 'read',
      icon: CheckCircle
    },
    {
      id: 4,
      type: 'system',
      title: 'System Update Scheduled',
      message: 'Routine system maintenance is scheduled for Sunday at 02:00 AM.',
      time: '5 hours ago',
      status: 'read',
      icon: Info
    }
  ];

  return (
    <DashboardLayout
      userRole="admin"
      userName="Admin"
      userInitials="AD"
      breadcrumb="Notifications"
      activePage="admin-notifications"
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">System Notifications</h1>
        <p className="text-white/60">Stay updated with system activities and required actions</p>
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => {
          const Icon = notification.icon;
          return (
            <GlassCard 
              key={notification.id} 
              className={`p-5 transition-all duration-300 ${notification.status === 'unread' ? 'border-l-4 border-l-cyan-400 bg-cyan-400/5' : ''}`}
            >
              <div className="flex gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  notification.type === 'approval' ? 'bg-blue-500/20 text-blue-400' :
                  notification.type === 'alert' ? 'bg-red-500/20 text-red-400' :
                  notification.type === 'payment' ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/70'
                }`}>
                  <Icon size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className={`font-bold ${notification.status === 'unread' ? 'text-white' : 'text-white/80'}`}>
                      {notification.title}
                    </h3>
                    <span className="text-white/40 text-xs flex items-center gap-1">
                      <Clock size={12} />
                      {notification.time}
                    </span>
                  </div>
                  <p className="text-white/60 text-sm mb-3 leading-relaxed">
                    {notification.message}
                  </p>
                  <div className="flex gap-3">
                    <button className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors">
                      Mark as read
                    </button>
                    {notification.type === 'approval' && (
                      <button 
                        onClick={() => onNavigate?.('admin-content')}
                        className="text-xs font-semibold text-white/40 hover:text-white transition-colors"
                      >
                        Action required
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
