
import { AgencySettings } from "@/types/agency";
import { ElementsSettings } from "./ElementsSettings";
import { TypographySettings } from "./TypographySettings";
import { IconSettings } from "./IconSettings";

interface DesignTabProps {
  settings: AgencySettings;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onTypographyChange: (element: string, field: string, value: string) => void;
}

export function DesignTab({ settings, onChange, onSelectChange, onTypographyChange }: DesignTabProps) {
  return (
    <div className="space-y-8">
      <ElementsSettings
        settings={settings}
        onChange={onChange}
      />
      <TypographySettings
        settings={settings}
        onChange={onChange}
        onTypographyChange={onTypographyChange}
      />
      <IconSettings
        settings={settings}
        onSelectChange={onSelectChange}
      />
    </div>
  );
}
