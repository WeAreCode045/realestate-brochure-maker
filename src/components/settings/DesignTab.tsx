
import { AgencySettings } from "@/types/agency";
import { ColorInputs } from "./ColorInputs";
import { TypographySettings } from "./TypographySettings";
import { IconSettings } from "./IconSettings";

interface DesignTabProps {
  settings: AgencySettings;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (name: string, value: string) => void;
}

export function DesignTab({ settings, onChange, onSelectChange }: DesignTabProps) {
  return (
    <div className="space-y-6">
      <ColorInputs
        primaryColor={settings.primaryColor}
        secondaryColor={settings.secondaryColor}
        onChange={onChange}
      />
      <TypographySettings
        settings={settings}
        onChange={onChange}
        onSelectChange={onSelectChange}
      />
      <IconSettings
        settings={settings}
        onSelectChange={onSelectChange}
      />
    </div>
  );
}
