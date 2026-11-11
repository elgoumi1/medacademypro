import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { GraduationCap, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

interface LoginProps {
  setActivePage: (page: string) => void;
}

export const Login: React.FC<LoginProps> = ({ setActivePage }) => {
  const { loginWithEmail, loginWithGoogle } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginWithEmail(email, password);
      setActivePage('student-dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      setActivePage('student-dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to login with Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070D1D] text-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-[#0B132B] p-8 rounded-3xl border border-[#1C2541] shadow-2xl">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-teal-400 flex items-center justify-center mx-auto shadow-xl shadow-cyan-500/20">
            <GraduationCap className="w-8 h-8 text-[#0B132B]" />
          </div>
          <h2 className="text-2xl font-black">{t('login')} to MED ACADEMY</h2>
          <p className="text-xs text-gray-400">Access your courses, progress, and certificates.</p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center space-x-3 rtl:space-x-reverse text-red-400 text-xs">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-cyan-400 absolute left-4 rtl:left-auto rtl:right-4 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="learner@example.com"
                className="w-full bg-[#1C2541] text-white rounded-xl pl-12 pr-4 py-3 text-sm border border-[#3A506B] focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 text-cyan-400 absolute left-4 rtl:left-auto rtl:right-4 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#1C2541] text-white rounded-xl pl-12 pr-4 py-3 text-sm border border-[#3A506B] focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-[#0B132B] font-bold text-sm shadow-lg shadow-cyan-500/20 hover:opacity-95 transition"
          >
            {loading ? 'Signing in...' : t('login')}
          </button>
        </form>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-[#1C2541]"></div>
          <span className="flex-shrink mx-4 text-xs text-gray-500 uppercase">Or</span>
          <div className="flex-grow border-t border-[#1C2541]"></div>
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-[#1C2541] hover:bg-[#2A3B63] text-white font-medium text-sm border border-[#3A506B] transition flex items-center justify-center space-x-2 rtl:space-x-reverse"
        >
          <span>Sign in with Google</span>
        </button>

        <p className="text-center text-xs text-gray-400 pt-2">
          Don't have an account?{' '}
          <button onClick={() => setActivePage('register')} className="text-cyan-400 font-bold hover:underline">
            {t('register')}
          </button>
        </p>
      </div>
    </div>
  );
};
