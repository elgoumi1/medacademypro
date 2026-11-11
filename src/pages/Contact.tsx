import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Mail, Send, CheckCircle2 } from 'lucide-react';

export const Contact: React.FC = () => {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#070D1D] text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-black tracking-tight">{t('contact')} MED ACADEMY</h1>
          <p className="text-gray-400 text-sm">Have questions or support inquiries? Reach out to our global administration team.</p>
        </div>

        {submitted ? (
          <div className="p-8 rounded-3xl bg-[#0B132B] border border-cyan-500/50 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-cyan-400 mx-auto" />
            <h3 className="text-xl font-bold">Message Received</h3>
            <p className="text-xs text-gray-300">Thank you for contacting us. Our support team will respond shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-[#0B132B] p-8 rounded-3xl border border-[#1C2541] shadow-2xl space-y-6">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Your Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="learner@example.com"
                className="w-full bg-[#1C2541] text-white rounded-xl px-4 py-3 text-sm border border-[#3A506B] focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Message</label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we assist your learning journey?"
                className="w-full bg-[#1C2541] text-white rounded-xl px-4 py-3 text-sm border border-[#3A506B] focus:outline-none focus:border-cyan-500"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-[#0B132B] font-bold text-sm shadow-lg shadow-cyan-500/20 hover:opacity-95 transition flex items-center justify-center space-x-2 rtl:space-x-reverse"
            >
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
