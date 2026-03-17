import React, { useState, useEffect } from 'react';
import { GlassCard } from '../glass-card';
import { X, Save, Plus, Trash2, FileText, Link as LinkIcon, Download, AlertCircle, Loader2 } from 'lucide-react';
import { apiRequest } from '../../lib/api';

interface Resource {
  id: string;
  title: string;
  type: 'ASSIGNMENT' | 'NOTE' | 'LINK';
  content: string;
  createdAt: string;
}

interface ManageResourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
  classId: string;
  className: string;
}

export function TeacherManageResourcesModal({ isOpen, onClose, classId, className }: ManageResourcesModalProps) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New resource form
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'ASSIGNMENT' | 'NOTE' | 'LINK'>('NOTE');
  const [newContent, setNewContent] = useState('');

  const fetchResources = async () => {
    if (!classId) return;
    try {
      setLoading(true);
      // Assuming we have an endpoint to fetch resources for a class
      // For now, we'll use the teacher classes endpoint which might include them or we need a specific one
      // Let's assume the teacher dashboard fetch includes them or we fetch them here
      const data = await apiRequest<{ classes: any[] }>('/classes/teacher');
      const currentClass = data.classes.find(c => c.id === classId);
      if (currentClass) {
        setResources(currentClass.resources || []);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch resources');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchResources();
    }
  }, [isOpen, classId]);

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    try {
      setAdding(true);
      await apiRequest(`/classes/${classId}/resources`, {
        method: 'POST',
        body: {
          title: newTitle,
          type: newType,
          content: newContent
        }
      });
      
      // Reset form and refresh
      setNewTitle('');
      setNewContent('');
      fetchResources();
    } catch (err: any) {
      setError(err.message || 'Failed to add resource');
    } finally {
      setAdding(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'ASSIGNMENT': return <FileText size={18} className="text-orange-400" />;
      case 'NOTE': return <Download size={18} className="text-blue-400" />;
      case 'LINK': return <LinkIcon size={18} className="text-green-400" />;
      default: return <FileText size={18} />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <GlassCard className="max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col relative animate-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white p-2 hover:bg-white/10 rounded-full transition-all"
        >
          <X size={24} />
        </button>

        <div className="p-8 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white mb-1">Manage Resources</h2>
          <p className="text-cyan-400 font-medium">{className}</p>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
              <AlertCircle size={20} />
              <p>{error}</p>
            </div>
          )}

          {/* Add New Resource Form */}
          <form onSubmit={handleAddResource} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Plus size={20} className="text-cyan-400" />
              Add New Resource
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-white/60">Title</label>
                <input 
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Week 1 Lecture Notes"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400 transition-all"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-white/60">Type</label>
                <select 
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full bg-[#1A1F2E] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400 transition-all"
                >
                  <option value="NOTE">Note / Document</option>
                  <option value="ASSIGNMENT">Assignment</option>
                  <option value="LINK">Class Link / External URL</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white/60">Content (Link or description)</label>
              <input 
                type="text"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder={newType === 'LINK' ? 'https://zoom.us/j/...' : 'Enter resource link or details'}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400 transition-all"
                required
              />
            </div>

            <button 
              type="submit"
              disabled={adding}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {adding ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
              Add Resource
            </button>
          </form>

          {/* Resources List */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Current Resources</h3>
            
            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="animate-spin text-cyan-400 mx-auto mb-4" size={40} />
                <p className="text-white/60">Loading resources...</p>
              </div>
            ) : resources.length === 0 ? (
              <div className="text-center py-12 bg-white/5 rounded-2xl border border-dashed border-white/10">
                <p className="text-white/40 italic">No resources added yet.</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {resources.map((res) => (
                  <div key={res.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-white/5">
                        {getIcon(res.type)}
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">{res.title}</h4>
                        <p className="text-white/40 text-xs truncate max-w-[200px] md:max-w-md">
                          {res.content}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-white/30 uppercase font-bold px-2 py-1 rounded bg-white/5 border border-white/5">
                        {res.type}
                      </span>
                      {/* Delete button (functionality to be added later) */}
                      <button className="text-white/20 hover:text-red-400 transition-colors p-1 opacity-0 group-hover:opacity-100">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-white/10 text-center">
          <button 
            onClick={onClose}
            className="px-8 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl transition-all"
          >
            Close
          </button>
        </div>
      </GlassCard>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
      `}</style>
    </div>
  );
}
