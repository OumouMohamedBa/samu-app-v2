'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function ErrorPage() {
  const { user, userData } = useAuth();

  return (
    <div className="min-h-screen bg-mauritania-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-mauritania-600 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-mauritania-600 mb-4">
            Une erreur est survenue
          </h2>
          <div className="space-y-4">
            {user ? (
              <>
                <p className="text-gray-600">
                  {userData?.role ? (
                    "Vous n'avez pas les permissions nécessaires pour accéder à cette page."
                  ) : (
                    "Votre rôle n'a pas encore été attribué. Veuillez contacter l'administrateur."
                  )}
                </p>
                <div className="text-sm text-gray-500">
                  Email de l&apos;administrateur:
                  <br />
                  <a href="mailto:21062@supnum.mr" className="text-mauritania-600 hover:text-mauritania-500">
                    21062@supnum.mr
                  </a>
                </div>
              </>
            ) : (
              <p className="text-gray-600">
                Veuillez vous connecter pour accéder à cette page.
              </p>
            )}
          </div>
          <div className="mt-8 space-y-4">
            {user ? (
              <Link
                href="/dashboard"
                className="inline-block bg-gold-400 text-mauritania-800 px-6 py-2 rounded-md hover:bg-gold-300 transition-colors"
              >
                Retour au tableau de bord
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="inline-block bg-mauritania-600 text-white px-6 py-2 rounded-md hover:bg-mauritania-700 transition-colors"
              >
                Se connecter
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
