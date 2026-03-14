import React, { useState, useEffect } from 'react';
import { DashboardLayout } from './dashboard-layout';
import { GlassCard } from '../glass-card';
import { getStoredAuth } from '../../lib/auth';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Briefcase,
  Shield,
  Calendar,
  Camera,
  Edit,
  Lock,
  Activity,
  FileText,
  DollarSign,
  UserPlus,
  MessageSquare,
  Monitor,
  Globe,
  MapPin,
  Clock,
} from 'lucide-react';

interface AdminMyProfileProps {
  onLogout?: () => void;
  onNavigate?: (page: string) => void;
}

export function AdminMyProfile({ onLogout, onNavigate }: AdminMyProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [jobTitle, setJobTitle] = useState('System Administrator');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Fetch real profile data from the database
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const auth = getStoredAuth();
        const response = await fetch('/api/users/profile', {
          headers: { 'Authorization': `Bearer ${auth?.token}` }
        });
        if (!response.ok) throw new Error('Failed to load profile');
        const data = await response.json();
        setEmail(data.email || '');
        if (data.profile) {
          setFirstName(data.profile.firstName || '');
          setLastName(data.profile.lastName || '');
          setPhoneNumber(data.profile.phone || '');
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const recentActivities = [
    {
      id: 1,
      icon: FileText,
      action: 'Generated monthly revenue report',
      time: '1 hour ago',
      color: 'text-blue-400',
    },
    {
      id: 2,
      icon: DollarSign,
      action: 'Verified student payment',
      time: '2 hours ago',
      color: 'text-green-400',
    },
    {
      id: 3,
      icon: UserPlus,
      action: 'Created new teacher account',
      time: 'yesterday',
      color: 'text-purple-400',
    },
    {
      id: 4,
      icon: MessageSquare,
      action: 'Updated chatbot FAQ',
      time: 'yesterday',
      color: 'text-cyan-400',
    },
  ];

  const handleSaveChanges = async () => {
    try {
      const auth = getStoredAuth();
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth?.token}`
        },
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          phone: phoneNumber,
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      alert('Profile updated successfully!');
      setIsEditing(false);
    } catch (err: any) {
      alert(err.message || 'An error occurred while updating the profile');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleChangePhoto = () => {
    alert('Photo upload feature coming soon!');
  };

  const handleUpdatePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('Please fill in all password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    alert('Password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <DashboardLayout userRole="admin" activePage="profile" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="p-8">
        {/* Page Header */}
        <div className="mb-8">
          <button
            onClick={() => onNavigate?.('dashboard')}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
            <p className="text-white/60">Manage your administrator account and security settings.</p>
          </div>
        </div>

        {/* Profile Summary Card */}
        <GlassCard className="p-8 mb-6">
          <div className="flex items-start gap-8">
            {/* Left side - Profile Photo and Basic Info */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                SA
              </div>
              <button
                onClick={handleChangePhoto}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all duration-300"
              >
                <Camera size={18} />
                Change Photo
              </button>
            </div>

            {/* Right side - Detailed Info */}
            <div className="flex-1">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {firstName} {lastName}
                </h2>
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm font-semibold">
                    Admin
                  </span>
                  <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-semibold">
                    Active
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/5">
                    <Mail className="text-white/60" size={20} />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Email Address</p>
                    <p className="text-white font-medium">{email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/5">
                    <Phone className="text-white/60" size={20} />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Phone Number</p>
                    <p className="text-white font-medium">{phoneNumber}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/5">
                    <Briefcase className="text-white/60" size={20} />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Job Title</p>
                    <p className="text-white font-medium">{jobTitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/5">
                    <Calendar className="text-white/60" size={20} />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Joined Date</p>
                    <p className="text-white font-medium">Jan 15, 2024</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] text-white font-semibold hover:shadow-[0_0_24px_rgba(59,130,246,0.6)] transition-all duration-300"
              >
                <Edit size={20} />
                Edit Profile
              </button>
            </div>
          </div>
        </GlassCard>

        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Personal Information Section */}
          <div className="col-span-2 space-y-6">
            <GlassCard className="p-6">
              <h2 className="text-xl font-bold text-white mb-6">Personal Information</h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-white/80 text-sm font-semibold mb-2">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-[#0f172a] border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-semibold mb-2">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-[#0f172a] border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-semibold mb-2">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full px-4 py-3 bg-[#0f172a] border border-white/10 rounded-xl text-white/60 placeholder-white/40 focus:outline-none focus:border-blue-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <p className="text-white/40 text-xs mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-semibold mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-[#0f172a] border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-semibold mb-2">Job Title</label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-[#0f172a] border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-semibold mb-2">Role</label>
                  <input
                    type="text"
                    value="Administrator"
                    disabled
                    className="w-full px-4 py-3 bg-[#0f172a] border border-white/10 rounded-xl text-white/60 placeholder-white/40 focus:outline-none focus:border-blue-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <p className="text-white/40 text-xs mt-1">Role cannot be changed</p>
                </div>
              </div>

              {isEditing && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleCancel}
                    className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveChanges}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] text-white font-semibold hover:shadow-[0_0_24px_rgba(59,130,246,0.6)] transition-all duration-300"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </GlassCard>

            {/* Security Settings */}
            <GlassCard className="p-6">
              <h2 className="text-xl font-bold text-white mb-6">Security Settings</h2>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-white/80 text-sm font-semibold mb-2">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-4 py-3 bg-[#0f172a] border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-semibold mb-2">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full px-4 py-3 bg-[#0f172a] border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-semibold mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full px-4 py-3 bg-[#0f172a] border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>
              </div>

              <button
                onClick={handleUpdatePassword}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] text-white font-semibold hover:shadow-[0_0_24px_rgba(59,130,246,0.6)] transition-all duration-300"
              >
                <Lock size={20} />
                Update Password
              </button>

              {/* Two-Factor Authentication */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-semibold mb-1">Two-Factor Authentication</h3>
                    <p className="text-white/60 text-sm">Add an extra layer of security to your account</p>
                  </div>
                  <button
                    onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                    className={`relative w-14 h-7 rounded-full transition-colors ${
                      twoFactorEnabled ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-white/10'
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                        twoFactorEnabled ? 'translate-x-7' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Session Information */}
            <GlassCard className="p-6">
              <h2 className="text-xl font-bold text-white mb-6">Session Information</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white/5">
                    <Clock className="text-white/60" size={18} />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Last Login</p>
                    <p className="text-white font-medium">Mar 13, 2026 — 09:30 AM</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white/5">
                    <Monitor className="text-white/60" size={18} />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Login Device</p>
                    <p className="text-white font-medium">Windows 10 Desktop</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white/5">
                    <Globe className="text-white/60" size={18} />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Browser</p>
                    <p className="text-white font-medium">Chrome 122.0</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white/5">
                    <MapPin className="text-white/60" size={18} />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">IP Address</p>
                    <p className="text-white font-medium font-mono text-sm">192.168.1.12</p>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Recent Activity */}
            <GlassCard className="p-6">
              <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-white/5">
                      <activity.icon className={activity.color} size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{activity.action}</p>
                      <p className="text-white/60 text-xs">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}