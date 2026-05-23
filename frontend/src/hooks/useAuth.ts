import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/authStore';
import { getMe } from '../lib/api';

export const useAuth = (required = false) => {
  const { user, token, setAuth, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      if (required) router.push('/login');
      return;
    }
    if (!user) {
      getMe().then(u => setAuth(u, token)).catch(() => {
        logout();
        if (required) router.push('/login');
      });
    }
  }, [token]);

  return { user, token, logout, isAdmin: user?.role === 'admin' };
};
