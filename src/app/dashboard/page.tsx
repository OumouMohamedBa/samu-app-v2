'use client';

import { useAuth } from '@/contexts/AuthContext';
import RoleProtectedRoute from '@/components/RoleProtectedRoute';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, userData, logout, isAdmin } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const getRoleSpecificContent = () => {
    switch (userData?.role) {
      case 'medecin':
        return (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-mauritania-600">
              <h3 className="text-lg font-semibold text-mauritania-600 mb-2">Consultations</h3>
              <p className="text-gray-600">Gérez vos consultations et suivis patients</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-gold-400">
              <h3 className="text-lg font-semibold text-mauritania-600 mb-2">Urgences</h3>
              <p className="text-gray-600">Accédez aux cas d'urgence en attente</p>
            </div>
          </div>
        );
      case 'infirmier':
        return (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-mauritania-600">
              <h3 className="text-lg font-semibold text-mauritania-600 mb-2">Soins</h3>
              <p className="text-gray-600">Liste des soins à administrer</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-gold-400">
              <h3 className="text-lg font-semibold text-mauritania-600 mb-2">Patients</h3>
              <p className="text-gray-600">Suivi des patients</p>
            </div>
          </div>
        );
      case 'receptionniste':
        return (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-mauritania-600">
              <h3 className="text-lg font-semibold text-mauritania-600 mb-2">Admissions</h3>
              <p className="text-gray-600">Gestion des admissions patients</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-gold-400">
              <h3 className="text-lg font-semibold text-mauritania-600 mb-2">Rendez-vous</h3>
              <p className="text-gray-600">Planning des rendez-vous</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <RoleProtectedRoute>
      <div className="min-h-screen bg-mauritania-800">
        <header className="bg-mauritania-600 shadow-lg">
          <div className="container mx-auto px-4 py-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gold-400">SAMU Mauritanie</h1>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-white">{user?.email}</p>
                <p className="text-gold-400 text-sm">
                  {isAdmin ? 'Super Admin' : userData?.role || 'Rôle non attribué'}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-gold-400 text-mauritania-800 px-4 py-2 rounded-md hover:bg-gold-300 transition-colors"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-mauritania-600">
                Tableau de bord
              </h2>
              {isAdmin && (
                <Link
                  href="/admin/users"
                  className="bg-mauritania-600 text-white px-4 py-2 rounded-md hover:bg-mauritania-700 transition-colors"
                >
                  Gestion des utilisateurs
                </Link>
              )}
            </div>
            
            {getRoleSpecificContent()}
            
            {!userData?.role && !isAdmin && (
              <div className="bg-mauritania-50 border-l-4 border-mauritania-600 p-4 rounded">
                <p className="text-mauritania-600">
                  Votre rôle n&apos;a pas encore été attribué. Veuillez contacter l&apos;administrateur.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </RoleProtectedRoute>
  );
}
