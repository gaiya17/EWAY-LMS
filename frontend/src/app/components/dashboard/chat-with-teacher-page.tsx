import React, { useState, useRef, useEffect } from 'react';
import { DashboardLayout } from './dashboard-layout';
import { GlassCard } from '../glass-card';
import {
  Search,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Info,
  Check,
  CheckCheck,
} from 'lucide-react';

interface ChatWithTeacherPageProps {
  onLogout?: () => void;
  onNavigate?: (page: string, data?: any) => void;
  teacherData?: any;
}

interface Teacher {
  id: number;
  name: string;
  subject: string;
  avatar: string;
  isOnline: boolean;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

interface Message {
  id: number;
  senderId: number;
  senderType: 'student' | 'teacher';
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

export function ChatWithTeacherPage({
  onLogout,
  onNavigate,
  teacherData,
}: ChatWithTeacherPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sample teachers data
  const teachers: Teacher[] = [
    {
      id: 1,
      name: 'Dr. Sarah Williams',
      subject: 'Mathematics',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      isOnline: true,
      lastMessage: 'Good luck with your exam preparation!',
      lastMessageTime: '10:30 AM',
      unreadCount: 2,
    },
    {
      id: 2,
      name: 'Mr. Amila Dasanayake',
      subject: 'Chemistry',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      isOnline: true,
      lastMessage: 'Please complete chapter 5 homework',
      lastMessageTime: 'Yesterday',
      unreadCount: 0,
    },
    {
      id: 3,
      name: 'Prof. Nadeesha Fernando',
      subject: 'Biology',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      isOnline: false,
      lastMessage: 'The lab session is scheduled for Friday',
      lastMessageTime: '2 days ago',
      unreadCount: 0,
    },
    {
      id: 4,
      name: 'Mr. Kasun Silva',
      subject: 'Physics',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      isOnline: true,
      lastMessage: 'Thanks for your question!',
      lastMessageTime: '3 days ago',
      unreadCount: 0,
    },
  ];

  // Sample messages for selected teacher
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      senderId: 1,
      senderType: 'teacher',
      text: 'Hello! How can I help you today?',
      timestamp: '10:00 AM',
      status: 'read',
    },
    {
      id: 2,
      senderId: 0,
      senderType: 'student',
      text: 'Hi Sir, I have a question about the homework from last week.',
      timestamp: '10:05 AM',
      status: 'read',
    },
    {
      id: 3,
      senderId: 1,
      senderType: 'teacher',
      text: 'Sure, what would you like to know?',
      timestamp: '10:06 AM',
      status: 'read',
    },
    {
      id: 4,
      senderId: 0,
      senderType: 'student',
      text: 'I\'m having trouble understanding the concept of derivatives in chapter 4.',
      timestamp: '10:10 AM',
      status: 'read',
    },
    {
      id: 5,
      senderId: 1,
      senderType: 'teacher',
      text: 'No problem! Derivatives represent the rate of change. Think of it like measuring speed - how fast something is changing at any given moment.',
      timestamp: '10:15 AM',
      status: 'read',
    },
    {
      id: 6,
      senderId: 0,
      senderType: 'student',
      text: 'That makes more sense now. Can you explain the chain rule?',
      timestamp: '10:20 AM',
      status: 'read',
    },
    {
      id: 7,
      senderId: 1,
      senderType: 'teacher',
      text: 'Absolutely! The chain rule is used when you have a function inside another function. I\'ll share some practice problems for you.',
      timestamp: '10:25 AM',
      status: 'read',
    },
    {
      id: 8,
      senderId: 1,
      senderType: 'teacher',
      text: 'Good luck with your exam preparation!',
      timestamp: '10:30 AM',
      status: 'delivered',
    },
  ]);

  // Filter teachers based on search
  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Auto-select teacher on mount if selectedTeacherId is provided
  useEffect(() => {
    if (teacherData) {
      const teacher = teachers.find((t) => t.id === teacherData.id);
      if (teacher) {
        setSelectedTeacher(teacher);
      }
    } else if (teachers.length > 0) {
      // Default to first teacher
      setSelectedTeacher(teachers[0]);
    }
  }, [teacherData]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (messageInput.trim() === '') return;

    const newMessage: Message = {
      id: messages.length + 1,
      senderId: 0,
      senderType: 'student',
      text: messageInput,
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'sent',
    };

    setMessages([...messages, newMessage]);
    setMessageInput('');

    // Simulate teacher response after 2 seconds
    setTimeout(() => {
      const teacherResponse: Message = {
        id: messages.length + 2,
        senderId: selectedTeacher?.id || 1,
        senderType: 'teacher',
        text: 'Thank you for your message! I\'ll get back to you shortly.',
        timestamp: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        status: 'sent',
      };
      setMessages((prev) => [...prev, teacherResponse]);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <DashboardLayout
        userRole="student"
        userName="Gayantha"
        userInitials="GP"
        notificationCount={5}
        breadcrumb="Chat"
        activePage="chat"
        onNavigate={onNavigate}
        onLogout={onLogout}
      >
        <div className="h-[calc(100vh-140px)] flex gap-6">
          {/* LEFT PANEL - Teacher List */}
          <div className="w-96 flex flex-col">
            <GlassCard className="flex-1 flex flex-col overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-white/10">
                <h2 className="text-2xl font-bold text-white mb-1">My Teachers</h2>
                <p className="text-white/60 text-sm">
                  {filteredTeachers.length} contact
                  {filteredTeachers.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Search Bar */}
              <div className="p-4 border-b border-white/10">
                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search teachers..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_12px_rgba(34,211,238,0.3)] transition-all duration-300"
                  />
                </div>
              </div>

              {/* Teacher List */}
              <div className="flex-1 overflow-y-auto">
                {filteredTeachers.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-white/60">No teachers found</p>
                  </div>
                ) : (
                  <div className="p-2">
                    {filteredTeachers.map((teacher) => {
                      const isSelected = selectedTeacher?.id === teacher.id;
                      return (
                        <button
                          key={teacher.id}
                          onClick={() => setSelectedTeacher(teacher)}
                          className={`w-full p-4 rounded-xl mb-2 transition-all duration-300 text-left ${
                            isSelected
                              ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-cyan-400/30 shadow-[0_0_16px_rgba(34,211,238,0.3)]'
                              : 'hover:bg-white/5 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {/* Avatar with Online Status */}
                            <div className="relative">
                              <img
                                src={teacher.avatar}
                                alt={teacher.name}
                                className="w-14 h-14 rounded-full object-cover border-2 border-white/10"
                              />
                              {teacher.isOnline && (
                                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0B0F1A]" />
                              )}
                              {teacher.unreadCount > 0 && (
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-[0_0_12px_rgba(59,130,246,0.6)]">
                                  {teacher.unreadCount}
                                </div>
                              )}
                            </div>

                            {/* Teacher Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="text-white font-semibold truncate">
                                  {teacher.name}
                                </h3>
                                <span className="text-xs text-white/60 ml-2 flex-shrink-0">
                                  {teacher.lastMessageTime}
                                </span>
                              </div>
                              <p className="text-cyan-400 text-xs mb-1">
                                {teacher.subject}
                              </p>
                              <p className="text-white/60 text-sm truncate">
                                {teacher.lastMessage}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </GlassCard>
          </div>

          {/* RIGHT PANEL - Chat Window */}
          <div className="flex-1 flex flex-col">
            {selectedTeacher ? (
              <GlassCard className="flex-1 flex flex-col overflow-hidden">
                {/* Chat Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Teacher Avatar */}
                    <div className="relative">
                      <img
                        src={selectedTeacher.avatar}
                        alt={selectedTeacher.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-white/10"
                      />
                      {selectedTeacher.isOnline && (
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0B0F1A]" />
                      )}
                    </div>

                    {/* Teacher Info */}
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {selectedTeacher.name}
                      </h3>
                      <p className="text-cyan-400 text-sm">
                        {selectedTeacher.subject} •{' '}
                        <span
                          className={
                            selectedTeacher.isOnline
                              ? 'text-green-400'
                              : 'text-white/60'
                          }
                        >
                          {selectedTeacher.isOnline ? 'Online' : 'Offline'}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all duration-300">
                      <Phone size={18} />
                    </button>
                    <button className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all duration-300">
                      <Video size={18} />
                    </button>
                    <button className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all duration-300">
                      <Info size={18} />
                    </button>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {/* Date Separator */}
                  <div className="flex items-center justify-center mb-6">
                    <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
                      <span className="text-white/60 text-xs">Today</span>
                    </div>
                  </div>

                  {/* Messages */}
                  {messages.map((message) => {
                    const isStudent = message.senderType === 'student';
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isStudent ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[60%] ${
                            isStudent ? 'order-2' : 'order-1'
                          }`}
                        >
                          {/* Message Bubble */}
                          <div
                            className={`p-4 rounded-2xl ${
                              isStudent
                                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-br-md'
                                : 'bg-white/5 backdrop-blur-xl border border-white/10 text-white/90 rounded-bl-md'
                            }`}
                          >
                            <p className="leading-relaxed">{message.text}</p>
                          </div>

                          {/* Timestamp & Status */}
                          <div
                            className={`flex items-center gap-1 mt-1 px-2 ${
                              isStudent ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            <span className="text-xs text-white/60">
                              {message.timestamp}
                            </span>
                            {isStudent && (
                              <div>
                                {message.status === 'sent' && (
                                  <Check size={14} className="text-white/60" />
                                )}
                                {message.status === 'delivered' && (
                                  <CheckCheck size={14} className="text-white/60" />
                                )}
                                {message.status === 'read' && (
                                  <CheckCheck size={14} className="text-cyan-400" />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input Area */}
                <div className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-xl">
                  <div className="flex items-end gap-3">
                    {/* Attachment Button */}
                    <button className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all duration-300 flex-shrink-0">
                      <Paperclip size={20} />
                    </button>

                    {/* Message Input */}
                    <div className="flex-1 relative">
                      <textarea
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        rows={1}
                        className="w-full px-4 py-3 pr-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_12px_rgba(34,211,238,0.3)] transition-all duration-300 resize-none"
                        style={{ minHeight: '44px', maxHeight: '120px' }}
                      />
                      {/* Emoji Button */}
                      <button className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors">
                        <Smile size={20} />
                      </button>
                    </div>

                    {/* Send Button */}
                    <button
                      onClick={handleSendMessage}
                      disabled={messageInput.trim() === ''}
                      className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white hover:shadow-[0_0_24px_rgba(59,130,246,0.6)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none flex-shrink-0"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              </GlassCard>
            ) : (
              <GlassCard className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mx-auto mb-4">
                    <Search size={40} className="text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Select a Teacher
                  </h3>
                  <p className="text-white/60">
                    Choose a teacher from the list to start chatting
                  </p>
                </div>
              </GlassCard>
            )}
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}