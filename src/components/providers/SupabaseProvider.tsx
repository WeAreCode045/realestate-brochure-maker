'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { useSettingsStore } from '@/store/settingsStore';
import { getSupabaseClient } from '@/lib/supabase';

const SupabaseContext = createContext<SupabaseClient | null>(null);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const settings = useSettingsStore((state) => state.supabaseSettings);

  useEffect(() => {
    try {
      const client = getSupabaseClient();
      setSupabase(client);
    } catch (error) {
      console.error('Failed to initialize Supabase client:', error);
    }
  }, [settings.url, settings.anonKey]);

  if (!supabase) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">
          Please configure Supabase credentials in settings
        </p>
      </div>
    );
  }

  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
}

