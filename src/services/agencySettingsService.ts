
import { supabase } from "@/integrations/supabase/client";
import { AgencySettings, Typography } from "@/types/agency";
import { Json } from "@/integrations/supabase/types";

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
  typography_h1: Json;
  typography_h2: Json;
  typography_p: Json;
  typography_title: Json;
  typography_price: Json;
  typography_label: Json;
  typography_list: Json;
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

  async updateSettings(id: string, data: AgencySettings) {
    const typographyToJson = (typography: Typography): Json => {
      return {
        color: typography.color,
        size: typography.size,
        weight: typography.weight,
        font: typography.font
      } as Json;
    };

    const updateData: AgencySettingsData = {
      agent_name: data.agentName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      primary_color: data.primaryColor,
      secondary_color: data.secondaryColor,
      logo_url: data.logoUrl,
      icon_build_year: data.iconBuildYear,
      icon_bedrooms: data.iconBedrooms,
      icon_bathrooms: data.iconBathrooms,
      icon_garages: data.iconGarages,
      icon_energy_class: data.iconEnergyClass,
      icon_sqft: data.iconSqft,
      icon_living_space: data.iconLivingSpace,
      google_maps_api_key: data.googleMapsApiKey,
      xml_import_url: data.xmlImportUrl,
      typography_h1: typographyToJson(data.typography_h1),
      typography_h2: typographyToJson(data.typography_h2),
      typography_p: typographyToJson(data.typography_p),
      typography_title: typographyToJson(data.typography_title),
      typography_price: typographyToJson(data.typography_price),
      typography_label: typographyToJson(data.typography_label),
      typography_list: typographyToJson(data.typography_list)
    };

    const { error } = await supabase
      .from('agency_settings')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;
  },

  async createSettings(data: AgencySettingsData & { name: string }) {
    const { error } = await supabase
      .from('agency_settings')
      .insert({
        ...data,
        typography_h1: data.typography_h1 as Json,
        typography_h2: data.typography_h2 as Json,
        typography_p: data.typography_p as Json,
        typography_title: data.typography_title as Json,
        typography_price: data.typography_price as Json,
        typography_label: data.typography_label as Json,
        typography_list: data.typography_list as Json,
      });

    if (error) throw error;
  }
};
