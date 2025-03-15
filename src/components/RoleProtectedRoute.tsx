'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/user';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireRole?: boolean;
}

export default function RoleProtectedRoute({ 
  children, 
  allowedRoles = [], 
  requireRole = true 
}: RoleProtectedRouteProps) {
  const { user, userData, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth/login');
        return;
      }

      // Super admin a toujours accès
      if (isAdmin) {
        return;
      }

      // Si l'utilisateur n'a pas de rôle et qu'un rôle est requis
      if (requireRole && !userData?.role) {
        router.push('/waiting-role');
        return;
      }

      // Si des rôles spécifiques sont requis, vérifier si l'utilisateur a l'un d'eux
      if (allowedRoles.length > 0 && !allowedRoles.includes(userData?.role as UserRole)) {
        router.push('/unauthorized');
        return;
      }
    }
  }, [user, userData, loading, router, allowedRoles, requireRole, isAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen bg-mauritania-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gold-400 border-t-transparent"></div>
      </div>
    );
  }

  // Afficher le contenu si :
  // 1. L'utilisateur est super admin
  // 2. Aucun rôle n'est requis
  // 3. L'utilisateur a un rôle autorisé
  if (isAdmin || !requireRole || allowedRoles.includes(userData?.role as UserRole)) {
    return <>{children}</>;
  }

  return null;
}
