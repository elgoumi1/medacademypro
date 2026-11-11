import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { GraduationCap, Globe, ShieldCheck, Award } from 'lucide-react';

interface AboutProps {
  setActivePage: (page: string) => void;
}

export const About: React.FC<AboutProps> = ({ setActivePage }) => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#070D1D] text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-teal-400 flex items-center justify-center mx-auto shadow-xl shadow-cyan-500/20">
            <GraduationCap className="w-8 h-8 text-[#0B132B]" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">{t('about')} MED ACADEMY</h1>
          <p className="text-cyan-400 text-sm font-semibold uppercase tracking-widest">Global Multilingual Learning Platform</p>
        </div>

        <div className="p-8 sm:p-12 rounded-3xl bg-[#0B132B] border border-[#1C2541] shadow-2xl space-y-8 leading-relaxed text-gray-300">
          <p className="text-lg">
            MED ACADEMY is a universal, enterprise-grade educational ecosystem dedicated to democratizing world-class education across all academic, professional, scientific, technical, and creative fields. Inspired by leading platforms, MED ACADEMY delivers rigorous curricula in multiple languages with verified certificate issuance.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="p-6 rounded-2xl bg-[#1C2541]/50 border border-[#3A506B] space-y-2">
              <Globe className="w-6 h-6 text-cyan-400" />
              <h3 className="font-bold text-white text-lg">Global Multilingual Reach</h3>
              <p className="text-xs text-gray-400">Supporting English, French, Arabic (with RTL), Chinese, and German for learners worldwide.</p>
            </div>
            <div className="p-6 rounded-2xl bg-[#1C2541]/50 border border-[#3A506B] space-y-2">
              <ShieldCheck className="w-6 h-6 text-teal-400" />
              <h3 className="font-bold text-white text-lg">Secure Administration</h3>
              <p className="text-xs text-gray-400">Strict super-admin publishing controls powered by secure Firebase Auth and Firestore rules.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
