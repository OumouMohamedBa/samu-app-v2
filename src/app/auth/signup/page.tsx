'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import styles from '../login/login.module.css'; // Import du CSS standard

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    try {
      await signup(email, password);
      router.push('/');
    } catch (err) {
      setError("Erreur lors de l'inscription");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h2 className={styles.title}>Inscription</h2>

        <form className={styles.form} onSubmit={handleSubmit}>
          {error && <div className={styles.errorMessage}>{error}</div>}

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.formLabel}>Email</label>
            <input
              id="email"
              type="email"
              required
              className={styles.formInput}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.formLabel}>Mot de passe</label>
            <input
              id="password"
              type="password"
              required
              className={styles.formInput}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirm-password" className={styles.formLabel}>Confirmer le mot de passe</label>
            <input
              id="confirm-password"
              type="password"
              required
              className={styles.formInput}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button type="submit" className={styles.button}>S'inscrire</button>

          <p className={styles.signupLink}>
            Déjà un compte ?{' '}
            <Link href="/auth/login" className={styles.link}>Se connecter</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
