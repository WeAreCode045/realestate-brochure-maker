import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PropertyData } from "@/types/property";
import { useState } from "react";
import { useAgencySettings } from "@/hooks/useAgencySettings";
import { PropertyDetails } from "./webview/PropertyDetails";
import { ContactForm } from "./webview/ContactForm";
import { WebViewHeader } from "./webview/WebViewHeader";
import { WebViewImageGrid } from "./webview/WebViewImageGrid";
import { WebViewFooter } from "./webview/WebViewFooter";

interface PropertyWebViewProps {
  property: PropertyData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

  const overlayStyle = { 
    backgroundColor: `${settings?.primaryColor || '#40497A'}BF` // BF adds 75% opacity
  };

  const sections = [
    {
      id: 'overview',
      title: 'Overview',
      content: (
        <div className="relative h-full">
          <WebViewHeader settings={settings} />

          <div className="space-y-4 mt-2">
            {property.featuredImage && (
              <div className="relative px-6">
                <img
                  src={property.featuredImage}
                  alt={property.title}
                  className="w-full h-[400px] object-cover rounded-lg"
                />
                <div 
                  className="absolute inset-0 rounded-lg mx-6"
                  style={overlayStyle}
                />
                <div className="absolute left-0 right-0 bottom-[20%] overflow-hidden">
                  <div 
                    className="relative mx-6 py-4 px-6"
                    style={{ backgroundColor: settings?.primaryColor || '#40497A' }}
                  >
                    {/* Left fold */}
                    <div 
                      className="absolute left-0 bottom-[-20px] h-[20px] w-[20px]"
                      style={{ 
                        backgroundColor: settings?.primaryColor ? `${settings.primaryColor}99` : '#40497A99',
                        clipPath: 'polygon(100% 0, 0 0, 100% 100%)'
                      }}
                    />
                    {/* Right fold */}
                    <div 
                      className="absolute right-0 bottom-[-20px] h-[20px] w-[20px]"
                      style={{ 
                        backgroundColor: settings?.primaryColor ? `${settings.primaryColor}99` : '#40497A99',
                        clipPath: 'polygon(0 0, 0 100%, 100% 0)'
                      }}
                    />
                    <div className="flex justify-between items-center">
                      <h1 className="text-3xl font-bold text-white uppercase">
                        {property.title}
                      </h1>
                      <p className="text-2xl font-bold text-white">€ {property.price}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <WebViewImageGrid images={property.gridImages} settings={settings} />
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

            <WebViewFooter 
              currentPage={currentPage}
              totalPages={filteredSections.length}
              onPrevious={() => setCurrentPage(prev => prev - 1)}
              onNext={() => setCurrentPage(prev => prev + 1)}
              onShare={handleShare}
              onPrint={handlePrint}
            />
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
