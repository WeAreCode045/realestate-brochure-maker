
import { WebViewSectionProps } from "../types";

export function FloorplansSection({ property }: WebViewSectionProps) {
  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-4">Floorplans</h3>
      <div className="grid grid-cols-2 gap-4">
        {property.floorplans?.map((plan, index) => (
          <img
            key={index}
            src={plan}
            alt={`Floorplan ${index + 1}`}
            className="w-full aspect-video object-cover rounded-lg cursor-pointer"
          />
        ))}
      </div>
    </div>
  );
}
