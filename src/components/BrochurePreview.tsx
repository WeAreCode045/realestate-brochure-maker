
import { Card } from "@/components/ui/card";
import { PropertyData } from "./PropertyForm";

interface BrochurePreviewProps {
  data: PropertyData;
}

export function BrochurePreview({ data }: BrochurePreviewProps) {
  return (
    <Card className="w-full max-w-2xl p-6 bg-white shadow-lg animate-fadeIn">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-estate-800">{data.title}</h2>
          <p className="text-xl text-estate-600 mt-2">{data.price}</p>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-estate-500">Slaapkamers</p>
            <p className="text-lg font-semibold">{data.bedrooms}</p>
          </div>
          <div>
            <p className="text-estate-500">Badkamers</p>
            <p className="text-lg font-semibold">{data.bathrooms}</p>
          </div>
          <div>
            <p className="text-estate-500">Oppervlakte</p>
            <p className="text-lg font-semibold">{data.sqft} m²</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-estate-700 mb-2">Locatie</h3>
          <p className="text-estate-600">{data.address}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-estate-700 mb-2">Beschrijving</h3>
          <p className="text-estate-600 whitespace-pre-wrap">{data.description}</p>
        </div>

        {data.images.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            {Array.from(data.images).map((image, index) => (
              <div key={index} className="aspect-video relative overflow-hidden rounded-lg">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Woning afbeelding ${index + 1}`}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
