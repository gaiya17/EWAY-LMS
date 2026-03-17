import React, { useState, useEffect } from 'react';
import { DashboardLayout } from './dashboard-layout';
import { GlassCard } from '../glass-card';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  BookOpen, 
  DollarSign, 
  Calendar,
  AlertCircle,
  ArrowLeft,
  Search
} from 'lucide-react';
import { apiRequest } from '../../lib/api';
import { getStoredAuth } from '../../lib/auth';

interface AdminApproveClassesProps {
  onLogout?: () => void;
  onNavigate?: (page: string) => void;
}

export function AdminApproveClasses({ onLogout, onNavigate }: AdminApproveClassesProps) {
  const [pendingClasses, setPendingClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPending = async () => {
    try {
      setLoading(true);
      const auth = getStoredAuth();
      const data = await apiRequest<{ classes: any[] }>('/classes/pending', {
        token: auth?.token,
      });
      setPendingClasses(data.classes);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch pending classes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleAction = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const auth = getStoredAuth();
      await apiRequest(`/classes/${id}/status`, {
        method: 'PATCH',
        body: { status },
        token: auth?.token,
      });
      // Refresh list
      fetchPending();
    } catch (err: any) {
      alert(err.message || 'Operation failed');
    }
  };

  const filteredClasses = pendingClasses.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.teacher?.user?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout
      userRole="admin"
      userName="Admin"
      userInitials="AD"
      notificationCount={7}
      breadcrumb="Approve Classes"
      activePage="admin-approve-classes"
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      <div className="mb-8">
        <button
          onClick={() => onNavigate?.('dashboard')}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-4 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </button>
        <h1 className="text-3xl font-bold text-white mb-2">Class Approvals</h1>
        <p className="text-white/60">Review and approve new class proposals from teachers</p>
      </div>

      <GlassCard className="p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={20} />
            <input
              type="text"
              placeholder="Search by class or teacher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-all"
            />
          </div>
          <div className="flex gap-4">
            <div className="px-4 py-2 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center gap-2">
              <Clock size={16} className="text-orange-400" />
              <span className="text-orange-400 font-semibold">{pendingClasses.length} Pending</span>
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white/60">Loading proposals...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-red-500/10 rounded-2xl border border-red-500/20">
            <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
            <p className="text-red-400 font-semibold">{error}</p>
            <button onClick={fetchPending} className="mt-4 text-cyan-400 hover:underline">Try Again</button>
          </div>
        ) : filteredClasses.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-400/50" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">All Caught Up!</h3>
            <p className="text-white/60">There are no pending class proposals at the moment.</p>
          </GlassCard>
        ) : (
          filteredClasses.map((cls) => (
            <GlassCard key={cls.id} className="p-6 hover:border-white/30 transition-all duration-300">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Info Section */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{cls.name}</h3>
                      <p className="text-cyan-400 text-sm font-semibold uppercase tracking-wider">
                        {cls.course?.name || 'Uncategorized Course'}
                      </p>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold border border-orange-500/30">
                      PENDING REVIEW
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 text-white/70">
                      <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                        <User size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] text-white/40 uppercase">Teacher</p>
                        <p className="text-sm font-medium">{cls.teacher?.user?.name || 'Unknown'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-white/70">
                      <div className="p-2 rounded-lg bg-green-500/20 text-green-400">
                        <DollarSign size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] text-white/40 uppercase">Monthly Fee</p>
                        <p className="text-sm font-medium">LKR {cls.fee?.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-white/70">
                      <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] text-white/40 uppercase">Schedule</p>
                        <p className="text-sm font-medium">{cls.schedule || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>

                  {cls.description && (
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-sm text-white/60 leading-relaxed italic line-clamp-2">
                        "{cls.description}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions Section */}
                <div className="flex lg:flex-col gap-3 justify-center border-t lg:border-t-0 lg:border-l border-white/10 pt-6 lg:pt-0 lg:pl-6">
                  <button
                    onClick={() => handleAction(cls.id, 'APPROVED')}
                    className="flex-1 lg:w-40 px-6 py-3 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={20} />
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(cls.id, 'REJECTED')}
                    className="flex-1 lg:w-40 px-6 py-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-400 font-bold hover:bg-red-500/30 transition-all flex items-center justify-center gap-2"
                  >
                    <XCircle size={20} />
                    Reject
                  </button>
                </div>
              </div>
            </GlassCard>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
