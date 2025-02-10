import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SupabaseSettings } from '@/types/settings';

interface SettingsState {
  supabaseSettings: SupabaseSettings;
  updateSupabaseSettings: (settings: SupabaseSettings) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      supabaseSettings: {
        url: '',
        anonKey: '',
      },
      updateSupabaseSettings: (settings) =>
        set({ supabaseSettings: settings }),
    }),
    {
      name: 'settings-storage',
      // Optional: Add encryption for sensitive data
      partialize: (state) => ({
        supabaseSettings: state.supabaseSettings,
      }),
    }
  )
);
