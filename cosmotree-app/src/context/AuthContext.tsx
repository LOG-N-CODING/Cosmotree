// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  Auth,
} from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<User>;
  signIn: (email: string, password: string) => Promise<User>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Firebase Auth 상태 구독 (통합)
  useEffect(() => {
    // 로딩 타임아웃 설정 (5초 후 강제로 로딩 완료)
    const loadingTimeout = setTimeout(() => {
      console.warn('Auth loading timeout, forcing completion');
      setLoading(false);
    }, 5000);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser);
      clearTimeout(loadingTimeout); // 타임아웃 취소
      setUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          // 로그인된 유저 Firestore에서 isAdmin 필드 읽기
          const snap = await getDoc(doc(db, 'users', firebaseUser.uid));
          setIsAdmin(snap.exists() && snap.data()?.isAdmin === 1);
        } catch (error) {
          console.warn('Firestore access denied in AuthContext:', error);
          // Firestore 접근이 거부되면 일반 사용자로 간주
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return () => {
      clearTimeout(loadingTimeout);
      unsubscribe();
    };
  }, []);

  // 이메일·비밀번호 회원가입
  const signUp = async (email: string, password: string) => {
    const cred = await createUserWithEmailAndPassword(auth as Auth, email, password);
    return cred.user;
  };

  // 이메일·비밀번호 로그인
  const signIn = async (email: string, password: string) => {
    const cred = await signInWithEmailAndPassword(auth as Auth, email, password);
    return cred.user;
  };

  // 로그아웃
  const signOut = () => firebaseSignOut(auth as Auth);

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, isAdmin }}>
      {/* 로딩 중 화면 처리 */}
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

// Context 사용을 편하게 해주는 커스텀 훅
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};
