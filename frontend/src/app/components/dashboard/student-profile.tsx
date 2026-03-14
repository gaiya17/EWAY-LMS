import React, { useState, useEffect } from 'react';
import { DashboardLayout } from './dashboard-layout';
import { GlassCard } from '../glass-card';
import { AIChat } from './ai-chat';
import { getStoredAuth } from '../../lib/auth';
import {
  ArrowLeft,
  Camera,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Users,
  Edit2,
  Lock,
  Eye,
  EyeOff,
  Check,
  CheckCircle,
  X,
} from 'lucide-react';

interface StudentProfileProps {
  onLogout?: () => void;
  onNavigate?: (page: string) => void;
}

export function StudentProfile({ onLogout, onNavigate }: StudentProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const profileCompletion = 85;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    email: '',
    mobile: '',
    batch: '2024 - Grade 12 Science',
  });

  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: '',
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
          firstName: data.profile?.firstName || '',
          lastName: data.profile?.lastName || '',
          gender: data.profile?.gender || '',
          email: data.email || '',
          mobile: data.profile?.phone || '',
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
    setFormData({ ...formData, [field]: value });
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData({ ...passwordData, [field]: value });
  };

  const handleSaveProfile = async () => {
    try {
      const auth = getStoredAuth();
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth?.token}`
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.mobile,
          gender: formData.gender,
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (err: any) {
      alert(err.message || 'An error occurred while updating the profile');
    }
  };

  const handleUpdatePassword = () => {
    if (passwordData.new !== passwordData.confirm) {
      alert('Passwords do not match!');
      return;
    }
    if (passwordData.new.length < 8) {
      alert('Password must be at least 8 characters long!');
      return;
    }
    setSuccessMessage('Password updated successfully!');
    setShowSuccessMessage(true);
    setPasswordData({ current: '', new: '', confirm: '' });
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  return (
    <>
      {/* Success Message Toast */}
      {showSuccessMessage && (
        <div className="fixed top-24 right-8 z-50 animate-in slide-in-from-right-4 duration-300">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-xl shadow-[0_0_32px_rgba(34,197,94,0.6)] flex items-center gap-3">
            <CheckCircle size={24} />
            <span className="font-semibold">{successMessage}</span>
            <button
              onClick={() => setShowSuccessMessage(false)}
              className="ml-4 hover:bg-white/20 rounded-lg p-1 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      <DashboardLayout
        userRole="student"
        userName="Gayantha"
        userInitials="GP"
        notificationCount={5}
        breadcrumb="My Profile"
        activePage="profile"
        onNavigate={onNavigate}
        onLogout={onLogout}
      >
        <div className="space-y-6">
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
              <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
              <p className="text-white/60">Manage your personal information</p>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT COLUMN - Profile Card */}
            <div className="lg:col-span-1">
              <GlassCard className="p-8">
                <div className="flex flex-col items-center text-center">
                  {/* Profile Image */}
                  <div className="relative mb-6 group cursor-pointer">
                    <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-blue-500/30 to-cyan-400/30 backdrop-blur-xl border-4 border-cyan-400/50 shadow-[0_0_32px_rgba(6,182,212,0.4)] flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_48px_rgba(6,182,212,0.6)]">
                      <span className="text-7xl">👨‍🎓</span>
                    </div>
                    {/* Hover overlay for change photo */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-600/80 to-cyan-600/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-2">
                      <Camera className="text-white" size={32} />
                      <span className="text-white text-sm font-semibold">Change Photo</span>
                    </div>
                    {/* Decorative glow rings */}
                    <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
                  </div>

                  {/* Name */}
                  <h2 className="text-2xl font-bold text-white mb-2">Gayantha Perera</h2>

                  {/* Student ID */}
                  <div className="px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/20 to-cyan-400/20 border border-cyan-400/30 mb-3">
                    <p className="text-cyan-300 font-semibold text-sm">Student ID: EW2024001</p>
                  </div>

                  {/* Grade Info */}
                  <p className="text-white/70 mb-6">Grade 12 – Science Stream</p>

                  {/* Change Photo Button */}
                  <button className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:shadow-[0_0_24px_rgba(59,130,246,0.6)] transition-all duration-300 transform hover:scale-105 mb-8">
                    Change Photo
                  </button>

                  {/* Profile Completion */}
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/70 text-sm">Profile Completion</span>
                      <span className="text-cyan-400 font-bold text-sm">{profileCompletion}%</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-1000 shadow-[0_0_16px_rgba(6,182,212,0.6)]"
                        style={{ width: `${profileCompletion}%` }}
                      />
                    </div>
                    <p className="text-white/50 text-xs mt-2">
                      Complete your profile to unlock all features
                    </p>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* RIGHT COLUMN - Personal Info & Password */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information Card */}
              <GlassCard className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                      <User size={20} className="text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Personal Information</h2>
                  </div>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/20 text-white hover:bg-white/10 hover:border-cyan-400/50 transition-all duration-300"
                    >
                      <Edit2 size={16} />
                      <span>Edit</span>
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 rounded-xl bg-white/5 border border-white/20 text-white hover:bg-white/10 transition-all duration-300"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-[0_0_24px_rgba(34,197,94,0.6)] transition-all duration-300"
                      >
                        <Check size={16} />
                        <span>Save</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Form Fields - 2 Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div>
                    <label className="flex items-center gap-2 text-white/60 text-sm mb-2">
                      <User size={14} />
                      First Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400/50 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all"
                      />
                    ) : (
                      <p className="text-white font-semibold text-lg">{formData.firstName}</p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="flex items-center gap-2 text-white/60 text-sm mb-2">
                      <User size={14} />
                      Last Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400/50 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all"
                      />
                    ) : (
                      <p className="text-white font-semibold text-lg">{formData.lastName}</p>
                    )}
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="flex items-center gap-2 text-white/60 text-sm mb-2">
                      <Users size={14} />
                      Gender
                    </label>
                    {isEditing ? (
                      <select
                        value={formData.gender}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400/50 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      <p className="text-white font-semibold text-lg">{formData.gender}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="flex items-center gap-2 text-white/60 text-sm mb-2">
                      <Mail size={14} />
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400/50 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all"
                      />
                    ) : (
                      <p className="text-white font-semibold text-lg break-all">
                        {formData.email}
                      </p>
                    )}
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="flex items-center gap-2 text-white/60 text-sm mb-2">
                      <Phone size={14} />
                      Mobile Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={formData.mobile}
                        onChange={(e) => handleInputChange('mobile', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400/50 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all"
                      />
                    ) : (
                      <p className="text-white font-semibold text-lg">{formData.mobile}</p>
                    )}
                  </div>

                  {/* Batch/Year */}
                  <div>
                    <label className="flex items-center gap-2 text-white/60 text-sm mb-2">
                      <Calendar size={14} />
                      Batch/Year
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.batch}
                        onChange={(e) => handleInputChange('batch', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400/50 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all"
                      />
                    ) : (
                      <p className="text-white font-semibold text-lg">{formData.batch}</p>
                    )}
                  </div>
                </div>
              </GlassCard>

              {/* Change Password Card */}
              <GlassCard className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    <Lock size={20} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Change Password</h2>
                </div>

                <div className="space-y-4">
                  {/* Current Password */}
                  <div>
                    <label className="flex items-center gap-2 text-white/60 text-sm mb-2">
                      <Lock size={14} />
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={passwordData.current}
                        onChange={(e) => handlePasswordChange('current', e.target.value)}
                        placeholder="Enter current password"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400/50 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all pr-12"
                      />
                      <button
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                      >
                        {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="flex items-center gap-2 text-white/60 text-sm mb-2">
                      <Lock size={14} />
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwordData.new}
                        onChange={(e) => handlePasswordChange('new', e.target.value)}
                        placeholder="Enter new password"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400/50 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all pr-12"
                      />
                      <button
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                      >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="flex items-center gap-2 text-white/60 text-sm mb-2">
                      <Lock size={14} />
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={passwordData.confirm}
                        onChange={(e) => handlePasswordChange('confirm', e.target.value)}
                        placeholder="Confirm new password"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400/50 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all pr-12"
                      />
                      <button
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Password Requirements */}
                  <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <p className="text-white/70 text-sm mb-2">Password must contain:</p>
                    <ul className="space-y-1 text-white/60 text-xs">
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-cyan-400" />
                        At least 8 characters
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-cyan-400" />
                        One uppercase letter
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-cyan-400" />
                        One number or special character
                      </li>
                    </ul>
                  </div>

                  {/* Update Button */}
                  <button
                    onClick={handleUpdatePassword}
                    className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold hover:shadow-[0_0_24px_rgba(139,92,246,0.6)] transition-all duration-300 transform hover:scale-105"
                  >
                    Update Password
                  </button>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </DashboardLayout>

      {/* AI Chatbot */}
      <AIChat />
    </>
  );
}
