
import { PropertyData } from "@/types/property";
import { AgencySettings } from "@/types/settings";

export interface WebViewSectionProps {
  property: PropertyData;
  settings?: AgencySettings;
}

export interface WebViewDialogProps {
  property: PropertyData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
