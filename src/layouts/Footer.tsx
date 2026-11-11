import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { GraduationCap, ShieldCheck, Globe, BookOpen } from 'lucide-react';

interface FooterProps {
  setActivePage: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActivePage }) => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#0B132B] text-gray-300 border-t border-[#1C2541] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-400 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <GraduationCap className="w-6 h-6 text-[#0B132B]" />
              </div>
              <div>
                <span className="text-xl font-black tracking-wider text-white">
                  {t('brandName')}
                </span>
                <span className="block text-[10px] uppercase tracking-widest text-cyan-400 font-semibold">
                  Global Learning Platform
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed pr-6 rtl:pr-0 rtl:pl-6">
              {t('footerText')}
            </p>
            <div className="flex items-center space-x-4 rtl:space-x-reverse text-xs text-cyan-400 font-medium">
              <span className="flex items-center space-x-1 rtl:space-x-reverse">
                <ShieldCheck className="w-4 h-4" />
                <span>Secure Firebase Auth</span>
              </span>
              <span className="flex items-center space-x-1 rtl:space-x-reverse">
                <Globe className="w-4 h-4" />
                <span>5 Languages Supported</span>
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => setActivePage('home')} className="hover:text-cyan-400 transition">
                  {t('home')}
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('courses')} className="hover:text-cyan-400 transition">
                  {t('exploreCourses')}
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('categories')} className="hover:text-cyan-400 transition">
                  {t('categories')}
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('articles')} className="hover:text-cyan-400 transition">
                  {t('articles')}
                </button>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Support & Legal</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => setActivePage('about')} className="hover:text-cyan-400 transition">
                  {t('about')}
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('contact')} className="hover:text-cyan-400 transition">
                  {t('contact')}
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('faq')} className="hover:text-cyan-400 transition">
                  {t('faq')}
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('verify-certificate')} className="hover:text-cyan-400 transition">
                  {t('verifyCertificate')}
                </button>
              </li>
            </ul>
          </div>

          {/* Admin Notice */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Administration</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              {t('adminPublishWarning')}
            </p>
            <div className="pt-2">
              <span className="inline-block px-3 py-1 rounded-lg bg-[#1C2541] border border-[#3A506B] text-[11px] text-cyan-300 font-medium">
                Admin: mohamedelgoumi60@gmail.com
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-[#1C2541] pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
          <p>© {new Date().getFullYear()} MED ACADEMY. All rights reserved.</p>
          <p className="mt-4 md:mt-0">Enterprise Global Multilingual Edition • Powered by Firebase</p>
        </div>
      </div>
    </footer>
  );
};
