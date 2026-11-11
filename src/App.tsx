/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Navbar } from './layouts/Navbar';
import { Footer } from './layouts/Footer';

// Pages
import { Home } from './pages/Home';
import { Courses } from './pages/Courses';
import { CourseDetails } from './pages/CourseDetails';
import { Categories } from './pages/Categories';
import { Articles } from './pages/Articles';
import { ArticleDetails } from './pages/ArticleDetails';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { FAQ } from './pages/FAQ';
import { VerifyCertificate } from './pages/VerifyCertificate';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { StudentDashboard } from './pages/StudentDashboard';
import { Learning } from './pages/Learning';
import { Certificates } from './pages/Certificates';
import { AdminDashboard } from './pages/admin/AdminDashboard';

export default function App() {
  const [activePage, setActivePage] = useState<string>('home');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedArticleId, setSelectedArticleId] = useState<string>('');

  return (
    <AuthProvider>
      <LanguageProvider>
        <ThemeProvider>
          <div className="min-h-screen bg-[#070D1D] dark:bg-[#070D1D] light:bg-gray-50 text-white dark:text-white light:text-gray-900 flex flex-col selection:bg-cyan-500 selection:text-[#0B132B] transition-colors">
            <Navbar activePage={activePage} setActivePage={setActivePage} />

            <main className="flex-1">
              {activePage === 'home' && (
                <Home 
                  setActivePage={setActivePage} 
                  setSelectedCourseId={setSelectedCourseId} 
                  setSelectedArticleId={setSelectedArticleId} 
                />
              )}
              {activePage === 'courses' && (
                <Courses setActivePage={setActivePage} setSelectedCourseId={setSelectedCourseId} />
              )}
              {activePage === 'course-details' && (
                <CourseDetails courseId={selectedCourseId} setActivePage={setActivePage} setSelectedCourseId={setSelectedCourseId} />
              )}
              {activePage === 'categories' && <Categories setActivePage={setActivePage} />}
              {activePage === 'articles' && (
                <Articles setActivePage={setActivePage} setSelectedArticleId={setSelectedArticleId} />
              )}
              {activePage === 'article-details' && (
                <ArticleDetails articleId={selectedArticleId} setActivePage={setActivePage} />
              )}
              {activePage === 'about' && <About setActivePage={setActivePage} />}
              {activePage === 'contact' && <Contact />}
              {activePage === 'faq' && <FAQ />}
              {activePage === 'verify-certificate' && <VerifyCertificate />}
              {activePage === 'login' && <Login setActivePage={setActivePage} />}
              {activePage === 'register' && <Register setActivePage={setActivePage} />}
              {activePage === 'student-dashboard' && (
                <StudentDashboard setActivePage={setActivePage} setSelectedCourseId={setSelectedCourseId} />
              )}
              {activePage === 'my-courses' && (
                <StudentDashboard setActivePage={setActivePage} setSelectedCourseId={setSelectedCourseId} />
              )}
              {activePage === 'learning' && <Learning courseId={selectedCourseId} setActivePage={setActivePage} />}
              {activePage === 'certificates' && <Certificates setActivePage={setActivePage} />}
              {activePage === 'admin-dashboard' && <AdminDashboard setActivePage={setActivePage} />}
            </main>

            <Footer setActivePage={setActivePage} />
          </div>
        </ThemeProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
