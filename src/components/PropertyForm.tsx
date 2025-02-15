import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { PropertyDetails } from "./property/PropertyDetails";
import { PropertyFeatures } from "./property/PropertyFeatures";
import { PropertyDescription } from "./property/PropertyDescription";
import { PropertyImages } from "./property/PropertyImages";
import { supabase } from "@/integrations/supabase/client";
import { fileToDataUrl } from '@/utils/file-utils';
import { BrochureData, PropertyFeature } from '@/types/brochures';

export interface PropertyFormProps {
  onSubmit?: (data: BrochureData) => void;
  initialData?: BrochureData;
}

export interface PropertyData extends Omit<BrochureData, 'images' | 'floorplans'> {
  images: File[];
  floorplans: File[];
}

export function PropertyForm({ onSubmit, initialData }: PropertyFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<PropertyData>({
    id: initialData?.id || '',
    title: initialData?.title || '',
    price: initialData?.price || '',
    address: initialData?.address || '',
    bedrooms: initialData?.bedrooms || '',
    bathrooms: initialData?.bathrooms || '',
    sqft: initialData?.sqft || '',
    livingArea: initialData?.livingArea || '',
    buildYear: initialData?.buildYear || '',
    garages: initialData?.garages || '',
    energyLabel: initialData?.energyLabel || '',
    description: initialData?.description || '',
    features: initialData?.features || [],
    images: [],
    floorplans: []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const imageUrls = await Promise.all(formData.images.map(fileToDataUrl));
      const floorplanUrls = await Promise.all(formData.floorplans.map(fileToDataUrl));

      const propertyData: BrochureData = {
        ...formData,
        images: imageUrls,
        floorplans: floorplanUrls,
      };

      const { error } = await supabase.from('properties').insert([propertyData]);
      if (error) throw error;

      toast({
        title: "Success",
        description: "Property saved successfully",
      });

      if (onSubmit) {
        onSubmit(propertyData);
      }
    } catch (error) {
      console.error('Error submitting property:', error);
      toast({
        title: "Error",
        description: "Failed to save property",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      if (newImages.length > 20) {
        toast({
          title: "Te veel afbeeldingen",
          description: "Selecteer maximaal 20 afbeeldingen",
          variant: "destructive",
        });
        return;
      }
      setFormData((prev) => ({ ...prev, images: newImages }));
    }
  };

  const handleFloorplanUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFloorplans = Array.from(e.target.files);
      if (newFloorplans.length > 10) {
        toast({
          title: "Te veel plattegronden",
          description: "Selecteer maximaal 10 plattegronden",
          variant: "destructive",
        });
        return;
      }
      setFormData((prev) => ({ ...prev, floorplans: newFloorplans }));
    }
  };

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, { id: Date.now().toString(), description: "" }],
    }));
  };

  const removeFeature = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((feature) => feature.id !== id),
    }));
  };

  const updateFeature = (id: string, description: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.map((feature) =>
        feature.id === id ? { ...feature, description } : feature
      ),
    }));
  };

  return (
    <Card className="w-full max-w-2xl p-6 space-y-6 animate-fadeIn">
      <form onSubmit={handleSubmit} className="space-y-6">
        <PropertyDetails
          {...formData}
          onChange={handleInputChange}
        />

        <PropertyDescription
          description={formData.description}
          onChange={handleInputChange}
        />

        <PropertyFeatures
          features={formData.features}
          onAdd={addFeature}
          onRemove={removeFeature}
          onUpdate={updateFeature}
        />

        <PropertyImages
          onImageUpload={handleImageUpload}
          onFloorplanUpload={handleFloorplanUpload}
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Saving..." : "Genereer Brochure"}
        </Button>
      </form>
    </Card>
  );
}
