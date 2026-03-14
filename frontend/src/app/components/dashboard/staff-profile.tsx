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
  User,
  Shield,
  Lock,
  Save,
  CheckCircle,
  Clock,
  FileText,
  CreditCard,
  QrCode,
  IdCard,
  Eye,
  EyeOff,
} from 'lucide-react';

interface StaffProfileProps {
  onLogout?: () => void;
  onNavigate?: (page: string) => void;
}

export function StaffProfile({ onLogout, onNavigate }: StaffProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    officeLocation: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [profileInfo, setProfileInfo] = useState({
    fullName: '',
    role: 'Administrative Staff',
    department: 'Operations',
    staffId: '',
    email: '',
    phone: '',
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
        const fullName = data.profile ? `${data.profile.firstName} ${data.profile.lastName}` : '';
        const phone = data.profile?.phone || '';
        setFormData(prev => ({ ...prev, fullName, email: data.email || '', phone }));
        setProfileInfo(prev => ({ ...prev, fullName, email: data.email || '', phone }));
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const permissions = [
    { id: 1, name: 'Verify Payments', icon: CreditCard, enabled: true },
    { id: 2, name: 'Generate Reports', icon: FileText, enabled: true },
    { id: 3, name: 'Manage Attendance', icon: QrCode, enabled: true },
    { id: 4, name: 'Issue Student Cards', icon: IdCard, enabled: true },
  ];

  const recentActivities = [
    {
      id: 1,
      action: 'Verified payment from Kasun Perera',
      time: 'Today 10:20 AM',
      icon: CreditCard,
      color: 'text-green-400',
    },
    {
      id: 2,
      action: 'Generated attendance report',
      time: 'Yesterday',
      icon: FileText,
      color: 'text-purple-400',
    },
    {
      id: 3,
      action: 'Issued student ID card',
      time: '2 days ago',
      icon: IdCard,
      color: 'text-blue-400',
    },
    {
      id: 4,
      action: 'Marked attendance for A/L ICT 2026',
      time: '3 days ago',
      icon: QrCode,
      color: 'text-cyan-400',
    },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
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
          firstName: formData.fullName.split(' ')[0],
          lastName: formData.fullName.split(' ').slice(1).join(' ') || '.',
          phone: formData.phone,
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

  const handleUpdatePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }
    alert('Password updated successfully!');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  return (
    <DashboardLayout
      userRole="staff"
      userName="Ms. Silva"
      userInitials="MS"
      notificationCount={5}
      breadcrumb="My Profile"
      activePage="profile"
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
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
            <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
            <p className="text-white/60">
              Manage your staff account information
            </p>
          </div>
        </div>
      </div>

      {/* Profile Overview Card */}
      <GlassCard className="p-8 mb-6">
        <div className="flex items-start justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Profile Overview</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
              isEditing
                ? 'bg-white/10 text-white hover:bg-white/20'
                : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-[0_0_24px_rgba(59,130,246,0.6)]'
            }`}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-white text-5xl font-bold">
                MS
              </div>
              {isEditing && (
                <button className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center text-white transition-colors">
                  <Camera size={20} />
                </button>
              )}
            </div>
          </div>

          {/* Profile Information */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-white/60 text-sm mb-1">Full Name</p>
              <p className="text-white text-lg font-semibold">
                {profileInfo.fullName}
              </p>
            </div>

            <div>
              <p className="text-white/60 text-sm mb-1">Role</p>
              <p className="text-white text-lg font-semibold">
                {profileInfo.role}
              </p>
            </div>

            <div>
              <p className="text-white/60 text-sm mb-1">Department</p>
              <p className="text-white text-lg font-semibold">
                {profileInfo.department}
              </p>
            </div>

            <div>
              <p className="text-white/60 text-sm mb-1">Staff ID</p>
              <p className="text-white text-lg font-semibold">
                {profileInfo.staffId}
              </p>
            </div>

            <div>
              <p className="text-white/60 text-sm mb-1">Email</p>
              <div className="flex items-center gap-2">
                <Mail size={18} className="text-blue-400" />
                <p className="text-white text-lg">{profileInfo.email}</p>
              </div>
            </div>

            <div>
              <p className="text-white/60 text-sm mb-1">Phone</p>
              <div className="flex items-center gap-2">
                <Phone size={18} className="text-green-400" />
                <p className="text-white text-lg">{profileInfo.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Account Settings */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold text-white mb-6">
              Account Settings
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-white/60 text-sm mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    handleInputChange('fullName', e.target.value)
                  }
                  disabled={!isEditing}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                />
              </div>

              <div>
                <label className="block text-white/60 text-sm mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                />
              </div>

              <div>
                <label className="block text-white/60 text-sm mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                />
              </div>

              <div>
                <label className="block text-white/60 text-sm mb-2">
                  Office Location
                </label>
                <input
                  type="text"
                  value={formData.officeLocation}
                  onChange={(e) =>
                    handleInputChange('officeLocation', e.target.value)
                  }
                  disabled={!isEditing}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                />
              </div>

              {isEditing && (
                <button
                  onClick={handleSaveProfile}
                  className="w-full px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:shadow-[0_0_24px_rgba(59,130,246,0.6)] transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  Save Changes
                </button>
              )}
            </div>
          </GlassCard>

          {/* Password Management */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold text-white mb-6">
              Change Password
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-white/60 text-sm mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      handlePasswordChange('currentPassword', e.target.value)
                    }
                    placeholder="Enter current password"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 transition-colors pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-white/60 text-sm mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      handlePasswordChange('newPassword', e.target.value)
                    }
                    placeholder="Enter new password"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 transition-colors pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-white/60 text-sm mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      handlePasswordChange('confirmPassword', e.target.value)
                    }
                    placeholder="Confirm new password"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 transition-colors pr-12"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              <button
                onClick={handleUpdatePassword}
                className="w-full px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:shadow-[0_0_24px_rgba(59,130,246,0.6)] transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Lock size={18} />
                Update Password
              </button>
            </div>
          </GlassCard>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Role & Permissions */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold text-white mb-6">
              Role & Permissions
            </h3>

            <div className="space-y-3">
              {permissions.map((permission) => {
                const Icon = permission.icon;
                return (
                  <div
                    key={permission.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <Icon className="text-blue-400" size={20} />
                      </div>
                      <span className="text-white font-medium">
                        {permission.name}
                      </span>
                    </div>
                    {permission.enabled && (
                      <CheckCircle className="text-green-400" size={20} />
                    )}
                  </div>
                );
              })}
            </div>
          </GlassCard>

          {/* Recent Activity */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold text-white mb-6">
              Recent Activity
            </h3>

            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                      <Icon className={activity.color} size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium mb-1">
                        {activity.action}
                      </p>
                      <div className="flex items-center gap-2 text-white/50 text-sm">
                        <Clock size={14} />
                        <span>{activity.time}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>
      </div>
    </DashboardLayout>
  );
}
