import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Course } from '../types';
import { Search, BookOpen, Filter, ArrowRight } from 'lucide-react';

interface CoursesProps {
  setActivePage: (page: string) => void;
  setSelectedCourseId: (id: string) => void;
}

export const Courses: React.FC<CoursesProps> = ({ setActivePage, setSelectedCourseId }) => {
  const { t } = useLanguage();
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const snap = await getDocs(collection(db, 'courses'));
        const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
        setCourses(list);
      } catch (err) {
        console.error('Error fetching courses:', err);
      }
    };
    fetchCourses();
  }, []);

  const categories = [
    'All',
    'Medicine & Health',
    'Artificial Intelligence',
    'Business & Management',
    'Science & Mathematics',
    'Arts & Design',
    'Law & Legal Studies',
    'Information Technology',
    'Programming',
    'Other Disciplines'
  ];

  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced', 'All Levels'];

  const filteredCourses = courses.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        c.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === 'All' || c.category === selectedCategory;
    const matchLevel = selectedLevel === 'All' || c.level === selectedLevel;
    return matchSearch && matchCategory && matchLevel;
  });

  return (
    <div className="min-h-screen bg-[#070D1D] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">{t('exploreCourses')}</h1>
          <p className="text-gray-400 text-sm">
            Discover comprehensive professional and academic courses across all global disciplines.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="bg-[#0B132B] p-6 rounded-2xl border border-[#1C2541] shadow-xl space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 text-cyan-400 absolute left-4 rtl:left-auto rtl:right-4 top-3.5" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1C2541] rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder-gray-400 border border-[#3A506B] focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-[#1C2541] text-white rounded-xl px-3 py-2.5 text-sm border border-[#3A506B] focus:outline-none"
              >
                {categories.map((cat, i) => (
                  <option key={i} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="w-full sm:w-48">
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Level</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full bg-[#1C2541] text-white rounded-xl px-3 py-2.5 text-sm border border-[#3A506B] focus:outline-none"
              >
                {levels.map((lvl, i) => (
                  <option key={i} value={lvl}>{lvl}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-20 bg-[#0B132B] rounded-2xl border border-[#1C2541]">
            <BookOpen className="w-12 h-12 text-cyan-400 mx-auto mb-4 opacity-50" />
            <p className="text-gray-300 font-medium">No courses found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <div 
                key={course.id}
                onClick={() => {
                  setSelectedCourseId(course.id);
                  setActivePage('course-details');
                }}
                className="group rounded-2xl bg-[#0B132B] border border-[#1C2541] hover:border-cyan-500/50 transition overflow-hidden cursor-pointer shadow-xl flex flex-col"
              >
                <div className="h-48 bg-gradient-to-tr from-[#1C2541] to-[#2A3B63] relative overflow-hidden">
                  {course.coverImage ? (
                    <img src={course.coverImage} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-cyan-400/40" />
                    </div>
                  )}
                  <span className="absolute top-3 left-3 rtl:left-auto rtl:right-3 px-3 py-1 rounded-full bg-[#0B132B]/80 backdrop-blur-md text-[11px] font-bold text-cyan-400 border border-cyan-500/30">
                    {course.category}
                  </span>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse text-xs text-gray-400 mb-2">
                      <span>{course.level}</span>
                      <span>•</span>
                      <span>{course.duration}</span>
                    </div>
                    <h4 className="font-bold text-lg text-white group-hover:text-cyan-400 transition line-clamp-2">
                      {course.title}
                    </h4>
                    <p className="text-xs text-gray-400 mt-2 line-clamp-2">
                      {course.description}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-[#1C2541] flex items-center justify-between text-xs">
                    <span className="text-gray-300 font-medium">{course.instructor}</span>
                    <span className="text-cyan-400 font-bold group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform inline-flex items-center space-x-1 rtl:space-x-reverse">
                      <span>View Course</span>
                      <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
