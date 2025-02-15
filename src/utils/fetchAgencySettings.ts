
import { supabase } from "@/integrations/supabase/client";
import { AgencySettings, Typography } from "@/types/agency";
import { defaultAgencySettings } from "./defaultAgencySettings";

export async function fetchAgencySettings(): Promise<AgencySettings | null> {
  const { data, error } = await supabase
    .from('agency_settings')
    .select('*')
    .maybeSingle();

  if (error) {
    console.error('Error fetching settings:', error);
    return null;
  }

  if (!data) return null;

  const typographyFromJson = (json: any): Typography => ({
    color: json?.color || defaultAgencySettings.typography_h1.color,
    size: json?.size || defaultAgencySettings.typography_h1.size,
    weight: json?.weight || defaultAgencySettings.typography_h1.weight,
    font: json?.font || defaultAgencySettings.typography_h1.font,
  });

  return {
    id: String(data.id),
    name: data.name || defaultAgencySettings.name,
    agentName: data.agent_name || defaultAgencySettings.agentName,
    email: data.email || defaultAgencySettings.email,
    phone: data.phone || defaultAgencySettings.phone,
    address: data.address || defaultAgencySettings.address,
    primaryColor: data.primary_color || defaultAgencySettings.primaryColor,
    secondaryColor: data.secondary_color || defaultAgencySettings.secondaryColor,
    logoUrl: data.logo_url,
    iconBuildYear: data.icon_build_year || defaultAgencySettings.iconBuildYear,
    iconBedrooms: data.icon_bedrooms || defaultAgencySettings.iconBedrooms,
    iconBathrooms: data.icon_bathrooms || defaultAgencySettings.iconBathrooms,
    iconGarages: data.icon_garages || defaultAgencySettings.iconGarages,
    iconEnergyClass: data.icon_energy_class || defaultAgencySettings.iconEnergyClass,
    iconSqft: data.icon_sqft || defaultAgencySettings.iconSqft,
    iconLivingSpace: data.icon_living_space || defaultAgencySettings.iconLivingSpace,
    googleMapsApiKey: data.google_maps_api_key || defaultAgencySettings.googleMapsApiKey,
    xmlImportUrl: data.xml_import_url || defaultAgencySettings.xmlImportUrl,
    typography_h1: typographyFromJson(data.typography_h1) || defaultAgencySettings.typography_h1,
    typography_h2: typographyFromJson(data.typography_h2) || defaultAgencySettings.typography_h2,
    typography_p: typographyFromJson(data.typography_p) || defaultAgencySettings.typography_p,
    typography_title: typographyFromJson(data.typography_title) || defaultAgencySettings.typography_title,
    typography_price: typographyFromJson(data.typography_price) || defaultAgencySettings.typography_price,
    typography_label: typographyFromJson(data.typography_label) || defaultAgencySettings.typography_label,
    typography_list: typographyFromJson(data.typography_list) || defaultAgencySettings.typography_list,
  };
}
