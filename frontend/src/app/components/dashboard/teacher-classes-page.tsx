import React from 'react';
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
} from 'lucide-react';

interface TeacherClassesPageProps {
  onLogout?: () => void;
  onNavigate?: (page: string) => void;
}

export function TeacherClassesPage({
  onLogout,
  onNavigate,
}: TeacherClassesPageProps) {
  const stats = [
    {
      title: 'Total Classes',
      value: '8',
      icon: BookOpen,
      color: 'blue',
      bgColor: 'bg-blue-500/20',
      textColor: 'text-blue-400',
    },
    {
      title: 'Active Classes',
      value: '6',
      icon: Video,
      color: 'green',
      bgColor: 'bg-green-500/20',
      textColor: 'text-green-400',
    },
    {
      title: 'Total Students',
      value: '215',
      icon: Users,
      color: 'purple',
      bgColor: 'bg-purple-500/20',
      textColor: 'text-purple-400',
    },
    {
      title: 'Total Hours',
      value: '156',
      icon: Clock,
      color: 'orange',
      bgColor: 'bg-orange-500/20',
      textColor: 'text-orange-400',
    },
  ];

  const classes = [
    {
      id: 1,
      title: 'Advanced Mathematics - A/L 2026',
      subject: 'Mathematics',
      thumbnail:
        'https://images.unsplash.com/photo-1758685848084-fc51214f3cd0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXRoZW1hdGljcyUyMGNsYXNzcm9vbSUyMHRlYWNoaW5nfGVufDF8fHx8MTc3MjQxMTI4Nnww&ixlib=rb-4.1.0&q=80&w=1080',
      students: 35,
      schedule: 'Mon, Wed, Fri',
      time: '10:00 AM - 12:00 PM',
      duration: '2 hours',
      mode: 'Online',
      status: 'Active',
      progress: 65,
      nextClass: 'Tomorrow at 10:00 AM',
    },
    {
      id: 2,
      title: 'Physics Theory & Practicals',
      subject: 'Physics',
      thumbnail:
        'https://images.unsplash.com/photo-1767042286080-446afa2c78d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaHlzaWNzJTIwbGFib3JhdG9yeSUyMGVxdWlwbWVudHxlbnwxfHx8fDE3NzI0MTcyMzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      students: 28,
      schedule: 'Tue, Thu',
      time: '2:00 PM - 4:00 PM',
      duration: '2 hours',
      mode: 'Physical',
      status: 'Active',
      progress: 72,
      nextClass: 'Today at 2:00 PM',
    },
    {
      id: 3,
      title: 'Chemistry - A/L Science Stream',
      subject: 'Chemistry',
      thumbnail:
        'https://images.unsplash.com/photo-1694230155228-cdde50083573?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVtaXN0cnklMjBzY2llbmNlJTIwY2xhc3N8ZW58MXx8fHwxNzcyNDc5NjM5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      students: 32,
      schedule: 'Sat, Sun',
      time: '8:00 AM - 10:00 AM',
      duration: '2 hours',
      mode: 'Online',
      status: 'Active',
      progress: 58,
      nextClass: 'Saturday at 8:00 AM',
    },
    {
      id: 4,
      title: 'Computer Science & Programming',
      subject: 'Computer Science',
      thumbnail:
        'https://images.unsplash.com/photo-1563630482997-07d8d7fbc9df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMHByb2dyYW1taW5nJTIwY29kaW5nfGVufDF8fHx8MTc3MjQzOTU2NHww&ixlib=rb-4.1.0&q=80&w=1080',
      students: 42,
      schedule: 'Mon, Wed',
      time: '4:00 PM - 6:00 PM',
      duration: '2 hours',
      mode: 'Online',
      status: 'Active',
      progress: 80,
      nextClass: 'Monday at 4:00 PM',
    },
    {
      id: 5,
      title: 'Biology - Molecular & Cell Biology',
      subject: 'Biology',
      thumbnail:
        'https://images.unsplash.com/photo-1595256899816-bb1d65a24d2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaW9sb2d5JTIwc2NpZW5jZSUyMGVkdWNhdGlvbnxlbnwxfHx8fDE3NzI0Nzk2NDB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      students: 30,
      schedule: 'Tue, Fri',
      time: '9:00 AM - 11:00 AM',
      duration: '2 hours',
      mode: 'Physical',
      status: 'Active',
      progress: 45,
      nextClass: 'Tuesday at 9:00 AM',
    },
    {
      id: 6,
      title: 'English Literature & Language',
      subject: 'English',
      thumbnail:
        'https://images.unsplash.com/photo-1699523525646-ae96e089474f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbmdsaXNoJTIwbGl0ZXJhdHVyZSUyMGJvb2tzfGVufDF8fHx8MTc3MjQ3OTY0MHww&ixlib=rb-4.1.0&q=80&w=1080',
      students: 38,
      schedule: 'Thu, Sat',
      time: '3:00 PM - 5:00 PM',
      duration: '2 hours',
      mode: 'Online',
      status: 'Active',
      progress: 53,
      nextClass: 'Thursday at 3:00 PM',
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
            onClick={() => alert('Create New Class - Coming Soon!')}
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
        {classes.map((classItem) => (
          <GlassCard
            key={classItem.id}
            className="overflow-hidden hover:scale-[1.02] transition-all duration-300 hover:shadow-[0_0_32px_rgba(59,130,246,0.3)] group"
          >
            {/* Thumbnail */}
            <div className="relative h-48 overflow-hidden">
              <ImageWithFallback
                src={classItem.thumbnail}
                alt={classItem.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

              {/* Mode Badge */}
              <div className="absolute top-3 right-3">
                <div
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    classItem.mode === 'Online'
                      ? 'bg-blue-500/90 text-white'
                      : 'bg-orange-500/90 text-white'
                  }`}
                >
                  {classItem.mode === 'Online' ? (
                    <span className="flex items-center gap-1">
                      <Video size={12} />
                      Online
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <MapPin size={12} />
                      Physical
                    </span>
                  )}
                </div>
              </div>

              {/* Status Badge */}
              <div className="absolute top-3 left-3">
                <div className="px-3 py-1 rounded-full bg-green-500/90 text-white text-xs font-semibold flex items-center gap-1">
                  <CheckCircle size={12} />
                  {classItem.status}
                </div>
              </div>

              {/* Students Count */}
              <div className="absolute bottom-3 left-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-sm">
                  <Users className="text-white" size={16} />
                  <span className="text-white text-sm font-semibold">
                    {classItem.students} Students
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/60 text-xs">
                    Course Progress
                  </span>
                  <span className="text-cyan-400 text-xs font-semibold">
                    {classItem.progress}%
                  </span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
                    style={{ width: `${classItem.progress}%` }}
                  />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">
                {classItem.title}
              </h3>

              {/* Class Info */}
              <div className="space-y-2 mb-4">
                {/* Schedule */}
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <Calendar size={16} className="text-blue-400" />
                  <span>{classItem.schedule}</span>
                </div>

                {/* Time */}
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <Clock size={16} className="text-green-400" />
                  <span>{classItem.time}</span>
                </div>

                {/* Next Class */}
                <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold">
                  <TrendingUp size={16} />
                  <span>{classItem.nextClass}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() =>
                    alert(`View ${classItem.title} - Coming Soon!`)
                  }
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all duration-300 text-sm"
                >
                  View Class
                </button>
                <button
                  onClick={() => alert('Manage Class - Coming Soon!')}
                  className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 transition-colors text-sm"
                >
                  <BarChart3 size={18} />
                </button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Empty State (Hidden when classes exist) */}
      {classes.length === 0 && (
        <GlassCard className="p-12 text-center">
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
              onClick={() => alert('Create Class - Coming Soon!')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:shadow-[0_0_24px_rgba(59,130,246,0.6)] transition-all duration-300 flex items-center gap-2 mx-auto"
            >
              <Plus size={20} />
              Create First Class
            </button>
          </div>
        </GlassCard>
      )}
    </DashboardLayout>
  );
}
