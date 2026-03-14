import React, { useState } from 'react';
import { DashboardLayout } from './dashboard-layout';
import { GlassCard } from '../glass-card';
import {
  Bell,
  Send,
  Upload,
  X,
  CheckCircle,
  Clock,
  FileText,
  Paperclip,
} from 'lucide-react';

interface TeacherNotificationsPageProps {
  onLogout?: () => void;
  onNavigate?: (page: string) => void;
}

type NotificationType = 'announcement' | 'assignment' | 'class' | 'important';

interface SentNotification {
  id: number;
  title: string;
  class: string;
  type: NotificationType;
  dateSent: string;
  status: 'sent' | 'pending';
  message: string;
}

export function TeacherNotificationsPage({
  onLogout,
  onNavigate,
}: TeacherNotificationsPageProps) {
  const [notificationTitle, setNotificationTitle] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [notificationType, setNotificationType] = useState<NotificationType | ''>('');
  const [message, setMessage] = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  const [sentNotifications, setSentNotifications] = useState<SentNotification[]>([
    {
      id: 1,
      title: 'Assignment Reminder',
      class: 'A/L ICT 2026',
      type: 'assignment',
      dateSent: 'Today 2:30 PM',
      status: 'sent',
      message: 'Please submit your Database ER Assignment by Friday.',
    },
    {
      id: 2,
      title: 'Class Postponed',
      class: 'A/L ICT 2026',
      type: 'class',
      dateSent: 'Today 10:00 AM',
      status: 'sent',
      message: "Tomorrow's ICT class has been rescheduled to 3:00 PM.",
    },
    {
      id: 3,
      title: 'Exam Schedule Released',
      class: 'Grade 11 ICT',
      type: 'announcement',
      dateSent: 'Yesterday',
      status: 'sent',
      message: 'Mid-term exam schedule is now available on the portal.',
    },
    {
      id: 4,
      title: 'Important: Project Deadline',
      class: 'A/L ICT 2026',
      type: 'important',
      dateSent: 'March 8, 2026',
      status: 'sent',
      message: 'Final project submission deadline is March 15. No extensions.',
    },
    {
      id: 5,
      title: 'Study Material Uploaded',
      class: 'A/L Maths 2026',
      type: 'announcement',
      dateSent: 'March 7, 2026',
      status: 'sent',
      message: 'New study materials for Chapter 8 have been uploaded.',
    },
    {
      id: 6,
      title: 'Lab Session Cancelled',
      class: 'Grade 10 ICT',
      type: 'class',
      dateSent: 'March 6, 2026',
      status: 'sent',
      message: "This Friday's lab session has been cancelled due to maintenance.",
    },
    {
      id: 7,
      title: 'Assignment Due Tomorrow',
      class: 'A/L Physics 2026',
      type: 'assignment',
      dateSent: 'March 5, 2026',
      status: 'sent',
      message: 'Reminder: Physics lab report due tomorrow at 11:59 PM.',
    },
    {
      id: 8,
      title: 'Welcome to New Term',
      class: 'A/L ICT 2026',
      type: 'announcement',
      dateSent: 'March 4, 2026',
      status: 'sent',
      message: 'Welcome to the new term! Excited to learn with you all.',
    },
  ]);

  const getTypeBadge = (type: NotificationType) => {
    switch (type) {
      case 'announcement':
        return (
          <span className="px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs font-semibold">
            Announcement
          </span>
        );
      case 'assignment':
        return (
          <span className="px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-400 text-xs font-semibold">
            Assignment
          </span>
        );
      case 'class':
        return (
          <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
            Class
          </span>
        );
      case 'important':
        return (
          <span className="px-2.5 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-semibold">
            Important
          </span>
        );
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setAttachedFile(null);
  };

  const handleCancel = () => {
    setNotificationTitle('');
    setSelectedClass('');
    setNotificationType('');
    setMessage('');
    setAttachedFile(null);
  };

  const handleSendNotification = () => {
    if (!notificationTitle || !selectedClass || !notificationType || !message) {
      alert('Please fill in all required fields');
      return;
    }

    const newNotification: SentNotification = {
      id: sentNotifications.length + 1,
      title: notificationTitle,
      class: selectedClass,
      type: notificationType as NotificationType,
      dateSent: 'Just now',
      status: 'sent',
      message: message,
    };

    setSentNotifications([newNotification, ...sentNotifications]);

    // Reset form
    handleCancel();

    alert(`Notification sent to ${selectedClass} students!`);
  };

  return (
    <DashboardLayout
      userRole="teacher"
      userName="Mr. Silva"
      userInitials="MS"
      notificationCount={0}
      breadcrumb="Notifications"
      activePage="notifications"
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Notifications
            </h1>
            <p className="text-white/60">
              Send announcements and view notification history
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT SIDE - Create Notification */}
        <div>
          <GlassCard className="p-6">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Bell size={24} className="text-blue-400" />
                Create Notification
              </h3>
              <p className="text-white/60 text-sm mt-1">
                Send announcements to your students
              </p>
            </div>

            <div className="space-y-5">
              {/* Notification Title */}
              <div>
                <label className="text-white/80 text-sm font-semibold mb-2 block">
                  Notification Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={notificationTitle}
                  onChange={(e) => setNotificationTitle(e.target.value)}
                  placeholder="Assignment Reminder"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>

              {/* Class Selection */}
              <div>
                <label className="text-white/80 text-sm font-semibold mb-2 block">
                  Select Class <span className="text-red-400">*</span>
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                >
                  <option value="" className="bg-[#0B0F1A]">
                    Select a class
                  </option>
                  <option value="A/L ICT 2026" className="bg-[#0B0F1A]">
                    A/L ICT 2026
                  </option>
                  <option value="A/L Maths 2026" className="bg-[#0B0F1A]">
                    A/L Maths 2026
                  </option>
                  <option value="A/L Physics 2026" className="bg-[#0B0F1A]">
                    A/L Physics 2026
                  </option>
                  <option value="Grade 11 ICT" className="bg-[#0B0F1A]">
                    Grade 11 ICT
                  </option>
                  <option value="Grade 10 ICT" className="bg-[#0B0F1A]">
                    Grade 10 ICT
                  </option>
                </select>
              </div>

              {/* Notification Type */}
              <div>
                <label className="text-white/80 text-sm font-semibold mb-2 block">
                  Notification Type <span className="text-red-400">*</span>
                </label>
                <select
                  value={notificationType}
                  onChange={(e) => setNotificationType(e.target.value as NotificationType)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                >
                  <option value="" className="bg-[#0B0F1A]">
                    Select type
                  </option>
                  <option value="announcement" className="bg-[#0B0F1A]">
                    Announcement
                  </option>
                  <option value="assignment" className="bg-[#0B0F1A]">
                    Assignment Reminder
                  </option>
                  <option value="class" className="bg-[#0B0F1A]">
                    Class Reminder
                  </option>
                  <option value="important" className="bg-[#0B0F1A]">
                    Important Notice
                  </option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="text-white/80 text-sm font-semibold mb-2 block">
                  Message <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message to students..."
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 transition-colors resize-none"
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="text-white/80 text-sm font-semibold mb-2 block">
                  Attachment (Optional)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    id="file-upload"
                    onChange={handleFileSelect}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  <label
                    htmlFor="file-upload"
                    className="block w-full px-4 py-8 rounded-xl bg-white/5 border-2 border-dashed border-white/20 text-center cursor-pointer hover:bg-white/10 hover:border-blue-500/50 transition-all duration-300"
                  >
                    <Upload className="text-white/40 mx-auto mb-3" size={32} />
                    <p className="text-white/60 text-sm font-semibold mb-1">
                      Drag and drop file or click to upload
                    </p>
                    <p className="text-white/40 text-xs">
                      Supported files: PDF / Image / Document
                    </p>
                  </label>
                </div>

                {attachedFile && (
                  <div className="mt-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Paperclip size={16} className="text-blue-400" />
                      <span className="text-white text-sm font-medium">
                        {attachedFile.name}
                      </span>
                    </div>
                    <button
                      onClick={handleRemoveFile}
                      className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <X size={16} className="text-white/60" />
                    </button>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={handleCancel}
                  className="flex-1 px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendNotification}
                  className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:shadow-[0_0_24px_rgba(59,130,246,0.6)] transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  Send Notification
                </button>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* RIGHT SIDE - Notification History */}
        <div>
          <GlassCard className="p-6">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText size={24} className="text-cyan-400" />
                Sent Notifications
              </h3>
              <p className="text-white/60 text-sm mt-1">
                {sentNotifications.length} notification
                {sentNotifications.length !== 1 ? 's' : ''} sent
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-white/60 font-semibold text-sm pb-4 px-3">
                      Title
                    </th>
                    <th className="text-left text-white/60 font-semibold text-sm pb-4 px-3">
                      Class
                    </th>
                    <th className="text-left text-white/60 font-semibold text-sm pb-4 px-3">
                      Type
                    </th>
                    <th className="text-left text-white/60 font-semibold text-sm pb-4 px-3">
                      Date Sent
                    </th>
                    <th className="text-center text-white/60 font-semibold text-sm pb-4 px-3">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sentNotifications.map((notification) => (
                    <tr
                      key={notification.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-4 px-3">
                        <p className="text-white font-semibold text-sm">
                          {notification.title}
                        </p>
                      </td>
                      <td className="py-4 px-3">
                        <span className="text-cyan-400 text-sm font-medium">
                          {notification.class}
                        </span>
                      </td>
                      <td className="py-4 px-3">
                        {getTypeBadge(notification.type)}
                      </td>
                      <td className="py-4 px-3">
                        <div className="flex items-center gap-1 text-white/60 text-sm">
                          <Clock size={14} />
                          {notification.dateSent}
                        </div>
                      </td>
                      <td className="py-4 px-3 text-center">
                        <span className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-semibold inline-flex items-center gap-1">
                          <CheckCircle size={12} />
                          Sent
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-white/10 text-center">
              <p className="text-white/60 text-sm">
                Showing all {sentNotifications.length} sent notification
                {sentNotifications.length !== 1 ? 's' : ''}
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    </DashboardLayout>
  );
}
