import React, { useState, useRef, useEffect } from 'react';
import { DashboardLayout } from './dashboard-layout';
import { GlassCard } from '../glass-card';
import {
  Search,
  Send,
  Paperclip,
  Smile,
  Phone,
  Info,
  Circle,
  MessageCircle,
  ArrowLeft,
} from 'lucide-react';

interface TeacherChatPageProps {
  onLogout?: () => void;
  onNavigate?: (page: string) => void;
}

interface Student {
  id: number;
  name: string;
  initials: string;
  class: string;
  subject: string;
  studentId: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  avatar: string;
}

interface Message {
  id: number;
  senderId: string;
  text: string;
  timestamp: string;
  isTeacher: boolean;
}

export function TeacherChatPage({
  onLogout,
  onNavigate,
}: TeacherChatPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const students: Student[] = [
    {
      id: 1,
      name: 'Kasun Perera',
      initials: 'KP',
      class: 'A/L ICT 2026',
      subject: 'ICT',
      studentId: 'ST2026001',
      lastMessage: 'Sir I have a question about assignment...',
      lastMessageTime: '2:30 PM',
      unreadCount: 2,
      isOnline: true,
      avatar: '#6366F1',
    },
    {
      id: 2,
      name: 'Nimal Silva',
      initials: 'NS',
      class: 'A/L ICT 2026',
      subject: 'ICT',
      studentId: 'ST2026002',
      lastMessage: 'Thank you sir for the explanation',
      lastMessageTime: '1:45 PM',
      unreadCount: 0,
      isOnline: true,
      avatar: '#22D3EE',
    },
    {
      id: 3,
      name: 'Amaya Fernando',
      initials: 'AF',
      class: 'A/L ICT 2026',
      subject: 'ICT',
      studentId: 'ST2026003',
      lastMessage: 'Can I submit the assignment tomorrow?',
      lastMessageTime: '12:15 PM',
      unreadCount: 1,
      isOnline: false,
      avatar: '#A855F7',
    },
    {
      id: 4,
      name: 'Sithija Wijesinghe',
      initials: 'SW',
      class: 'Grade 11 ICT',
      subject: 'ICT',
      studentId: 'ST2025015',
      lastMessage: 'Sir when is the next class?',
      lastMessageTime: '11:30 AM',
      unreadCount: 0,
      isOnline: false,
      avatar: '#F59E0B',
    },
    {
      id: 5,
      name: 'Tharindu Bandara',
      initials: 'TB',
      class: 'A/L Maths 2026',
      subject: 'Mathematics',
      studentId: 'ST2026045',
      lastMessage: 'I understood the concept now, thank you!',
      lastMessageTime: 'Yesterday',
      unreadCount: 0,
      isOnline: true,
      avatar: '#22C55E',
    },
    {
      id: 6,
      name: 'Sachini De Silva',
      initials: 'SD',
      class: 'A/L ICT 2026',
      subject: 'ICT',
      studentId: 'ST2026008',
      lastMessage: 'Sir I have completed the project',
      lastMessageTime: 'Yesterday',
      unreadCount: 0,
      isOnline: false,
      avatar: '#EC4899',
    },
    {
      id: 7,
      name: 'Ravindu Jayasinghe',
      initials: 'RJ',
      class: 'Grade 10 ICT',
      subject: 'ICT',
      studentId: 'ST2024032',
      lastMessage: 'Can you explain the algorithm again?',
      lastMessageTime: 'March 8',
      unreadCount: 0,
      isOnline: false,
      avatar: '#3B82F6',
    },
    {
      id: 8,
      name: 'Nethmi Perera',
      initials: 'NP',
      class: 'A/L Physics 2026',
      subject: 'Physics',
      studentId: 'ST2026078',
      lastMessage: 'Got it sir, thanks!',
      lastMessageTime: 'March 7',
      unreadCount: 0,
      isOnline: true,
      avatar: '#8B5CF6',
    },
  ];

  const [conversations, setConversations] = useState<{ [key: number]: Message[] }>({
    1: [
      {
        id: 1,
        senderId: 'student',
        text: 'Good morning sir!',
        timestamp: '10:30 AM',
        isTeacher: false,
      },
      {
        id: 2,
        senderId: 'teacher',
        text: 'Good morning Kasun! How can I help you?',
        timestamp: '10:32 AM',
        isTeacher: true,
      },
      {
        id: 3,
        senderId: 'student',
        text: 'Sir I have a question about the database ER diagram assignment',
        timestamp: '10:33 AM',
        isTeacher: false,
      },
      {
        id: 4,
        senderId: 'teacher',
        text: 'Sure, what would you like to know?',
        timestamp: '10:35 AM',
        isTeacher: true,
      },
      {
        id: 5,
        senderId: 'student',
        text: 'How do I represent the many-to-many relationship between students and courses?',
        timestamp: '10:36 AM',
        isTeacher: false,
      },
      {
        id: 6,
        senderId: 'teacher',
        text: 'Great question! You need to create a junction table. Check slide 15 in the lecture notes for an example.',
        timestamp: '10:38 AM',
        isTeacher: true,
      },
      {
        id: 7,
        senderId: 'student',
        text: 'Sir I have a question about assignment...',
        timestamp: '2:30 PM',
        isTeacher: false,
      },
    ],
    2: [
      {
        id: 1,
        senderId: 'student',
        text: 'Sir can you explain question 3?',
        timestamp: '1:00 PM',
        isTeacher: false,
      },
      {
        id: 2,
        senderId: 'teacher',
        text: 'Yes, check the ER diagram example in the lecture notes.',
        timestamp: '1:10 PM',
        isTeacher: true,
      },
      {
        id: 3,
        senderId: 'student',
        text: 'Thank you sir for the explanation',
        timestamp: '1:45 PM',
        isTeacher: false,
      },
    ],
    3: [
      {
        id: 1,
        senderId: 'student',
        text: 'Sir, I was sick yesterday',
        timestamp: '12:00 PM',
        isTeacher: false,
      },
      {
        id: 2,
        senderId: 'teacher',
        text: 'I hope you feel better. Do you have a medical certificate?',
        timestamp: '12:05 PM',
        isTeacher: true,
      },
      {
        id: 3,
        senderId: 'student',
        text: 'Can I submit the assignment tomorrow?',
        timestamp: '12:15 PM',
        isTeacher: false,
      },
    ],
  });

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.class.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student);
    // Mark messages as read
    const updatedStudents = students.map((s) =>
      s.id === student.id ? { ...s, unreadCount: 0 } : s
    );
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedStudent) return;

    const newMessage: Message = {
      id: (conversations[selectedStudent.id]?.length || 0) + 1,
      senderId: 'teacher',
      text: messageInput,
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      }),
      isTeacher: true,
    };

    setConversations({
      ...conversations,
      [selectedStudent.id]: [
        ...(conversations[selectedStudent.id] || []),
        newMessage,
      ],
    });

    setMessageInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, selectedStudent]);

  const totalUnread = students.reduce((sum, student) => sum + student.unreadCount, 0);

  return (
    <DashboardLayout
      userRole="teacher"
      userName="Mr. Silva"
      userInitials="MS"
      notificationCount={0}
      breadcrumb="Chat with Students"
      activePage="teacher-chat"
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      {/* Page Header */}
      <div className="mb-6">
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
        <h1 className="text-3xl font-bold text-white mb-2">
          Chat with Students
        </h1>
        <p className="text-white/60">Communicate with your students</p>
      </div>

      <div className="flex gap-6 h-[calc(100vh-280px)]">
        {/* LEFT PANEL - Students List */}
        <div className="w-80 flex-shrink-0">
          <GlassCard className="p-5 h-full flex flex-col">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-white mb-1">My Students</h3>
              <p className="text-white/60 text-sm">
                Students from your classes
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative mb-4">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                size={18}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search students..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 transition-colors"
              />
            </div>

            {/* Students List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
              {filteredStudents.map((student) => (
                <button
                  key={student.id}
                  onClick={() => handleStudentClick(student)}
                  className={`w-full p-3 rounded-xl transition-all duration-300 text-left ${
                    selectedStudent?.id === student.id
                      ? 'bg-gradient-to-r from-blue-500/20 to-cyan-400/20 border border-blue-500/30'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-sm"
                        style={{ background: student.avatar }}
                      >
                        {student.initials}
                      </div>
                      {student.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0B0F1A]" />
                      )}
                    </div>

                    {/* Student Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-semibold text-white text-sm truncate">
                          {student.name}
                        </h4>
                        <span className="text-xs text-white/40 flex-shrink-0 ml-2">
                          {student.lastMessageTime}
                        </span>
                      </div>
                      <p className="text-cyan-400 text-xs mb-1">
                        {student.class}
                      </p>
                      <p className="text-white/60 text-xs truncate">
                        {student.lastMessage}
                      </p>
                    </div>

                    {/* Unread Badge */}
                    {student.unreadCount > 0 && (
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">
                          {student.unreadCount}
                        </span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* RIGHT PANEL - Chat Window */}
        <div className="flex-1">
          <GlassCard className="h-full flex flex-col">
            {selectedStudent ? (
              <>
                {/* Chat Header */}
                <div className="p-5 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-sm"
                        style={{ background: selectedStudent.avatar }}
                      >
                        {selectedStudent.initials}
                      </div>
                      {selectedStudent.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0B0F1A]" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-white font-bold">
                        {selectedStudent.name}
                      </h3>
                      <p className="text-cyan-400 text-sm">
                        {selectedStudent.class}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
                      <Phone size={18} className="text-white/70" />
                    </button>
                    <button className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
                      <Info size={18} className="text-white/70" />
                    </button>
                  </div>
                </div>

                {/* Chat Messages Area */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {conversations[selectedStudent.id]?.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.isTeacher ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[70%] ${
                          message.isTeacher
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                            : 'bg-white/10'
                        } rounded-2xl px-4 py-3`}
                      >
                        <p className="text-white text-sm mb-1">{message.text}</p>
                        <p
                          className={`text-xs ${
                            message.isTeacher ? 'text-white/70' : 'text-white/50'
                          }`}
                        >
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input Area */}
                <div className="p-5 border-t border-white/10">
                  <div className="flex items-end gap-3">
                    <button className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
                      <Paperclip size={20} className="text-white/70" />
                    </button>

                    <div className="flex-1 relative">
                      <textarea
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        rows={1}
                        className="w-full px-4 py-3 pr-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 transition-colors resize-none"
                      />
                      <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-lg transition-colors">
                        <Smile size={20} className="text-white/70" />
                      </button>
                    </div>

                    <button
                      onClick={handleSendMessage}
                      className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:shadow-[0_0_24px_rgba(59,130,246,0.6)] transition-all duration-300 flex items-center gap-2"
                    >
                      <Send size={18} />
                      Send
                    </button>
                  </div>
                </div>
              </>
            ) : (
              // No Student Selected State
              <div className="flex-1 flex flex-col items-center justify-center p-8">
                <MessageCircle
                  className="text-white/20 mb-4"
                  size={64}
                />
                <h3 className="text-white font-bold text-xl mb-2">
                  No Chat Selected
                </h3>
                <p className="text-white/60 text-center">
                  Select a student from the list to start chatting
                </p>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </DashboardLayout>
  );
}