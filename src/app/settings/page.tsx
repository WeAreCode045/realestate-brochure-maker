'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useSettingsStore } from '@/store/settingsStore';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function SettingsPage() {
  const { toast } = useToast();
  const { supabaseSettings, updateSupabaseSettings } = useSettingsStore();
  const [settings, setSettings] = useState(supabaseSettings);
  const [showKey, setShowKey] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate the credentials before saving
      const response = await fetch(settings.url + '/rest/v1/', {
        headers: {
          'apikey': settings.anonKey,
        },
      });

      if (!response.ok) {
        throw new Error('Invalid Supabase credentials');
      }

      updateSupabaseSettings(settings);
      
      toast({
        title: 'Settings saved',
        description: 'Supabase credentials have been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to validate Supabase credentials. Please check your settings.',
        variant: 'destructive',
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <Card className="max-w-2xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Supabase Configuration</h2>
            
            <div className="space-y-2">
              <Label htmlFor="url">Supabase URL</Label>
              <Input
                id="url"
                name="url"
                type="url"
                value={settings.url}
                onChange={handleChange}
                placeholder="https://your-project.supabase.co"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="anonKey">Anon Key</Label>
              <div className="relative">
                <Input
                  id="anonKey"
                  name="anonKey"
                  type={showKey ? 'text' : 'password'}
                  value={settings.anonKey}
                  onChange={handleChange}
                  placeholder="your-anon-key"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowKey(!showKey)}
                >
                  {showKey ? '🔒' : '👁️'}
                </button>
              </div>
            </div>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="submit" className="w-full">
                Save Settings
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  Changing Supabase credentials will affect all data operations.
                  Make sure you have entered the correct credentials.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleSubmit}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <div className="text-sm text-gray-500 mt-4">
            <p>
              You can find your Supabase credentials in your project&apos;s
              dashboard under Project Settings → API.
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
}
