
import { Json } from "@/integrations/supabase/types";

export interface PropertyFeature {
  id: string;
  description: string;
}

export interface BrochureData {
  id: string;  // Changed from optional to required
  title: string;
  address: string;
  price: string;
  bedrooms: string;
  bathrooms: string;
  sqft: string;
  livingArea: string;
  buildYear: string;
  garages: string;
  energyLabel: string;
  description: string;
  features: PropertyFeature[];
  images: string[];
  floorplans: string[];
  created_at?: string;
  updated_at?: string;
}

export type StoredPropertyData = BrochureData;
