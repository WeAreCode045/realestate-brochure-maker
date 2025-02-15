
import { useState, useEffect } from "react";
import { AgencySettings, Typography } from "@/types/agency";
import { useToast } from "@/components/ui/use-toast";
import { fetchAgencySettings } from "@/utils/fetchAgencySettings";
import { defaultAgencySettings } from "@/utils/defaultAgencySettings";
import { agencySettingsService } from "@/services/agencySettingsService";
import { useLogoUpload } from "./useLogoUpload";
import { Json } from "@/integrations/supabase/types";

export const useAgencySettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<AgencySettings>(defaultAgencySettings);
  const { logoPreview, setLogoPreview, handleLogoUpload } = useLogoUpload();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let logoUrl = settings.logoUrl;

      if (logoPreview && !logoPreview.startsWith('http')) {
        const file = await (await fetch(logoPreview)).blob();
        const filename = `logo-${Date.now()}.png`;
        logoUrl = await agencySettingsService.uploadLogo(file, filename);
      }

      const typographyToJson = (typography: Typography): Json => ({
        color: typography.color,
        size: typography.size,
        weight: typography.weight,
        font: typography.font
      });

      const updateData = {
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
        typography_h1: typographyToJson(settings.typography_h1),
        typography_h2: typographyToJson(settings.typography_h2),
        typography_p: typographyToJson(settings.typography_p),
        typography_title: typographyToJson(settings.typography_title),
        typography_price: typographyToJson(settings.typography_price),
        typography_label: typographyToJson(settings.typography_label),
        typography_list: typographyToJson(settings.typography_list)
      };

      if (settings.id) {
        await agencySettingsService.updateSettings(settings.id, settings);
      } else {
        await agencySettingsService.createSettings(updateData);
      }

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

  const handleTypographyChange = (element: string, field: keyof Typography, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [element]: {
        ...prev[element],
        [field]: value,
      },
    }));
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
