'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/auth/login');
    }, 50);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-mauritania-800 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gold-400 border-t-transparent mb-4"></div>
        <p className="text-gold-400">Redirection en cours...</p>
      </div>
    </div>
  );
}