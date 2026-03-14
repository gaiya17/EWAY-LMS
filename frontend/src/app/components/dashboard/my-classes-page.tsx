import React, { useState } from 'react';
import { DashboardLayout } from './dashboard-layout';
import { GlassCard } from '../glass-card';
import { AIChat } from './ai-chat';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import {
  ArrowLeft,
  BookOpen,
  Play,
  CheckCircle,
  Clock,
  Plus,
  Search,
  Wifi,
  MapPin,
  User,
  Calendar,
  FileText,
} from 'lucide-react';

interface MyClassesPageProps {
  onLogout?: () => void;
  onNavigate?: (page: string) => void;
}

type ClassType = 'online' | 'physical';
type ClassStatus = 'active' | 'completed';
type FilterType = 'all' | 'active' | 'completed' | 'online' | 'physical';

interface ClassData {
  id: number;
  title: string;
  teacher: string;
  schedule: string;
  duration: string;
  progress: number;
  type: ClassType;
  status: ClassStatus;
  thumbnail: string;
}

export function MyClassesPage({ onLogout, onNavigate }: MyClassesPageProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const classes: ClassData[] = [
    {
      id: 1,
      title: 'A/L Chemistry 2026',
      teacher: 'Mr. Amila Dasanayake',
      schedule: 'Every Saturday 8:00 AM - 12:00 PM',
      duration: '4 hours',
      progress: 65,
      type: 'online',
      status: 'active',
      thumbnail: 'https://images.unsplash.com/photo-1608037222022-62649819f8aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVtaXN0cnklMjBsYWJvcmF0b3J5JTIwZWR1Y2F0aW9ufGVufDF8fHx8MTc3MTc3MDU4NXww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 2,
      title: 'A/L Combined Mathematics',
      teacher: 'Ms. Nadeeka Fernando',
      schedule: 'Every Sunday 2:00 PM - 6:00 PM',
      duration: '4 hours',
      progress: 78,
      type: 'physical',
      status: 'active',
      thumbnail: 'https://images.unsplash.com/photo-1758685734312-5134968399a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXRoZW1hdGljcyUyMGVxdWF0aW9ucyUyMGJsYWNrYm9hcmR8ZW58MXx8fHwxNzcxNzc5OTA5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 3,
      title: 'A/L Physics - Advanced Level',
      teacher: 'Mr. Kasun Perera',
      schedule: 'Every Friday 5:00 PM - 9:00 PM',
      duration: '4 hours',
      progress: 45,
      type: 'online',
      status: 'active',
      thumbnail: 'https://images.unsplash.com/photo-1765207633730-001e54ec6aba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaHlzaWNzJTIwc2NpZW5jZSUyMGxhYm9yYXRvcnl8ZW58MXx8fHwxNzcxODQ5NzQxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 4,
      title: 'A/L Biology - Complete Course',
      teacher: 'Dr. Saman Silva',
      schedule: 'Every Thursday 6:00 PM - 9:00 PM',
      duration: '3 hours',
      progress: 92,
      type: 'online',
      status: 'active',
      thumbnail: 'https://images.unsplash.com/photo-1743792930023-774d74a015cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaW9sb2d5JTIwbWljcm9zY29wZSUyMHNjaWVuY2V8ZW58MXx8fHwxNzcxODQ5NzQxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 5,
      title: 'English Language & Literature',
      teacher: 'Mrs. Priya Jayawardena',
      schedule: 'Every Tuesday 4:00 PM - 6:00 PM',
      duration: '2 hours',
      progress: 100,
      type: 'physical',
      status: 'completed',
      thumbnail: 'https://images.unsplash.com/photo-1699523525646-ae96e089474f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbmdsaXNoJTIwbGl0ZXJhdHVyZSUyMGJvb2tzfGVufDF8fHx8MTc3MTc2ODY0NHww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 6,
      title: 'ICT - Programming & Web Design',
      teacher: 'Mr. Dinesh Rajapaksa',
      schedule: 'Every Wednesday 7:00 PM - 9:00 PM',
      duration: '2 hours',
      progress: 55,
      type: 'online',
      status: 'active',
      thumbnail: 'https://images.unsplash.com/photo-1563630482997-07d8d7fbc9df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMHByb2dyYW1taW5nJTIwY29kaW5nfGVufDF8fHx8MTc3MTgzMjIyMHww&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ];

  // Calculate stats
  const stats = {
    totalEnrolled: classes.length,
    activeClasses: classes.filter((c) => c.status === 'active').length,
    completedClasses: classes.filter((c) => c.status === 'completed').length,
    totalHours: 156,
  };

  // Filter classes
  const getFilteredClasses = () => {
    let filtered = classes;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((c) =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (activeFilter === 'active') {
      filtered = filtered.filter((c) => c.status === 'active');
    } else if (activeFilter === 'completed') {
      filtered = filtered.filter((c) => c.status === 'completed');
    } else if (activeFilter === 'online') {
      filtered = filtered.filter((c) => c.type === 'online');
    } else if (activeFilter === 'physical') {
      filtered = filtered.filter((c) => c.type === 'physical');
    }

    return filtered;
  };

  const filteredClasses = getFilteredClasses();

  const handleBrowseCourses = () => {
    // Navigate to Purchase Classes page
    onNavigate?.('purchase');
  };

  const handleContinue = (classId: number) => {
    // Future: Navigate to class learning page
    console.log('Continue to class:', classId);
    alert('Class Learning Page - Coming Soon!');
  };

  const handleResources = (classId: number) => {
    // Future: Navigate to class resources
    console.log('Open resources for class:', classId);
    alert('Class Resources - Coming Soon!');
  };

  return (
    <>
      <DashboardLayout
        userRole="student"
        userName="Gayantha"
        userInitials="GP"
        notificationCount={5}
        breadcrumb="My Classes"
        activePage="classes"
        onNavigate={onNavigate}
        onLogout={onLogout}
      >
        <div className="space-y-8">
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
              <h1 className="text-3xl font-bold text-white mb-2">My Classes</h1>
              <p className="text-white/60">Access and manage your enrolled courses</p>
            </div>

            {/* Browse Courses Button */}
            <button
              onClick={handleBrowseCourses}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:shadow-[0_0_24px_rgba(59,130,246,0.6)] transition-all duration-300 transform hover:scale-105"
            >
              <Plus size={20} />
              <span>Browse Courses</span>
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Enrolled */}
            <GlassCard className="p-6 hover:shadow-[0_0_32px_rgba(59,130,246,0.3)] transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm mb-1">Total Enrolled</p>
                  <h3 className="text-white text-3xl font-bold">{stats.totalEnrolled}</h3>
                </div>
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-400/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BookOpen size={28} className="text-cyan-400" />
                </div>
              </div>
            </GlassCard>

            {/* Active Classes */}
            <GlassCard className="p-6 hover:shadow-[0_0_32px_rgba(34,197,94,0.3)] transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm mb-1">Active Classes</p>
                  <h3 className="text-white text-3xl font-bold">{stats.activeClasses}</h3>
                </div>
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-400/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play size={28} className="text-green-400" />
                </div>
              </div>
            </GlassCard>

            {/* Completed Classes */}
            <GlassCard className="p-6 hover:shadow-[0_0_32px_rgba(168,85,247,0.3)] transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm mb-1">Completed Classes</p>
                  <h3 className="text-white text-3xl font-bold">{stats.completedClasses}</h3>
                </div>
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-violet-400/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CheckCircle size={28} className="text-purple-400" />
                </div>
              </div>
            </GlassCard>

            {/* Total Learning Hours */}
            <GlassCard className="p-6 hover:shadow-[0_0_32px_rgba(251,146,60,0.3)] transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm mb-1">Learning Hours</p>
                  <h3 className="text-white text-3xl font-bold">{stats.totalHours} hrs</h3>
                </div>
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-400/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Clock size={28} className="text-orange-400" />
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Search & Filters */}
          <GlassCard className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Search Bar */}
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                <input
                  type="text"
                  placeholder="Search classes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400/50 focus:bg-white/10 transition-all"
                />
              </div>

              {/* Filters */}
              <div className="flex gap-2 flex-wrap">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'active', label: 'Active' },
                  { id: 'completed', label: 'Completed' },
                  { id: 'online', label: 'Online' },
                  { id: 'physical', label: 'Physical' },
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id as FilterType)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                      activeFilter === filter.id
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-[0_0_16px_rgba(59,130,246,0.5)]'
                        : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* Classes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <div className="text-6xl mb-4">📚</div>
                <p className="text-white/60 text-lg">No classes found</p>
                <p className="text-white/40 text-sm mt-2">Try adjusting your search or filters</p>
              </div>
            ) : (
              filteredClasses.map((classItem) => (
                <GlassCard
                  key={classItem.id}
                  className="p-0 overflow-hidden group hover:shadow-[0_0_32px_rgba(59,130,246,0.4)] transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1"
                >
                  {/* Thumbnail */}
                  <div className="relative h-48 overflow-hidden">
                    <ImageWithFallback
                      src={classItem.thumbnail}
                      alt={classItem.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F1A] via-[#0B0F1A]/60 to-transparent" />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      {/* Type Badge */}
                      <div
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 backdrop-blur-xl border ${
                          classItem.type === 'online'
                            ? 'bg-blue-500/30 text-blue-300 border-blue-400/50'
                            : 'bg-orange-500/30 text-orange-300 border-orange-400/50'
                        }`}
                      >
                        {classItem.type === 'online' ? (
                          <>
                            <Wifi size={12} />
                            Online
                          </>
                        ) : (
                          <>
                            <MapPin size={12} />
                            Physical
                          </>
                        )}
                      </div>

                      {/* Status Badge */}
                      <div
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 backdrop-blur-xl border ${
                          classItem.status === 'active'
                            ? 'bg-green-500/30 text-green-300 border-green-400/50'
                            : 'bg-gray-500/30 text-gray-300 border-gray-400/50'
                        }`}
                      >
                        {classItem.status === 'active' ? (
                          <>
                            <Play size={12} />
                            Active
                          </>
                        ) : (
                          <>
                            <CheckCircle size={12} />
                            Completed
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    {/* Progress Bar */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white/60 text-xs">Progress</span>
                        <span className="text-cyan-400 font-semibold text-sm">
                          {classItem.progress}%
                        </span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
                          style={{ width: `${classItem.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-white font-bold text-xl group-hover:text-cyan-400 transition-colors">
                      {classItem.title}
                    </h3>

                    {/* Details */}
                    <div className="space-y-2">
                      {/* Teacher */}
                      <div className="flex items-center gap-2 text-white/70 text-sm">
                        <User size={16} className="text-cyan-400" />
                        <span>{classItem.teacher}</span>
                      </div>

                      {/* Schedule */}
                      <div className="flex items-center gap-2 text-white/70 text-sm">
                        <Calendar size={16} className="text-cyan-400" />
                        <span>{classItem.schedule}</span>
                      </div>

                      {/* Duration */}
                      <div className="flex items-center gap-2 text-white/70 text-sm">
                        <Clock size={16} className="text-cyan-400" />
                        <span>{classItem.duration}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => handleContinue(classItem.id)}
                        className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:shadow-[0_0_16px_rgba(59,130,246,0.6)] transition-all duration-300 transform hover:scale-105"
                      >
                        {classItem.status === 'completed' ? 'Review' : 'Continue'}
                      </button>
                      <button
                        onClick={() => handleResources(classItem.id)}
                        className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition-all duration-300 group/btn"
                      >
                        <FileText size={20} className="group-hover/btn:text-cyan-400 transition-colors" />
                      </button>
                    </div>
                  </div>
                </GlassCard>
              ))
            )}
          </div>
        </div>
      </DashboardLayout>

      {/* AI Chatbot */}
      <AIChat />
    </>
  );
}
