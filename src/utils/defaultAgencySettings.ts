
import { AgencySettings, Typography } from "@/types/agency";

export const defaultTypography: Typography = {
  color: "#64748B",
  size: "1rem",
  weight: "400",
  font: "Inter"
};

export const defaultAgencySettings: AgencySettings = {
  name: "",
  agentName: "",
  email: "",
  phone: "",
  address: "",
  primaryColor: "#40497A",
  secondaryColor: "#E2E8F0",
  iconBuildYear: "calendar",
  iconBedrooms: "bed",
  iconBathrooms: "bath",
  iconGarages: "car",
  iconEnergyClass: "zap",
  iconSqft: "ruler",
  iconLivingSpace: "home",
  googleMapsApiKey: "",
  xmlImportUrl: "",
  typography_h1: {
    ...defaultTypography,
    size: "2.25rem",
    weight: "700",
    color: "#1E293B"
  },
  typography_h2: {
    ...defaultTypography,
    size: "1.875rem",
    weight: "600",
    color: "#334155"
  },
  typography_p: {
    ...defaultTypography
  },
  typography_title: {
    ...defaultTypography,
    size: "1.5rem",
    weight: "600",
    color: "#1E293B"
  },
  typography_price: {
    ...defaultTypography,
    size: "1.25rem",
    weight: "700",
    color: "#0F172A"
  },
  typography_label: {
    ...defaultTypography,
    size: "0.875rem",
    weight: "500",
    color: "#475569"
  },
  typography_list: {
    ...defaultTypography
  }
};
