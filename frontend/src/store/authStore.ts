import { create } from 'zustand';

interface User { id: string; email: string; role: string; credits: number; }

interface AuthStore {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  updateCredits: (credits: number) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  setAuth: (user, token) => {
    localStorage.setItem('token', token);
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },
  updateCredits: (credits) => set((s) => ({ user: s.user ? { ...s.user, credits } : null })),
}));
