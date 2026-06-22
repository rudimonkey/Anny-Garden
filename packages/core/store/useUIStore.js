import { create } from 'zustand';
export const useUIStore = create((set) => ({
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
