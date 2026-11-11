import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { db } from '../../lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, getDoc, setDoc } from 'firebase/firestore';
import { Course, Article, Lesson, Certificate, UserProfile } from '../../types';
import { 
  Shield, BookOpen, FileText, Users, Award, Plus, Trash2, 
  Settings, Globe, Video, HelpCircle, Layers, Activity, Lock, 
  ToggleLeft, ToggleRight, AlertTriangle, CheckCircle2, Eye, Send, Image, Film, Edit3 
} from 'lucide-react';

interface AdminDashboardProps {
  setActivePage: (page: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ setActivePage }) => {
  const { isAdmin, currentUser } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [activeTab, setActiveTab] = useState<
    'courses' | 'articles' | 'lessons' | 'videos' | 'quizzes' | 'categories' | 'translations' | 'certificates' | 'students' | 'settings' | 'permissions' | 'audit' | 'new-course' | 'new-article'
  >('articles');

  const [courses, setCourses] = useState<Course[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [usersList, setUsersList] = useState<UserProfile[]>([]);

  // Publishing Permissions Setting state
  const [ownerOnlyPublishing, setOwnerOnlyPublishing] = useState<boolean>(true);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [pendingToggleValue, setPendingToggleValue] = useState<boolean>(true);
  const [savingSetting, setSavingSetting] = useState<boolean>(false);

  // New Course Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Medicine & Health');
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels'>('Beginner');
  const [duration, setDuration] = useState('4 Weeks');
  const [instructor, setInstructor] = useState('Prof. Dr. Admin');
  const [coverImage, setCoverImage] = useState('');
  const [publishStatus, setPublishStatus] = useState<boolean>(true);

  // New Article Form state (Writing, Images, Videos, Publishing)
  const [artTitle, setArtTitle] = useState('');
  const [artContent, setArtContent] = useState('');
  const [artCategory, setArtCategory] = useState('Research & Education');
  const [artCover, setArtCover] = useState('');
  const [artVideoUrl, setArtVideoUrl] = useState('');
  const [artPublishStatus, setArtPublishStatus] = useState<boolean>(true);

  useEffect(() => {
    fetchAllAdminData();
    fetchPublishingSetting();
  }, []);

  const fetchAllAdminData = async () => {
    try {
      const courseSnap = await getDocs(collection(db, 'courses'));
      setCourses(courseSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course)));

      const articleSnap = await getDocs(collection(db, 'articles'));
      setArticles(articleSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Article)));

      const lessonSnap = await getDocs(collection(db, 'lessons'));
      setLessons(lessonSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lesson)));

      const certSnap = await getDocs(collection(db, 'certificates'));
      setCertificates(certSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Certificate)));

      const userSnap = await getDocs(collection(db, 'users'));
      setUsersList(userSnap.docs.map(doc => doc.data() as UserProfile));
    } catch (err) {
      console.error('Error fetching admin data:', err);
    }
  };

  const fetchPublishingSetting = async () => {
    try {
      const settingDoc = await getDoc(doc(db, 'platform_settings', 'publishing'));
      if (settingDoc.exists()) {
        const data = settingDoc.data();
        if (typeof data.ownerOnlyPublishing === 'boolean') {
          setOwnerOnlyPublishing(data.ownerOnlyPublishing);
        }
      }
    } catch (err) {
      console.error('Error fetching publishing permission setting:', err);
    }
  };

  const handleToggleAttempt = (newValue: boolean) => {
    setPendingToggleValue(newValue);
    setShowConfirmModal(true);
  };

  const confirmTogglePublishingSetting = async () => {
    setSavingSetting(true);
    try {
      await setDoc(doc(db, 'platform_settings', 'publishing'), {
        ownerOnlyPublishing: pendingToggleValue,
        updatedAt: new Date().toISOString(),
        updatedBy: currentUser?.email
      }, { merge: true });
      setOwnerOnlyPublishing(pendingToggleValue);
    } catch (err) {
      console.error('Error updating publishing setting:', err);
    } finally {
      setSavingSetting(false);
      setShowConfirmModal(false);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    try {
      await addDoc(collection(db, 'courses'), {
        title,
        description,
        category,
        level,
        duration,
        language: 'en',
        instructor,
        coverImage,
        published: publishStatus,
        createdAt: new Date().toISOString()
      });
      setTitle('');
      setDescription('');
      setCoverImage('');
      setActiveTab('courses');
      fetchAllAdminData();
    } catch (err) {
      console.error('Error creating course:', err);
    }
  };

  const handleCreateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    try {
      await addDoc(collection(db, 'articles'), {
        title: artTitle,
        content: artContent,
        category: artCategory,
        author: currentUser?.email || 'Super Admin',
        coverImage: artCover,
        videoUrl: artVideoUrl,
        published: artPublishStatus,
        createdAt: new Date().toISOString()
      });
      setArtTitle('');
      setArtContent('');
      setArtCover('');
      setArtVideoUrl('');
      setActiveTab('articles');
      fetchAllAdminData();
    } catch (err) {
      console.error('Error creating article:', err);
    }
  };

  const handleToggleCoursePublish = async (course: Course) => {
    if (!isAdmin) return;
    try {
      const newStatus = !course.published;
      await updateDoc(doc(db, 'courses', course.id), { published: newStatus });
      fetchAllAdminData();
    } catch (err) {
      console.error('Error toggling course publish status:', err);
    }
  };

  const handleToggleArticlePublish = async (article: Article) => {
    if (!isAdmin) return;
    try {
      const newStatus = !article.published;
      await updateDoc(doc(db, 'articles', article.id), { published: newStatus });
      fetchAllAdminData();
    } catch (err) {
      console.error('Error toggling article publish status:', err);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!isAdmin) return;
    if (window.confirm('Delete this course?')) {
      await deleteDoc(doc(db, 'courses', id));
      fetchAllAdminData();
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!isAdmin) return;
    if (window.confirm('Delete this article?')) {
      await deleteDoc(doc(db, 'articles', id));
      fetchAllAdminData();
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className={`text-center space-y-4 max-w-md p-8 rounded-3xl border shadow-2xl ${isLight ? 'bg-white border-red-200 text-slate-900' : 'bg-[#0B132B] border-red-500/30 text-white'}`}>
          <Lock className="w-16 h-16 text-red-500 mx-auto" />
          <h2 className="text-2xl font-black">Access Denied — Super Admin Only</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            MED ACADEMY enforces strict owner-only publishing permissions. Only the platform owner (mohamedelgoumi60@gmail.com) can access administrative modules.
          </p>
          <button
            onClick={() => setActivePage('home')}
            className="px-6 py-2.5 rounded-xl bg-cyan-600 text-white font-bold text-sm"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className={`p-8 rounded-3xl border shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 ${isLight ? 'bg-white border-slate-200' : 'bg-[#0B132B] border-cyan-500/35'}`}>
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30 text-xs font-bold uppercase">
              لوحة تحكم المالك — خاصية الكتابة والنشر الحصري
            </span>
            <h1 className="text-2xl sm:text-3xl font-black">MED ACADEMY Administration Hub</h1>
            <p className="text-xs text-cyan-600 dark:text-cyan-400 font-mono">Owner Publishing Authority: {currentUser?.email}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('new-article')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:opacity-95 text-white font-bold text-xs flex items-center space-x-2 rtl:space-x-reverse shadow-lg"
            >
              <Edit3 className="w-4 h-4" />
              <span>كتابة ونشر مقال جديد (Write & Publish)</span>
            </button>
            <button
              onClick={() => setActiveTab('new-course')}
              className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center space-x-2 rtl:space-x-reverse shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة دورة جديدة</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className={`flex flex-wrap gap-2 border-b pb-4 ${isLight ? 'border-slate-200' : 'border-[#1C2541]'}`}>
          {[
            { id: 'articles', label: `نشر المقالات (${articles.length})`, icon: FileText },
            { id: 'courses', label: `الدورات (${courses.length})`, icon: BookOpen },
            { id: 'new-article', label: '✏️ كتابة مقال جديد', icon: Edit3 },
            { id: 'lessons', label: `الدروس (${lessons.length})`, icon: Layers },
            { id: 'videos', label: 'إدارة الفيديو', icon: Video },
            { id: 'quizzes', label: 'الاختبارات', icon: HelpCircle },
            { id: 'certificates', label: `الشهادات (${certificates.length})`, icon: Award },
            { id: 'students', label: `الطلاب (${usersList.length})`, icon: Users },
            { id: 'permissions', label: 'صلاحيات النشر (Owner Only)', icon: Shield },
            { id: 'audit', label: 'سجل العمليات', icon: Activity },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 rtl:space-x-reverse ${isActive ? 'bg-cyan-600 text-white shadow-md' : isLight ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-[#0B132B] text-gray-300 hover:bg-[#1C2541]'}`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content: Publishing Permissions */}
        {activeTab === 'permissions' && (
          <div className="max-w-3xl mx-auto space-y-8">
            <div className={`p-8 rounded-3xl border shadow-xl space-y-6 ${isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0B132B] border-[#1C2541] text-white'}`}>
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black">حصرية الكتابة والنشر (Owner-Only Publishing)</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">أنت وحدك المالك ولديكم صلاحية الكتابة، إدراج الصور ومقاطع الفيديو، والنشر</p>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                قصر جميع صلاحيات كتابة المواضيع، إدراج الصور، إضافة مقاطع الفيديو، النشر، التعديل، والحذف على مالك المنصة حصرياً.
              </p>

              <div className={`p-6 rounded-2xl border flex items-center justify-between ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#1C2541]/40 border-[#3A506B]'}`}>
                <div className="space-y-1">
                  <span className="font-bold text-sm">حالة قفل النشر والكتابة</span>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse pt-1">
                    <span className={`w-2.5 h-2.5 rounded-full ${ownerOnlyPublishing ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                    <span className={`text-xs font-bold uppercase tracking-wider ${ownerOnlyPublishing ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                      {ownerOnlyPublishing ? 'مفعل — الكتابة والنشر مقتصرة على المالك فقط (Enabled)' : 'معطل — وضع النشر المقيد غير فعال'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleAttempt(!ownerOnlyPublishing)}
                  className={`p-2 rounded-xl transition ${ownerOnlyPublishing ? 'text-cyan-600 dark:text-cyan-400' : 'text-gray-400'}`}
                >
                  {ownerOnlyPublishing ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10" />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className={`max-w-md w-full p-8 rounded-3xl border shadow-2xl space-y-6 ${isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0B132B] border-[#1C2541] text-white'}`}>
              <div className="flex items-center space-x-3 rtl:space-x-reverse text-amber-500">
                <AlertTriangle className="w-8 h-8" />
                <h3 className="text-xl font-black">تأكيد تغيير صلاحيات النشر</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                أنت على وشك تغيير إعدادات حصرية الكتابة والنشر. هل تريد المتابعة؟
              </p>
              <div className="flex space-x-4 rtl:space-x-reverse pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className={`flex-1 py-3 rounded-xl border text-sm font-bold transition ${isLight ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200' : 'bg-[#1C2541] border-[#3A506B] text-gray-200'}`}
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  disabled={savingSetting}
                  onClick={confirmTogglePublishingSetting}
                  className="flex-1 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold shadow-lg transition"
                >
                  {savingSetting ? 'جاري الحفظ...' : 'تأكيد التغيير'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Articles CMS (Writing, Images, Videos, Publishing) */}
        {activeTab === 'articles' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">إدارة ونشر المقالات (خاصية الكتابة والنشر)</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">أنت المالك الوحيد المخول بكتابة المواضيع، إدراج الصور ومقاطع الفيديو، ونشرها.</p>
              </div>
              <button onClick={() => setActiveTab('new-article')} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-bold text-xs shadow-lg flex items-center space-x-2 rtl:space-x-reverse">
                <Edit3 className="w-4 h-4" />
                <span>+ كتابة ونشر مقال جديد</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <div key={article.id} className={`p-6 rounded-2xl border space-y-4 flex flex-col justify-between shadow-xl ${isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0B132B] border-[#1C2541] text-white'}`}>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase">{article.category}</span>
                      <button
                        onClick={() => handleToggleArticlePublish(article)}
                        className={`px-3 py-1 rounded-full text-[11px] font-bold flex items-center space-x-1 rtl:space-x-reverse transition ${article.published ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'}`}
                      >
                        <Send className="w-3 h-3" />
                        <span>{article.published ? 'منشور (Published)' : 'مسودة (Draft)'}</span>
                      </button>
                    </div>
                    {article.coverImage && (
                      <div className="h-36 rounded-xl overflow-hidden bg-slate-100 dark:bg-[#1C2541]">
                        <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <h4 className="font-bold text-lg mt-1">{article.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-3">{article.content}</p>
                    {article.videoUrl && (
                      <div className="flex items-center space-x-1.5 rtl:space-x-reverse text-xs text-cyan-600 dark:text-cyan-400 font-medium">
                        <Film className="w-4 h-4" />
                        <span>يحتوي على فيديو تعليمي</span>
                      </div>
                    )}
                  </div>
                  <div className={`pt-4 border-t flex items-center justify-between text-xs ${isLight ? 'border-slate-100' : 'border-[#1C2541]'}`}>
                    <span className="text-gray-500 dark:text-gray-300">الكاتب: {article.author}</span>
                    <button
                      onClick={() => handleDeleteArticle(article.id)}
                      className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content: Courses */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">إدارة الدورات التدريبية</h3>
              <button onClick={() => setActiveTab('new-course')} className="px-4 py-2 rounded-xl bg-cyan-600 text-white font-bold text-xs">
                + إيقاف أو إنشاء دورة
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course.id} className={`p-6 rounded-2xl border space-y-4 flex flex-col justify-between shadow-xl ${isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0B132B] border-[#1C2541] text-white'}`}>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase">{course.category}</span>
                      <button
                        onClick={() => handleToggleCoursePublish(course)}
                        className={`px-3 py-1 rounded-full text-[11px] font-bold flex items-center space-x-1 rtl:space-x-reverse transition ${course.published ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'}`}
                      >
                        <Send className="w-3 h-3" />
                        <span>{course.published ? 'منشور' : 'مسودة'}</span>
                      </button>
                    </div>
                    <h4 className="font-bold text-lg mt-1">{course.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{course.description}</p>
                  </div>
                  <div className={`pt-4 border-t flex items-center justify-between text-xs ${isLight ? 'border-slate-100' : 'border-[#1C2541]'}`}>
                    <span className="text-gray-500 dark:text-gray-300 font-medium">{course.instructor}</span>
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content: New Article Form (Writing, Images, Videos, Publishing) */}
        {activeTab === 'new-article' && (
          <form onSubmit={handleCreateArticle} className={`p-8 rounded-3xl border shadow-2xl space-y-6 max-w-3xl mx-auto ${isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0B132B] border-[#1C2541] text-white'}`}>
            <div className="space-y-2 border-b pb-4 border-slate-200 dark:border-[#1C2541]">
              <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-600 dark:text-teal-300 text-xs font-bold uppercase">
                لوحة الكاتب والناشر الحصري
              </span>
              <h3 className="text-2xl font-black">كتابة مقال جديد، إدراج الصور ومقاطع الفيديو، والنشر</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">أنت وحدك المالك المخول بكتابة محتوى المنصة، إرفاق الوسائط، ونشره للعامة.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">عنوان الموضوع (Article Title)</label>
              <input
                type="text"
                required
                value={artTitle}
                onChange={(e) => setArtTitle(e.target.value)}
                placeholder="اكتب عنواناً جذاباً ومحترفاً..."
                className={`w-full rounded-xl px-4 py-3 text-sm border focus:outline-none focus:border-cyan-500 ${isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#1C2541] border-[#3A506B] text-white'}`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">التصنيف (Category)</label>
                <input
                  type="text"
                  required
                  value={artCategory}
                  onChange={(e) => setArtCategory(e.target.value)}
                  placeholder="مثال: التكنولوجيا الطبية، الذكاء الاصطناعي..."
                  className={`w-full rounded-xl px-4 py-3 text-sm border ${isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#1C2541] border-[#3A506B] text-white'}`}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">حالة النشر (Publish Status)</label>
                <select
                  value={artPublishStatus ? 'true' : 'false'}
                  onChange={(e) => setArtPublishStatus(e.target.value === 'true')}
                  className={`w-full rounded-xl px-3 py-3 text-sm border ${isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#1C2541] border-[#3A506B] text-white'}`}
                >
                  <option value="true">نشر فوري للعامة (Published)</option>
                  <option value="false">حفظ كمسودة (Draft)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1 flex items-center space-x-1 rtl:space-x-reverse">
                <Image className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>رابط صورة الغلاف (Cover Image URL)</span>
              </label>
              <input
                type="url"
                value={artCover}
                onChange={(e) => setArtCover(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className={`w-full rounded-xl px-4 py-3 text-sm border ${isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#1C2541] border-[#3A506B] text-white'}`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1 flex items-center space-x-1 rtl:space-x-reverse">
                <Film className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>رابط فيديو تعليمي مضمن (Video Embed URL - Optional)</span>
              </label>
              <input
                type="url"
                value={artVideoUrl}
                onChange={(e) => setArtVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/embed/..."
                className={`w-full rounded-xl px-4 py-3 text-sm border ${isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#1C2541] border-[#3A506B] text-white'}`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1 flex items-center space-x-1 rtl:space-x-reverse">
                <Edit3 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>محتوى الموضوع (Article Content & Writing)</span>
              </label>
              <textarea
                required
                rows={8}
                value={artContent}
                onChange={(e) => setArtContent(e.target.value)}
                placeholder="اكتب تفاصيل الموضوع التعليمي أو البحثي هنا بكل حرية..."
                className={`w-full rounded-xl px-4 py-3 text-sm border focus:outline-none focus:border-cyan-500 leading-relaxed ${isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#1C2541] border-[#3A506B] text-white'}`}
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:opacity-95 text-white font-bold text-base shadow-xl flex items-center justify-center space-x-2 rtl:space-x-reverse"
            >
              <Send className="w-5 h-5" />
              <span>نشر المقال الآن (Publish Now)</span>
            </button>
          </form>
        )}

        {/* Tab Content: New Course Form */}
        {activeTab === 'new-course' && (
          <form onSubmit={handleCreateCourse} className={`p-8 rounded-3xl border shadow-2xl space-y-6 max-w-2xl mx-auto ${isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0B132B] border-[#1C2541] text-white'}`}>
            <h3 className="text-xl font-bold">إنشاء دورة تعليمية جديدة ونشرها</h3>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Course Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Advanced Clinical Pharmacology"
                className={`w-full rounded-xl px-4 py-3 text-sm border focus:outline-none focus:border-cyan-500 ${isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#1C2541] border-[#3A506B] text-white'}`}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`w-full rounded-xl px-3 py-3 text-sm border ${isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#1C2541] border-[#3A506B] text-white'}`}
                >
                  <option value="Medicine & Health">Medicine & Health</option>
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="Business & Management">Business & Management</option>
                  <option value="Science & Mathematics">Science & Mathematics</option>
                  <option value="Arts & Design">Arts & Design</option>
                  <option value="Law & Legal Studies">Law & Legal Studies</option>
                  <option value="Programming">Programming</option>
                  <option value="Other Disciplines">Other Disciplines</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Difficulty Level</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as any)}
                  className={`w-full rounded-xl px-3 py-3 text-sm border ${isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#1C2541] border-[#3A506B] text-white'}`}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="All Levels">All Levels</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Instructor</label>
                <input
                  type="text"
                  required
                  value={instructor}
                  onChange={(e) => setInstructor(e.target.value)}
                  className={`w-full rounded-xl px-4 py-3 text-sm border ${isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#1C2541] border-[#3A506B] text-white'}`}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Publish Status</label>
                <select
                  value={publishStatus ? 'true' : 'false'}
                  onChange={(e) => setPublishStatus(e.target.value === 'true')}
                  className={`w-full rounded-xl px-3 py-3 text-sm border ${isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#1C2541] border-[#3A506B] text-white'}`}
                >
                  <option value="true">Published (منشور)</option>
                  <option value="false">Draft (مسودة)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Description</label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`w-full rounded-xl px-4 py-3 text-sm border focus:outline-none focus:border-cyan-500 ${isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#1C2541] border-[#3A506B] text-white'}`}
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-500 text-white font-bold text-sm shadow-lg"
            >
              حفظ ونشر الدورة
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
