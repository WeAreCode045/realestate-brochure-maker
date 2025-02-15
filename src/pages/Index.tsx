import { useState, useEffect } from "react";
import { PropertyForm, PropertyData } from "@/components/PropertyForm";
import { BrochurePreview } from "@/components/BrochurePreview";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Save } from "lucide-react";
import { dataUrlToFile, fileToDataUrl } from '@/utils/file-utils';

interface StoredPropertyData extends Omit<PropertyData, 'images' | 'floorplans'> {
  images: string[];
  floorplans: string[];
}

const base64ToBlob = async (base64: string) => {
  const response = await fetch(base64);
  return await response.blob();
};

const Index = () => {
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);
  const [savedBrochures, setSavedBrochures] = useState<StoredPropertyData[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem("savedBrochures");
    if (saved) {
      setSavedBrochures(JSON.parse(saved));
    }
  }, []);

  const handleFormSubmit = async (data: PropertyData) => {
    const imagePromises = data.images.map(file => 
      new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      })
    );

    const floorplanPromises = data.floorplans.map(file => 
      new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      })
    );

    const imageUrls = await Promise.all(imagePromises);
    const floorplanUrls = await Promise.all(floorplanPromises);

    const storedData: StoredPropertyData = {
      ...data,
      images: imageUrls,
      floorplans: floorplanUrls,
    };

    setPropertyData(data);

    if (editingIndex !== null) {
      const newBrochures = [...savedBrochures];
      newBrochures[editingIndex] = storedData;
      setSavedBrochures(newBrochures);
      localStorage.setItem("savedBrochures", JSON.stringify(newBrochures));
      setEditingIndex(null);
      toast({
        title: "Brochure bijgewerkt",
        description: "De brochure is succesvol bijgewerkt",
      });
    } else {
      toast({
        title: "Voorbeeld gereed",
        description: "Uw brochure voorbeeld is gegenereerd",
      });
    }
  };

  const saveBrochure = async () => {
    if (!propertyData) return;
    
    const imagePromises = propertyData.images.map(file => 
      new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      })
    );

    const floorplanPromises = propertyData.floorplans.map(file => 
      new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      })
    );

    const imageUrls = await Promise.all(imagePromises);
    const floorplanUrls = await Promise.all(floorplanPromises);

    const storedData: StoredPropertyData = {
      ...propertyData,
      images: imageUrls,
      floorplans: floorplanUrls,
    };
    
    const newBrochures = [...savedBrochures, storedData];
    setSavedBrochures(newBrochures);
    localStorage.setItem("savedBrochures", JSON.stringify(newBrochures));
    
    toast({
      title: "Brochure opgeslagen",
      description: "De brochure is succesvol opgeslagen",
    });
  };

  const editBrochure = async (index: number) => {
    const brochure = savedBrochures[index];
    
    try {
      const imagesToFiles = await Promise.all(
        brochure.images.map(url => dataUrlToFile(url, 'image.jpg'))
      );

      const floorplansToFiles = await Promise.all(
        brochure.floorplans.map(url => dataUrlToFile(url, 'floorplan.jpg'))
      );

      const propertyDataWithFiles: PropertyData = {
        ...brochure,
        images: imagesToFiles,
        floorplans: floorplansToFiles,
      };

      setPropertyData(propertyDataWithFiles);
      setEditingIndex(index);
      toast({
        title: "Bewerken gestart",
        description: "U kunt de brochure nu bewerken",
      });
    } catch (error) {
      console.error('Error converting images:', error);
      toast({
        title: "Error",
        description: "Er is een fout opgetreden bij het laden van de afbeeldingen",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-estate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-estate-800 mb-4">Woning Brochure Maker</h1>
          <p className="text-estate-600">Maak professionele woningbrochures in enkele minuten</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <PropertyForm onSubmit={handleFormSubmit} initialData={editingIndex !== null ? propertyData : undefined} />
          </div>
          <div className="space-y-4">
            {propertyData && (
              <>
                <BrochurePreview data={propertyData} />
                {editingIndex !== null ? (
                  <Button onClick={() => setEditingIndex(null)} className="w-full">
                    Cancel Editing
                  </Button>
                ) : (
                  <Button onClick={saveBrochure} className="w-full">
                    <Save className="w-4 h-4 mr-2" />
                    Save Brochure
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
