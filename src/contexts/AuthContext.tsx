import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, db, 
  signInWithPopup, googleProvider, 
  signInWithEmailAndPassword, createUserWithEmailAndPassword, 
  signOut, onAuthStateChanged, FirebaseUser 
} from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { UserProfile } from '../types';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (e: string, p: string) => Promise<void>;
  registerWithEmail: (e: string, p: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = 'mohamedelgoumi60@gmail.com';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const isAdmin = Boolean(
    (currentUser?.email && currentUser.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) ||
    (userProfile?.role === 'super_admin')
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setCurrentUser(firebaseUser);
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          const isSuperAdmin = firebaseUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
          const role = isSuperAdmin ? 'super_admin' : 'student';

          if (userDocSnap.exists()) {
            const data = userDocSnap.data() as UserProfile;
            // Ensure admin email is always super_admin
            const finalRole = isSuperAdmin ? 'super_admin' : data.role;
            setUserProfile({ ...data, role: finalRole });
          } else {
            const newProfile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Learner',
              role,
              createdAt: new Date().toISOString()
            };
            await setDoc(userDocRef, newProfile);
            setUserProfile(newProfile);
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const loginWithEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const registerWithEmail = async (email: string, pass: string, name: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    const isSuperAdmin = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
    const newProfile: UserProfile = {
      uid: cred.user.uid,
      email,
      displayName: name,
      role: isSuperAdmin ? 'super_admin' : 'student',
      createdAt: new Date().toISOString()
    };
    await setDoc(doc(db, 'users', cred.user.uid), newProfile);
    setUserProfile(newProfile);
  };

  const logout = async () => {
    await signOut(auth);
    setUserProfile(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, userProfile, isAdmin, loading, loginWithGoogle, loginWithEmail, registerWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
