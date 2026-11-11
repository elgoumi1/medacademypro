import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  GraduationCap, Globe, User, LogOut, Shield, BookOpen, 
  Menu, X, Award, FileText, Home, Compass, Layers, Sun, Moon 
} from 'lucide-react';
import { MarketTicker } from '../components/MarketTicker';

interface NavbarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activePage, setActivePage }) => {
  const { language, setLanguage, t, isRtl } = useLanguage();
  const { currentUser, userProfile, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'ar', label: 'العربية' },
    { code: 'zh', label: '中文' },
    { code: 'de', label: 'Deutsch' },
  ];

  const isLight = theme === 'light';

  return (
    <header className="sticky top-0 z-50">
      <MarketTicker />
      <div className={`${isLight ? 'bg-white/95 text-slate-900 border-slate-200' : 'bg-[#0B132B]/95 text-white border-[#1C2541]'} backdrop-blur-md border-b shadow-md transition-colors`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div 
              className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer group"
              onClick={() => setActivePage('home')}
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className={`text-xl font-black tracking-wider ${isLight ? 'text-slate-900' : 'bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-500 bg-clip-text text-transparent'}`}>
                  {t('brandName')}
                </span>
                <span className="block text-[10px] uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-semibold">
                  Global Learning Platform
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8 rtl:space-x-reverse">
              <button 
                onClick={() => setActivePage('home')}
                className={`text-sm font-medium transition-colors hover:text-cyan-600 dark:hover:text-cyan-400 ${activePage === 'home' ? 'text-cyan-600 dark:text-cyan-400 font-semibold' : isLight ? 'text-slate-600' : 'text-gray-300'}`}
              >
                {t('home')}
              </button>
              <button 
                onClick={() => setActivePage('courses')}
                className={`text-sm font-medium transition-colors hover:text-cyan-600 dark:hover:text-cyan-400 ${activePage === 'courses' ? 'text-cyan-600 dark:text-cyan-400 font-semibold' : isLight ? 'text-slate-600' : 'text-gray-300'}`}
              >
                {t('exploreCourses')}
              </button>
              <button 
                onClick={() => setActivePage('categories')}
                className={`text-sm font-medium transition-colors hover:text-cyan-600 dark:hover:text-cyan-400 ${activePage === 'categories' ? 'text-cyan-600 dark:text-cyan-400 font-semibold' : isLight ? 'text-slate-600' : 'text-gray-300'}`}
              >
                {t('categories')}
              </button>
              <button 
                onClick={() => setActivePage('articles')}
                className={`text-sm font-medium transition-colors hover:text-cyan-600 dark:hover:text-cyan-400 ${activePage === 'articles' ? 'text-cyan-600 dark:text-cyan-400 font-semibold' : isLight ? 'text-slate-600' : 'text-gray-300'}`}
              >
                {t('articles')}
              </button>
              <button 
                onClick={() => setActivePage('verify-certificate')}
                className={`text-sm font-medium transition-colors hover:text-cyan-600 dark:hover:text-cyan-400 ${activePage === 'verify-certificate' ? 'text-cyan-600 dark:text-cyan-400 font-semibold' : isLight ? 'text-slate-600' : 'text-gray-300'}`}
              >
                {t('verifyCertificate')}
              </button>
            </nav>

            {/* Right Action Area */}
            <div className="hidden lg:flex items-center space-x-4 rtl:space-x-reverse">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className={`p-2.5 rounded-xl border transition shadow-sm ${isLight ? 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200' : 'bg-[#1C2541] text-cyan-400 border-[#3A506B] hover:bg-[#2A3B63]'}`}
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-slate-700" />}
              </button>

              {/* Language Selector */}
              <div className="relative">
                <button 
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className={`flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 rounded-xl border text-sm font-medium transition ${isLight ? 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200' : 'bg-[#1C2541] text-gray-200 border-[#3A506B]'}`}
                >
                  <Globe className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <span className="uppercase">{language}</span>
                </button>

                {langDropdownOpen && (
                  <div className={`absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-40 rounded-xl border shadow-xl py-1 z-50 ${isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#1C2541] border-[#3A506B] text-gray-200'}`}>
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLanguage(l.code as any);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full text-left rtl:text-right px-4 py-2 text-sm transition flex items-center justify-between ${language === l.code ? 'text-cyan-600 dark:text-cyan-400 font-bold bg-slate-50 dark:bg-[#2A3B63]/50' : 'hover:bg-slate-100 dark:hover:bg-[#2A3B63]'}`}
                      >
                        <span>{l.label}</span>
                        {language === l.code && <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Auth / User menu */}
              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className={`flex items-center space-x-3 rtl:space-x-reverse pl-2 pr-4 py-1.5 rounded-xl border transition ${isLight ? 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-800' : 'bg-[#1C2541] border-[#3A506B] hover:bg-[#2A3B63] text-white'}`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-teal-500 flex items-center justify-center font-bold text-white">
                      {userProfile?.displayName ? userProfile.displayName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="text-left rtl:text-right">
                      <span className="block text-xs font-semibold truncate max-w-[100px]">
                        {userProfile?.displayName || 'User'}
                      </span>
                      <span className="block text-[10px] text-cyan-600 dark:text-cyan-400 capitalize font-medium">
                        {isAdmin ? 'Super Admin' : 'Student'}
                      </span>
                    </div>
                  </button>

                  {userDropdownOpen && (
                    <div className={`absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-56 rounded-xl border shadow-xl py-1 z-50 ${isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#1C2541] border-[#3A506B] text-gray-200'}`}>
                      <div className={`px-4 py-2 border-b ${isLight ? 'border-slate-100' : 'border-[#3A506B]'}`}>
                        <p className="text-xs text-gray-400">Signed in as</p>
                        <p className="text-sm font-medium truncate">{currentUser.email}</p>
                      </div>

                      {isAdmin && (
                        <button
                          onClick={() => {
                            setActivePage('admin-dashboard');
                            setUserDropdownOpen(false);
                          }}
                          className={`w-full text-left rtl:text-right px-4 py-2.5 text-sm transition flex items-center space-x-2 rtl:space-x-reverse text-cyan-600 dark:text-cyan-300 font-medium ${isLight ? 'hover:bg-slate-50' : 'hover:bg-[#2A3B63]'}`}
                        >
                          <Shield className="w-4 h-4" />
                          <span>{t('adminPanel')}</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setActivePage('student-dashboard');
                          setUserDropdownOpen(false);
                        }}
                        className={`w-full text-left rtl:text-right px-4 py-2.5 text-sm transition flex items-center space-x-2 rtl:space-x-reverse ${isLight ? 'hover:bg-slate-50 text-slate-700' : 'hover:bg-[#2A3B63] text-gray-200'}`}
                      >
                        <User className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                        <span>{t('dashboard')}</span>
                      </button>

                      <button
                        onClick={() => {
                          setActivePage('my-courses');
                          setUserDropdownOpen(false);
                        }}
                        className={`w-full text-left rtl:text-right px-4 py-2.5 text-sm transition flex items-center space-x-2 rtl:space-x-reverse ${isLight ? 'hover:bg-slate-50 text-slate-700' : 'hover:bg-[#2A3B63] text-gray-200'}`}
                      >
                        <BookOpen className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                        <span>{t('myCourses')}</span>
                      </button>

                      <button
                        onClick={() => {
                          setActivePage('certificates');
                          setUserDropdownOpen(false);
                        }}
                        className={`w-full text-left rtl:text-right px-4 py-2.5 text-sm transition flex items-center space-x-2 rtl:space-x-reverse ${isLight ? 'hover:bg-slate-50 text-slate-700' : 'hover:bg-[#2A3B63] text-gray-200'}`}
                      >
                        <Award className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                        <span>{t('certificates')}</span>
                      </button>

                      <div className={`border-t my-1 ${isLight ? 'border-slate-100' : 'border-[#3A506B]'}`}></div>

                      <button
                        onClick={async () => {
                          await logout();
                          setUserDropdownOpen(false);
                          setActivePage('home');
                        }}
                        className="w-full text-left rtl:text-right px-4 py-2.5 text-sm hover:bg-red-500/10 text-red-500 transition flex items-center space-x-2 rtl:space-x-reverse"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{t('logout')}</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <button
                    onClick={() => setActivePage('login')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition ${isLight ? 'text-slate-700 hover:bg-slate-100' : 'text-gray-200 hover:text-white hover:bg-[#1C2541]'}`}
                  >
                    {t('login')}
                  </button>
                  <button
                    onClick={() => setActivePage('register')}
                    className="px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-cyan-600 to-teal-500 text-white hover:opacity-95 transition shadow-lg shadow-cyan-500/20"
                  >
                    {t('register')}
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center space-x-3 rtl:space-x-reverse">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg ${isLight ? 'bg-slate-100 text-slate-700' : 'bg-[#1C2541] text-cyan-400'}`}
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 rounded-lg ${isLight ? 'bg-slate-100 text-slate-700' : 'bg-[#1C2541] text-gray-300'}`}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className={`lg:hidden border-b px-4 pt-2 pb-6 space-y-3 ${isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#0B132B] border-[#1C2541] text-white'}`}>
            <div className={`flex items-center justify-between py-2 border-b ${isLight ? 'border-slate-100' : 'border-[#1C2541]'}`}>
              <span className="text-xs text-gray-400 uppercase font-semibold">Language</span>
              <div className="flex space-x-1 rtl:space-x-reverse">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLanguage(l.code as any)}
                    className={`px-2 py-1 rounded text-xs uppercase ${language === l.code ? 'bg-cyan-600 text-white font-bold' : isLight ? 'bg-slate-100 text-slate-700' : 'bg-[#1C2541] text-gray-300'}`}
                  >
                    {l.code}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => { setActivePage('home'); setMobileMenuOpen(false); }}
              className={`w-full text-left rtl:text-right px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 rtl:space-x-reverse ${isLight ? 'hover:bg-slate-100' : 'hover:bg-[#1C2541]'}`}
            >
              <Home className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>{t('home')}</span>
            </button>
            <button
              onClick={() => { setActivePage('courses'); setMobileMenuOpen(false); }}
              className={`w-full text-left rtl:text-right px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 rtl:space-x-reverse ${isLight ? 'hover:bg-slate-100' : 'hover:bg-[#1C2541]'}`}
            >
              <Compass className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>{t('exploreCourses')}</span>
            </button>
            <button
              onClick={() => { setActivePage('categories'); setMobileMenuOpen(false); }}
              className={`w-full text-left rtl:text-right px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 rtl:space-x-reverse ${isLight ? 'hover:bg-slate-100' : 'hover:bg-[#1C2541]'}`}
            >
              <Layers className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>{t('categories')}</span>
            </button>
            <button
              onClick={() => { setActivePage('articles'); setMobileMenuOpen(false); }}
              className={`w-full text-left rtl:text-right px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 rtl:space-x-reverse ${isLight ? 'hover:bg-slate-100' : 'hover:bg-[#1C2541]'}`}
            >
              <FileText className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>{t('articles')}</span>
            </button>
            <button
              onClick={() => { setActivePage('verify-certificate'); setMobileMenuOpen(false); }}
              className={`w-full text-left rtl:text-right px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 rtl:space-x-reverse ${isLight ? 'hover:bg-slate-100' : 'hover:bg-[#1C2541]'}`}
            >
              <Award className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>{t('verifyCertificate')}</span>
            </button>

            <div className={`pt-2 border-t space-y-2 ${isLight ? 'border-slate-100' : 'border-[#1C2541]'}`}>
              {currentUser ? (
                <>
                  {isAdmin && (
                    <button
                      onClick={() => { setActivePage('admin-dashboard'); setMobileMenuOpen(false); }}
                      className="w-full text-left rtl:text-right px-3 py-2 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 text-sm font-medium flex items-center space-x-2 rtl:space-x-reverse"
                    >
                      <Shield className="w-4 h-4" />
                      <span>{t('adminPanel')}</span>
                    </button>
                  )}
                  <button
                    onClick={() => { setActivePage('student-dashboard'); setMobileMenuOpen(false); }}
                    className={`w-full text-left rtl:text-right px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 rtl:space-x-reverse ${isLight ? 'hover:bg-slate-100' : 'hover:bg-[#1C2541]'}`}
                  >
                    <User className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                    <span>{t('dashboard')}</span>
                  </button>
                  <button
                    onClick={async () => { await logout(); setMobileMenuOpen(false); setActivePage('home'); }}
                    className="w-full text-left rtl:text-right px-3 py-2 rounded-lg hover:bg-red-500/10 text-red-500 text-sm font-medium flex items-center space-x-2 rtl:space-x-reverse"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t('logout')}</span>
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => { setActivePage('login'); setMobileMenuOpen(false); }}
                    className={`w-full py-2.5 rounded-xl text-sm font-medium text-center border ${isLight ? 'bg-slate-100 border-slate-200 text-slate-800' : 'bg-[#1C2541] border-[#3A506B] text-white'}`}
                  >
                    {t('login')}
                  </button>
                  <button
                    onClick={() => { setActivePage('register'); setMobileMenuOpen(false); }}
                    className="w-full py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-cyan-600 to-teal-500 text-white text-center shadow-lg"
                  >
                    {t('register')}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
