import React, { useState, useEffect } from 'react';
import { GlassCard } from '../glass-card';
import { X, Save, Plus, AlertCircle } from 'lucide-react';
import { apiRequest } from '../../lib/api';
import { getStoredAuth } from '../../lib/auth';

interface CreateClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function TeacherCreateClassModal({ isOpen, onClose, onSuccess }: CreateClassModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    fee: '',
    schedule: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.fee) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const auth = getStoredAuth();
      await apiRequest('/classes', {
        method: 'POST',
        token: auth?.token,
        body: {
          ...formData,
          fee: parseFloat(formData.fee),
        },
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl animate-in zoom-in-95 duration-200">
        <GlassCard className="p-0 border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-blue-500/10 to-purple-500/10">
            <div>
              <h2 className="text-2xl font-bold text-white">Create New Class</h2>
              <p className="text-white/60 text-sm">Propose a new class for admin approval</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/50 flex items-center gap-3 text-red-200">
                <AlertCircle size={20} />
                <p>{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Class Name */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white/80">Class Name</label>
                <input
                  type="text"
                  placeholder="e.g. Physics 2026 Theory"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-all"
                  required
                />
              </div>

              {/* Fee */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white/80">Monthly Fee (LKR)</label>
                <input
                  type="number"
                  placeholder="e.g. 5000"
                  value={formData.fee}
                  onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-all"
                  required
                />
              </div>

              {/* Schedule */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-white/80">Schedule</label>
                <input
                  type="text"
                  placeholder="e.g. Every Saturday 8:00 AM - 12:00 PM"
                  value={formData.schedule}
                  onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-all"
                />
              </div>

              {/* Description */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-white/80">Description</label>
                <textarea
                  placeholder="Enter class details, curriculum overview, etc."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-all resize-none"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save size={20} />
                )}
                <span>Submit for Approval</span>
              </button>
            </div>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}
