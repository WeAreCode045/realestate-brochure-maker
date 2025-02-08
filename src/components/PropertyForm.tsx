
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

export interface PropertyData {
  title: string;
  price: string;
  address: string;
  bedrooms: string;
  bathrooms: string;
  sqft: string;
  description: string;
  images: File[];
  floorplans: File[];
}

interface PropertyFormProps {
  onSubmit: (data: PropertyData) => void;
}

export function PropertyForm({ onSubmit }: PropertyFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<PropertyData>({
    title: "",
    price: "",
    address: "",
    bedrooms: "",
    bathrooms: "",
    sqft: "",
    description: "",
    images: [],
    floorplans: [],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      if (newImages.length > 10) {
        toast({
          title: "Te veel afbeeldingen",
          description: "Selecteer maximaal 10 afbeeldingen",
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
      if (newFloorplans.length > 3) {
        toast({
          title: "Te veel plattegronden",
          description: "Selecteer maximaal 3 plattegronden",
          variant: "destructive",
        });
        return;
      }
      setFormData((prev) => ({ ...prev, floorplans: newFloorplans }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="w-full max-w-2xl p-6 space-y-6 animate-fadeIn">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Titel Woning</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="mt-1"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Prijs</Label>
              <Input
                id="price"
                name="price"
                type="text"
                value={formData.price}
                onChange={handleInputChange}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="sqft">Oppervlakte (m²)</Label>
              <Input
                id="sqft"
                name="sqft"
                type="text"
                value={formData.sqft}
                onChange={handleInputChange}
                className="mt-1"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Adres</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="mt-1"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bedrooms">Slaapkamers</Label>
              <Input
                id="bedrooms"
                name="bedrooms"
                type="number"
                value={formData.bedrooms}
                onChange={handleInputChange}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="bathrooms">Badkamers</Label>
              <Input
                id="bathrooms"
                name="bathrooms"
                type="number"
                value={formData.bathrooms}
                onChange={handleInputChange}
                className="mt-1"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Beschrijving</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="images">Foto's (Max 10)</Label>
            <Input
              id="images"
              name="images"
              type="file"
              onChange={handleImageUpload}
              className="mt-1"
              accept="image/*"
              multiple
              required
            />
          </div>

          <div>
            <Label htmlFor="floorplans">Plattegronden (Max 3)</Label>
            <Input
              id="floorplans"
              name="floorplans"
              type="file"
              onChange={handleFloorplanUpload}
              className="mt-1"
              accept="image/*"
              multiple
              required
            />
          </div>
        </div>

        <Button type="submit" className="w-full">
          Genereer Brochure
        </Button>
      </form>
    </Card>
  );
}
