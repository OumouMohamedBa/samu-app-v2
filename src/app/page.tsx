'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';  // Utiliser le contexte d'authentification

export default function Home() {
  const { user } = useAuth();  // Récupérer l'utilisateur connecté via le contexte
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      // Si l'utilisateur n'est pas authentifié, rediriger vers la page de login
      console.log('Redirecting to /auth/login');
      router.push('/auth/login');
    }
  }, [user, router]);

  console.log('Rendering Home component');
  return null;
}
