'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase'; // Ajout de l'import auth

import styles from './login.module.css';
import './login.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth() || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!login) {
      setError('Erreur interne. Veuillez réessayer.');
      return;
    }

    try {
      await login(email, password);
      const user = auth.currentUser;

      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userRole = userDoc.data().role;

          // Redirection en fonction du rôle
          if (userRole === 'admin') {
            router.push('/admin/dashboard');
          } else if (userRole === 'operateur') {
            router.push('/operateur/dashboard');
          } else if (userRole === 'medecin') {
            router.push('/medecin/dashboard');
          } else if (userRole === 'infirmier') {
            router.push('/infirmier/dashboard');
          } else {
            // Si le rôle est non défini ou inconnu
            setError('Rôle non reconnu. Accès interdit.');
          }
        } else {
          setError('Aucun utilisateur trouvé dans la base de données.');
        }
      }
    } catch (err) {
      setError('Email ou mot de passe incorrect');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h2 className={styles.title}>Connexion</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          {error && <div className={styles.errorMessage}>{error}</div>}
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              id="email"
              type="email"
              required
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>Mot de passe</label>
            <input
              id="password"
              type="password"
              required
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className={styles.button}>Se connecter</button>
          <div className={styles.signupLink}>
            <Link href="/auth/signup">Pas encore de compte ? S'inscrire</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
