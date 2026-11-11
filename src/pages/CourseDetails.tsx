import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc, collection, query, where, getDocs, setDoc } from 'firebase/firestore';
import { Course, Lesson, Enrollment } from '../types';
import { BookOpen, Clock, Award, CheckCircle, ArrowLeft, PlayCircle, ShieldCheck } from 'lucide-react';

interface CourseDetailsProps {
  courseId: string;
  setActivePage: (page: string) => void;
  setSelectedCourseId: (id: string) => void;
}

export const CourseDetails: React.FC<CourseDetailsProps> = ({ courseId, setActivePage, setSelectedCourseId }) => {
  const { t } = useLanguage();
  const { currentUser } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const docRef = doc(db, 'courses', courseId);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setCourse({ id: snap.id, ...snap.data() } as Course);
        }

        const lessonQuery = query(collection(db, 'lessons'), where('courseId', '==', courseId));
        const lessonSnap = await getDocs(lessonQuery);
        const lessonList = lessonSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lesson));
        lessonList.sort((a, b) => a.order - b.order);
        setLessons(lessonList);

        if (currentUser) {
          const enrollQuery = query(
            collection(db, 'enrollments'),
            where('userId', '==', currentUser.uid),
            where('courseId', '==', courseId)
          );
          const enrollSnap = await getDocs(enrollQuery);
          if (!enrollSnap.empty) {
            setEnrolled(true);
          }
        }
      } catch (err) {
        console.error('Error fetching course details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseData();
    }
  }, [courseId, currentUser]);

  const handleEnroll = async () => {
    if (!currentUser) {
      setActivePage('login');
      return;
    }

    try {
      const enrollmentId = `${currentUser.uid}_${courseId}`;
      const newEnrollment: Enrollment = {
        id: enrollmentId,
        userId: currentUser.uid,
        courseId,
        progress: 0,
        completed: false,
        enrolledAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'enrollments', enrollmentId), newEnrollment);
      setEnrolled(true);
      setActivePage('learning');
    } catch (err) {
      console.error('Error enrolling in course:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070D1D] text-white flex items-center justify-center">
        <p className="text-cyan-400 font-medium">Loading course details...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#070D1D] text-white flex flex-col items-center justify-center space-y-4">
        <p className="text-xl font-bold">Course not found.</p>
        <button 
          onClick={() => setActivePage('courses')}
          className="px-6 py-2.5 rounded-xl bg-cyan-500 text-[#0B132B] font-bold text-sm"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070D1D] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <button
          onClick={() => setActivePage('courses')}
          className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-cyan-400 hover:text-cyan-300 font-medium"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          <span>Back to Catalog</span>
        </button>

        {/* Hero Card */}
        <div className="rounded-3xl bg-[#0B132B] border border-[#1C2541] overflow-hidden shadow-2xl">
          <div className="h-64 sm:h-80 bg-gradient-to-tr from-[#1C2541] to-[#2A3B63] relative">
            {course.coverImage && (
              <img src={course.coverImage} alt={course.title} className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B] via-[#0B132B]/40 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 rtl:left-auto rtl:right-6 rtl:left-6 space-y-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold uppercase tracking-wider">
                {course.category}
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-white">{course.title}</h1>
            </div>
          </div>

          <div className="p-8 space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-[#1C2541]">
              <div>
                <span className="block text-xs text-gray-400 uppercase font-semibold">Instructor</span>
                <span className="block text-sm font-bold text-white mt-1">{course.instructor}</span>
              </div>
              <div>
                <span className="block text-xs text-gray-400 uppercase font-semibold">Duration</span>
                <span className="block text-sm font-bold text-white mt-1">{course.duration}</span>
              </div>
              <div>
                <span className="block text-xs text-gray-400 uppercase font-semibold">Level</span>
                <span className="block text-sm font-bold text-white mt-1">{course.level}</span>
              </div>
              <div>
                <span className="block text-xs text-gray-400 uppercase font-semibold">Language</span>
                <span className="block text-sm font-bold text-white mt-1 uppercase">{course.language || 'English'}</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold">About This Course</h3>
              <p className="text-gray-300 leading-relaxed text-sm sm:text-base">{course.description}</p>
            </div>

            {/* Curriculum */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Course Curriculum ({lessons.length} Lessons)</h3>
              {lessons.length === 0 ? (
                <p className="text-sm text-gray-400">Lessons are currently being prepared by the administration.</p>
              ) : (
                <div className="space-y-3">
                  {lessons.map((lesson, index) => (
                    <div key={lesson.id} className="p-4 rounded-xl bg-[#1C2541]/50 border border-[#3A506B]/50 flex items-center justify-between">
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <span className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-xs">
                          {index + 1}
                        </span>
                        <span className="text-sm font-semibold text-white">{lesson.title}</span>
                      </div>
                      {lesson.videoUrl && (
                        <span className="text-xs text-cyan-400 flex items-center space-x-1 rtl:space-x-reverse">
                          <PlayCircle className="w-4 h-4" />
                          <span>Video Lesson</span>
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Button */}
            <div className="pt-6 border-t border-[#1C2541] flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">Tuition Fee</p>
                <p className="text-2xl font-black text-cyan-400">100% Free</p>
              </div>
              {enrolled ? (
                <button
                  onClick={() => setActivePage('learning')}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-[#0B132B] font-bold text-sm shadow-lg shadow-cyan-500/20 hover:opacity-95 transition"
                >
                  Continue Learning
                </button>
              ) : (
                <button
                  onClick={handleEnroll}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-[#0B132B] font-bold text-sm shadow-lg shadow-cyan-500/20 hover:opacity-95 transition"
                >
                  Enroll Free Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
