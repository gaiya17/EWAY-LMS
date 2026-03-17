import React, { useState, useEffect } from 'react';
import { GlassCard } from './glass-card';
import { Lock, Eye, EyeOff, CheckCircle, Shield, AlertCircle } from 'lucide-react';
import { verifySetupToken, setupPassword as setupPasswordApi } from '../lib/auth';

interface SetupPasswordPageProps {
  onLoginClick: () => void;
}

type SetupStep = 'loading' | 'setup' | 'success' | 'error';

export function SetupPasswordPage({ onLoginClick }: SetupPasswordPageProps) {
  const [step, setStep] = useState<SetupStep>('loading');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email');
    const tokenParam = params.get('token');

    if (!emailParam || !tokenParam) {
      setStep('error');
      setError('Invalid or missing setup details. Please contact your administrator.');
      return;
    }

    setEmail(emailParam);
    setToken(tokenParam);

    const verify = async () => {
      try {
        await verifySetupToken({ email: emailParam, token: tokenParam });
        setStep('setup');
      } catch (err) {
        setStep('error');
        setError(err instanceof Error ? err.message : 'Invalid or expired setup link.');
      }
    };

    verify();
  }, []);

  const calculatePasswordStrength = (pass: string) => {
    let strength = 0;
    if (pass.length >= 8) strength += 25;
    if (pass.length >= 12) strength += 25;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength += 25;
    if (/[0-9]/.test(pass)) strength += 12.5;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 12.5;
    return strength;
  };

  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(password));
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (passwordStrength < 70) {
      setError('Please choose a stronger password');
      return;
    }

    try {
      setIsSubmitting(true);
      await setupPasswordApi({
        email,
        token,
        password,
        confirmPassword
      });
      setStep('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set password');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 'loading') {
    return (
      <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center p-8">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-white/70">Verifying setup link...</p>
        </div>
      </div>
    );
  }

  if (step === 'error') {
    return (
      <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center p-8">
        <GlassCard className="p-8 md:p-10 w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="text-red-500" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Setup Error</h2>
          <p className="text-white/70 mb-8">{error}</p>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full px-8 py-3 rounded-full bg-white/10 text-white font-semibold hover:bg-white/20 transition-all border border-white/10"
          >
            Go to Home
          </button>
        </GlassCard>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center p-8">
        <GlassCard className="p-8 md:p-10 w-full max-w-md text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500/30 to-emerald-400/30 backdrop-blur-xl border border-green-400/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-400" size={48} />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Setup Complete!</h2>
          <p className="text-white/70 mb-8">
            Your password has been set successfully. You can now log in to your dashboard.
          </p>
          <button
            onClick={onLoginClick}
            className="w-full px-8 py-4 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 text-white font-semibold hover:shadow-[0_0_32px_rgba(99,102,241,0.6)] transition-all duration-300 transform hover:scale-[1.02]"
          >
            Login to Account
          </button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center font-bold text-white text-xl mx-auto mb-4">
            EW
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Setup Your Password</h1>
          <p className="text-white/70">Welcome to EWAY! Create a password to access your account.</p>
        </div>

        <GlassCard className="p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white font-semibold mb-2">Email</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/50 cursor-not-allowed"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-white font-semibold mb-2">New Password</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className={`w-full pl-12 pr-12 py-3 rounded-xl bg-white/5 border ${
                    error ? 'border-red-500' : 'border-white/10 focus:border-cyan-400/50'
                  } text-white placeholder-white/50 focus:outline-none focus:ring-2 transition-all`}
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/70 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {password && (
                <div className="mt-3">
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        passwordStrength < 40 ? 'bg-red-500' : passwordStrength < 70 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${passwordStrength}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-white/50 mt-1">
                    {passwordStrength < 70 ? 'Password must be stronger' : 'Strong password'}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-white font-semibold mb-2">Confirm Password</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
                  <Lock size={20} />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError('');
                  }}
                  className={`w-full pl-12 pr-12 py-3 rounded-xl bg-white/5 border ${
                    error && confirmPassword && password !== confirmPassword ? 'border-red-500' : 'border-white/10 focus:border-cyan-400/50'
                  } text-white placeholder-white/50 focus:outline-none focus:ring-2 transition-all`}
                  placeholder="Confirm password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/70 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                <AlertCircle size={16} />
                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-8 py-4 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 text-white font-semibold hover:shadow-[0_0_32px_rgba(99,102,241,0.6)] transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? 'Setting Password...' : 'Complete Setup'}
            </button>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}
