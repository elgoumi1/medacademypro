export type Language = 'en' | 'fr' | 'ar' | 'zh' | 'de';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'student' | 'super_admin';
  createdAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  duration: string;
  language: string;
  instructor: string;
  coverImage: string;
  published: boolean;
  createdAt: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  content: string;
  videoUrl?: string;
  order: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  passingScore: number;
  questions: QuizQuestion[];
}

export interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  coverImage?: string;
  videoUrl?: string;
  published: boolean;
  createdAt: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  progress: number;
  completed: boolean;
  enrolledAt: string;
}

export interface Certificate {
  id: string;
  userId: string;
  userName: string;
  courseId: string;
  courseTitle: string;
  certificateCode: string;
  issuedAt: string;
}
