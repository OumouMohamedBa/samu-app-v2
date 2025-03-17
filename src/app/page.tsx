'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    console.log('Redirecting to /auth/login');
    router.push('/auth/login');
  }, [router]);

  console.log('Rendering Home component');
  return null;
}
