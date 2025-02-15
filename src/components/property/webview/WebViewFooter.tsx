
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Share2, Printer } from "lucide-react";

interface WebViewFooterProps {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
  onShare: (platform: string) => void;
  onPrint: () => void;
}

export function WebViewFooter({ 
  currentPage, 
  totalPages, 
  onPrevious, 
  onNext, 
  onShare, 
  onPrint 
}: WebViewFooterProps) {
  return (
    <div className="sticky bottom-0 w-full bg-white border-t p-4">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={currentPage === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentPage ? 'bg-primary' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">Brochure</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={onNext}
            disabled={currentPage === totalPages - 1}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>

          <Button 
            variant="outline" 
            size="icon"
            onClick={() => onShare('whatsapp')}
            title="Share on WhatsApp"
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={onPrint}
            title="Print Brochure"
          >
            <Printer className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
