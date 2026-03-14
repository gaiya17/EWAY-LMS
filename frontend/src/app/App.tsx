import React, { useEffect, useState } from 'react';
import { Navbar } from './components/navbar';
import { HeroSection } from './components/hero-section';
import { AboutSection } from './components/about-section';
import { FeaturesSection } from './components/features-section';
import { WorkProcessSection } from './components/work-process-section';
import { GallerySection } from './components/gallery-section';
import { CTASection } from './components/cta-section';
import { ContactSection } from './components/contact-section';
import { Footer } from './components/footer';
import { LoginPage } from './components/login-page';
import { RegistrationPage } from './components/registration-page';
import { VerifyEmailPage } from './components/verify-email-page';
import { ForgotPasswordFlow } from './components/forgot-password-flow';
import { StudentDashboardHome } from './components/dashboard/student-dashboard-home';
import { StudentProfile } from './components/dashboard/student-profile';
import { StudentIdCard } from './components/dashboard/student-id-card';
import { NotificationsPage } from './components/dashboard/notifications-page';
import { MyClassesPage } from './components/dashboard/my-classes-page';
import { PurchaseClassesPage } from './components/dashboard/purchase-classes-page';
import { CheckoutPage } from './components/dashboard/checkout-page';
import { FreeTutorialsPage } from './components/dashboard/free-tutorials-page';
import { StudyPacksPage } from './components/dashboard/study-packs-page';
import { StudyPackPreviewPage } from './components/dashboard/study-pack-preview-page';
import { CheckoutPaymentPage } from './components/dashboard/checkout-payment-page';
import { AllTeachersPage } from './components/dashboard/all-teachers-page';
import { TeacherProfilePage } from './components/dashboard/teacher-profile-page';
import { ChatWithTeacherPage } from './components/dashboard/chat-with-teacher-page';
import { MyPerformancePage } from './components/dashboard/my-performance-page';
import { SupportPage } from './components/dashboard/support-page';
import { ComingSoonDashboard } from './components/dashboard/coming-soon-dashboard';
import { TeacherDashboardHome } from './components/dashboard/teacher-dashboard-home';
import { TeacherProfile } from './components/dashboard/teacher-profile';
import { TeacherClassesPage } from './components/dashboard/teacher-classes-page';
import { TeacherAssignmentsPage } from './components/dashboard/teacher-assignments-page';
import { TeacherAttendancePage } from './components/dashboard/teacher-attendance-page';
import { TeacherNotificationsPage } from './components/dashboard/teacher-notifications-page';
import { TeacherChatPage } from './components/dashboard/teacher-chat-page';
import { StaffDashboardHome } from './components/dashboard/staff-dashboard-home';
import { StaffProfile } from './components/dashboard/staff-profile';
import { VerifyPaymentsPage } from './components/dashboard/verify-payments-page';
import { AttendanceManagementPage } from './components/dashboard/attendance-management-page';
import { StudentCardsPage } from './components/dashboard/student-cards-page';
import { ReportsPage } from './components/dashboard/reports-page';
import { StaffNotificationsPage } from './components/dashboard/staff-notifications-page';
import { AdminDashboardHome } from './components/dashboard/admin-dashboard-home';
import { AdminUserManagement } from './components/dashboard/admin-user-management';
import { AdminChatbotManagement } from './components/dashboard/admin-chatbot-management';
import { AdminPaymentVerification } from './components/dashboard/admin-payment-verification';
import { AdminReportGeneration } from './components/dashboard/admin-report-generation';
import { AdminViewReport } from './components/dashboard/admin-view-report';
import { AdminActivityLog } from './components/dashboard/admin-activity-log';
import { AdminMyProfile } from './components/dashboard/admin-my-profile';
import { clearStoredAuth, getStoredAuth } from './lib/auth';

type PageType =
  | 'home'
  | 'login'
  | 'register'
  | 'verify-email'
  | 'forgot-password'
  | 'dashboard-student'
  | 'student-profile'
  | 'student-id-card'
  | 'student-notifications'
  | 'student-classes'
  | 'student-purchase'
  | 'student-checkout'
  | 'student-tutorials'
  | 'student-study-packs'
  | 'student-pack-preview'
  | 'student-pack-checkout'
  | 'student-teachers'
  | 'student-teacher-profile'
  | 'student-chat'
  | 'student-performance'
  | 'support'
  | 'dashboard-teacher'
  | 'teacher-profile'
  | 'teacher-classes'
  | 'teacher-assignments'
  | 'teacher-attendance'
  | 'teacher-notifications'
  | 'teacher-chat'
  | 'dashboard-staff'
  | 'staff-profile'
  | 'verify-payments'
  | 'attendance-management'
  | 'student-cards'
  | 'reports'
  | 'staff-notifications'
  | 'dashboard-admin'
  | 'admin-users'
  | 'admin-chatbot'
  | 'admin-payment-verification'
  | 'admin-report-generation'
  | 'admin-view-report'
  | 'admin-activity-log'
  | 'admin-my-profile';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [checkoutData, setCheckoutData] = useState<any>(null);
  const [previewPackData, setPreviewPackData] = useState<any>(null);
  const [packCheckoutData, setPackCheckoutData] = useState<any>(null);
  const [teacherProfileData, setTeacherProfileData] = useState<any>(null);
  const [chatTeacherData, setChatTeacherData] = useState<any>(null);

  useEffect(() => {
    // Smooth scrolling for the entire page
    document.documentElement.style.scrollBehavior = 'smooth';

    const storedAuth = getStoredAuth();
    if (storedAuth?.user?.role) {
      handleLoginSuccess(storedAuth.user.role);
    }
    
    // Check URL parameters for page routing (e.g., email verification)
    const params = new URLSearchParams(window.location.search);
    const pageParam = params.get('page');
    if (pageParam === 'verify-email') {
      setCurrentPage('verify-email');
    }
  }, []);

  const handleLoginSuccess = (role: 'student' | 'teacher' | 'staff' | 'admin') => {
    switch (role) {
      case 'student':
        setCurrentPage('dashboard-student');
        break;
      case 'teacher':
        setCurrentPage('dashboard-teacher');
        break;
      case 'staff':
        setCurrentPage('dashboard-staff');
        break;
      case 'admin':
        setCurrentPage('dashboard-admin');
        break;
    }
  };

  const handleLogout = () => {
    clearStoredAuth();
    setCurrentPage('login');
  };

  const handleLoginClick = () => {
    setCurrentPage('login');
  };

  const handleRegisterClick = () => {
    setCurrentPage('register');
  };

  const handleStudentNavigation = (page: string, data?: any) => {
    if (page === 'dashboard') {
      setCurrentPage('dashboard-student');
    } else if (page === 'profile') {
      setCurrentPage('student-profile');
    } else if (page === 'student-id' || page === 'id-card') {
      setCurrentPage('student-id-card');
    } else if (page === 'notifications') {
      setCurrentPage('student-notifications');
    } else if (page === 'classes') {
      setCurrentPage('student-classes');
    } else if (page === 'purchase' || page === 'browse') {
      setCurrentPage('student-purchase');
    } else if (page === 'checkout') {
      setCheckoutData(data);
      setCurrentPage('student-checkout');
    } else if (page === 'tutorials') {
      setCurrentPage('student-tutorials');
    } else if (page === 'study-packs') {
      setCurrentPage('student-study-packs');
    } else if (page === 'pack-preview') {
      setPreviewPackData(data);
      setCurrentPage('student-pack-preview');
    } else if (page === 'pack-checkout') {
      setPackCheckoutData(data);
      setCurrentPage('student-pack-checkout');
    } else if (page === 'teachers') {
      setCurrentPage('student-teachers');
    } else if (page === 'teacher-profile') {
      setTeacherProfileData(data);
      setCurrentPage('student-teacher-profile');
    } else if (page === 'chat') {
      setChatTeacherData(data);
      setCurrentPage('student-chat');
    } else if (page === 'performance') {
      setCurrentPage('student-performance');
    } else if (page === 'support') {
      setCurrentPage('support');
    }
    // Add more navigation cases as needed
  };

  const handleTeacherNavigation = (page: string) => {
    if (page === 'dashboard') {
      setCurrentPage('dashboard-teacher');
    } else if (page === 'profile' || page === 'teacher-profile') {
      setCurrentPage('teacher-profile');
    } else if (page === 'teacher-classes') {
      setCurrentPage('teacher-classes');
    } else if (page === 'teacher-assignments') {
      setCurrentPage('teacher-assignments');
    } else if (page === 'teacher-attendance') {
      setCurrentPage('teacher-attendance');
    } else if (page === 'notifications' || page === 'teacher-notifications') {
      setCurrentPage('teacher-notifications');
    } else if (page === 'teacher-students') {
      alert('Students - Coming Soon!');
    } else if (page === 'teacher-chat') {
      setCurrentPage('teacher-chat');
    }
  };

  const handleStaffNavigation = (page: string) => {
    if (page === 'dashboard') {
      setCurrentPage('dashboard-staff');
    } else if (page === 'profile') {
      setCurrentPage('staff-profile');
    } else if (page === 'verify-payments') {
      setCurrentPage('verify-payments');
    } else if (page === 'attendance-management') {
      setCurrentPage('attendance-management');
    } else if (page === 'student-cards') {
      setCurrentPage('student-cards');
    } else if (page === 'reports') {
      setCurrentPage('reports');
    } else if (page === 'notifications') {
      setCurrentPage('staff-notifications');
    }
  };

  const handleAdminNavigation = (page: string) => {
    if (page === 'dashboard') {
      setCurrentPage('dashboard-admin');
    } else if (page === 'user-management') {
      setCurrentPage('admin-users');
    } else if (page === 'chatbot-management') {
      setCurrentPage('admin-chatbot');
    } else if (page === 'payment-verification') {
      setCurrentPage('admin-payment-verification');
    } else if (page === 'report-generation') {
      setCurrentPage('admin-report-generation');
    } else if (page === 'view-report') {
      setCurrentPage('admin-view-report');
    } else if (page === 'attendance-management') {
      setCurrentPage('admin-activity-log');
    } else if (page === 'my-profile') {
      setCurrentPage('admin-my-profile');
    } else if (page === 'profile') {
      setCurrentPage('admin-my-profile');
    } else {
      // For now, show alert for other admin pages
      alert(`${page} - Coming Soon!`);
    }
  };

  return (
    <div>
      {/* Only show Navbar on the landing page */}
      {currentPage === 'home' && <Navbar onLoginClick={handleLoginClick} onRegisterClick={handleRegisterClick} />}
      
      {currentPage === 'home' && (
        <div>
          <HeroSection />
          <AboutSection />
          <FeaturesSection />
          <WorkProcessSection />
          <GallerySection />
          <CTASection />
          <ContactSection />
          <Footer />
        </div>
      )}
      {currentPage === 'login' && <LoginPage onLoginSuccess={handleLoginSuccess} onRegisterClick={handleRegisterClick} onForgotPasswordClick={() => setCurrentPage('forgot-password')} />}
      {currentPage === 'register' && (
        <RegistrationPage
          onLoginClick={handleLoginClick}
          onRegisterSuccess={() => handleLoginSuccess('student')}
        />
      )}
      {currentPage === 'verify-email' && <VerifyEmailPage onLoginClick={handleLoginClick} />}
      {currentPage === 'forgot-password' && <ForgotPasswordFlow onBackToLogin={handleLoginClick} />}
      {currentPage === 'dashboard-student' && (
        <StudentDashboardHome onLogout={handleLogout} onNavigate={handleStudentNavigation} />
      )}
      {currentPage === 'student-profile' && (
        <StudentProfile onLogout={handleLogout} onNavigate={handleStudentNavigation} />
      )}
      {currentPage === 'student-id-card' && (
        <StudentIdCard onLogout={handleLogout} onNavigate={handleStudentNavigation} />
      )}
      {currentPage === 'student-notifications' && (
        <NotificationsPage onLogout={handleLogout} onNavigate={handleStudentNavigation} />
      )}
      {currentPage === 'student-classes' && (
        <MyClassesPage onLogout={handleLogout} onNavigate={handleStudentNavigation} />
      )}
      {currentPage === 'student-purchase' && (
        <PurchaseClassesPage onLogout={handleLogout} onNavigate={handleStudentNavigation} />
      )}
      {currentPage === 'student-checkout' && (
        <CheckoutPage onLogout={handleLogout} onNavigate={handleStudentNavigation} data={checkoutData} />
      )}
      {currentPage === 'student-tutorials' && (
        <FreeTutorialsPage onLogout={handleLogout} onNavigate={handleStudentNavigation} />
      )}
      {currentPage === 'student-study-packs' && (
        <StudyPacksPage onLogout={handleLogout} onNavigate={handleStudentNavigation} />
      )}
      {currentPage === 'student-pack-preview' && (
        <StudyPackPreviewPage
          onLogout={handleLogout}
          onNavigate={handleStudentNavigation}
          data={previewPackData}
        />
      )}
      {currentPage === 'student-pack-checkout' && (
        <CheckoutPaymentPage
          onLogout={handleLogout}
          onNavigate={handleStudentNavigation}
          data={packCheckoutData}
        />
      )}
      {currentPage === 'student-teachers' && (
        <AllTeachersPage onLogout={handleLogout} onNavigate={handleStudentNavigation} />
      )}
      {currentPage === 'student-teacher-profile' && (
        <TeacherProfilePage
          onLogout={handleLogout}
          onNavigate={handleStudentNavigation}
          data={teacherProfileData}
        />
      )}
      {currentPage === 'student-chat' && (
        <ChatWithTeacherPage
          onLogout={handleLogout}
          onNavigate={handleStudentNavigation}
          teacherData={chatTeacherData}
        />
      )}
      {currentPage === 'student-performance' && (
        <MyPerformancePage onLogout={handleLogout} onNavigate={handleStudentNavigation} />
      )}
      {currentPage === 'support' && <SupportPage onLogout={handleLogout} onNavigate={handleStudentNavigation} />}
      {currentPage === 'dashboard-teacher' && (
        <TeacherDashboardHome onLogout={handleLogout} onNavigate={handleTeacherNavigation} />
      )}
      {currentPage === 'teacher-profile' && (
        <TeacherProfile onLogout={handleLogout} onNavigate={handleTeacherNavigation} />
      )}
      {currentPage === 'teacher-classes' && (
        <TeacherClassesPage onLogout={handleLogout} onNavigate={handleTeacherNavigation} />
      )}
      {currentPage === 'teacher-assignments' && (
        <TeacherAssignmentsPage onLogout={handleLogout} onNavigate={handleTeacherNavigation} />
      )}
      {currentPage === 'teacher-attendance' && (
        <TeacherAttendancePage onLogout={handleLogout} onNavigate={handleTeacherNavigation} />
      )}
      {currentPage === 'teacher-notifications' && (
        <TeacherNotificationsPage onLogout={handleLogout} onNavigate={handleTeacherNavigation} />
      )}
      {currentPage === 'teacher-chat' && (
        <TeacherChatPage onLogout={handleLogout} onNavigate={handleTeacherNavigation} />
      )}
      {currentPage === 'dashboard-staff' && (
        <StaffDashboardHome onLogout={handleLogout} onNavigate={handleStaffNavigation} />
      )}
      {currentPage === 'staff-profile' && (
        <StaffProfile onLogout={handleLogout} onNavigate={handleStaffNavigation} />
      )}
      {currentPage === 'verify-payments' && (
        <VerifyPaymentsPage onLogout={handleLogout} onNavigate={handleStaffNavigation} />
      )}
      {currentPage === 'attendance-management' && (
        <AttendanceManagementPage onLogout={handleLogout} onNavigate={handleStaffNavigation} />
      )}
      {currentPage === 'student-cards' && (
        <StudentCardsPage onLogout={handleLogout} onNavigate={handleStaffNavigation} />
      )}
      {currentPage === 'reports' && (
        <ReportsPage onLogout={handleLogout} onNavigate={handleStaffNavigation} />
      )}
      {currentPage === 'staff-notifications' && (
        <StaffNotificationsPage onLogout={handleLogout} onNavigate={handleStaffNavigation} />
      )}
      {currentPage === 'dashboard-admin' && (
        <AdminDashboardHome onLogout={handleLogout} onNavigate={handleAdminNavigation} />
      )}
      {currentPage === 'admin-users' && (
        <AdminUserManagement onLogout={handleLogout} onNavigate={handleAdminNavigation} />
      )}
      {currentPage === 'admin-chatbot' && (
        <AdminChatbotManagement onLogout={handleLogout} onNavigate={handleAdminNavigation} />
      )}
      {currentPage === 'admin-payment-verification' && (
        <AdminPaymentVerification onLogout={handleLogout} onNavigate={handleAdminNavigation} />
      )}
      {currentPage === 'admin-report-generation' && (
        <AdminReportGeneration onLogout={handleLogout} onNavigate={handleAdminNavigation} />
      )}
      {currentPage === 'admin-view-report' && (
        <AdminViewReport onLogout={handleLogout} onNavigate={handleAdminNavigation} />
      )}
      {currentPage === 'admin-activity-log' && (
        <AdminActivityLog onLogout={handleLogout} onNavigate={handleAdminNavigation} />
      )}
      {currentPage === 'admin-my-profile' && (
        <AdminMyProfile onLogout={handleLogout} onNavigate={handleAdminNavigation} />
      )}
    </div>
  );
}

export default App;
