'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { UserData, UserRole } from '@/types/user';
import RoleProtectedRoute from '@/components/RoleProtectedRoute';

interface UserWithId extends UserData {
  id: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { updateUserRole, isAdmin } = useAuth();
  const [updateStatus, setUpdateStatus] = useState<{ id: string; status: 'success' | 'error' | null; message: string }>({ 
    id: '', 
    status: null,
    message: '' 
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setError(null);
        // Créer une requête pour obtenir tous les utilisateurs
        const usersQuery = query(
          collection(db, 'users'),
          orderBy('createdAt', 'desc')
        );

        // Configuration de l'écouteur en temps réel
        const unsubscribe = onSnapshot(usersQuery, 
          (snapshot) => {
            const usersData: UserWithId[] = [];
            snapshot.forEach((doc) => {
              const data = doc.data();
              // S'assurer que toutes les propriétés requises sont présentes
              usersData.push({
                id: doc.id,
                email: data.email || '',
                role: data.role || null,
                createdAt: data.createdAt || new Date().toISOString(),
                updatedAt: data.updatedAt || data.createdAt || new Date().toISOString(),
                uid: data.uid || doc.id
              });
            });
            console.log('Utilisateurs récupérés:', usersData);
            setUsers(usersData);
            setLoading(false);
          },
          (error) => {
            console.error("Erreur lors de la récupération des utilisateurs:", error);
            setError("Une erreur est survenue lors de la récupération des utilisateurs.");
            setLoading(false);
          }
        );

        return () => unsubscribe();
      } catch (error) {
        console.error("Erreur lors de l'initialisation de la requête:", error);
        setError("Une erreur est survenue lors de l'initialisation.");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleUpdate = async (userId: string, role: UserRole) => {
    try {
      setUpdateStatus({ id: userId, status: null, message: 'Mise à jour en cours...' });
      await updateUserRole(userId, role);
      setUpdateStatus({ 
        id: userId, 
        status: 'success',
        message: 'Rôle mis à jour avec succès'
      });
      setTimeout(() => setUpdateStatus({ id: '', status: null, message: '' }), 3000);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du rôle:", error);
      setUpdateStatus({ 
        id: userId, 
        status: 'error',
        message: 'Erreur lors de la mise à jour du rôle'
      });
      setTimeout(() => setUpdateStatus({ id: '', status: null, message: '' }), 3000);
    }
  };

  const roleOptions: UserRole[] = ['admin', 'medecin', 'infirmier', 'receptionniste'];

  if (loading) {
    return (
      <div className="min-h-screen bg-mauritania-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gold-400 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-mauritania-800 flex items-center justify-center px-4">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur</h3>
            <p className="text-sm text-gray-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <RoleProtectedRoute allowedRoles={[]}>
      <div className="min-h-screen bg-mauritania-800">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-mauritania-600 mb-2">
                  Gestion des Utilisateurs
                </h1>
                <p className="text-sm text-gray-600">
                  Total des utilisateurs: {users.length}
                </p>
              </div>
            </div>
            
            {users.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-mauritania-50 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-mauritania-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <p className="text-gray-500">Aucun utilisateur trouvé</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-mauritania-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-mauritania-600 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-mauritania-600 uppercase tracking-wider">
                        Date d'inscription
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-mauritania-600 uppercase tracking-wider">
                        Dernière modification
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-mauritania-600 uppercase tracking-wider">
                        Rôle Actuel
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-mauritania-600 uppercase tracking-wider">
                        Modifier le Rôle
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-mauritania-600 uppercase tracking-wider">
                        Statut
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className={user.role ? 'bg-white hover:bg-mauritania-50/30' : 'bg-mauritania-50/30 hover:bg-mauritania-50/50'}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 bg-mauritania-600 rounded-full flex items-center justify-center">
                              <span className="text-gold-400 text-sm font-medium">
                                {user.email?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.email}
                              </div>
                              {user.email === '21062@supnum.mr' && (
                                <div className="text-xs text-gold-400">Super Admin</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.updatedAt || user.createdAt).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role 
                              ? 'bg-mauritania-100 text-mauritania-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.role || 'Non attribué'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {isAdmin && user.email !== '21062@supnum.mr' && (
                            <select
                              className="block w-full px-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-mauritania-500 focus:border-mauritania-500 sm:text-sm rounded-md"
                              value={user.role || ''}
                              onChange={(e) => handleRoleUpdate(user.id, e.target.value as UserRole)}
                            >
                              <option value="">Sélectionner un rôle</option>
                              {roleOptions.map((role) => (
                                <option key={role} value={role}>
                                  {role.charAt(0).toUpperCase() + role.slice(1)}
                                </option>
                              ))}
                            </select>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {updateStatus.id === user.id && (
                            <div className={`text-sm ${
                              updateStatus.status === 'success' 
                                ? 'text-green-600' 
                                : updateStatus.status === 'error'
                                ? 'text-red-600'
                                : 'text-mauritania-600'
                            }`}>
                              <span className="inline-block mr-2">
                                {updateStatus.status === 'success' ? '✓' : 
                                 updateStatus.status === 'error' ? '✗' : '⟳'}
                              </span>
                              {updateStatus.message}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </RoleProtectedRoute>
  );
}
