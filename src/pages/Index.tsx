
import { useState } from "react";
import { PropertyForm, PropertyData } from "@/components/PropertyForm";
import { BrochurePreview } from "@/components/BrochurePreview";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import jsPDF from "jspdf";
import 'jspdf-autotable';

const Index = () => {
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);
  const { toast } = useToast();

  const handleFormSubmit = (data: PropertyData) => {
    setPropertyData(data);
    toast({
      title: "Voorbeeld gereed",
      description: "Uw brochure voorbeeld is gegenereerd",
    });
  };

  const generatePDF = async () => {
    if (!propertyData) return;

    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Cover page
    pdf.setFontSize(24);
    pdf.text(propertyData.title, pageWidth / 2, pageHeight / 3, { align: "center" });
    pdf.setFontSize(18);
    pdf.text(propertyData.price, pageWidth / 2, pageHeight / 3 + 10, { align: "center" });
    pdf.addPage();

    // General information page
    pdf.setFontSize(20);
    pdf.text("Eigenschappen", 20, 20);

    const tableData = [
      ["Adres", propertyData.address],
      ["Prijs", propertyData.price],
      ["Slaapkamers", propertyData.bedrooms],
      ["Badkamers", propertyData.bathrooms],
      ["Oppervlakte", `${propertyData.sqft} m²`],
    ];

    (pdf as any).autoTable({
      startY: 30,
      head: [["Kenmerk", "Details"]],
      body: tableData,
    });

    pdf.setFontSize(14);
    pdf.text("Beschrijving", 20, (pdf as any).autoTable.previous.finalY + 20);
    const splitDescription = pdf.splitTextToSize(propertyData.description, pageWidth - 40);
    pdf.text(splitDescription, 20, (pdf as any).autoTable.previous.finalY + 30);
    pdf.addPage();

    // Photos page
    pdf.setFontSize(20);
    pdf.text("Foto's", 20, 20);
    let yPosition = 40;

    for (let i = 0; i < propertyData.images.length; i++) {
      if (yPosition + 80 > pageHeight) {
        pdf.addPage();
        yPosition = 40;
      }

      const img = propertyData.images[i];
      const url = URL.createObjectURL(img);
      await pdf.addImage(url, "JPEG", 20, yPosition, 170, 80);
      yPosition += 90;
    }

    // Floor plans page
    if (propertyData.floorplans.length > 0) {
      pdf.addPage();
      pdf.setFontSize(20);
      pdf.text("Plattegronden", 20, 20);
      yPosition = 40;

      for (let i = 0; i < propertyData.floorplans.length; i++) {
        if (yPosition + 80 > pageHeight) {
          pdf.addPage();
          yPosition = 40;
        }

        const floorplan = propertyData.floorplans[i];
        const url = URL.createObjectURL(floorplan);
        await pdf.addImage(url, "JPEG", 20, yPosition, 170, 80);
        yPosition += 90;
      }
    }

    // Contact page
    pdf.addPage();
    pdf.setFontSize(20);
    pdf.text("Contact Informatie", 20, 20);
    
    const contactInfo = [
      ["Makelaar", "Uw Makelaar BV"],
      ["Telefoon", "+31 (0)20 123 4567"],
      ["Email", "info@uwmakelaar.nl"],
      ["Adres", "Makelaarsweg 1, 1234 AB Amsterdam"],
    ];

    (pdf as any).autoTable({
      startY: 30,
      head: [["", ""]],
      body: contactInfo,
      theme: "plain",
    });

    pdf.save("woning-brochure.pdf");
    toast({
      title: "Succes",
      description: "Uw brochure is gedownload",
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
                <Button onClick={generatePDF} className="w-full">
                  Download PDF
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
