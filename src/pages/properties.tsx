
import { useProperties } from '@/hooks/useProperties';
import { PropertyData, PropertyForm } from '@/components/PropertyForm';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { getImageUrl } from '@/utils/supabase-utils';

export default function PropertiesPage() {
    const { properties, loading, error, refreshProperties } = useProperties();

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <div>Error loading properties: {error.message}</div>;
    }

    const handlePropertySubmit = async (data: PropertyData) => {
        await refreshProperties();
    };

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">Properties</h1>

            <PropertyForm onSubmit={handlePropertySubmit} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {properties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                ))}
            </div>
        </div>
    );
}

function PropertyCard({ property }: { property: PropertyData }) {
    return (
        <div className="border rounded-lg p-4 shadow-sm">
            {property.images && property.images[0] && (
                <img
                    src={typeof property.images[0] === 'string' ? property.images[0] : URL.createObjectURL(property.images[0])}
                    alt={property.title}
                    className="rounded-lg object-cover w-full h-48 mb-4"
                />
            )}
            <h2 className="text-xl font-semibold">{property.title}</h2>
            <p className="text-gray-600">{property.address}</p>
            <p className="text-lg font-bold mt-2">{property.price}</p>
            <div className="flex gap-4 mt-2 text-sm text-gray-500">
                <span>{property.bedrooms} beds</span>
                <span>{property.bathrooms} baths</span>
                <span>{property.sqft} sqft</span>
            </div>
        </div>
    );
}
