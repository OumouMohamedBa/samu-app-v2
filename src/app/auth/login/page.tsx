'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
<<<<<<< HEAD
import styles from './login.module.css';
=======
import './login.css';
import { div } from 'framer-motion/client';
>>>>>>> 8cac64dae5631ccf375bb3298906f4f9460b1eb7

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError('Email ou mot de passe incorrect');
    }
  };

  return (
<<<<<<< HEAD
    <div className={styles.container}>
      <div className={styles.box}>
        <h2 className={styles.title}>Connexion</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          {error && <div className={styles.errorMessage}>{error}</div>}
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
=======
    <div className="container">
      
      <div  className="logo">
        <a href=""></a>
      </div>
    <div className="login-container">
      


      <div className="login-box">
        <div>
          <h2 className="login-title">Connexion</h2>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
>>>>>>> 8cac64dae5631ccf375bb3298906f4f9460b1eb7
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
    </div>
  );
}
