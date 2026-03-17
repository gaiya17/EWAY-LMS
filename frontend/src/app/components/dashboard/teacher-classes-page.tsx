import React, { useState, useEffect } from 'react';
import { DashboardLayout } from './dashboard-layout';
import { GlassCard } from '../glass-card';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import {
  ArrowLeft,
  BookOpen,
  Users,
  CheckCircle,
  Clock,
  Video,
  MapPin,
  Calendar,
  TrendingUp,
  FileText,
  BarChart3,
  Plus,
  AlertCircle,
} from 'lucide-react';
import { apiRequest } from '../../lib/api';
import { getStoredAuth } from '../../lib/auth';
import { TeacherCreateClassModal } from './teacher-create-class-modal';
import { TeacherManageResourcesModal } from './teacher-manage-resources-modal';

interface TeacherClassesPageProps {
  onLogout?: () => void;
  onNavigate?: (page: string) => void;
}

export function TeacherClassesPage({
  onLogout,
  onNavigate,
}: TeacherClassesPageProps) {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Resource management modal state
  const [isResourcesModalOpen, setIsResourcesModalOpen] = useState(false);
  const [selectedClassForResources, setSelectedClassForResources] = useState<{id: string, name: string} | null>(null);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const auth = getStoredAuth();
      const data = await apiRequest<{ classes: any[] }>('/classes/teacher', {
        token: auth?.token,
      });
      setClasses(data.classes);
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch classes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const stats = [
    {
      title: 'Total Classes',
      value: classes.length.toString(),
      icon: BookOpen,
      color: 'blue',
      bgColor: 'bg-blue-500/20',
      textColor: 'text-blue-400',
    },
    {
      title: 'Approved',
      value: classes.filter(c => c.status === 'APPROVED').length.toString(),
      icon: CheckCircle,
      color: 'green',
      bgColor: 'bg-green-500/20',
      textColor: 'text-green-400',
    },
    {
      title: 'Pending',
      value: classes.filter(c => c.status === 'PENDING').length.toString(),
      icon: Clock,
      color: 'orange',
      bgColor: 'bg-orange-500/20',
      textColor: 'text-orange-400',
    },
    {
      title: 'Total Students',
      value: classes.reduce((acc, c) => acc + (c.enrollments?.length || 0), 0).toString(),
      icon: Users,
      color: 'purple',
      bgColor: 'bg-purple-500/20',
      textColor: 'text-purple-400',
    },
  ];

  return (
    <DashboardLayout
      userRole="teacher"
      userName="Mr. Silva"
      userInitials="GS"
      notificationCount={8}
      breadcrumb="My Classes"
      activePage="teacher-classes"
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <button
              onClick={() => onNavigate?.('dashboard')}
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-3 group"
            >
              <ArrowLeft
                size={20}
                className="group-hover:-translate-x-1 transition-transform"
              />
              <span>Back to Dashboard</span>
            </button>
            <h1 className="text-3xl font-bold text-white mb-2">My Classes</h1>
            <p className="text-white/60">
              Manage and track your teaching schedule
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:shadow-[0_0_24px_rgba(59,130,246,0.6)] transition-all duration-300 flex items-center gap-2"
          >
            <Plus size={20} />
            Create Class
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <GlassCard key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm mb-2">{stat.title}</p>
                  <p className="text-4xl font-bold text-white">{stat.value}</p>
                </div>
                <div
                  className={`w-14 h-14 rounded-xl ${stat.bgColor} flex items-center justify-center`}
                >
                  <Icon className={stat.textColor} size={28} />
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
           <div className="col-span-full text-center py-16">
             <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
             <p className="text-white/60">Loading your classes...</p>
           </div>
        ) : error ? (
          <div className="col-span-full text-center py-16">
            <div className="text-4xl mb-4">⚠️</div>
            <p className="text-red-400">{error}</p>
          </div>
        ) : classes.length === 0 ? (
          <GlassCard className="p-12 text-center col-span-full">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-6">
                <BookOpen className="text-blue-400" size={48} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                No Classes Yet
              </h3>
              <p className="text-white/60 mb-6">
                You haven't created any classes yet. Start by creating your first
                class.
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:shadow-[0_0_24px_rgba(59,130,246,0.6)] transition-all duration-300 flex items-center gap-2 mx-auto"
              >
                <Plus size={20} />
                Create First Class
              </button>
            </div>
          </GlassCard>
        ) : (
          classes.map((classItem) => (
            <GlassCard
              key={classItem.id}
              className="overflow-hidden hover:scale-[1.02] transition-all duration-300 hover:shadow-[0_0_32px_rgba(59,130,246,0.3)] group"
            >
              {/* Thumbnail */}
              <div className="relative h-48 overflow-hidden">
                <ImageWithFallback
                  src={classItem.thumbnail || 'https://images.unsplash.com/photo-1694230155228-cdde50083573?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVtaXN0cnklMjBzY2llbmNlJTIwY2xhc3N8ZW58MXx8fHwxNzcyNDc5NjM5fDA&ixlib=rb-4.1.0&q=80&w=1080'}
                  alt={classItem.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
  
                {/* Mode Badge */}
                <div className="absolute top-3 right-3">
                  <div
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/90 text-white"
                  >
                    <span className="flex items-center gap-1">
                        <Video size={12} />
                        Online
                    </span>
                  </div>
                </div>
  
                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <div className={`px-3 py-1 rounded-full text-white text-xs font-semibold flex items-center gap-1 ${
                    classItem.status === 'APPROVED' ? 'bg-green-500/90' : 
                    classItem.status === 'PENDING' ? 'bg-orange-500/90' : 'bg-red-500/90'
                  }`}>
                    {classItem.status === 'APPROVED' ? <CheckCircle size={12} /> : 
                     classItem.status === 'PENDING' ? <Clock size={12} /> : <AlertCircle size={12} />}
                    {classItem.status}
                  </div>
                </div>
  
                {/* Students Count */}
                <div className="absolute bottom-3 left-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-sm">
                    <Users className="text-white" size={16} />
                    <span className="text-white text-sm font-semibold">
                      {classItem.enrollments?.length || 0} Students
                    </span>
                  </div>
                </div>
              </div>
  
              {/* Content */}
              <div className="p-5">
                {/* Title */}
                <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">
                  {classItem.name}
                </h3>
                <p className="text-white/40 text-xs mb-3 italic">{classItem.course?.name}</p>
  
                {/* Class Info */}
                <div className="space-y-2 mb-4">
                  {/* Schedule */}
                  <div className="flex items-center gap-2 text-white/70 text-sm">
                    <Calendar size={16} className="text-blue-400" />
                    <span>{classItem.schedule || 'No schedule set'}</span>
                  </div>
  
                  {/* Fee */}
                  <div className="flex items-center gap-2 text-green-400 text-sm font-semibold">
                    <span>LKR {classItem.fee?.toLocaleString()} / month</span>
                  </div>
                </div>
  
                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      alert(`Manage ${classItem.name} - Coming Soon!`)
                    }
                    className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all duration-300 text-sm"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedClassForResources({ id: classItem.id, name: classItem.name });
                      setIsResourcesModalOpen(true);
                    }}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-cyan-400 font-semibold rounded-lg hover:from-blue-500/30 hover:to-cyan-500/30 transition-all flex items-center justify-center gap-2"
                  >
                    <BookOpen size={16} />
                    Manage Resources
                  </button>
                </div>
              </div>
            </GlassCard>
          ))
        )}
      </div>

      <TeacherCreateClassModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)} 
        onSuccess={fetchClasses}
      />

      {selectedClassForResources && (
        <TeacherManageResourcesModal
          isOpen={isResourcesModalOpen}
          onClose={() => {
            setIsResourcesModalOpen(false);
            fetchClasses(); // Refresh to show resource count if any
          }}
          classId={selectedClassForResources.id}
          className={selectedClassForResources.name}
        />
      )}
    </DashboardLayout>
  );
}
