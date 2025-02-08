
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { PlusCircle, MinusCircle, Home, Car, Calendar, Ruler, Zap } from "lucide-react";

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
    livingArea: "",
    buildYear: "",
    garages: "",
    energyLabel: "",
    description: "",
    features: [],
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
              <Label htmlFor="buildYear">Bouwjaar</Label>
              <Input
                id="buildYear"
                name="buildYear"
                type="number"
                value={formData.buildYear}
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
              <Label htmlFor="sqft">Perceeloppervlakte (m²)</Label>
              <Input
                id="sqft"
                name="sqft"
                type="number"
                value={formData.sqft}
                onChange={handleInputChange}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="livingArea">Woonoppervlak (m²)</Label>
              <Input
                id="livingArea"
                name="livingArea"
                type="number"
                value={formData.livingArea}
                onChange={handleInputChange}
                className="mt-1"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
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
            <div>
              <Label htmlFor="garages">Garages</Label>
              <Input
                id="garages"
                name="garages"
                type="number"
                value={formData.garages}
                onChange={handleInputChange}
                className="mt-1"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="energyLabel">Energielabel</Label>
            <select
              id="energyLabel"
              name="energyLabel"
              value={formData.energyLabel}
              onChange={handleInputChange}
              className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2"
              required
            >
              <option value="">Selecteer label</option>
              <option value="A+++">A+++</option>
              <option value="A++">A++</option>
              <option value="A+">A+</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="E">E</option>
              <option value="F">F</option>
              <option value="G">G</option>
            </select>
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

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Kenmerken</Label>
              <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                <PlusCircle className="w-4 h-4 mr-2" />
                Kenmerk Toevoegen
              </Button>
            </div>
            {formData.features.map((feature) => (
              <div key={feature.id} className="flex items-center gap-2">
                <Input
                  value={feature.description}
                  onChange={(e) => updateFeature(feature.id, e.target.value)}
                  placeholder="Voer kenmerk in"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFeature(feature.id)}
                >
                  <MinusCircle className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}
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
