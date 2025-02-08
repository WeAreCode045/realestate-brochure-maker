
import { Card } from "@/components/ui/card";
import { PropertyData } from "./PropertyForm";
import { Home, Car, Calendar, Ruler, Zap } from "lucide-react";

interface BrochurePreviewProps {
  data: PropertyData;
}

export function BrochurePreview({ data }: BrochurePreviewProps) {
  const getEnergyLabelColor = (label: string) => {
    const colors: { [key: string]: string } = {
      'A+++': 'bg-green-600',
      'A++': 'bg-green-500',
      'A+': 'bg-green-400',
      'A': 'bg-green-300',
      'B': 'bg-lime-400',
      'C': 'bg-yellow-400',
      'D': 'bg-orange-400',
      'E': 'bg-orange-500',
      'F': 'bg-red-400',
      'G': 'bg-red-500',
    };
    return colors[label] || 'bg-gray-400';
  };

  return (
    <Card className="w-full max-w-2xl p-6 bg-white shadow-lg animate-fadeIn">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-estate-800">{data.title}</h2>
          <p className="text-xl text-estate-600 mt-2">{data.price}</p>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="flex flex-col items-center">
            <Home className="w-6 h-6 text-estate-600 mb-2" />
            <p className="text-estate-500">Woonoppervlak</p>
            <p className="text-lg font-semibold">{data.livingArea} m²</p>
          </div>
          <div className="flex flex-col items-center">
            <Ruler className="w-6 h-6 text-estate-600 mb-2" />
            <p className="text-estate-500">Perceel</p>
            <p className="text-lg font-semibold">{data.sqft} m²</p>
          </div>
          <div className="flex flex-col items-center">
            <Calendar className="w-6 h-6 text-estate-600 mb-2" />
            <p className="text-estate-500">Bouwjaar</p>
            <p className="text-lg font-semibold">{data.buildYear}</p>
          </div>
          <div className="flex flex-col items-center">
            <Car className="w-6 h-6 text-estate-600 mb-2" />
            <p className="text-estate-500">Garages</p>
            <p className="text-lg font-semibold">{data.garages}</p>
          </div>
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
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              <p className="text-estate-500">Energielabel</p>
            </div>
            <div className={`mt-1 px-3 py-1 rounded-full text-white font-semibold ${getEnergyLabelColor(data.energyLabel)}`}>
              {data.energyLabel}
            </div>
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

        {data.features.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-estate-700 mb-2">Kenmerken</h3>
            <ul className="list-disc list-inside space-y-1">
              {data.features.map((feature, index) => (
                <li key={feature.id} className="text-estate-600">{feature.description}</li>
              ))}
            </ul>
          </div>
        )}

        {data.images.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-estate-700 mb-2">Foto's</h3>
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
          </div>
        )}

        {data.floorplans.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-estate-700 mb-2">Plattegronden</h3>
            <div className="grid grid-cols-2 gap-4">
              {Array.from(data.floorplans).map((floorplan, index) => (
                <div key={index} className="aspect-video relative overflow-hidden rounded-lg">
                  <img
                    src={URL.createObjectURL(floorplan)}
                    alt={`Plattegrond ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
