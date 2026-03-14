import React, { useState } from 'react';
import { DashboardLayout } from './dashboard-layout';
import { GlassCard } from '../glass-card';
import {
  ArrowLeft,
  Download,
  Search,
  Eye,
  Check,
  X,
  Clock,
  CheckCircle,
  XCircle,
  CreditCard,
  Calendar,
  User,
  FileText,
  AlertCircle,
} from 'lucide-react';

interface VerifyPaymentsPageProps {
  onLogout?: () => void;
  onNavigate?: (page: string) => void;
}

interface Payment {
  id: string;
  studentName: string;
  studentId: string;
  course: string;
  amount: number;
  paymentMethod: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  transactionRef: string;
  receiptUrl?: string;
}

export function VerifyPaymentsPage({
  onLogout,
  onNavigate,
}: VerifyPaymentsPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [classFilter, setClassFilter] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const [payments, setPayments] = useState<Payment[]>([
    {
      id: '1',
      studentName: 'Kasun Perera',
      studentId: 'STU-1045',
      course: 'A/L ICT 2026',
      amount: 15000,
      paymentMethod: 'Bank Transfer',
      date: 'March 18, 2026',
      status: 'pending',
      transactionRef: 'TXN-20260318-1045',
    },
    {
      id: '2',
      studentName: 'Nimali Fernando',
      studentId: 'STU-1046',
      course: 'A/L Mathematics 2026',
      amount: 12000,
      paymentMethod: 'Online Banking',
      date: 'March 17, 2026',
      status: 'pending',
      transactionRef: 'TXN-20260317-1046',
    },
    {
      id: '3',
      studentName: 'Ravindu Silva',
      studentId: 'STU-1042',
      course: 'O/L Science 2026',
      amount: 10000,
      paymentMethod: 'Bank Transfer',
      date: 'March 16, 2026',
      status: 'approved',
      transactionRef: 'TXN-20260316-1042',
    },
    {
      id: '4',
      studentName: 'Sanduni Perera',
      studentId: 'STU-1047',
      course: 'A/L ICT 2026',
      amount: 15000,
      paymentMethod: 'Cash Deposit',
      date: 'March 15, 2026',
      status: 'approved',
      transactionRef: 'TXN-20260315-1047',
    },
    {
      id: '5',
      studentName: 'Kavinda Rathnayake',
      studentId: 'STU-1048',
      course: 'A/L Physics 2026',
      amount: 13500,
      paymentMethod: 'Bank Transfer',
      date: 'March 14, 2026',
      status: 'rejected',
      transactionRef: 'TXN-20260314-1048',
    },
    {
      id: '6',
      studentName: 'Thilini Jayasinghe',
      studentId: 'STU-1049',
      course: 'O/L Mathematics 2026',
      amount: 9000,
      paymentMethod: 'Online Banking',
      date: 'March 18, 2026',
      status: 'pending',
      transactionRef: 'TXN-20260318-1049',
    },
  ]);

  const stats = {
    pending: payments.filter((p) => p.status === 'pending').length,
    approved: payments.filter((p) => p.status === 'approved').length,
    rejected: payments.filter((p) => p.status === 'rejected').length,
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || payment.status === statusFilter;
    const matchesClass =
      classFilter === 'all' || payment.course.includes(classFilter);
    return matchesSearch && matchesStatus && matchesClass;
  });

  const handleViewReceipt = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowReceiptModal(true);
  };

  const handleApproveClick = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowApproveModal(true);
  };

  const handleRejectClick = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowRejectModal(true);
  };

  const handleApproveConfirm = () => {
    if (selectedPayment) {
      setPayments((prev) =>
        prev.map((p) =>
          p.id === selectedPayment.id ? { ...p, status: 'approved' as const } : p
        )
      );
      setShowApproveModal(false);
      setSelectedPayment(null);
    }
  };

  const handleRejectConfirm = () => {
    if (selectedPayment && rejectReason) {
      setPayments((prev) =>
        prev.map((p) =>
          p.id === selectedPayment.id ? { ...p, status: 'rejected' as const } : p
        )
      );
      setShowRejectModal(false);
      setSelectedPayment(null);
      setRejectReason('');
    } else {
      alert('Please select a reason for rejection');
    }
  };

  const handleExportReport = () => {
    alert('Exporting payment report... (Feature coming soon)');
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      approved: 'bg-green-500/20 text-green-400 border-green-500/30',
      rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
    };

    const icons = {
      pending: Clock,
      approved: CheckCircle,
      rejected: XCircle,
    };

    const Icon = icons[status as keyof typeof icons];

    return (
      <span
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 w-fit ${
          styles[status as keyof typeof styles]
        }`}
      >
        <Icon size={14} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <DashboardLayout
      userRole="staff"
      userName="Ms. Silva"
      userInitials="MS"
      notificationCount={5}
      breadcrumb="Verify Payments"
      activePage="verify-payments"
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
            <h1 className="text-3xl font-bold text-white mb-2">
              Verify Payments
            </h1>
            <p className="text-white/60">
              Review and approve student payment submissions
            </p>
          </div>
          <button
            onClick={handleExportReport}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:shadow-[0_0_24px_rgba(59,130,246,0.6)] transition-all duration-300 flex items-center gap-2"
          >
            <Download size={18} />
            Export Payments Report
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <GlassCard className="p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm mb-2">Pending Payments</p>
              <p className="text-4xl font-bold text-white">{stats.pending}</p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <Clock className="text-orange-400" size={28} />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm mb-2">Approved Payments</p>
              <p className="text-4xl font-bold text-white">{stats.approved}</p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="text-green-400" size={28} />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm mb-2">Rejected Payments</p>
              <p className="text-4xl font-bold text-white">{stats.rejected}</p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-red-500/20 flex items-center justify-center">
              <XCircle className="text-red-400" size={28} />
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Filter Panel */}
      <GlassCard className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
              size={20}
            />
            <input
              type="text"
              placeholder="Search student..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
          >
            <option value="all">All Classes</option>
            <option value="A/L ICT">A/L ICT</option>
            <option value="A/L Mathematics">A/L Mathematics</option>
            <option value="A/L Physics">A/L Physics</option>
            <option value="O/L Science">O/L Science</option>
            <option value="O/L Mathematics">O/L Mathematics</option>
          </select>

          <input
            type="date"
            className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
          />
        </div>
      </GlassCard>

      {/* Payment Table */}
      <GlassCard className="p-6">
        <h2 className="text-xl font-bold text-white mb-6">Payment Requests</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-white/60 text-sm font-semibold pb-4 px-4">
                  Student Name
                </th>
                <th className="text-left text-white/60 text-sm font-semibold pb-4 px-4">
                  Student ID
                </th>
                <th className="text-left text-white/60 text-sm font-semibold pb-4 px-4">
                  Course / Class
                </th>
                <th className="text-left text-white/60 text-sm font-semibold pb-4 px-4">
                  Amount
                </th>
                <th className="text-left text-white/60 text-sm font-semibold pb-4 px-4">
                  Payment Method
                </th>
                <th className="text-left text-white/60 text-sm font-semibold pb-4 px-4">
                  Date
                </th>
                <th className="text-left text-white/60 text-sm font-semibold pb-4 px-4">
                  Status
                </th>
                <th className="text-left text-white/60 text-sm font-semibold pb-4 px-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr
                  key={payment.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-semibold text-sm">
                        {payment.studentName.charAt(0)}
                      </div>
                      <span className="text-white font-medium">
                        {payment.studentName}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-white/70">{payment.studentId}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-white">{payment.course}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-white font-semibold">
                      LKR {payment.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-white/70">{payment.paymentMethod}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-white/70">{payment.date}</span>
                  </td>
                  <td className="py-4 px-4">
                    {getStatusBadge(payment.status)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewReceipt(payment)}
                        className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                        title="View Receipt"
                      >
                        <Eye size={18} />
                      </button>
                      {payment.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApproveClick(payment)}
                            className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                            title="Approve"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            onClick={() => handleRejectClick(payment)}
                            className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                            title="Reject"
                          >
                            <X size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredPayments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-white/40 text-lg">No payments found</p>
            </div>
          )}
        </div>
      </GlassCard>

      {/* View Receipt Modal */}
      {showReceiptModal && selectedPayment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0B0F1A] border border-white/10 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Payment Receipt</h2>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Receipt Image Placeholder */}
              <div className="w-full h-64 rounded-xl bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center">
                <div className="text-center">
                  <FileText className="text-white/40 mx-auto mb-2" size={48} />
                  <p className="text-white/40">Payment Receipt Screenshot</p>
                  <p className="text-white/30 text-sm mt-1">
                    (Image would be displayed here)
                  </p>
                </div>
              </div>

              {/* Payment Details */}
              <GlassCard className="p-6">
                <h3 className="text-lg font-bold text-white mb-4">
                  Payment Details
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="text-blue-400" size={20} />
                    <div>
                      <p className="text-white/60 text-sm">Student</p>
                      <p className="text-white font-medium">
                        {selectedPayment.studentName} ({selectedPayment.studentId})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <CreditCard className="text-green-400" size={20} />
                    <div>
                      <p className="text-white/60 text-sm">Amount Paid</p>
                      <p className="text-white font-semibold text-lg">
                        LKR {selectedPayment.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <FileText className="text-purple-400" size={20} />
                    <div>
                      <p className="text-white/60 text-sm">Transaction Reference</p>
                      <p className="text-white font-medium">
                        {selectedPayment.transactionRef}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="text-cyan-400" size={20} />
                    <div>
                      <p className="text-white/60 text-sm">Payment Date</p>
                      <p className="text-white font-medium">
                        {selectedPayment.date}
                      </p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      )}

      {/* Approve Payment Modal */}
      {showApproveModal && selectedPayment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0B0F1A] border border-white/10 rounded-2xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-green-400" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Approve Payment?
              </h2>
              <p className="text-white/60">
                Are you sure you want to approve this payment from{' '}
                <span className="text-white font-semibold">
                  {selectedPayment.studentName}
                </span>
                ?
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowApproveModal(false)}
                className="flex-1 px-5 py-3 rounded-xl bg-white/5 text-white hover:bg-white/10 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleApproveConfirm}
                className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-[0_0_24px_rgba(34,197,94,0.6)] transition-all duration-300 font-semibold"
              >
                Confirm Approval
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Payment Modal */}
      {showRejectModal && selectedPayment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0B0F1A] border border-white/10 rounded-2xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="text-red-400" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Reject Payment?
              </h2>
              <p className="text-white/60 mb-6">
                Please select a reason for rejecting this payment.
              </p>

              <select
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-red-500/50 transition-colors mb-4"
              >
                <option value="">Select reason...</option>
                <option value="invalid-receipt">Invalid receipt</option>
                <option value="incorrect-amount">Incorrect amount</option>
                <option value="duplicate-payment">Duplicate payment</option>
                <option value="unclear-proof">Unclear proof of payment</option>
                <option value="other">Other reason</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
                className="flex-1 px-5 py-3 rounded-xl bg-white/5 text-white hover:bg-white/10 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectConfirm}
                className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 text-white hover:shadow-[0_0_24px_rgba(239,68,68,0.6)] transition-all duration-300 font-semibold"
              >
                Reject Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
