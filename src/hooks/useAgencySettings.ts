
import { useState, useEffect } from "react";
import { AgencySettings, Typography } from "@/types/agency";
import { useToast } from "@/components/ui/use-toast";
import { fetchAgencySettings } from "@/utils/fetchAgencySettings";
import { defaultAgencySettings } from "@/utils/defaultAgencySettings";
import { agencySettingsService } from "@/services/agencySettingsService";
import { useLogoUpload } from "./useLogoUpload";

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

      const updateData = {
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
        typography_h1: settings.typography_h1 as Record<string, unknown>,
        typography_h2: settings.typography_h2 as Record<string, unknown>,
        typography_p: settings.typography_p as Record<string, unknown>,
        typography_title: settings.typography_title as Record<string, unknown>,
        typography_price: settings.typography_price as Record<string, unknown>,
        typography_label: settings.typography_label as Record<string, unknown>,
        typography_list: settings.typography_list as Record<string, unknown>,
      };

      if (settings.id) {
        await agencySettingsService.updateSettings(settings.id, updateData);
      } else {
        await agencySettingsService.createSettings({ ...updateData, name: settings.name });
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
