'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function WaitingRolePage() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth/login');
      } else if (userData?.role) {
        router.push('/dashboard');
      }
    }
  }, [user, userData, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-mauritania-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gold-400 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mauritania-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-mauritania-600 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-mauritania-600 mb-2">
            En attente d&apos;attribution de rôle
          </h2>
          <p className="text-mauritania-600">
            Votre compte a été créé avec succès, mais vous devez attendre qu&apos;un administrateur vous attribue un rôle.
          </p>
        </div>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Email: <span className="font-medium">{user?.email}</span>
          </p>
          <p className="text-sm text-gray-500">
            Veuillez contacter l&apos;administrateur à l&apos;adresse suivante:
            <br />
            <a href="mailto:21062@supnum.mr" className="text-mauritania-600 hover:text-mauritania-500">
              21062@supnum.mr
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
