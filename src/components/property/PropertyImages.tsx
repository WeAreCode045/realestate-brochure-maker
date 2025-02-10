
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useProperties } from "@/hooks/useProperties";

interface PropertyImagesProps {
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFloorplanUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PropertyImages({
  onImageUpload,
  onFloorplanUpload,
}: PropertyImagesProps) {
  const { properties } = useProperties();

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="images">Foto's (Max 20)</Label>
        <Input
          id="images"
          name="images"
          type="file"
          onChange={onImageUpload}
          className="mt-1"
          accept="image/*"
          multiple
          required
        />
      </div>

      <div>
        <Label htmlFor="floorplans">Plattegronden (Max 10)</Label>
        <Input
          id="floorplans"
          name="floorplans"
          type="file"
          onChange={onFloorplanUpload}
          className="mt-1"
          accept="image/*"
          multiple
          required
        />
      </div>
    </div>
  );
}
