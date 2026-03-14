import React, { useState } from 'react';
import { GlassCard } from '../glass-card';
import { X, ChevronDown } from 'lucide-react';
import { getStoredAuth } from '../../lib/auth';

type UserRole = 'student' | 'teacher' | 'staff' | 'admin';
type UserStatus = 'active' | 'inactive';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddUserModal({ isOpen, onClose, onSuccess }: AddUserModalProps) {
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'teacher' as UserRole,
  });
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateUser = async () => {
    // Validation
    setError(null);
    if (!newUser.firstName || !newUser.lastName || !newUser.email) {
      setError('Please fill in all required fields');
      return;
    }

    if (newUser.role !== 'teacher' && newUser.role !== 'staff') {
      setError('You can only create Teacher or Staff accounts from this panel.');
      return;
    }

    setIsLoading(true);

    try {
      const auth = getStoredAuth();
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth?.token}`
        },
        body: JSON.stringify({
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          phone: newUser.phone || undefined,
          role: newUser.role
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create user');
      }

      // Reset form
      setNewUser({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'teacher',
      });

      // Show success notification (you can replace this with a toast)
      alert('User created successfully! A password reset link has been emailed to them.');

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }

      // Close modal
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred during user creation.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <GlassCard className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Modal Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Create New User</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X size={20} className="text-white" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <div className="space-y-4">
            <p className="text-white/60 text-sm mb-4">
              Enter the details of the new user. An email with a secure link will be automatically sent to them so they can set their password.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {/* First Name */}
              <div>
                <label className="block text-white/80 text-sm font-semibold mb-2">
                  First Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={newUser.firstName}
                  onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 transition-colors"
                  placeholder="Enter first name"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-white/80 text-sm font-semibold mb-2">
                  Last Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={newUser.lastName}
                  onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 transition-colors"
                  placeholder="Enter last name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-white/80 text-sm font-semibold mb-2">
                Email Address <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 transition-colors"
                placeholder="Enter email address"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-white/80 text-sm font-semibold mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={newUser.phone}
                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 transition-colors"
                placeholder="Enter phone number"
              />
            </div>

            {/* Role Dropdown */}
            <div>
              <label className="block text-white/80 text-sm font-semibold mb-2">
                Role <span className="text-red-400">*</span>
              </label>
              <div className="relative z-40">
                <button
                  onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                  className="w-full flex items-center justify-between px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors"
                >
                  <span className="capitalize">{newUser.role}</span>
                  <ChevronDown size={18} />
                </button>
                {showRoleDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-[#0B0F1A]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg overflow-hidden z-50">
                    {['teacher', 'staff'].map((role) => (
                      <button
                        key={role}
                        onClick={() => {
                          setNewUser({ ...newUser, role: role as UserRole });
                          setShowRoleDropdown(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-white hover:bg-blue-500/20 transition-colors capitalize ${
                          newUser.role === role ? 'bg-blue-500/10 text-blue-400' : ''
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-white/10">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateUser}
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:shadow-[0_0_24px_rgba(59,130,246,0.6)] transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
