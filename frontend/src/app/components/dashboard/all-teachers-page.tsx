import React, { useState } from 'react';
import { DashboardLayout } from './dashboard-layout';
import { GlassCard } from '../glass-card';
import { AIChat } from './ai-chat';
import {
  Search,
  Star,
  GraduationCap,
  BookOpen,
  Users,
  Award,
  TrendingUp,
} from 'lucide-react';

interface AllTeachersPageProps {
  onLogout?: () => void;
  onNavigate?: (page: string, data?: any) => void;
}

interface Teacher {
  id: number;
  name: string;
  subject: string;
  level: string;
  quote: string;
  rating: number;
  reviewCount: number;
  profileImage: string;
  experience: string;
  studentCount: number;
  courseCount: number;
}

export function AllTeachersPage({ onLogout, onNavigate }: AllTeachersPageProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Sample teacher data
  const teachers: Teacher[] = [
    {
      id: 1,
      name: 'Mr. Amila Dasanayake',
      subject: 'Chemistry',
      level: 'A/L 2026',
      quote: 'Empowering Students with Science',
      rating: 4.8,
      reviewCount: 156,
      profileImage:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      experience: '12 Years',
      studentCount: 450,
      courseCount: 8,
    },
    {
      id: 2,
      name: 'Ms. Nadeesha Fernando',
      subject: 'Biology',
      level: 'A/L 2026',
      quote: 'Making Biology Simple and Fun',
      rating: 4.9,
      reviewCount: 203,
      profileImage:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      experience: '10 Years',
      studentCount: 520,
      courseCount: 6,
    },
    {
      id: 3,
      name: 'Mr. Suresh Bandara',
      subject: 'ICT',
      level: 'A/L 2026',
      quote: 'Teaching Technology for Tomorrow',
      rating: 4.7,
      reviewCount: 134,
      profileImage:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      experience: '8 Years',
      studentCount: 380,
      courseCount: 10,
    },
    {
      id: 4,
      name: 'Ms. Thisara Perera',
      subject: 'Mathematics',
      level: 'A/L 2026',
      quote: 'Numbers Don\'t Lie, They Inspire',
      rating: 4.9,
      reviewCount: 267,
      profileImage:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      experience: '15 Years',
      studentCount: 680,
      courseCount: 12,
    },
    {
      id: 5,
      name: 'Mr. Kasun Silva',
      subject: 'Physics',
      level: 'A/L 2026',
      quote: 'Unraveling the Mysteries of the Universe',
      rating: 4.8,
      reviewCount: 189,
      profileImage:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
      experience: '11 Years',
      studentCount: 420,
      courseCount: 7,
    },
    {
      id: 6,
      name: 'Ms. Dilani Jayasinghe',
      subject: 'English',
      level: 'A/L 2026',
      quote: 'Mastering Language, Unlocking Opportunities',
      rating: 4.7,
      reviewCount: 145,
      profileImage:
        'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400',
      experience: '9 Years',
      studentCount: 340,
      courseCount: 5,
    },
  ];

  // Filter teachers based on search query
  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewProfile = (teacher: Teacher) => {
    if (onNavigate) {
      onNavigate('teacher-profile', teacher);
    }
  };

  return (
    <>
      <DashboardLayout
        userRole="student"
        userName="Gayantha"
        userInitials="GP"
        notificationCount={5}
        breadcrumb="Teachers"
        activePage="teachers"
        onNavigate={onNavigate}
        onLogout={onLogout}
      >
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
            {/* Title */}
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">All Teachers</h1>
              <p className="text-white/60">
                Browse teachers and explore their courses
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full lg:w-96">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search teacher by name or subject"
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_12px_rgba(34,211,238,0.3)] transition-all duration-300"
              />
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <GlassCard className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Users size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-white/60 text-sm">Total Teachers</p>
                  <p className="text-white text-xl font-bold">{teachers.length}</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <BookOpen size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-white/60 text-sm">Total Courses</p>
                  <p className="text-white text-xl font-bold">
                    {teachers.reduce((sum, t) => sum + t.courseCount, 0)}
                  </p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Award size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-white/60 text-sm">Avg Rating</p>
                  <p className="text-white text-xl font-bold">
                    {(
                      teachers.reduce((sum, t) => sum + t.rating, 0) /
                      teachers.length
                    ).toFixed(1)}
                  </p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                  <TrendingUp size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-white/60 text-sm">Total Students</p>
                  <p className="text-white text-xl font-bold">
                    {teachers.reduce((sum, t) => sum + t.studentCount, 0)}
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Teacher Cards Grid */}
        {filteredTeachers.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <p className="text-white/60 text-lg">
              No teachers found matching "{searchQuery}"
            </p>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeachers.map((teacher) => (
              <GlassCard
                key={teacher.id}
                className="p-6 hover:bg-white/10 transition-all duration-300 group cursor-pointer hover:shadow-[0_0_32px_rgba(59,130,246,0.3)] hover:scale-105"
              >
                {/* Profile Image */}
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <img
                    src={teacher.profileImage}
                    alt={teacher.name}
                    className="w-full h-full rounded-full object-cover border-4 border-white/10 group-hover:border-cyan-400/50 transition-all duration-300"
                  />
                  {/* Floating Badge */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-[0_0_16px_rgba(59,130,246,0.6)]">
                    <GraduationCap size={20} className="text-white" />
                  </div>
                </div>

                {/* Name */}
                <h3 className="text-xl font-bold text-white text-center mb-2">
                  {teacher.name}
                </h3>

                {/* Subject */}
                <p className="text-cyan-400 text-center font-semibold mb-2">
                  {teacher.subject} | {teacher.level}
                </p>

                {/* Quote */}
                <p className="text-white/60 text-sm text-center italic mb-4">
                  "{teacher.quote}"
                </p>

                {/* Stats Row */}
                <div className="flex items-center justify-center gap-4 mb-4 text-sm text-white/60">
                  <div className="flex items-center gap-1">
                    <BookOpen size={16} className="text-cyan-400" />
                    <span>{teacher.courseCount} courses</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={16} className="text-cyan-400" />
                    <span>{teacher.studentCount}+ students</span>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center justify-center gap-2 mb-6">
                  <Star size={18} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-white font-bold">{teacher.rating}</span>
                  <span className="text-white/60 text-sm">
                    ({teacher.reviewCount} reviews)
                  </span>
                </div>

                {/* Button */}
                <button
                  onClick={() => handleViewProfile(teacher)}
                  className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:shadow-[0_0_24px_rgba(59,130,246,0.6)] transition-all duration-300 transform group-hover:scale-105"
                >
                  View Profile
                </button>
              </GlassCard>
            ))}
          </div>
        )}
      </DashboardLayout>

      <AIChat />
    </>
  );
}
