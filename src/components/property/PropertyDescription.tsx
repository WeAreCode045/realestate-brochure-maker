
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface PropertyDescriptionProps {
  description: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function PropertyDescription({
  description,
  onChange,
}: PropertyDescriptionProps) {
  return (
    <div>
      <Label htmlFor="description">Beschrijving</Label>
      <Textarea
        id="description"
        name="description"
        value={description}
        onChange={onChange}
        className="mt-1"
        required
      />
    </div>
  );
}
