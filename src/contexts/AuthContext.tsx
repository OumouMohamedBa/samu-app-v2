'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { UserData, UserRole } from '@/types/user';

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  updateUserRole: (userId: string, role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const SUPER_ADMIN_EMAIL = '21062@supnum.mr';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          // Vérifier si l'utilisateur existe déjà dans Firestore
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (!userDoc.exists()) {
            // Si l'utilisateur n'existe pas dans Firestore, le créer
            const now = new Date().toISOString();
            const newUserData: UserData = {
              email: user.email || '',
              role: null,
              createdAt: now,
              updatedAt: now,
              uid: user.uid
            };
            await setDoc(userDocRef, newUserData);
          }

          // Configurer l'écouteur en temps réel pour les mises à jour
          const unsubscribeDoc = onSnapshot(userDocRef, (doc) => {
            if (doc.exists()) {
              const data = doc.data();
              setUserData({
                email: data.email || '',
                role: data.role || null,
                createdAt: data.createdAt || new Date().toISOString(),
                updatedAt: data.updatedAt || data.createdAt || new Date().toISOString(),
                uid: data.uid || user.uid
              } as UserData);
            }
          }, (error) => {
            console.error("Erreur lors de l'écoute des changements:", error);
          });

          return () => unsubscribeDoc();
        } catch (error) {
          console.error("Erreur lors de la récupération des données utilisateur:", error);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const now = new Date().toISOString();
      
      // Créer le document utilisateur dans Firestore avec l'UID
      const userData: UserData = {
        email,
        role: null,
        createdAt: now,
        updatedAt: now,
        uid: userCredential.user.uid
      };
      
      await setDoc(doc(db, 'users', userCredential.user.uid), userData);
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      throw error;
    }
  };

  const updateUserRole = async (userId: string, role: UserRole) => {
    if (!user || user.email !== SUPER_ADMIN_EMAIL) {
      throw new Error('Non autorisé à modifier les rôles');
    }
    
    try {
      const userDocRef = doc(db, 'users', userId);
      await setDoc(userDocRef, { 
        role,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du rôle:", error);
      throw error;
    }
  };

  const isAdmin = user?.email === SUPER_ADMIN_EMAIL;

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        userData, 
        loading, 
        signup, 
        login, 
        logout, 
        isAdmin,
        updateUserRole 
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
