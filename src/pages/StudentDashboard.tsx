import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { Enrollment, Course, Certificate } from '../types';
import { BookOpen, Award, CheckCircle, Clock, ArrowRight, Sparkles, Flame, Zap, Calendar as CalendarIcon, Video } from 'lucide-react';

interface StudentDashboardProps {
  setActivePage: (page: string) => void;
  setSelectedCourseId: (id: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ setActivePage, setSelectedCourseId }) => {
  const { userProfile, currentUser } = useAuth();
  const { t } = useLanguage();
  const [enrollments, setEnrollments] = useState<(Enrollment & { course?: Course })[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!currentUser) return;
      try {
        const enrollQuery = query(collection(db, 'enrollments'), where('userId', '==', currentUser.uid));
        const enrollSnap = await getDocs(enrollQuery);
        
        const enrolledList = await Promise.all(
          enrollSnap.docs.map(async (enrollDoc) => {
            const data = enrollDoc.data() as Enrollment;
            const courseDoc = await getDoc(doc(db, 'courses', data.courseId));
            const course = courseDoc.exists() ? ({ id: courseDoc.id, ...courseDoc.data() } as Course) : undefined;
            return { ...data, course };
          })
        );
        setEnrollments(enrolledList);

        const certQuery = query(collection(db, 'certificates'), where('userId', '==', currentUser.uid));
        const certSnap = await getDocs(certQuery);
        const certList = certSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Certificate));
        setCertificates(certList);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070D1D] text-white flex items-center justify-center">
        <p className="text-cyan-400 font-medium">Loading Learnify dashboard...</p>
      </div>
    );
  }

  const completedCount = enrollments.filter(e => e.completed).length;

  return (
    <div className="min-h-screen text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Learnify Welcome & Stats Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-8 rounded-3xl bg-gradient-to-r from-[#0B132B] to-[#1C2541] border border-[#3A506B] shadow-2xl flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold uppercase">
                Learnify Student Portal
              </span>
              <h1 className="text-2xl sm:text-4xl font-black">
                Welcome back, {userProfile?.displayName || 'Alex'}! 👋
              </h1>
              <p className="text-gray-300 text-sm">
                You've completed 85% of your weekly goal. Keep going to hit 20 learning hours!
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#3A506B]/50 text-center">
              <div className="p-3 rounded-2xl bg-[#070D1D]/60 border border-[#3A506B]">
                <Flame className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                <p className="text-xl font-black text-white">7 Days</p>
                <p className="text-[10px] uppercase text-gray-400 font-semibold">Current Streak</p>
              </div>
              <div className="p-3 rounded-2xl bg-[#070D1D]/60 border border-[#3A506B]">
                <Clock className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                <p className="text-xl font-black text-white">45 hrs</p>
                <p className="text-[10px] uppercase text-gray-400 font-semibold">Learning Hours</p>
              </div>
              <div className="p-3 rounded-2xl bg-[#070D1D]/60 border border-[#3A506B]">
                <Zap className="w-5 h-5 text-teal-400 mx-auto mb-1" />
                <p className="text-xl font-black text-white">3.6K</p>
                <p className="text-[10px] uppercase text-gray-400 font-semibold">XP Points</p>
              </div>
            </div>
          </div>

          {/* Quick Calendar & Enrolled Stats */}
          <div className="p-8 rounded-3xl bg-[#0B132B] border border-[#1C2541] shadow-2xl space-y-6 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-gray-300 flex items-center space-x-2 rtl:space-x-reverse">
                <CalendarIcon className="w-4 h-4 text-cyan-400" />
                <span>June 09, 2026</span>
              </h3>
              <span className="text-xs text-cyan-400 font-bold">Active Week</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 rounded-2xl bg-[#1C2541]/40 border border-[#3A506B]">
                <p className="text-2xl font-black text-cyan-400">{enrollments.length}</p>
                <p className="text-xs text-gray-400 mt-1 uppercase font-semibold">Enrolled</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#1C2541]/40 border border-[#3A506B]">
                <p className="text-2xl font-black text-teal-400">{completedCount}</p>
                <p className="text-xs text-gray-400 mt-1 uppercase font-semibold">Completed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Learning & Live Classes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-bold">Continue Learning</h3>
            {enrollments.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-[#0B132B] border border-[#1C2541]">
                <BookOpen className="w-10 h-10 text-cyan-400 mx-auto mb-3 opacity-50" />
                <p className="text-gray-300 font-medium">You are not enrolled in any courses yet.</p>
                <button
                  onClick={() => setActivePage('courses')}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-cyan-500 text-[#0B132B] font-bold text-sm"
                >
                  Browse Catalog
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {enrollments.map((enr) => (
                  <div
                    key={enr.id}
                    onClick={() => {
                      if (enr.course) {
                        setSelectedCourseId(enr.course.id);
                        setActivePage('learning');
                      }
                    }}
                    className="p-6 rounded-2xl bg-[#0B132B] border border-[#1C2541] hover:border-cyan-500/50 transition cursor-pointer shadow-xl flex items-center justify-between gap-4"
                  >
                    <div className="space-y-2 flex-1">
                      <span className="text-xs font-bold text-cyan-400 uppercase">{enr.course?.category || 'Course'}</span>
                      <h4 className="font-bold text-lg text-white">{enr.course?.title || 'Course Title'}</h4>
                      <div className="w-full bg-[#1C2541] rounded-full h-2 overflow-hidden max-w-md">
                        <div className="bg-gradient-to-r from-cyan-500 to-teal-400 h-full rounded-full" style={{ width: `${enr.progress}%` }}></div>
                      </div>
                    </div>
                    <button className="px-5 py-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold hover:bg-cyan-500/30 transition flex-shrink-0">
                      Resume Lesson
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Live Classes */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Upcoming Live Classes</h3>
            <div className="p-6 rounded-3xl bg-[#0B132B] border border-[#1C2541] shadow-xl space-y-4">
              {[
                { title: 'Advanced Prototyping', instructor: 'Sarah Jenkins', time: 'LIVE NOW', color: 'text-rose-400' },
                { title: 'Redux State Mgmt', instructor: 'David Chan', time: '02:30 PM', color: 'text-cyan-400' },
                { title: 'Content Strategy 101', instructor: 'Emily Watson', time: 'Tomorrow', color: 'text-gray-400' },
              ].map((cls, i) => (
                <div key={i} className="p-4 rounded-2xl bg-[#1C2541]/40 border border-[#3A506B]/50 flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-white">{cls.title}</h4>
                    <p className="text-xs text-gray-400">{cls.instructor}</p>
                  </div>
                  <span className={`text-xs font-bold font-mono ${cls.color}`}>{cls.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
