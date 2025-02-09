
import { useState, useEffect } from "react";
import { PropertyForm, PropertyData } from "@/components/PropertyForm";
import { BrochurePreview } from "@/components/BrochurePreview";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";

const Index = () => {
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);
  const [savedBrochures, setSavedBrochures] = useState<PropertyData[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem("savedBrochures");
    if (saved) {
      setSavedBrochures(JSON.parse(saved));
    }
  }, []);

  const handleFormSubmit = (data: PropertyData) => {
    setPropertyData(data);
    toast({
      title: "Voorbeeld gereed",
      description: "Uw brochure voorbeeld is gegenereerd",
    });
  };

  const saveBrochure = () => {
    if (!propertyData) return;
    
    const newBrochures = [...savedBrochures, propertyData];
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
    
    toast({
      title: "Brochure verwijderd",
      description: "De brochure is succesvol verwijderd",
    });
  };

  const loadBrochure = (brochure: PropertyData) => {
    setPropertyData(brochure);
    toast({
      title: "Brochure geladen",
      description: "De geselecteerde brochure is geladen",
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
            <PropertyForm onSubmit={handleFormSubmit} />
          </div>
          <div className="space-y-4">
            {propertyData && (
              <>
                <BrochurePreview data={propertyData} />
                <div className="flex gap-4">
                  <Button onClick={saveBrochure} className="w-full">
                    Brochure Opslaan
                  </Button>
                </div>
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
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2"
                      onClick={() => deleteBrochure(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <h3 className="font-semibold mb-2">{brochure.title}</h3>
                    <p className="text-sm text-gray-500 mb-4">{brochure.address}</p>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => loadBrochure(brochure)}
                    >
                      Laden
                    </Button>
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
