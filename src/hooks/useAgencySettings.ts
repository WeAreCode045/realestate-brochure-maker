
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AgencySettings, TypographySettings } from "@/types/agency";
import { useToast } from "@/components/ui/use-toast";
import { fetchAgencySettings } from "@/utils/fetchAgencySettings";

export const useAgencySettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<AgencySettings>({
    name: "",
    agentName: "",
    email: "",
    phone: "",
    address: "",
    primaryColor: "#40497A",
    secondaryColor: "#E2E8F0",
    iconBuildYear: "calendar",
    iconBedrooms: "bed",
    iconBathrooms: "bath",
    iconGarages: "car",
    iconEnergyClass: "zap",
    iconSqft: "ruler",
    iconLivingSpace: "home",
    googleMapsApiKey: "",
    xmlImportUrl: "",
    typography_h1: {
      color: "#1E293B",
      size: "2.25rem",
      weight: "700",
      font: "Inter"
    },
    typography_h2: {
      color: "#334155",
      size: "1.875rem",
      weight: "600",
      font: "Inter"
    },
    typography_p: {
      color: "#64748B",
      size: "1rem",
      weight: "400",
      font: "Inter"
    },
    typography_title: {
      color: "#1E293B",
      size: "1.5rem",
      weight: "600",
      font: "Inter"
    },
    typography_price: {
      color: "#0F172A",
      size: "1.25rem",
      weight: "700",
      font: "Inter"
    },
    typography_label: {
      color: "#475569",
      size: "0.875rem",
      weight: "500",
      font: "Inter"
    },
    typography_list: {
      color: "#64748B",
      size: "1rem",
      weight: "400",
      font: "Inter"
    }
  });
  const [logoPreview, setLogoPreview] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let logoUrl = settings.logoUrl;

      if (logoPreview && !logoPreview.startsWith('http')) {
        const file = await (await fetch(logoPreview)).blob();
        const filename = `logo-${Date.now()}.png`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('agency_files')
          .upload(filename, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('agency_files')
          .getPublicUrl(filename);

        logoUrl = publicUrl;
      }

      const { error } = settings.id 
        ? await supabase
            .from('agency_settings')
            .update({
              name: settings.name,
              agent_name: settings.agentName,
              email: settings.email,
              phone: settings.phone,
              address: settings.address,
              primary_color: settings.primaryColor,
              secondary_color: settings.secondaryColor,
              logo_url: logoUrl,
              icon_build_year: settings.iconBuildYear,
              icon_bedrooms: settings.iconBedrooms,
              icon_bathrooms: settings.iconBathrooms,
              icon_garages: settings.iconGarages,
              icon_energy_class: settings.iconEnergyClass,
              icon_sqft: settings.iconSqft,
              icon_living_space: settings.iconLivingSpace,
              google_maps_api_key: settings.googleMapsApiKey,
              xml_import_url: settings.xmlImportUrl,
              typography_h1: settings.typography_h1,
              typography_h2: settings.typography_h2,
              typography_p: settings.typography_p,
              typography_title: settings.typography_title,
              typography_price: settings.typography_price,
              typography_label: settings.typography_label,
              typography_list: settings.typography_list,
            })
            .eq('id', settings.id)
        : await supabase
            .from('agency_settings')
            .insert({
              name: settings.name,
              agent_name: settings.agentName,
              email: settings.email,
              phone: settings.phone,
              address: settings.address,
              primary_color: settings.primaryColor,
              secondary_color: settings.secondaryColor,
              logo_url: logoUrl,
              icon_build_year: settings.iconBuildYear,
              icon_bedrooms: settings.iconBedrooms,
              icon_bathrooms: settings.iconBathrooms,
              icon_garages: settings.iconGarages,
              icon_energy_class: settings.iconEnergyClass,
              icon_sqft: settings.iconSqft,
              icon_living_space: settings.iconLivingSpace,
              google_maps_api_key: settings.googleMapsApiKey,
              xml_import_url: settings.xmlImportUrl,
              typography_h1: settings.typography_h1,
              typography_h2: settings.typography_h2,
              typography_p: settings.typography_p,
              typography_title: settings.typography_title,
              typography_price: settings.typography_price,
              typography_label: settings.typography_label,
              typography_list: settings.typography_list,
            });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Settings saved successfully",
      });

      const newSettings = await fetchAgencySettings();
      if (newSettings) {
        setSettings(newSettings);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTypographyChange = (element: string, field: keyof TypographySettings, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [element]: {
        ...prev[element],
        [field]: value,
      },
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const loadSettings = async () => {
      const data = await fetchAgencySettings();
      if (data) {
        setSettings(data);
        if (data.logoUrl) {
          setLogoPreview(data.logoUrl);
        }
      }
    };
    loadSettings();
  }, []);

  return {
    settings,
    logoPreview,
    isLoading,
    handleSubmit,
    handleChange,
    handleSelectChange,
    handleTypographyChange,
    handleLogoUpload,
  };
};
