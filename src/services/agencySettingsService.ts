
import { supabase } from "@/integrations/supabase/client";
import { AgencySettings, Typography } from "@/types/agency";

interface AgencySettingsData {
  agent_name: string;
  email: string;
  phone: string;
  address: string;
  primary_color: string;
  secondary_color: string;
  logo_url?: string;
  icon_build_year: string;
  icon_bedrooms: string;
  icon_bathrooms: string;
  icon_garages: string;
  icon_energy_class: string;
  icon_sqft: string;
  icon_living_space: string;
  google_maps_api_key: string;
  xml_import_url: string;
  typography_h1: Record<string, unknown>;
  typography_h2: Record<string, unknown>;
  typography_p: Record<string, unknown>;
  typography_title: Record<string, unknown>;
  typography_price: Record<string, unknown>;
  typography_label: Record<string, unknown>;
  typography_list: Record<string, unknown>;
}

export const agencySettingsService = {
  async uploadLogo(file: Blob, filename: string) {
    const { data, error } = await supabase.storage
      .from('agency_files')
      .upload(filename, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('agency_files')
      .getPublicUrl(filename);

    return publicUrl;
  },

  async updateSettings(id: string, data: AgencySettingsData) {
    const { error } = await supabase
      .from('agency_settings')
      .update(data)
      .eq('id', id);

    if (error) throw error;
  },

  async createSettings(data: AgencySettingsData & { name: string }) {
    const { error } = await supabase
      .from('agency_settings')
      .insert(data);

    if (error) throw error;
  }
};
