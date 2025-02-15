
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AgencySettings, TypographySettings } from "@/types/agency";

interface TypographySettingsProps {
  settings: AgencySettings;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTypographyChange: (element: string, field: keyof TypographySettings, value: string) => void;
}

export const TypographySettings = ({ settings, onChange, onTypographyChange }: TypographySettingsProps) => {
  const typographyElements = [
    { key: 'typography_h1', label: 'Heading 1' },
    { key: 'typography_h2', label: 'Heading 2' },
    { key: 'typography_p', label: 'Paragraph' },
    { key: 'typography_title', label: 'Title' },
    { key: 'typography_price', label: 'Price' },
    { key: 'typography_label', label: 'Labels' },
    { key: 'typography_list', label: 'Lists' },
  ];

  const fontOptions = [
    { value: 'Inter', label: 'Inter' },
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Open Sans', label: 'Open Sans' },
    { value: 'Lato', label: 'Lato' },
  ];

  const fontWeightOptions = [
    { value: '400', label: 'Regular' },
    { value: '500', label: 'Medium' },
    { value: '600', label: 'Semibold' },
    { value: '700', label: 'Bold' },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Typography</h3>
      <p className="text-sm text-gray-500">Customize the appearance of different text elements</p>

      {typographyElements.map(({ key, label }) => (
        <div key={key} className="space-y-4 border p-4 rounded-lg">
          <h4 className="font-medium">{label}</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={settings[key]?.color || '#000000'}
                  onChange={(e) => onTypographyChange(key, 'color', e.target.value)}
                  className="w-12 h-12 p-1 cursor-pointer"
                />
                <Input
                  type="text"
                  value={settings[key]?.color || '#000000'}
                  onChange={(e) => onTypographyChange(key, 'color', e.target.value)}
                  className="flex-1"
                  placeholder="#000000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Size</Label>
              <Input
                type="text"
                value={settings[key]?.size || '1rem'}
                onChange={(e) => onTypographyChange(key, 'size', e.target.value)}
                placeholder="1rem"
              />
            </div>

            <div className="space-y-2">
              <Label>Font</Label>
              <Select
                value={settings[key]?.font || 'Inter'}
                onValueChange={(value) => onTypographyChange(key, 'font', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent>
                  {fontOptions.map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      {font.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Weight</Label>
              <Select
                value={settings[key]?.weight || '400'}
                onValueChange={(value) => onTypographyChange(key, 'weight', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select weight" />
                </SelectTrigger>
                <SelectContent>
                  {fontWeightOptions.map((weight) => (
                    <SelectItem key={weight.value} value={weight.value}>
                      {weight.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
