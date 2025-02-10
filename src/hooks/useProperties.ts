import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { PropertyData } from '@/components/PropertyForm'; // Adjust the import path

export function useProperties() {
  const [properties, setProperties] = useState<PropertyData[]>([]);
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
        setProperties(data || []);
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
      setProperties(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch properties'));
      console.error('Error refreshing properties:', err);
    } finally {
      setLoading(false);
    }
  };

  return { properties, loading, error, refreshProperties };
}
