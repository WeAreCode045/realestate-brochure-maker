
import { useState } from "react";
import { PropertyForm, PropertyData } from "@/components/PropertyForm";
import { BrochurePreview } from "@/components/BrochurePreview";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Index = () => {
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);
  const { toast } = useToast();

  const handleFormSubmit = (data: PropertyData) => {
    setPropertyData(data);
    toast({
      title: "Preview ready",
      description: "Your brochure preview has been generated",
    });
  };

  const generatePDF = async () => {
    if (!propertyData) return;

    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Title
    pdf.setFontSize(24);
    pdf.text(propertyData.title, pageWidth / 2, 20, { align: "center" });

    // Price
    pdf.setFontSize(18);
    pdf.text(propertyData.price, pageWidth / 2, 30, { align: "center" });

    // Property Details Table
    autoTable(pdf, {
      head: [["Feature", "Details"]],
      body: [
        ["Address", propertyData.address],
        ["Bedrooms", propertyData.bedrooms],
        ["Bathrooms", propertyData.bathrooms],
        ["Square Footage", propertyData.sqft],
      ],
      startY: 40,
    });

    // Description
    pdf.setFontSize(12);
    const splitDescription = pdf.splitTextToSize(propertyData.description, pageWidth - 40);
    pdf.text(splitDescription, 20, pdf.lastAutoTable.finalY + 20);

    // Images
    let yPosition = pdf.lastAutoTable.finalY + 60;
    for (let i = 0; i < propertyData.images.length; i++) {
      if (yPosition + 80 > pageHeight) {
        pdf.addPage();
        yPosition = 20;
      }

      const img = propertyData.images[i];
      const url = URL.createObjectURL(img);
      await pdf.addImage(url, "JPEG", 20, yPosition, 170, 80);
      yPosition += 90;
    }

    pdf.save("property-brochure.pdf");
    toast({
      title: "Success",
      description: "Your brochure has been downloaded",
    });
  };

  return (
    <div className="min-h-screen bg-estate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-estate-800 mb-4">Real Estate Brochure Maker</h1>
          <p className="text-estate-600">Create professional property brochures in minutes</p>
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
