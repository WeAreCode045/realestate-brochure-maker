
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface AgencySettings {
  name: string;
  agentName: string;
  email: string;
  phone: string;
  address: string;
  primaryColor: string;
  secondaryColor: string;
}

const Settings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<AgencySettings>(() => {
    const savedSettings = localStorage.getItem("agencySettings");
    return savedSettings
      ? JSON.parse(savedSettings)
      : {
          name: "",
          agentName: "",
          email: "",
          phone: "",
          address: "",
          primaryColor: "#40497A",
          secondaryColor: "#E2E8F0",
        };
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("agencySettings", JSON.stringify(settings));
    toast({
      title: "Success",
      description: "Settings saved successfully",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Agency Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="space-y-2">
          <Label htmlFor="name">Agency Name</Label>
          <Input
            id="name"
            name="name"
            value={settings.name}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="agentName">Agent Name</Label>
          <Input
            id="agentName"
            name="agentName"
            value={settings.agentName}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={settings.email}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            value={settings.phone}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            name="address"
            value={settings.address}
            onChange={handleChange}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="primaryColor">Primary Color</Label>
            <div className="flex gap-2">
              <Input
                id="primaryColor"
                name="primaryColor"
                type="color"
                value={settings.primaryColor}
                onChange={handleChange}
                className="w-16 h-10 p-1"
              />
              <Input
                value={settings.primaryColor}
                onChange={handleChange}
                name="primaryColor"
                className="flex-1"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="secondaryColor">Secondary Color</Label>
            <div className="flex gap-2">
              <Input
                id="secondaryColor"
                name="secondaryColor"
                type="color"
                value={settings.secondaryColor}
                onChange={handleChange}
                className="w-16 h-10 p-1"
              />
              <Input
                value={settings.secondaryColor}
                onChange={handleChange}
                name="secondaryColor"
                className="flex-1"
              />
            </div>
          </div>
        </div>
        <Button type="submit">Save Settings</Button>
      </form>
    </div>
  );
};

export default Settings;
