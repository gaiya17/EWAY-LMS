import React, { useEffect, useState } from 'react';
import { GlassCard } from './glass-card';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import ewayLogo from '../../assets/5839cd6ca5cc93c08af5158653805fc6c7e77232.png';
import { verifyEmail } from '../lib/auth';

interface VerifyEmailPageProps {
  onLoginClick?: () => void;
}

export function VerifyEmailPage({ onLoginClick }: VerifyEmailPageProps) {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Get token from URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (!token) {
      setStatus('error');
      setErrorMessage('Verification token is missing from the URL.');
      return;
    }

    const verifyToken = async () => {
      try {
        await verifyEmail({ token });
        setStatus('success');
      } catch (error) {
        setStatus('error');
        setErrorMessage(error instanceof Error ? error.message : 'Verification failed');
      }
    };

    verifyToken();
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B0F1A] via-cyan-900/20 to-indigo-900/20" />
        {/* Animated glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-black flex items-center justify-center overflow-hidden mb-4 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
            <img src={ewayLogo} alt="EWAY Logo" className="w-14 h-14 object-contain" />
          </div>
          <span className="text-white font-semibold text-2xl tracking-wider">EWAY</span>
        </div>

        <GlassCard className="p-8 text-center relative overflow-hidden">
          {/* Subtle gradient border effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-50 pointer-events-none" />
          
          <div className="relative z-10">
            {status === 'verifying' && (
              <div className="flex flex-col items-center py-6">
                <Loader2 className="w-16 h-16 text-cyan-400 animate-spin mb-6" />
                <h2 className="text-2xl font-bold text-white mb-3">Verifying Your Email</h2>
                <p className="text-white/70">
                  Please wait while we verify your email address...
                </p>
              </div>
            )}

            {status === 'success' && (
              <div className="flex flex-col items-center py-6 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(52,211,153,0.3)] transform transition-transform hover:scale-110">
                  <CheckCircle className="text-white w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-3">Email Verified!</h2>
                <p className="text-white/80 mb-8 max-w-sm">
                  Your account has been successfully verified. You can now login to access all EWAY features.
                </p>
                <button
                  onClick={onLoginClick}
                  className="w-full px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 text-white font-semibold shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all duration-300 transform hover:-translate-y-1"
                >
                  Proceed to Login
                </button>
              </div>
            )}

            {status === 'error' && (
              <div className="flex flex-col items-center py-6 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(244,63,94,0.3)] transform transition-transform hover:scale-110">
                  <XCircle className="text-white w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-3">Verification Failed</h2>
                <p className="text-white/80 mb-8">
                  {errorMessage || 'The verification link is invalid or has expired.'}
                </p>
                <button
                  onClick={onLoginClick}
                  className="w-full px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold border border-white/20 transition-all duration-300 transform hover:-translate-y-1"
                >
                  Return to Login
                </button>
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
