import { createClient } from '@supabase/supabase-js';
import { useSettingsStore } from '@/store/settingsStore';

export function getSupabaseClient() {
  const settings = useSettingsStore.getState().supabaseSettings;
  
  if (!settings.url || !settings.anonKey) {
    throw new Error('Supabase credentials not configured');
  }

  return createClient(settings.url, settings.anonKey);
}