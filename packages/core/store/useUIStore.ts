import { create } from 'zustand';

interface UIState {
  isOffline: boolean;
  isLoading: boolean;
  error: string | null;
  setOffline: (offline: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  simulateLoading: (ms?: number) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isOffline: false,
  isLoading: false,
  error: null,
  setOffline: (offline) => set({ isOffline: offline }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  simulateLoading: (ms = 1500) => {
    set({ isLoading: true });
    setTimeout(() => set({ isLoading: false }), ms);
  },
}));
