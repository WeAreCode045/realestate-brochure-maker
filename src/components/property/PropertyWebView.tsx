
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useAgencySettings } from "@/hooks/useAgencySettings";
import { WebViewFooter } from "./webview/WebViewFooter";
import { OverviewSection } from "./webview/sections/OverviewSection";
import { DetailsSection } from "./webview/sections/DetailsSection";
import { PhotosSection } from "./webview/sections/PhotosSection";
import { FloorplansSection } from "./webview/sections/FloorplansSection";
import { ContactSection } from "./webview/sections/ContactSection";
import { usePropertyWebView } from "./webview/usePropertyWebView";
import { WebViewDialogProps } from "./webview/types";

export function PropertyWebView({ property, open, onOpenChange }: WebViewDialogProps) {
  const { settings } = useAgencySettings();
  const {
    selectedImage,
    setSelectedImage,
    currentPage,
    setCurrentPage,
    handleShare,
    handlePrint
  } = usePropertyWebView();

  const sections = [
    {
      id: 'overview',
      title: 'Overview',
      content: <OverviewSection property={property} settings={settings} />
    },
    {
      id: 'details',
      title: 'Details',
      content: <DetailsSection property={property} settings={settings} />
    },
    {
      id: 'photos',
      title: 'Photos',
      content: <PhotosSection property={property} settings={settings} />
    },
    {
      id: 'floorplans',
      title: 'Floorplans',
      content: <FloorplansSection property={property} settings={settings} />
    },
    {
      id: 'contact',
      title: 'Contact',
      content: <ContactSection property={property} settings={settings} />
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
          <DialogTitle className="sr-only">
            {filteredSections[currentPage]?.title}
          </DialogTitle>
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
            <DialogTitle className="sr-only">Image Preview</DialogTitle>
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
