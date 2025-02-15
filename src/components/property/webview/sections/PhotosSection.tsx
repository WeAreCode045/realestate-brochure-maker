
import { WebViewSectionProps } from "../types";

export function PhotosSection({ property }: WebViewSectionProps) {
  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-4">Photos</h3>
      <div className="grid grid-cols-3 gap-4">
        {property.images?.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Property ${index + 1}`}
            className="w-full aspect-video object-cover rounded-lg cursor-pointer"
          />
        ))}
      </div>
    </div>
  );
}
