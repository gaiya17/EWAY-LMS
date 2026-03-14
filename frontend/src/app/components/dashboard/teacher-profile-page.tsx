import React, { useState } from 'react';
import { DashboardLayout } from './dashboard-layout';
import { GlassCard } from '../glass-card';
import { AIChat } from './ai-chat';
import {
  Star,
  Mail,
  Building2,
  Award,
  MessageCircle,
  Clock,
  Users,
  DollarSign,
  Video,
  MapPin,
  Calendar,
  BookOpen,
  GraduationCap,
  TrendingUp,
} from 'lucide-react';

interface TeacherProfilePageProps {
  onLogout?: () => void;
  onNavigate?: (page: string, data?: any) => void;
  teacherData?: any;
}

interface Course {
  id: number;
  name: string;
  schedule: string;
  time: string;
  students: number;
  price: number;
  type: 'online' | 'physical';
  duration: string;
  location?: string;
}

interface Review {
  id: number;
  studentName: string;
  rating: number;
  comment: string;
  date: string;
  studentAvatar: string;
}

export function TeacherProfilePage({
  onLogout,
  onNavigate,
  teacherData,
}: TeacherProfilePageProps) {
  const [showChatModal, setShowChatModal] = useState(false);

  // Default teacher data
  const defaultTeacher = {
    id: 1,
    name: 'Mr. Amila Dasanayake',
    subject: 'Chemistry',
    level: 'A/L 2026',
    quote: 'Empowering Students with Science',
    rating: 4.8,
    reviewCount: 156,
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    experience: '12 Years',
    studentCount: 450,
    courseCount: 8,
    email: 'amila.d@ewayinstitute.lk',
    institute: 'EWAY Institute - Colombo Branch',
    isOnline: true,
    about:
      'Experienced chemistry teacher with over 12 years of excellence in A/L Chemistry education. Specialized in Physical, Organic, and Inorganic Chemistry with proven track record of helping students achieve top grades. My teaching methodology combines theoretical knowledge with practical applications, making complex concepts easy to understand.',
  };

  const teacher = { ...defaultTeacher, ...teacherData };

  // Sample courses
  const courses: Course[] = [
    {
      id: 1,
      name: '2026 A/L Chemistry Theory Class',
      schedule: 'Every Saturday',
      time: '8:00 AM – 12:00 PM',
      students: 45,
      price: 3500,
      type: 'physical',
      duration: '4 hours',
      location: 'EWAY Institute - Colombo',
    },
    {
      id: 2,
      name: 'Online Chemistry Revision Course',
      schedule: 'Every Sunday',
      time: '6:00 PM – 8:00 PM',
      students: 120,
      price: 2500,
      type: 'online',
      duration: '2 hours',
    },
    {
      id: 3,
      name: 'Organic Chemistry Master Class',
      schedule: 'Every Wednesday',
      time: '4:00 PM – 6:00 PM',
      students: 35,
      price: 3000,
      type: 'online',
      duration: '2 hours',
    },
    {
      id: 4,
      name: 'Past Paper Discussion (Physical)',
      schedule: 'Every Friday',
      time: '2:00 PM – 5:00 PM',
      students: 28,
      price: 2800,
      type: 'physical',
      duration: '3 hours',
      location: 'EWAY Institute - Colombo',
    },
  ];

  // Sample reviews
  const reviews: Review[] = [
    {
      id: 1,
      studentName: 'Sahan Perera',
      rating: 5,
      comment:
        'Excellent teacher! His teaching methods are very clear and easy to understand. I improved my chemistry grade from C to A within 6 months.',
      date: '2 weeks ago',
      studentAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100',
    },
    {
      id: 2,
      studentName: 'Nethmi Silva',
      rating: 5,
      comment:
        'Best chemistry teacher I\'ve ever had. He explains complex organic chemistry concepts in a simple way. Highly recommended!',
      date: '1 month ago',
      studentAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    },
    {
      id: 3,
      studentName: 'Ravindu Fernando',
      rating: 4,
      comment:
        'Great teacher with lots of experience. The classes are well-structured and he provides excellent study materials.',
      date: '1 month ago',
      studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    },
    {
      id: 4,
      studentName: 'Ishara Jayasinghe',
      rating: 5,
      comment:
        'Mr. Amila is very patient and always willing to answer questions. His past paper discussions are extremely helpful.',
      date: '2 months ago',
      studentAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    },
  ];

  const handleEnroll = (course: Course) => {
    // Navigate to checkout or show enrollment modal
    console.log('Enroll in course:', course);
    alert(`Enrolling in ${course.name} - Coming Soon!`);
  };

  const handleChatWithTeacher = () => {
    // Navigate to chat page with teacher data
    if (onNavigate) {
      onNavigate('chat', teacher);
    }
  };

  return (
    <>
      <DashboardLayout
        userRole="student"
        userName="Gayantha"
        userInitials="GP"
        notificationCount={5}
        breadcrumb="Teachers / Profile"
        activePage="teachers"
        onNavigate={onNavigate}
        onLogout={onLogout}
      >
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT SIDE - Teacher Details Card */}
          <div className="lg:col-span-1">
            <GlassCard className="p-6 sticky top-8">
              {/* Profile Image with Online Indicator */}
              <div className="relative w-40 h-40 mx-auto mb-4">
                <img
                  src={teacher.profileImage}
                  alt={teacher.name}
                  className="w-full h-full rounded-full object-cover border-4 border-white/10"
                />
                {teacher.isOnline && (
                  <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-[#0B0F1A] shadow-[0_0_16px_rgba(34,197,94,0.6)]" />
                )}
              </div>

              {/* Name & Subject */}
              <h2 className="text-2xl font-bold text-white text-center mb-2">
                {teacher.name}
              </h2>
              <p className="text-cyan-400 text-center font-semibold mb-4">
                {teacher.subject} | {teacher.level}
              </p>

              {/* Rating */}
              <div className="flex items-center justify-center gap-2 mb-6 pb-6 border-b border-white/10">
                <Star size={20} className="text-yellow-400 fill-yellow-400" />
                <span className="text-white font-bold text-xl">{teacher.rating}</span>
                <span className="text-white/60">({teacher.reviewCount} reviews)</span>
              </div>

              {/* Contact Info */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                    <Mail size={18} className="text-cyan-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white/60 text-xs">Email</p>
                    <p className="text-white text-sm truncate">{teacher.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                    <Building2 size={18} className="text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white/60 text-xs">Institute</p>
                    <p className="text-white text-sm">{teacher.institute}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                    <Award size={18} className="text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white/60 text-xs">Experience</p>
                    <p className="text-white text-sm">{teacher.experience}</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-400/20">
                  <Users size={20} className="text-cyan-400 mb-1" />
                  <p className="text-white text-lg font-bold">{teacher.studentCount}+</p>
                  <p className="text-white/60 text-xs">Students</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-400/20">
                  <BookOpen size={20} className="text-green-400 mb-1" />
                  <p className="text-white text-lg font-bold">{teacher.courseCount}</p>
                  <p className="text-white/60 text-xs">Courses</p>
                </div>
              </div>

              {/* About Section */}
              <div className="mb-6">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                  <GraduationCap size={18} className="text-cyan-400" />
                  About
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">{teacher.about}</p>
              </div>

              {/* Chat Button */}
              <button
                onClick={handleChatWithTeacher}
                className="w-full px-6 py-3 rounded-xl border-2 border-cyan-400 text-cyan-400 font-semibold hover:bg-cyan-400 hover:text-white hover:shadow-[0_0_24px_rgba(34,211,238,0.5)] transition-all duration-300 flex items-center justify-center gap-2"
              >
                <MessageCircle size={18} />
                Chat with Teacher
              </button>
            </GlassCard>
          </div>

          {/* RIGHT SIDE - Courses & Reviews */}
          <div className="lg:col-span-2 space-y-8">
            {/* Courses Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Available Courses / Classes
                </h2>
                <span className="text-white/60 text-sm">
                  {courses.length} courses available
                </span>
              </div>

              <div className="space-y-4">
                {courses.map((course) => (
                  <GlassCard
                    key={course.id}
                    className="p-6 hover:bg-white/10 transition-all duration-300 hover:shadow-[0_0_24px_rgba(59,130,246,0.2)]"
                  >
                    {/* Course Header */}
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">
                          {course.name}
                        </h3>

                        {/* Schedule & Time */}
                        <div className="flex flex-wrap gap-4 mb-3">
                          <div className="flex items-center gap-2 text-white/70 text-sm">
                            <Calendar size={16} className="text-cyan-400" />
                            <span>{course.schedule}</span>
                          </div>
                          <div className="flex items-center gap-2 text-white/70 text-sm">
                            <Clock size={16} className="text-cyan-400" />
                            <span>{course.time}</span>
                          </div>
                        </div>

                        {/* Location (if physical) */}
                        {course.location && (
                          <div className="flex items-center gap-2 text-white/70 text-sm mb-2">
                            <MapPin size={16} className="text-cyan-400" />
                            <span>{course.location}</span>
                          </div>
                        )}

                        {/* Stats Row */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 text-white/60 text-sm">
                            <Users size={16} className="text-cyan-400" />
                            <span>{course.students} students</span>
                          </div>
                          <div className="flex items-center gap-2 text-white/60 text-sm">
                            <Clock size={16} className="text-cyan-400" />
                            <span>{course.duration}</span>
                          </div>
                        </div>
                      </div>

                      {/* Price & Badge */}
                      <div className="flex lg:flex-col items-center lg:items-end gap-3">
                        <span
                          className={`px-4 py-1.5 rounded-full text-xs font-semibold ${
                            course.type === 'online'
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-400/30'
                              : 'bg-orange-500/20 text-orange-400 border border-orange-400/30'
                          }`}
                        >
                          {course.type === 'online' ? (
                            <span className="flex items-center gap-1">
                              <Video size={14} />
                              Online
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <MapPin size={14} />
                              Physical
                            </span>
                          )}
                        </span>
                        <div className="text-right">
                          <p className="text-green-400 text-2xl font-bold">
                            LKR {course.price.toLocaleString()}
                          </p>
                          <p className="text-white/60 text-xs">per month</p>
                        </div>
                      </div>
                    </div>

                    {/* Enroll Button */}
                    <button
                      onClick={() => handleEnroll(course)}
                      className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold hover:shadow-[0_0_24px_rgba(34,197,94,0.6)] transition-all duration-300 transform hover:scale-105"
                    >
                      Enroll Now
                    </button>
                  </GlassCard>
                ))}
              </div>
            </div>

            {/* Ratings & Feedback Section */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">
                Ratings & Feedback
              </h2>

              {/* Overall Rating Summary */}
              <GlassCard className="p-6 mb-6">
                <div className="flex flex-col lg:flex-row items-center gap-6">
                  <div className="text-center lg:border-r lg:border-white/10 lg:pr-8">
                    <div className="text-6xl font-bold text-white mb-2">
                      {teacher.rating}
                    </div>
                    <div className="flex items-center justify-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={20}
                          className={
                            star <= Math.round(teacher.rating)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-white/20'
                          }
                        />
                      ))}
                    </div>
                    <p className="text-white/60 text-sm">
                      Based on {teacher.reviewCount} reviews
                    </p>
                  </div>

                  <div className="flex-1 w-full">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = reviews.filter((r) => r.rating === rating).length;
                      const percentage = (count / reviews.length) * 100;
                      return (
                        <div key={rating} className="flex items-center gap-3 mb-2">
                          <span className="text-white/60 text-sm w-8">{rating}★</span>
                          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-yellow-400 to-orange-400"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-white/60 text-sm w-12 text-right">
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </GlassCard>

              {/* Individual Reviews */}
              <div className="space-y-4">
                {reviews.map((review) => (
                  <GlassCard key={review.id} className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Student Avatar */}
                      <img
                        src={review.studentAvatar}
                        alt={review.studentName}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white/10"
                      />

                      {/* Review Content */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-white font-semibold">
                            {review.studentName}
                          </h4>
                          <span className="text-white/60 text-sm">{review.date}</span>
                        </div>

                        {/* Stars */}
                        <div className="flex items-center gap-1 mb-3">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={16}
                              className={
                                star <= review.rating
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-white/20'
                              }
                            />
                          ))}
                        </div>

                        {/* Comment */}
                        <p className="text-white/70 leading-relaxed">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>

      <AIChat />
    </>
  );
}