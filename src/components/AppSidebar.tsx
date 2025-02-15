import { Home, Settings, Edit2, FileDown } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { generatePropertyPDF } from '../utils/pdfGenerator';
import { PropertyData } from './PropertyForm';
import { supabase } from '@/integrations/supabase/client';

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

interface StoredPropertyData {
  id: string;
  title: string;
  address: string;
  images: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [savedBrochures, setSavedBrochures] = useState<StoredPropertyData[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSavedBrochures = async () => {
      const { data, error } = await supabase
        .from('brochures')
        .select('*');

      if (error) {
        console.error('Error fetching brochures:', error);
      } else {
        setSavedBrochures(data);
      }
    };

    fetchSavedBrochures();
  }, []);

  const handleEditBrochure = (brochure: StoredPropertyData) => {
    navigate('/', {
      state: {
        editBrochure: {
          ...brochure,
          features: brochure.features || []
        }
      }
    });
  };

  const handleGeneratePDF = async (brochure: StoredPropertyData) => {
    try {
      toast({
        title: "Genereren PDF",
        description: "Even geduld, uw brochure wordt gegenereerd...",
      });

      const propertyData: PropertyData = {
        ...brochure,
        images: [],
        features: brochure.features || [],
        floorplans: [],
        price: brochure.price || '',
        bedrooms: brochure.bedrooms || '',
        bathrooms: brochure.bathrooms || '',
        sqft: brochure.sqft || '',
        livingArea: brochure.livingArea || '',
        buildYear: brochure.buildYear || '',
        garages: brochure.garages || '',
        energyLabel: brochure.energyLabel || '',
        description: brochure.description || ''
      };

      // Generate PDF
      const pdfBlob = await generatePropertyPDF(propertyData);

      // Create download link
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${brochure.title.replace(/\s+/g, '-')}-brochure.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Brochure is succesvol gedownload",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Er is een fout opgetreden bij het genereren van de brochure",
        variant: "destructive",
      });
    }
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton onClick={() => navigate(item.url)}>
                    <item.icon className="w-4 h-4 mr-2" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel>Saved Brochures</SidebarGroupLabel>
          <ScrollArea className="h-[400px]">
            <div className="grid gap-4 p-4">
              {savedBrochures.map((brochure, index) => (
                <Card key={index} className="relative overflow-hidden">
                  {brochure.images.length > 0 && (
                    <div className="aspect-[4/3] relative">
                      <img
                        src={brochure.images[0]}
                        alt={brochure.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleEditBrochure(brochure)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleGeneratePDF(brochure)}
                        >
                          <FileDown className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
                        <p className="text-white text-sm font-medium truncate">
                          {brochure.title}
                        </p>
                        <p className="text-white/80 text-xs truncate">
                          {brochure.address}
                        </p>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </ScrollArea>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
