import { Card } from "@/components/ui/card";
import { PropertyData } from "./PropertyForm";
import { Home, Car, Calendar, Ruler, Zap } from "lucide-react";
import { useEffect, useState } from "react";

interface BrochurePreviewProps {
  data: PropertyData;
}

export function BrochurePreview({ data }: BrochurePreviewProps) {
  const [agencySettings, setAgencySettings] = useState<any>(null);
  const [agencyLogo, setAgencyLogo] = useState<string>("");

  useEffect(() => {
    const settings = localStorage.getItem("agencySettings");
    const logo = localStorage.getItem("agencyLogo");
    if (settings) {
      setAgencySettings(JSON.parse(settings));
    }
    if (logo) {
      setAgencyLogo(logo);
    }
  }, []);

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
      <div className="space-y-8">
        {data.images.length > 0 && (
          <div className="aspect-[4/3] w-full overflow-hidden rounded-lg mb-6">
            <img
              src={URL.createObjectURL(data.images[0])}
              alt={data.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
              <h2 className="text-2xl font-semibold">{data.title}</h2>
              <p className="text-xl">{data.price}</p>
            </div>
          </div>
        )}

        <div className="text-center border-b pb-6">
          <h2 className="text-3xl font-semibold text-estate-800 mb-2">{data.title}</h2>
          <p className="text-2xl text-estate-600 font-medium">{data.price}</p>
        </div>

        <div className="grid grid-cols-4 gap-6 bg-estate-50 p-6 rounded-lg">
          <div className="flex flex-col items-center">
            <Home className="w-8 h-8 text-estate-600 mb-2" />
            <p className="text-estate-500 text-sm">Woonoppervlak</p>
            <p className="text-lg font-semibold">{data.livingArea} m²</p>
          </div>
          <div className="flex flex-col items-center">
            <Ruler className="w-8 h-8 text-estate-600 mb-2" />
            <p className="text-estate-500 text-sm">Perceel</p>
            <p className="text-lg font-semibold">{data.sqft} m²</p>
          </div>
          <div className="flex flex-col items-center">
            <Calendar className="w-8 h-8 text-estate-600 mb-2" />
            <p className="text-estate-500 text-sm">Bouwjaar</p>
            <p className="text-lg font-semibold">{data.buildYear}</p>
          </div>
          <div className="flex flex-col items-center">
            <Car className="w-8 h-8 text-estate-600 mb-2" />
            <p className="text-estate-500 text-sm">Garages</p>
            <p className="text-lg font-semibold">{data.garages}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 bg-estate-50 p-6 rounded-lg">
          <div className="text-center">
            <p className="text-estate-500 text-sm">Slaapkamers</p>
            <p className="text-xl font-semibold">{data.bedrooms}</p>
          </div>
          <div className="text-center">
            <p className="text-estate-500 text-sm">Badkamers</p>
            <p className="text-xl font-semibold">{data.bathrooms}</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              <p className="text-estate-500 text-sm">Energielabel</p>
            </div>
            <div className={`mt-2 px-4 py-1 rounded-full text-white font-semibold ${getEnergyLabelColor(data.energyLabel)}`}>
              {data.energyLabel}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-estate-700">Locatie</h3>
          <p className="text-estate-600">{data.address}</p>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-estate-700">Beschrijving</h3>
          <p className="text-estate-600 whitespace-pre-wrap leading-relaxed">{data.description}</p>
        </div>

        {data.features.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-estate-700">Kenmerken</h3>
            <ul className="grid grid-cols-2 gap-2">
              {data.features.map((feature, index) => (
                <li key={feature.id} className="text-estate-600 flex items-center">
                  <span className="w-2 h-2 bg-estate-400 rounded-full mr-2"></span>
                  {feature.description}
                </li>
              ))}
            </ul>
          </div>
        )}

        {data.floorplans.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-estate-700">Plattegronden</h3>
            <div className="grid grid-cols-2 gap-4">
              {Array.from(data.floorplans).map((floorplan, index) => (
                <div key={index} className="relative pb-[75%] overflow-hidden rounded-lg">
                  <img
                    src={URL.createObjectURL(floorplan)}
                    alt={`Plattegrond ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              {agencySettings && (
                <>
                  <p className="font-semibold">{agencySettings.name}</p>
                  <p>{agencySettings.address}</p>
                  <p>{agencySettings.phone}</p>
                  <p>{agencySettings.email}</p>
                </>
              )}
            </div>
            {agencyLogo && (
              <div className="w-32">
                <img
                  src={agencyLogo}
                  alt="Agency Logo"
                  className="h-12 object-contain"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
