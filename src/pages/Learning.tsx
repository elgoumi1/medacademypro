import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { Course, Lesson, Enrollment, Certificate } from '../types';
import { BookOpen, CheckCircle, PlayCircle, Award, ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface LearningProps {
  courseId: string;
  setActivePage: (page: string) => void;
}

export const Learning: React.FC<LearningProps> = ({ courseId, setActivePage }) => {
  const { currentUser, userProfile } = useAuth();
  const { t } = useLanguage();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLearningData = async () => {
      if (!currentUser || !courseId) return;
      try {
        const courseDoc = await getDoc(doc(db, 'courses', courseId));
        if (courseDoc.exists()) {
          setCourse({ id: courseDoc.id, ...courseDoc.data() } as Course);
        }

        const lessonQuery = query(collection(db, 'lessons'), where('courseId', '==', courseId));
        const lessonSnap = await getDocs(lessonQuery);
        const lessonList = lessonSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lesson));
        lessonList.sort((a, b) => a.order - b.order);
        setLessons(lessonList);

        const enrollId = `${currentUser.uid}_${courseId}`;
        const enrollDoc = await getDoc(doc(db, 'enrollments', enrollId));
        if (enrollDoc.exists()) {
          setEnrollment(enrollDoc.data() as Enrollment);
        }
      } catch (err) {
        console.error('Error loading learning data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLearningData();
  }, [currentUser, courseId]);

  if (loading || !course) {
    return (
      <div className="min-h-screen bg-[#070D1D] text-white flex items-center justify-center">
        <p className="text-cyan-400 font-medium">Loading learning interface...</p>
      </div>
    );
  }

  const currentLesson = lessons[currentLessonIndex];

  const handleMarkComplete = async () => {
    if (!currentLesson || !currentUser) return;
    if (!completedLessons.includes(currentLesson.id)) {
      const updatedCompleted = [...completedLessons, currentLesson.id];
      setCompletedLessons(updatedCompleted);

      const progress = Math.round((updatedCompleted.length / lessons.length) * 100);
      const isCompleted = progress === 100;

      const enrollId = `${currentUser.uid}_${courseId}`;
      const updatedEnrollment: Enrollment = {
        id: enrollId,
        userId: currentUser.uid,
        courseId,
        progress,
        completed: isCompleted,
        enrolledAt: enrollment?.enrolledAt || new Date().toISOString()
      };
      await setDoc(doc(db, 'enrollments', enrollId), updatedEnrollment);
      setEnrollment(updatedEnrollment);

      // If 100% complete, issue certificate automatically!
      if (isCompleted) {
        const certId = `CERT_${currentUser.uid}_${courseId}`;
        const certCode = `MED-CERT-${Math.floor(100000 + Math.random() * 900000)}`;
        const newCert: Certificate = {
          id: certId,
          userId: currentUser.uid,
          userName: userProfile?.displayName || currentUser.email || 'Learner',
          courseId,
          courseTitle: course.title,
          certificateCode: certCode,
          issuedAt: new Date().toISOString()
        };
        await setDoc(doc(db, 'certificates', certId), newCert);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#070D1D] text-white flex flex-col">
      {/* Top Bar */}
      <header className="bg-[#0B132B] border-b border-[#1C2541] px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => setActivePage('student-dashboard')}
          className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-cyan-400 hover:text-cyan-300 font-medium"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          <span>Exit to Dashboard</span>
        </button>
        <h2 className="font-bold text-sm sm:text-lg truncate max-w-md text-white">{course.title}</h2>
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="text-xs text-gray-400">Progress:</span>
          <span className="text-xs font-bold text-cyan-400">{enrollment?.progress || 0}%</span>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4">
        {/* Sidebar Lessons */}
        <div className="lg:col-span-1 bg-[#0B132B] border-r border-[#1C2541] p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Course Lessons</h3>
          <div className="space-y-2">
            {lessons.map((lesson, idx) => {
              const isSelected = idx === currentLessonIndex;
              const isCompleted = completedLessons.includes(lesson.id);
              return (
                <button
                  key={lesson.id}
                  onClick={() => {
                    setCurrentLessonIndex(idx);
                    setQuizSubmitted(false);
                  }}
                  className={`w-full text-left rtl:text-right p-3 rounded-xl text-sm font-medium transition flex items-center justify-between ${isSelected ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold' : 'bg-[#1C2541]/50 text-gray-300 hover:bg-[#1C2541]'}`}
                >
                  <span className="truncate pr-2">{idx + 1}. {lesson.title}</span>
                  {isCompleted && <Check className="w-4 h-4 text-teal-400 flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Lesson Reader */}
        <div className="lg:col-span-3 p-6 sm:p-12 space-y-8 overflow-y-auto">
          {currentLesson ? (
            <div className="max-w-3xl mx-auto space-y-8 bg-[#0B132B] p-8 sm:p-12 rounded-3xl border border-[#1C2541] shadow-2xl">
              <div>
                <span className="text-xs text-cyan-400 font-bold uppercase">Lesson {currentLessonIndex + 1} of {lessons.length}</span>
                <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">{currentLesson.title}</h1>
              </div>

              {currentLesson.videoUrl && (
                <div className="aspect-video rounded-2xl overflow-hidden bg-black border border-[#3A506B]">
                  <iframe
                    src={currentLesson.videoUrl}
                    title={currentLesson.title}
                    className="w-full h-full"
                    allowFullScreen
                  ></iframe>
                </div>
              )}

              <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed text-base whitespace-pre-wrap">
                {currentLesson.content}
              </div>

              <div className="pt-8 border-t border-[#1C2541] flex items-center justify-between">
                <button
                  onClick={handleMarkComplete}
                  className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-[#0B132B] font-bold text-sm shadow-lg shadow-teal-500/20 transition flex items-center space-x-2 rtl:space-x-reverse"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Mark Lesson Complete</span>
                </button>

                {currentLessonIndex < lessons.length - 1 && (
                  <button
                    onClick={() => {
                      setCurrentLessonIndex(currentLessonIndex + 1);
                      setQuizSubmitted(false);
                    }}
                    className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#0B132B] font-bold text-sm shadow-lg shadow-cyan-500/20 transition flex items-center space-x-2 rtl:space-x-reverse"
                  >
                    <span>Next Lesson</span>
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-400">No lessons available for this course.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
