import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { PropertyDetails } from "./property/PropertyDetails";
import { PropertyFeatures } from "./property/PropertyFeatures";
import { PropertyDescription } from "./property/PropertyDescription";
import { PropertyImages } from "./property/PropertyImages";

export interface PropertyFeature {
  id: string;
  description: string;
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
  description: string;
  features: PropertyFeature[];
  images: File[];
  floorplans: File[];
}

interface PropertyFormProps {
  onSubmit: (data: PropertyData) => void;
  initialData?: PropertyData;
}

export function PropertyForm({ onSubmit, initialData }: PropertyFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<PropertyData>({
    title: "",
    price: "",
    address: "",
    bedrooms: "",
    bathrooms: "",
    sqft: "",
    livingArea: "",
    buildYear: "",
    garages: "",
    energyLabel: "",
    description: "",
    features: [],
    images: [],
    floorplans: [],
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
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

        <Button type="submit" className="w-full">
          Genereer Brochure
        </Button>
      </form>
    </Card>
  );
}
