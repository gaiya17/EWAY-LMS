import React, { useState } from 'react';
import { DashboardLayout } from './dashboard-layout';
import { GlassCard } from '../glass-card';
import { AIChat } from './ai-chat';
import {
  ArrowLeft,
  CheckCheck,
  Bell,
  BookOpen,
  CreditCard,
  AlertTriangle,
  Settings,
  Clock,
  Circle,
} from 'lucide-react';

interface NotificationsPageProps {
  onLogout?: () => void;
  onNavigate?: (page: string) => void;
}

type NotificationType = 'all' | 'unread' | 'academic' | 'classes' | 'payments' | 'warnings' | 'system';

interface Notification {
  id: number;
  title: string;
  description: string;
  time: string;
  type: 'Academic' | 'Classes' | 'Payment' | 'Warning' | 'System';
  unread: boolean;
  icon: string;
}

export function NotificationsPage({ onLogout, onNavigate }: NotificationsPageProps) {
  const [activeFilter, setActiveFilter] = useState<NotificationType>('all');

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: 'New Assignment Posted',
      description: 'Physics - Chapter 5 homework has been posted. Due date: Friday, 5:00 PM',
      time: '2 hours ago',
      type: 'Academic',
      unread: true,
      icon: '📚',
    },
    {
      id: 2,
      title: 'Class Schedule Updated',
      description: 'Your Mathematics class has been rescheduled to 3:00 PM today',
      time: '5 hours ago',
      type: 'Classes',
      unread: true,
      icon: '📅',
    },
    {
      id: 3,
      title: 'Payment Received',
      description: 'Your payment of Rs. 5,000 for June month has been successfully received',
      time: '1 day ago',
      type: 'Payment',
      unread: false,
      icon: '💳',
    },
    {
      id: 4,
      title: 'Assignment Deadline Reminder',
      description: 'Chemistry assignment is due tomorrow at 11:59 PM',
      time: '1 day ago',
      type: 'Academic',
      unread: true,
      icon: '⏰',
    },
    {
      id: 5,
      title: 'Low Attendance Warning',
      description: 'Your attendance has dropped below 75%. Please attend classes regularly.',
      time: '2 days ago',
      type: 'Warning',
      unread: false,
      icon: '⚠️',
    },
    {
      id: 6,
      title: 'New Study Material Available',
      description: 'Biology - Chapter 8 study notes and practice questions are now available',
      time: '3 days ago',
      type: 'Academic',
      unread: false,
      icon: '📖',
    },
    {
      id: 7,
      title: 'System Maintenance Notice',
      description: 'LMS will be under maintenance on Sunday 2:00 AM - 4:00 AM',
      time: '4 days ago',
      type: 'System',
      unread: false,
      icon: '🔧',
    },
    {
      id: 8,
      title: 'Online Class Link Updated',
      description: 'New Zoom link for English Literature class has been shared',
      time: '5 days ago',
      type: 'Classes',
      unread: false,
      icon: '💻',
    },
  ]);

  const filterCategories = [
    { id: 'all', label: 'All Notifications', icon: Bell, count: notifications.length },
    { id: 'unread', label: 'Unread', icon: Circle, count: notifications.filter(n => n.unread).length },
    { id: 'academic', label: 'Academic', icon: BookOpen, count: notifications.filter(n => n.type === 'Academic').length },
    { id: 'classes', label: 'Classes', icon: BookOpen, count: notifications.filter(n => n.type === 'Classes').length },
    { id: 'payments', label: 'Payments', icon: CreditCard, count: notifications.filter(n => n.type === 'Payment').length },
    { id: 'warnings', label: 'Warnings', icon: AlertTriangle, count: notifications.filter(n => n.type === 'Warning').length },
    { id: 'system', label: 'System', icon: Settings, count: notifications.filter(n => n.type === 'System').length },
  ];

  const getFilteredNotifications = () => {
    if (activeFilter === 'all') return notifications;
    if (activeFilter === 'unread') return notifications.filter(n => n.unread);
    
    const typeMap: Record<NotificationType, string> = {
      'academic': 'Academic',
      'classes': 'Classes',
      'payments': 'Payment',
      'warnings': 'Warning',
      'system': 'System',
      'all': '',
      'unread': '',
    };
    
    return notifications.filter(n => n.type === typeMap[activeFilter]);
  };

  const filteredNotifications = getFilteredNotifications();

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const handleNotificationClick = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, unread: false } : n
    ));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Academic': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Classes': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'Payment': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Warning': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'System': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      default: return 'bg-white/20 text-white/70 border-white/30';
    }
  };

  return (
    <>
      <DashboardLayout
        userRole="student"
        userName="Gayantha"
        userInitials="GP"
        notificationCount={notifications.filter(n => n.unread).length}
        breadcrumb="Notifications"
        activePage="notifications"
        onNavigate={onNavigate}
        onLogout={onLogout}
      >
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => onNavigate?.('dashboard')}
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-4 group"
              >
                <ArrowLeft
                  size={20}
                  className="group-hover:-translate-x-1 transition-transform"
                />
                <span>Back to Dashboard</span>
              </button>
              <h1 className="text-3xl font-bold text-white mb-2">Notifications</h1>
              <p className="text-white/60">Stay updated with your academic activities</p>
            </div>

            {/* Mark All Read Button */}
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:shadow-[0_0_24px_rgba(59,130,246,0.6)] transition-all duration-300 transform hover:scale-105"
            >
              <CheckCheck size={20} />
              <span>Mark all as read</span>
            </button>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* LEFT COLUMN - Filter Panel */}
            <div className="lg:col-span-1">
              <GlassCard className="p-6 sticky top-8">
                <h2 className="text-white font-bold text-lg mb-4">Filter By</h2>
                <div className="space-y-2">
                  {filterCategories.map((category) => {
                    const Icon = category.icon;
                    const isActive = activeFilter === category.id;

                    return (
                      <button
                        key={category.id}
                        onClick={() => setActiveFilter(category.id as NotificationType)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${
                          isActive
                            ? 'bg-gradient-to-r from-blue-500/20 to-cyan-400/20 border border-cyan-400/30 shadow-[0_0_16px_rgba(6,182,212,0.3)]'
                            : 'bg-white/5 hover:bg-white/10 border border-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon
                            size={18}
                            className={isActive ? 'text-cyan-400' : 'text-white/70'}
                          />
                          <span
                            className={`font-medium ${
                              isActive ? 'text-white' : 'text-white/70'
                            }`}
                          >
                            {category.label}
                          </span>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            isActive
                              ? 'bg-cyan-400/20 text-cyan-400'
                              : 'bg-white/10 text-white/60'
                          }`}
                        >
                          {category.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </GlassCard>
            </div>

            {/* RIGHT COLUMN - Notifications List */}
            <div className="lg:col-span-3">
              <GlassCard className="p-6">
                {/* List Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                  <h2 className="text-white font-bold text-xl">
                    {filterCategories.find(c => c.id === activeFilter)?.label || 'All Notifications'}
                  </h2>
                  <span className="text-white/60 text-sm">{filteredNotifications.length} total</span>
                </div>

                {/* Notifications List */}
                <div className="space-y-3">
                  {filteredNotifications.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">📭</div>
                      <p className="text-white/60 text-lg">No notifications found</p>
                    </div>
                  ) : (
                    filteredNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification.id)}
                        className={`p-5 rounded-xl transition-all duration-300 cursor-pointer group ${
                          notification.unread
                            ? 'bg-blue-500/10 border-l-4 border-l-cyan-400 hover:bg-blue-500/15 shadow-[0_0_16px_rgba(6,182,212,0.2)]'
                            : 'bg-white/5 hover:bg-white/10 border border-white/5'
                        }`}
                      >
                        <div className="flex gap-4">
                          {/* Icon */}
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-400/20 flex items-center justify-center text-2xl">
                              {notification.icon}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-white font-semibold text-lg group-hover:text-cyan-400 transition-colors">
                                {notification.title}
                              </h3>
                              {notification.unread && (
                                <div className="w-3 h-3 bg-cyan-400 rounded-full flex-shrink-0 ml-2 mt-1 shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
                              )}
                            </div>

                            <p className="text-white/70 text-sm mb-3 leading-relaxed">
                              {notification.description}
                            </p>

                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1.5 text-white/50 text-xs">
                                <Clock size={14} />
                                <span>{notification.time}</span>
                              </div>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTypeColor(
                                  notification.type
                                )}`}
                              >
                                {notification.type}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </DashboardLayout>

      {/* AI Chatbot */}
      <AIChat />
    </>
  );
}
