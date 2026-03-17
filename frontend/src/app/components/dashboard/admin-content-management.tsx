import React, { useState } from 'react';
import { DashboardLayout } from './dashboard-layout';
import { GlassCard } from '../glass-card';
import { AdminApproveClasses } from './admin-approve-classes';
import { 
  BookOpen, 
  Files, 
  CheckCircle, 
  Clock, 
  LayoutGrid, 
  Filter,
  Search,
  Sparkles
} from 'lucide-react';

interface AdminContentManagementProps {
  onLogout?: () => void;
  onNavigate?: (page: string, data?: any) => void;
}

export function AdminContentManagementPage({ onLogout, onNavigate }: AdminContentManagementProps) {
  const [activeTab, setActiveTab] = useState<'classes' | 'study-packs'>('classes');

  return (
    <DashboardLayout
      userRole="admin"
      userName="Admin"
      userInitials="AD"
      breadcrumb="Content Management"
      activePage="admin-content"
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Content Management</h1>
        <p className="text-white/60">Review and moderate educational content and resources</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab('classes')}
          className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
            activeTab === 'classes'
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-[0_0_24px_rgba(59,130,246,0.4)]'
              : 'bg-white/5 text-white/60 hover:bg-white/10'
          }`}
        >
          <BookOpen size={20} />
          Classes Approval
        </button>
        <button
          onClick={() => setActiveTab('study-packs')}
          className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
            activeTab === 'study-packs'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-[0_0_24px_rgba(168,85,247,0.4)]'
              : 'bg-white/5 text-white/60 hover:bg-white/10'
          }`}
        >
          <Files size={20} />
          Study Pack Moderation
        </button>
      </div>

      {activeTab === 'classes' ? (
        <AdminApproveClasses onLogout={onLogout} onNavigate={onNavigate} />
      ) : (
        <div className="space-y-6 animate-in fade-in duration-500">
           <GlassCard className="p-12 text-center">
             <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
               <Sparkles size={40} className="text-purple-400" />
             </div>
             <h3 className="text-2xl font-bold text-white mb-3">Study Pack Moderation</h3>
             <p className="text-white/60 max-w-md mx-auto mb-6">
               This module is currently being optimized. You'll soon be able to approve and moderate study packs from this interface.
             </p>
             <div className="inline-flex px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/40 text-sm font-medium">
               Feature arriving in Sprint 2
             </div>
           </GlassCard>
        </div>
      )}
    </DashboardLayout>
  );
}
