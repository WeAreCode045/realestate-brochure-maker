
export interface TypographySettings {
  color: string;
  size: string;
  weight: string;
  font: string;
}

export interface AgencySettings {
  id?: string;
  name: string;
  agentName: string;
  email: string;
  phone: string;
  address: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl?: string;
  iconBuildYear?: string;
  iconBedrooms?: string;
  iconBathrooms?: string;
  iconGarages?: string;
  iconEnergyClass?: string;
  iconSqft?: string;
  iconLivingSpace?: string;
  googleMapsApiKey?: string;
  xmlImportUrl?: string;
  typography_h1?: TypographySettings;
  typography_h2?: TypographySettings;
  typography_p?: TypographySettings;
  typography_title?: TypographySettings;
  typography_price?: TypographySettings;
  typography_label?: TypographySettings;
  typography_list?: TypographySettings;
}
