import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Course, Article } from '../types';
import { 
  Search, BookOpen, ArrowRight, CheckCircle, Sparkles, 
  Stethoscope, Atom, Cpu, Code, Globe, Briefcase, LineChart, 
  Megaphone, Wrench, GraduationCap, MessageSquare, Palette, Heart, Scale, BookMarked, Award, ShieldCheck 
} from 'lucide-react';

interface HomeProps {
  setActivePage: (page: string) => void;
  setSelectedCourseId?: (id: string) => void;
  setSelectedArticleId?: (id: string) => void;
}

export const Home: React.FC<HomeProps> = ({ setActivePage, setSelectedCourseId, setSelectedArticleId }) => {
  const { t } = useLanguage();
  const [courses, setCourses] = useState<Course[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const courseSnap = await getDocs(collection(db, 'courses'));
        const courseList = courseSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
        setCourses(courseList);

        const articleSnap = await getDocs(collection(db, 'articles'));
        const articleList = articleSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Article));
        setArticles(articleList.slice(0, 3));
      } catch (err) {
        console.error('Error fetching home data:', err);
      }
    };
    fetchHomeData();
  }, []);

  // 16 Professional Global Disciplines
  const allDisciplines = [
    { name: 'Medicine & Healthcare', icon: Stethoscope, color: 'from-rose-500 to-pink-500', cat: 'Medicine & Health' },
    { name: 'Science & Mathematics', icon: Atom, color: 'from-purple-500 to-indigo-500', cat: 'Science & Mathematics' },
    { name: 'AI & Machine Learning', icon: Cpu, color: 'from-cyan-500 to-blue-500', cat: 'Artificial Intelligence' },
    { name: 'Programming & Software', icon: Code, color: 'from-teal-500 to-emerald-500', cat: 'Programming' },
    { name: 'IT & Cybersecurity', icon: Globe, color: 'from-blue-600 to-cyan-600', cat: 'Information Technology' },
    { name: 'Business & Management', icon: Briefcase, color: 'from-amber-500 to-orange-500', cat: 'Business & Management' },
    { name: 'Finance & Economics', icon: LineChart, color: 'from-emerald-600 to-teal-600', cat: 'Finance' },
    { name: 'Marketing & Entrepreneurship', icon: Megaphone, color: 'from-pink-600 to-rose-600', cat: 'Marketing' },
    { name: 'Engineering & Technology', icon: Wrench, color: 'from-indigo-600 to-purple-600', cat: 'Engineering' },
    { name: 'Education & Teaching', icon: GraduationCap, color: 'from-cyan-600 to-teal-500', cat: 'Education' },
    { name: 'Languages & Communication', icon: MessageSquare, color: 'from-teal-400 to-cyan-500', cat: 'Languages' },
    { name: 'Arts, Design & Creativity', icon: Palette, color: 'from-pink-400 to-purple-500', cat: 'Arts & Design' },
    { name: 'Health, Fitness & Wellness', icon: Heart, color: 'from-rose-400 to-orange-400', cat: 'Health & Beauty' },
    { name: 'Law & Social Sciences', icon: Scale, color: 'from-blue-500 to-indigo-600', cat: 'Law & Legal Studies' },
    { name: 'Personal Development', icon: Sparkles, color: 'from-amber-400 to-yellow-500', cat: 'Personal Development' },
    { name: 'Other Disciplines', icon: BookMarked, color: 'from-gray-500 to-slate-600', cat: 'Other Disciplines' },
  ];

  const getCourseCountForCategory = (catName: string) => {
    return courses.filter(c => c.category.toLowerCase() === catName.toLowerCase() || c.category.includes(catName)).length;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActivePage('courses');
  };

  return (
    <div className="min-h-screen text-white transition-colors">
      {/* Global Multidisciplinary Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-32 border-b border-[#1C2541] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-950/40 via-[#070D1D] to-[#070D1D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-8">
            <div className="inline-flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 rounded-full bg-[#1C2541]/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold tracking-wide uppercase shadow-lg shadow-cyan-500/10">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Global Multidisciplinary Learning Academy</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
              Unlock Your Potential. Learn Anything. Anywhere.
            </h1>

            <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              Discover thousands of learning opportunities across science, technology, business, healthcare, creativity, and more. Build your skills, earn certificates, and shape your future with MED ACADEMY.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <button
                onClick={() => setActivePage('courses')}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-400 text-[#0B132B] font-bold text-sm shadow-xl shadow-cyan-500/20 hover:opacity-95 transition"
              >
                Explore Courses
              </button>
              <button
                onClick={() => setActivePage('courses')}
                className="px-8 py-4 rounded-2xl bg-[#1C2541] border border-cyan-500/30 text-cyan-300 font-bold text-sm hover:bg-[#2A3B63] transition"
              >
                Start Learning
              </button>
            </div>

            {/* Search Box */}
            <form onSubmit={handleSearch} className="max-w-xl mx-auto flex items-center bg-[#1C2541] rounded-2xl p-2 border border-[#3A506B] shadow-2xl mt-6">
              <Search className="w-5 h-5 text-cyan-400 ml-3 mr-2 rtl:mr-3 rtl:ml-2 flex-shrink-0" />
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent text-white placeholder-gray-400 text-sm focus:outline-none px-2"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-[#0B132B] font-bold text-sm hover:opacity-95 transition shadow-lg flex-shrink-0"
              >
                Search
              </button>
            </form>

            <div className="flex flex-wrap justify-center gap-6 pt-4 text-xs text-gray-400">
              <span className="flex items-center space-x-1.5 rtl:space-x-reverse">
                <CheckCircle className="w-4 h-4 text-cyan-400" />
                <span>Professional Certificates</span>
              </span>
              <span className="flex items-center space-x-1.5 rtl:space-x-reverse">
                <CheckCircle className="w-4 h-4 text-cyan-400" />
                <span>5 World Languages</span>
              </span>
              <span className="flex items-center space-x-1.5 rtl:space-x-reverse">
                <CheckCircle className="w-4 h-4 text-cyan-400" />
                <span>Learn at Your Own Pace</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Real Statistics Bar */}
      <section className="bg-[#0B132B] border-b border-[#1C2541] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <p className="text-3xl lg:text-4xl font-black text-cyan-400">{courses.length}+</p>
              <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Published Courses</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl lg:text-4xl font-black text-teal-400">16</p>
              <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Core Disciplines</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl lg:text-4xl font-black text-cyan-400">5</p>
              <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Global Languages</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl lg:text-4xl font-black text-teal-400">100%</p>
              <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Free Accessible Education</p>
            </div>
          </div>
        </div>
      </section>

      {/* 16 Professional Discipline Cards */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-2">Comprehensive Curriculum</h2>
            <h3 className="text-3xl font-black tracking-tight">Explore All 16 Professional Disciplines</h3>
          </div>
          <button 
            onClick={() => setActivePage('categories')}
            className="flex items-center space-x-1 rtl:space-x-reverse text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {allDisciplines.map((disc, i) => {
            const Icon = disc.icon;
            const count = getCourseCountForCategory(disc.cat);
            return (
              <div 
                key={i}
                onClick={() => setActivePage('courses')}
                className="group p-6 rounded-2xl bg-[#0B132B] border border-[#1C2541] hover:border-cyan-500/50 transition cursor-pointer shadow-xl flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${disc.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-base text-white group-hover:text-cyan-400 transition">{disc.name}</h4>
                  <p className="text-xs text-gray-400">
                    {count > 0 ? `${count} Published Course${count > 1 ? 's' : ''}` : 'Explore programs'}
                  </p>
                </div>
                <div className="pt-3 border-t border-[#1C2541] flex items-center justify-between text-xs text-cyan-400 font-bold">
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-[#0B132B]/50 border-t border-[#1C2541]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-2">Curriculum</h2>
              <h3 className="text-3xl font-black tracking-tight">{t('featuredCourses')}</h3>
            </div>
            <button 
              onClick={() => setActivePage('courses')}
              className="flex items-center space-x-1 rtl:space-x-reverse text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition"
            >
              <span>{t('browseCatalog')}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>

          {courses.length === 0 ? (
            <div className="text-center py-16 bg-[#0B132B] rounded-2xl border border-[#1C2541]">
              <BookOpen className="w-12 h-12 text-cyan-400 mx-auto mb-4 opacity-50" />
              <p className="text-gray-300 font-medium">No courses published yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.slice(0, 6).map((course) => (
                <div 
                  key={course.id}
                  onClick={() => {
                    if (setSelectedCourseId) setSelectedCourseId(course.id);
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
      </section>

      {/* Why Choose MED ACADEMY */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400">Excellence in Education</h2>
          <h3 className="text-3xl font-black tracking-tight">Why Choose MED ACADEMY?</h3>
          <p className="text-gray-400 text-sm">Designed to empower learners worldwide with robust tools and verified credentials.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-8 rounded-2xl bg-[#0B132B] border border-[#1C2541] space-y-3">
            <Globe className="w-8 h-8 text-cyan-400" />
            <h4 className="font-bold text-lg text-white">Multilingual Experience</h4>
            <p className="text-xs text-gray-400 leading-relaxed">Study in English, French, Arabic (with RTL), Chinese, or German seamlessly.</p>
          </div>
          <div className="p-8 rounded-2xl bg-[#0B132B] border border-[#1C2541] space-y-3">
            <Award className="w-8 h-8 text-teal-400" />
            <h4 className="font-bold text-lg text-white">Verified Certificates</h4>
            <p className="text-xs text-gray-400 leading-relaxed">Earn verifiable digital certificates upon completing course curriculum requirements.</p>
          </div>
          <div className="p-8 rounded-2xl bg-[#0B132B] border border-[#1C2541] space-y-3">
            <ShieldCheck className="w-8 h-8 text-cyan-400" />
            <h4 className="font-bold text-lg text-white">Secure Platform</h4>
            <p className="text-xs text-gray-400 leading-relaxed">Robust Firebase authentication and Firestore security rules protecting your data.</p>
          </div>
          <div className="p-8 rounded-2xl bg-[#0B132B] border border-[#1C2541] space-y-3">
            <Sparkles className="w-8 h-8 text-teal-400" />
            <h4 className="font-bold text-lg text-white">Self-Paced Study</h4>
            <p className="text-xs text-gray-400 leading-relaxed">Access written lessons and video resources anytime, anywhere across all devices.</p>
          </div>
        </div>
      </section>

      {/* Educational Articles */}
      <section className="py-20 bg-[#0B132B]/50 border-t border-[#1C2541]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-2">Insights</h2>
              <h3 className="text-3xl font-black tracking-tight">Latest Educational Articles</h3>
            </div>
            <button 
              onClick={() => setActivePage('articles')}
              className="flex items-center space-x-1 rtl:space-x-reverse text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition"
            >
              <span>View All Articles</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>

          {articles.length === 0 ? (
            <div className="text-center py-16 bg-[#0B132B] rounded-2xl border border-[#1C2541]">
              <p className="text-gray-400 text-sm">No articles published yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {articles.map((art) => (
                <div 
                  key={art.id}
                  onClick={() => {
                    if (setSelectedArticleId) setSelectedArticleId(art.id);
                    setActivePage('article-details');
                  }}
                  className="p-6 rounded-2xl bg-[#0B132B] border border-[#1C2541] hover:border-cyan-500/50 transition cursor-pointer shadow-xl space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-cyan-400 uppercase">{art.category}</span>
                    <h4 className="font-bold text-lg text-white line-clamp-2">{art.title}</h4>
                    <p className="text-xs text-gray-400 line-clamp-3">{art.content}</p>
                  </div>
                  <div className="pt-4 border-t border-[#1C2541] flex items-center justify-between text-xs text-gray-400">
                    <span>{art.author}</span>
                    <span className="text-cyan-400 font-bold flex items-center space-x-1 rtl:space-x-reverse">
                      <span>Read</span>
                      <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
