
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PropertyData } from "@/types/property";
import { useState } from "react";
import { useAgencySettings } from "@/hooks/useAgencySettings";
import { PropertyDetails } from "./webview/PropertyDetails";
import { ContactForm } from "./webview/ContactForm";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Share2, Printer, Mail, Phone, MapPin } from "lucide-react";

interface PropertyWebViewProps {
  property: PropertyData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Section {
  id: string;
  title: string;
  content: JSX.Element;
}

export function PropertyWebView({ property, open, onOpenChange }: PropertyWebViewProps) {
  const { settings } = useAgencySettings();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const handleShare = async (platform: string) => {
    const shareUrl = window.location.href;
    const text = `Check out this property: ${property.title}`;
    
    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + shareUrl)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`);
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`);
        break;
      case 'email':
        window.location.href = `mailto:?subject=${encodeURIComponent(property.title)}&body=${encodeURIComponent(text + '\n\n' + shareUrl)}`;
        break;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const sections: Section[] = [
    {
      id: 'overview',
      title: 'Overview',
      content: (
        <div className="relative h-full">
          <div className="p-6 pb-2 flex justify-between items-start">
            <div className="flex flex-col gap-2">
              {settings?.logoUrl && (
                <img
                  src={settings.logoUrl}
                  alt="Agency Logo"
                  className="w-[200px] h-auto object-contain"
                />
              )}
            </div>
            <div className="flex flex-col items-end gap-2 text-xs">
              {settings?.address && (
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: settings?.secondaryColor }}
                  >
                    <MapPin className="w-3 h-3 text-white" />
                  </div>
                  <span>{settings.address}</span>
                </div>
              )}
              {settings?.phone && (
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: settings?.secondaryColor }}
                  >
                    <Phone className="w-3 h-3 text-white" />
                  </div>
                  <span>{settings.phone}</span>
                </div>
              )}
              {settings?.email && (
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: settings?.secondaryColor }}
                  >
                    <Mail className="w-3 h-3 text-white" />
                  </div>
                  <span>{settings.email}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4 mt-2">
            {property.featuredImage && (
              <div className="relative px-6">
                <img
                  src={property.featuredImage}
                  alt={property.title}
                  className="w-full h-[400px] object-cover rounded-lg"
                />
              </div>
            )}

            {property.gridImages && property.gridImages.length > 0 && (
              <div className="grid grid-cols-4 gap-4 px-6">
                {property.gridImages.slice(0, 4).map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Grid ${index + 1}`}
                      className="w-full aspect-video object-cover rounded-lg"
                    />
                    <div 
                      className="absolute inset-0 rounded-lg"
                      style={{ backgroundColor: `rgba(126, 105, 171, 0.6)` }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div 
            className="absolute bottom-0 left-0 right-0 py-4"
            style={{ backgroundColor: settings?.primaryColor }}
          >
            <div className="container flex justify-between items-center px-6">
              <h1 className="text-3xl font-bold text-white uppercase">
                {property.title}
              </h1>
              <p className="text-2xl font-bold text-white">€ {property.price}</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'details',
      title: 'Details',
      content: (
        <div className="space-y-6">
          <PropertyDetails 
            property={property}
            primaryColor={settings?.secondaryColor}
          />
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-4">Description</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{property.description}</p>
          </div>
        </div>
      )
    },
    {
      id: 'photos',
      title: 'Photos',
      content: (
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">Photos</h3>
          <div className="grid grid-cols-3 gap-4">
            {property.images?.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Property ${index + 1}`}
                className="w-full aspect-video object-cover rounded-lg cursor-pointer"
                onClick={() => setSelectedImage(image)}
              />
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'floorplans',
      title: 'Floorplans',
      content: (
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">Floorplans</h3>
          <div className="grid grid-cols-2 gap-4">
            {property.floorplans?.map((plan, index) => (
              <img
                key={index}
                src={plan}
                alt={`Floorplan ${index + 1}`}
                className="w-full aspect-video object-cover rounded-lg cursor-pointer"
                onClick={() => setSelectedImage(plan)}
              />
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'contact',
      title: 'Contact',
      content: (
        <div className="space-y-6">
          {property.address && settings?.googleMapsApiKey && (
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Location</h3>
              <div className="h-[400px] rounded-lg overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: 0 }}
                  src={`https://www.google.com/maps/embed/v1/place?key=${settings.googleMapsApiKey}&q=${encodeURIComponent(property.address)}`}
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
          <ContactForm 
            agencyName={settings?.name}
            agencyAddress={settings?.address}
            agencyPhone={settings?.phone}
            agencyEmail={settings?.email}
            secondaryColor={settings?.secondaryColor}
          />
        </div>
      )
    }
  ];

  const filteredSections = sections.filter(section => {
    if (section.id === 'photos' && (!property.images || property.images.length === 0)) return false;
    if (section.id === 'floorplans' && (!property.floorplans || property.floorplans.length === 0)) return false;
    return true;
  });

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[595px] h-[842px] p-0 overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto">
              {filteredSections[currentPage]?.content}
            </div>

            <div className="sticky bottom-0 w-full bg-white border-t p-4">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  disabled={currentPage === 0}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                <div className="flex gap-2">
                  {filteredSections.map((section, index) => (
                    <div
                      key={section.id}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentPage ? 'bg-primary' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={currentPage === filteredSections.length - 1}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>

                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleShare('whatsapp')}
                    title="Share on WhatsApp"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={handlePrint}
                    title="Print Brochure"
                  >
                    <Printer className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-[90vw] max-h-[90vh]">
            <img
              src={selectedImage}
              alt="Large view"
              className="w-full h-full object-contain"
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
