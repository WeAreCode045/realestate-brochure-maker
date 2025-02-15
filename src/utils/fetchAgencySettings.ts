
import { supabase } from "@/integrations/supabase/client";
import { AgencySettings, Typography } from "@/types/agency";

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

  const defaultTypography: Typography = {
    color: "#64748B",
    size: "1rem",
    weight: "400",
    font: "Inter"
  };

  return {
    id: String(data.id),
    name: data.name || "",
    agentName: data.agent_name || "",
    email: data.email || "",
    phone: data.phone || "",
    address: data.address || "",
    primaryColor: data.primary_color || "#40497A",
    secondaryColor: data.secondary_color || "#E2E8F0",
    logoUrl: data.logo_url,
    iconBuildYear: data.icon_build_year || "calendar",
    iconBedrooms: data.icon_bedrooms || "bed",
    iconBathrooms: data.icon_bathrooms || "bath",
    iconGarages: data.icon_garages || "car",
    iconEnergyClass: data.icon_energy_class || "zap",
    iconSqft: data.icon_sqft || "ruler",
    iconLivingSpace: data.icon_living_space || "home",
    googleMapsApiKey: data.google_maps_api_key || "",
    xmlImportUrl: data.xml_import_url || "",
    typography_h1: data.typography_h1 as Typography || {
      ...defaultTypography,
      size: "2.25rem",
      weight: "700",
      color: "#1E293B"
    },
    typography_h2: data.typography_h2 as Typography || {
      ...defaultTypography,
      size: "1.875rem",
      weight: "600",
      color: "#334155"
    },
    typography_p: data.typography_p as Typography || {
      ...defaultTypography
    },
    typography_title: data.typography_title as Typography || {
      ...defaultTypography,
      size: "1.5rem",
      weight: "600",
      color: "#1E293B"
    },
    typography_price: data.typography_price as Typography || {
      ...defaultTypography,
      size: "1.25rem",
      weight: "700",
      color: "#0F172A"
    },
    typography_label: data.typography_label as Typography || {
      ...defaultTypography,
      size: "0.875rem",
      weight: "500",
      color: "#475569"
    },
    typography_list: data.typography_list as Typography || {
      ...defaultTypography
    }
  };
}
