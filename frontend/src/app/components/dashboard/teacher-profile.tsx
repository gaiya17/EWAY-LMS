import React, { useState, useEffect } from 'react';
import { DashboardLayout } from './dashboard-layout';
import { GlassCard } from '../glass-card';
import { getStoredAuth } from '../../lib/auth';
import {
  ArrowLeft,
  Camera,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  BookOpen,
  Award,
  Shield,
  Bell,
  Lock,
  Save,
  X,
  CheckCircle,
  BadgeCheck,
} from 'lucide-react';

interface TeacherProfileProps {
  onLogout?: () => void;
  onNavigate?: (page: string) => void;
}

export function TeacherProfile({ onLogout, onNavigate }: TeacherProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    teacherId: '',
    subject: '',
    experience: '',
    qualification: '',
    joinedDate: '',
  });

  // Fetch real profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const auth = getStoredAuth();
        const response = await fetch('/api/users/profile', {
          headers: { 'Authorization': `Bearer ${auth?.token}` }
        });
        if (!response.ok) throw new Error('Failed to load profile');
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          fullName: data.profile ? `${data.profile.firstName} ${data.profile.lastName}` : '',
          email: data.email || '',
          phone: data.profile?.phone || '',
        }));
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const auth = getStoredAuth();
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth?.token}`
        },
        body: JSON.stringify({
          firstName: formData.fullName.split(' ')[0], // Simple split for now
          lastName: formData.fullName.split(' ').slice(1).join(' ') || '.',
          phone: formData.phone,
          // Address/DoB are not currently saved in the DB schema for TeacherProfile, so emitting them
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (err: any) {
      alert(err.message || 'An error occurred while updating the profile');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // In a real app, you would reset to the fetched original data here
  };

  return (
    <DashboardLayout
      userRole="teacher"
      userName="Mr. Silva"
      userInitials="GS"
      notificationCount={8}
      breadcrumb="My Profile"
      activePage="profile"
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
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span>Back to Dashboard</span>
            </button>
            <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
            <p className="text-white/60">
              Manage your personal information and account settings
            </p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              isEditing
                ? 'bg-white/10 text-white hover:bg-white/20'
                : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-[0_0_24px_rgba(59,130,246,0.6)]'
            }`}
          >
            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {/* Profile Overview Card */}
      <GlassCard className="p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Profile Image */}
          <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-white text-4xl font-bold relative">
              GS
              {/* Online Status */}
              <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 rounded-full border-4 border-[#0B0F1A]"></div>
            </div>
            {isEditing && (
              <button className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="text-white" size={24} />
              </button>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <h2 className="text-2xl font-bold text-white">
                {formData.fullName}
              </h2>
              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30">
                <BadgeCheck className="text-blue-400" size={16} />
                <span className="text-blue-400 text-sm font-semibold">
                  Verified
                </span>
              </div>
            </div>
            <p className="text-white/60 mb-4">Teacher • EWAY LMS</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="text-blue-400" size={18} />
                </div>
                <div>
                  <p className="text-white/50 text-xs">Email</p>
                  <p className="text-white text-sm font-medium">
                    {formData.email}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <Phone className="text-green-400" size={18} />
                </div>
                <div>
                  <p className="text-white/50 text-xs">Phone</p>
                  <p className="text-white text-sm font-medium">
                    {formData.phone}
                  </p>
                </div>
              </div>

              {/* Teacher ID */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <Shield className="text-purple-400" size={18} />
                </div>
                <div>
                  <p className="text-white/50 text-xs">Teacher ID</p>
                  <p className="text-white text-sm font-medium">
                    {formData.teacherId}
                  </p>
                </div>
              </div>

              {/* Subject */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="text-orange-400" size={18} />
                </div>
                <div>
                  <p className="text-white/50 text-xs">Subject</p>
                  <p className="text-white text-sm font-medium">
                    {formData.subject}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Personal Information */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <User className="text-blue-400" size={20} />
            </div>
            <h3 className="text-xl font-bold text-white">
              Personal Information
            </h3>
          </div>

          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="text-white/60 text-sm mb-2 block">
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-white/60 text-sm mb-2 block">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="text-white/60 text-sm mb-2 block">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="text-white/60 text-sm mb-2 block">
                Date of Birth
              </label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) =>
                  handleInputChange('dateOfBirth', e.target.value)
                }
                disabled={!isEditing}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            {/* Address */}
            <div>
              <label className="text-white/60 text-sm mb-2 block">
                Address
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                disabled={!isEditing}
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed resize-none"
              />
            </div>
          </div>
        </GlassCard>

        {/* Professional Information */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Award className="text-purple-400" size={20} />
            </div>
            <h3 className="text-xl font-bold text-white">
              Professional Information
            </h3>
          </div>

          <div className="space-y-4">
            {/* Teacher ID */}
            <div>
              <label className="text-white/60 text-sm mb-2 block">
                Teacher ID
              </label>
              <input
                type="text"
                value={formData.teacherId}
                disabled
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 cursor-not-allowed"
              />
            </div>

            {/* Subject */}
            <div>
              <label className="text-white/60 text-sm mb-2 block">
                Subject Specialization
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            {/* Experience */}
            <div>
              <label className="text-white/60 text-sm mb-2 block">
                Teaching Experience
              </label>
              <input
                type="text"
                value={formData.experience}
                onChange={(e) =>
                  handleInputChange('experience', e.target.value)
                }
                disabled={!isEditing}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            {/* Qualification */}
            <div>
              <label className="text-white/60 text-sm mb-2 block">
                Qualifications
              </label>
              <textarea
                value={formData.qualification}
                onChange={(e) =>
                  handleInputChange('qualification', e.target.value)
                }
                disabled={!isEditing}
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed resize-none"
              />
            </div>

            {/* Joined Date */}
            <div>
              <label className="text-white/60 text-sm mb-2 block">
                Joined Date
              </label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                <Calendar className="text-cyan-400" size={18} />
                <span className="text-white">
                  {new Date(formData.joinedDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Account Settings */}
      <GlassCard className="p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
            <Shield className="text-green-400" size={20} />
          </div>
          <h3 className="text-xl font-bold text-white">Account Settings</h3>
        </div>

        <div className="space-y-4">
          {/* Change Password */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Lock className="text-blue-400" size={18} />
              </div>
              <div>
                <p className="text-white font-semibold">Change Password</p>
                <p className="text-white/60 text-sm">
                  Update your account password
                </p>
              </div>
            </div>
            <button className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors font-semibold text-sm">
              Change
            </button>
          </div>

          {/* Two-Factor Authentication */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Shield className="text-purple-400" size={18} />
              </div>
              <div>
                <p className="text-white font-semibold">
                  Two-Factor Authentication
                </p>
                <p className="text-white/60 text-sm">
                  Add an extra layer of security
                </p>
              </div>
            </div>
            <button
              onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                twoFactorEnabled ? 'bg-green-500' : 'bg-white/20'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  twoFactorEnabled ? 'translate-x-7' : ''
                }`}
              />
            </button>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <Bell className="text-orange-400" size={18} />
              </div>
              <div>
                <p className="text-white font-semibold">Email Notifications</p>
                <p className="text-white/60 text-sm">
                  Receive updates via email
                </p>
              </div>
            </div>
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                notificationsEnabled ? 'bg-green-500' : 'bg-white/20'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  notificationsEnabled ? 'translate-x-7' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Action Buttons */}
      {isEditing && (
        <div className="flex items-center justify-end gap-4">
          <button
            onClick={handleCancel}
            className="px-6 py-3 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors flex items-center gap-2"
          >
            <X size={20} />
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:shadow-[0_0_24px_rgba(59,130,246,0.6)] transition-all duration-300 flex items-center gap-2"
          >
            <Save size={20} />
            Save Changes
          </button>
        </div>
      )}
    </DashboardLayout>
  );
}
