
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BrochureData } from '@/types/brochures';

export function useProperties() {
  const [properties, setProperties] = useState<BrochureData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchProperties() {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        // Transform the data to match BrochureData type
        const transformedData = (data || []).map(item => ({
          ...item,
          features: Array.isArray(item.features) ? item.features : [],
          images: Array.isArray(item.images) ? item.images : [],
          floorplans: Array.isArray(item.floorplans) ? item.floorplans : [],
        }));

        setProperties(transformedData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch properties'));
        console.error('Error fetching properties:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, []);

  const refreshProperties = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const transformedData = (data || []).map(item => ({
        ...item,
        features: Array.isArray(item.features) ? item.features : [],
        images: Array.isArray(item.images) ? item.images : [],
        floorplans: Array.isArray(item.floorplans) ? item.floorplans : [],
      }));

      setProperties(transformedData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch properties'));
      console.error('Error refreshing properties:', err);
    } finally {
      setLoading(false);
    }
  };

  return { properties, loading, error, refreshProperties };
}
