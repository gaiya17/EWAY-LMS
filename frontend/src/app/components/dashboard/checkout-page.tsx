import React, { useState } from 'react';
import { DashboardLayout } from './dashboard-layout';
import { GlassCard } from '../glass-card';
import { AIChat } from './ai-chat';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import {
  ArrowLeft,
  CreditCard,
  Building2,
  Upload,
  CheckCircle,
  AlertCircle,
  Download,
  Loader2,
  X,
  Wifi,
  MapPin,
  Calendar,
  User,
} from 'lucide-react';

interface CheckoutPageProps {
  onLogout?: () => void;
  onNavigate?: (page: string, data?: any) => void;
  courseData?: {
    id: number;
    title: string;
    teacher: string;
    type: 'online' | 'physical';
    price: number;
    thumbnail: string;
  };
}

type PaymentMethod = 'card' | 'bank';
type PaymentStatus = 'idle' | 'processing' | 'success' | 'failed';

export function CheckoutPage({ onLogout, onNavigate, courseData }: CheckoutPageProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [showReceipt, setShowReceipt] = useState(false);

  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardholderName, setCardholderName] = useState('');

  // Bank transfer state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Transaction details (generated on success)
  const [transactionId] = useState(`TXN${Date.now()}`);
  const [transactionDate] = useState(new Date().toLocaleDateString());

  // Default course data if not provided
  const course = courseData || {
    id: 1,
    title: 'A/L Chemistry Complete Course 2026',
    teacher: 'Mr. Amila Dasanayake',
    type: 'online' as const,
    price: 16000,
    thumbnail: 'https://images.unsplash.com/photo-1758685847747-597ce085906e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVtaXN0cnklMjB0ZWFjaGVyJTIwY2xhc3Nyb29tfGVufDF8fHx8MTc3MTkxNzc1M3ww&ixlib=rb-4.1.0&q=80&w=1080',
  };

  const discount = 1000;
  const totalAmount = course.price - discount;

  // Detect card brand
  const getCardBrand = (number: string) => {
    const cleaned = number.replace(/\s/g, '');
    if (cleaned.startsWith('4')) return 'visa';
    if (cleaned.startsWith('5')) return 'mastercard';
    return null;
  };

  const cardBrand = getCardBrand(cardNumber);

  // Format card number
  const handleCardNumberChange = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    setCardNumber(formatted.substring(0, 19)); // Max 16 digits + 3 spaces
  };

  // Format expiry date
  const handleExpiryChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      setExpiryDate(`${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`);
    } else {
      setExpiryDate(cleaned);
    }
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  // Handle payment
  const handlePayment = () => {
    setPaymentStatus('processing');

    // Simulate payment processing
    setTimeout(() => {
      // 90% success rate for demo
      const success = Math.random() > 0.1;
      setPaymentStatus(success ? 'success' : 'failed');
    }, 2500);
  };

  const handleRetry = () => {
    setPaymentStatus('idle');
  };

  const handleDownloadReceipt = () => {
    alert('Receipt download - Coming Soon!');
  };

  // PAYMENT PROCESSING STATE
  if (paymentStatus === 'processing') {
    return (
      <>
        <DashboardLayout
          userRole="student"
          userName="Gayantha"
          userInitials="GP"
          notificationCount={5}
          breadcrumb="Processing Payment"
          activePage="purchase"
          onNavigate={onNavigate}
          onLogout={onLogout}
        >
          <div className="min-h-[600px] flex items-center justify-center">
            <GlassCard className="p-12 text-center max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                <Loader2 size={40} className="text-white animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Processing Payment</h2>
              <p className="text-white/60">
                Please wait while we process your payment securely...
              </p>
            </GlassCard>
          </div>
        </DashboardLayout>
        <AIChat />
      </>
    );
  }

  // PAYMENT SUCCESS STATE
  if (paymentStatus === 'success') {
    return (
      <>
        <DashboardLayout
          userRole="student"
          userName="Gayantha"
          userInitials="GP"
          notificationCount={5}
          breadcrumb="Payment Success"
          activePage="purchase"
          onNavigate={onNavigate}
          onLogout={onLogout}
        >
          <div className="min-h-[600px] flex items-center justify-center">
            <GlassCard className="p-12 text-center max-w-2xl mx-auto">
              {/* Success Icon */}
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.5)] animate-in zoom-in duration-500">
                <CheckCircle size={48} className="text-white" />
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-white mb-3">Payment Successful! 🎉</h1>
              <p className="text-white/70 text-lg mb-8">
                You have successfully enrolled in <span className="text-cyan-400 font-semibold">{course.title}</span>
              </p>

              {/* Payment Details */}
              <div className="bg-white/5 rounded-2xl p-6 mb-8 text-left space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Course</span>
                  <span className="text-white font-semibold">{course.title}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Amount Paid</span>
                  <span className="text-green-400 font-bold text-xl">LKR {totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Payment Method</span>
                  <span className="text-white">{paymentMethod === 'card' ? 'Credit Card' : 'Bank Transfer'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Date</span>
                  <span className="text-white">{transactionDate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Transaction ID</span>
                  <span className="text-white font-mono text-sm">{transactionId}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => onNavigate?.('classes')}
                  className="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:shadow-[0_0_24px_rgba(59,130,246,0.6)] transition-all duration-300 transform hover:scale-105"
                >
                  Go to My Classes
                </button>
                <button
                  onClick={() => setShowReceipt(true)}
                  className="flex-1 px-6 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Download size={20} />
                  Download Receipt
                </button>
              </div>
            </GlassCard>
          </div>
        </DashboardLayout>
        <AIChat />

        {/* Receipt Modal */}
        {showReceipt && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <GlassCard className="max-w-2xl w-full p-8 relative">
              <button
                onClick={() => setShowReceipt(false)}
                className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              {/* Receipt Header */}
              <div className="text-center mb-8 pb-6 border-b border-white/10">
                <h2 className="text-3xl font-bold text-white mb-2">EWAY Institute LMS</h2>
                <p className="text-white/60">Payment Receipt</p>
              </div>

              {/* Receipt Details */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between">
                  <span className="text-white/60">Receipt No:</span>
                  <span className="text-white font-mono">{transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Date:</span>
                  <span className="text-white">{transactionDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Student:</span>
                  <span className="text-white">Gayantha Premachandra</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Course:</span>
                  <span className="text-white">{course.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Teacher:</span>
                  <span className="text-white">{course.teacher}</span>
                </div>

                <div className="border-t border-white/10 pt-4 mt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-white/60">Course Fee:</span>
                    <span className="text-white">LKR {course.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-white/60">Discount:</span>
                    <span className="text-green-400">- LKR {discount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-4 border-t border-white/10">
                    <span className="text-white font-bold text-lg">Total Paid:</span>
                    <span className="text-green-400 font-bold text-2xl">LKR {totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex justify-between">
                  <span className="text-white/60">Payment Method:</span>
                  <span className="text-white">{paymentMethod === 'card' ? 'Credit Card' : 'Bank Transfer'}</span>
                </div>
              </div>

              {/* Download Button */}
              <button
                onClick={handleDownloadReceipt}
                className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:shadow-[0_0_24px_rgba(59,130,246,0.6)] transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Download size={20} />
                Download PDF Receipt
              </button>
            </GlassCard>
          </div>
        )}
      </>
    );
  }

  // PAYMENT FAILED STATE
  if (paymentStatus === 'failed') {
    return (
      <>
        <DashboardLayout
          userRole="student"
          userName="Gayantha"
          userInitials="GP"
          notificationCount={5}
          breadcrumb="Payment Failed"
          activePage="purchase"
          onNavigate={onNavigate}
          onLogout={onLogout}
        >
          <div className="min-h-[600px] flex items-center justify-center">
            <GlassCard className="p-12 text-center max-w-md mx-auto">
              {/* Error Icon */}
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.5)] animate-in zoom-in duration-500">
                <AlertCircle size={48} className="text-white" />
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-white mb-3">Payment Failed</h1>
              <p className="text-white/70 text-lg mb-8">
                Something went wrong with your payment. Please try again or use a different payment method.
              </p>

              {/* Error Details */}
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-8">
                <p className="text-red-400 text-sm">
                  Error: Transaction could not be completed. Please check your payment details and try again.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleRetry}
                  className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:shadow-[0_0_24px_rgba(59,130,246,0.6)] transition-all duration-300 transform hover:scale-105"
                >
                  Retry Payment
                </button>
                <button
                  onClick={handleRetry}
                  className="w-full px-6 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition-all duration-300"
                >
                  Change Payment Method
                </button>
                <button
                  onClick={() => onNavigate?.('purchase')}
                  className="w-full px-6 py-4 text-white/60 hover:text-white transition-colors"
                >
                  Back to Browse Courses
                </button>
              </div>
            </GlassCard>
          </div>
        </DashboardLayout>
        <AIChat />
      </>
    );
  }

  // CHECKOUT PAGE (IDLE STATE)
  return (
    <>
      <DashboardLayout
        userRole="student"
        userName="Gayantha"
        userInitials="GP"
        notificationCount={5}
        breadcrumb="Checkout"
        activePage="purchase"
        onNavigate={onNavigate}
        onLogout={onLogout}
      >
        <div className="space-y-8">
          {/* Header */}
          <div>
            <button
              onClick={() => onNavigate?.('purchase')}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-4 group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span>Back to Browse Courses</span>
            </button>
            <h1 className="text-3xl font-bold text-white mb-2">Checkout</h1>
            <p className="text-white/60">Complete your enrollment</p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT SIDE - Order Summary */}
            <div className="lg:col-span-1">
              <GlassCard className="p-6 sticky top-8">
                <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

                {/* Course Card */}
                <div className="space-y-4">
                  {/* Course Image */}
                  <div className="relative h-40 rounded-xl overflow-hidden">
                    <ImageWithFallback
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F1A] via-transparent to-transparent" />
                    
                    {/* Type Badge */}
                    <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 backdrop-blur-xl border ${
                      course.type === 'online'
                        ? 'bg-blue-500/30 text-blue-300 border-blue-400/50'
                        : 'bg-orange-500/30 text-orange-300 border-orange-400/50'
                    }`}>
                      {course.type === 'online' ? <Wifi size={12} /> : <MapPin size={12} />}
                      {course.type === 'online' ? 'Online' : 'Physical'}
                    </div>
                  </div>

                  {/* Course Details */}
                  <div>
                    <h3 className="text-white font-bold text-lg mb-2">{course.title}</h3>
                    <div className="flex items-center gap-2 text-white/60 text-sm">
                      <User size={14} className="text-cyan-400" />
                      <span>{course.teacher}</span>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <div className="flex justify-between text-white/70">
                      <span>Course Fee</span>
                      <span>LKR {course.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-green-400">
                      <span>Discount</span>
                      <span>- LKR {discount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-white font-bold text-xl pt-3 border-t border-white/10">
                      <span>Total</span>
                      <span className="text-green-400">LKR {totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* RIGHT SIDE - Payment Method */}
            <div className="lg:col-span-2">
              <GlassCard className="p-8">
                <h2 className="text-xl font-bold text-white mb-6">Payment Method</h2>

                {/* Payment Method Tabs */}
                <div className="flex gap-4 mb-8">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                      paymentMethod === 'card'
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-[0_0_16px_rgba(59,130,246,0.5)]'
                        : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    <CreditCard size={20} />
                    Card Payment
                  </button>
                  <button
                    onClick={() => setPaymentMethod('bank')}
                    className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                      paymentMethod === 'bank'
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-[0_0_16px_rgba(59,130,246,0.5)]'
                        : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    <Building2 size={20} />
                    Bank Transfer
                  </button>
                </div>

                {/* CARD PAYMENT FORM */}
                {paymentMethod === 'card' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                    {/* Card Number */}
                    <div className="relative">
                      <label className="block text-white/60 text-sm mb-2">Card Number</label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => handleCardNumberChange(e.target.value)}
                        className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400/50 focus:bg-white/10 transition-all"
                      />
                      {cardBrand && (
                        <div className="absolute right-4 top-[42px] text-xs text-white/60 uppercase font-bold">
                          {cardBrand === 'visa' && '💳 VISA'}
                          {cardBrand === 'mastercard' && '💳 MASTERCARD'}
                        </div>
                      )}
                    </div>

                    {/* Expiry & CVC */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white/60 text-sm mb-2">Expiry Date</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={expiryDate}
                          onChange={(e) => handleExpiryChange(e.target.value)}
                          maxLength={5}
                          className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400/50 focus:bg-white/10 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-white/60 text-sm mb-2">CVC</label>
                        <input
                          type="text"
                          placeholder="123"
                          value={cvc}
                          onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').substring(0, 3))}
                          maxLength={3}
                          className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400/50 focus:bg-white/10 transition-all"
                        />
                      </div>
                    </div>

                    {/* Cardholder Name */}
                    <div>
                      <label className="block text-white/60 text-sm mb-2">Cardholder Name</label>
                      <input
                        type="text"
                        placeholder="GAYANTHA PREMACHANDRA"
                        value={cardholderName}
                        onChange={(e) => setCardholderName(e.target.value.toUpperCase())}
                        className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400/50 focus:bg-white/10 transition-all"
                      />
                    </div>

                    {/* Security Notice */}
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                      <p className="text-blue-400 text-sm">
                        🔒 Your payment information is encrypted and secure
                      </p>
                    </div>

                    {/* Pay Button */}
                    <button
                      onClick={handlePayment}
                      disabled={!cardNumber || !expiryDate || !cvc || !cardholderName}
                      className="w-full px-6 py-5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-lg hover:shadow-[0_0_24px_rgba(59,130,246,0.6)] transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      Pay LKR {totalAmount.toLocaleString()}
                    </button>
                  </div>
                )}

                {/* BANK TRANSFER FORM */}
                {paymentMethod === 'bank' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                    {/* Bank Details */}
                    <div className="bg-white/5 rounded-2xl p-6 space-y-3">
                      <h3 className="text-white font-semibold mb-4">Bank Account Details</h3>
                      <div className="flex justify-between">
                        <span className="text-white/60">Bank Name</span>
                        <span className="text-white font-semibold">Commercial Bank</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Account Name</span>
                        <span className="text-white font-semibold">EWAY Institute (Pvt) Ltd</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Account Number</span>
                        <span className="text-white font-mono font-semibold">1234 5678 9012</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Branch</span>
                        <span className="text-white font-semibold">Colombo Main Branch</span>
                      </div>
                    </div>

                    {/* Instructions */}
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                      <p className="text-yellow-400 text-sm">
                        ⚠️ Please use your Student ID as the reference when making the payment
                      </p>
                    </div>

                    {/* Upload Section */}
                    <div>
                      <label className="block text-white/60 text-sm mb-2">Upload Payment Slip</label>
                      <div className="relative">
                        <input
                          type="file"
                          id="payment-slip"
                          accept="image/*,.pdf"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <label
                          htmlFor="payment-slip"
                          className="block w-full px-6 py-12 bg-white/5 border-2 border-dashed border-white/20 rounded-xl text-center cursor-pointer hover:bg-white/10 hover:border-cyan-400/50 transition-all duration-300"
                        >
                          <Upload size={40} className="mx-auto mb-4 text-white/40" />
                          {uploadedFile ? (
                            <div>
                              <p className="text-white font-semibold mb-1">{uploadedFile.name}</p>
                              <p className="text-white/60 text-sm">Click to change file</p>
                            </div>
                          ) : (
                            <div>
                              <p className="text-white mb-1">Click to upload or drag and drop</p>
                              <p className="text-white/60 text-sm">PNG, JPG or PDF (Max 5MB)</p>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      onClick={handlePayment}
                      disabled={!uploadedFile}
                      className="w-full px-6 py-5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-lg hover:shadow-[0_0_24px_rgba(59,130,246,0.6)] transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      Submit Payment for Verification
                    </button>

                    <p className="text-white/40 text-xs text-center">
                      Your payment will be verified within 24 hours. You'll receive a confirmation email once approved.
                    </p>
                  </div>
                )}
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
