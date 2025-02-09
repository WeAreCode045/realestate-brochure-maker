
import { useState, useEffect } from "react";
import { PropertyForm, PropertyData } from "@/components/PropertyForm";
import { BrochurePreview } from "@/components/BrochurePreview";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { X, Edit2, Save, FileDown } from "lucide-react";
import PDFDocument from 'pdfkit';

// Helper type to store image data
interface StoredPropertyData extends Omit<PropertyData, 'images' | 'floorplans'> {
  images: string[];
  floorplans: string[];
}

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
    // Convert File objects to base64 strings for storage
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
    
    // Convert File objects to base64 strings for storage
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

  const deleteBrochure = (index: number) => {
    const newBrochures = savedBrochures.filter((_, i) => i !== index);
    setSavedBrochures(newBrochures);
    localStorage.setItem("savedBrochures", JSON.stringify(newBrochures));
    
    if (editingIndex === index) {
      setEditingIndex(null);
      setPropertyData(null);
    }
    
    toast({
      title: "Brochure verwijderd",
      description: "De brochure is succesvol verwijderd",
    });
  };

  const editBrochure = async (index: number) => {
    const brochure = savedBrochures[index];
    
    // Convert base64 strings back to File objects
    const imagesToFiles = await Promise.all(
      brochure.images.map(async (dataUrl) => {
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        return new File([blob], 'image.jpg', { type: 'image/jpeg' });
      })
    );

    const floorplansToFiles = await Promise.all(
      brochure.floorplans.map(async (dataUrl) => {
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        return new File([blob], 'floorplan.jpg', { type: 'image/jpeg' });
      })
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
  };

  const handleGeneratePDF = async (brochure: StoredPropertyData) => {
    // Convert base64 strings back to File objects for PDF generation
    const imagesToFiles = await Promise.all(
      brochure.images.map(async (dataUrl) => {
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        return new File([blob], 'image.jpg', { type: 'image/jpeg' });
      })
    );

    const floorplansToFiles = await Promise.all(
      brochure.floorplans.map(async (dataUrl) => {
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        return new File([blob], 'floorplan.jpg', { type: 'image/jpeg' });
      })
    );

    const propertyDataWithFiles: PropertyData = {
      ...brochure,
      images: imagesToFiles,
      floorplans: floorplansToFiles,
    };

    setPropertyData(propertyDataWithFiles);
    toast({
      title: "PDF Generatie",
      description: "Uw brochure wordt gegenereerd",
    });
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
                    <X className="w-4 h-4 mr-2" />
                    Annuleer Bewerken
                  </Button>
                ) : (
                  <Button onClick={saveBrochure} className="w-full">
                    <Save className="w-4 h-4 mr-2" />
                    Brochure Opslaan
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        {savedBrochures.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-estate-800 mb-6">Opgeslagen Brochures</h2>
            <ScrollArea className="h-[300px] rounded-md border p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedBrochures.map((brochure, index) => (
                  <Card key={index} className="p-4 relative">
                    <div className="absolute right-2 top-2 flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => editBrochure(index)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteBrochure(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    {brochure.images.length > 0 && (
                      <div className="mb-4 aspect-[4/3] overflow-hidden rounded-lg">
                        <img
                          src={brochure.images[0]}
                          alt={brochure.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <h3 className="font-semibold mb-2">{brochure.title}</h3>
                    <p className="text-sm text-gray-500 mb-4">{brochure.address}</p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => editBrochure(index)}
                      >
                        Bewerken
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleGeneratePDF(brochure)}
                      >
                        <FileDown className="w-4 h-4 mr-2" />
                        PDF
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;

