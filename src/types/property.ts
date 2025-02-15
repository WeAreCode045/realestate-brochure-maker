
import { Json } from "@/integrations/supabase/types";

export interface PropertyFeature {
  id: string;
  description: string;
}

export interface PropertyGridImage {
  id: string;
  url: string;
}

export interface PropertyData {
  title: string;
  price: string;
  address: string;
  bedrooms: string;
  bathrooms: string;
  sqft: string;
  livingArea: string;
  buildYear: string;
  garages: string;
  energyLabel: string;
  hasGarden: boolean;
  description: string;
  features: PropertyFeature[];
  images: string[];
  floorplans: string[];
  featuredImage: string | null;
  gridImages: string[];
}

export interface PropertyFormData extends PropertyData {}

export interface PropertySubmitData extends Omit<PropertyData, 'features'> {
  features: Json;
}
