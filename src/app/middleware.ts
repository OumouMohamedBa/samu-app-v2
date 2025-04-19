import { NextResponse } from 'next/server';
import { auth } from '@/lib/firebase'; // Assurez-vous que Firebase est bien configuré
import { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const user = auth.currentUser; // Vérifier si l'utilisateur est authentifié

  // Liste des chemins protégés
  const protectedPaths = ['/admin/dashboard', '/operateur/dashboard', '/medecin/dashboard', '/infirmier/dashboard'];

  // Si l'utilisateur n'est pas authentifié et tente d'accéder à une page protégée
  if (!user && protectedPaths.some(path => req.url.includes(path))) {
    // Rediriger vers la page de login
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  return NextResponse.next(); // Si l'utilisateur est authentifié ou si la page n'est pas protégée, continuer
}

export const config = {
  matcher: ['/admin/*', '/operateur/*', '/medecin/*', '/infirmier/*'], // Ces chemins seront protégés
};
