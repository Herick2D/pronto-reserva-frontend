'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, ComponentType } from 'react';

export function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>,
) {
  const WithAuthComponent = (props: P) => {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.replace('/login');
      }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
      return <div>Carregando aplicação...</div>;
    }

    if (isAuthenticated) {
      return <WrappedComponent {...props} />;
    }

    return null;
  };

  WithAuthComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithAuthComponent;
}