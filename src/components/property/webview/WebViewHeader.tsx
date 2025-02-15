
import { Mail, Phone, MapPin } from "lucide-react";
import { AgencySettings } from "@/types/agency";

interface WebViewHeaderProps {
  settings?: AgencySettings;
}

export function WebViewHeader({ settings }: WebViewHeaderProps) {
  return (
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
  );
}
