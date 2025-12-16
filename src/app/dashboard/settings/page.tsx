'use client';

import { useState } from 'react';
import { Save, Upload, RefreshCw, Image } from 'lucide-react';
import { Button, Card, Input, Textarea, Checkbox } from '@/components/ui';
import { mockSettings } from '@/lib/mock-data';
import type { SiteSettings } from '@/lib/types';
import { useToast } from '@/lib/context';

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(mockSettings);
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();

  const handleChange = (field: keyof SiteSettings, value: unknown) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    addToast({ type: 'success', title: 'Settings saved successfully' });
  };

  const handleReset = () => {
    setSettings(mockSettings);
    addToast({ type: 'info', title: 'Settings reset to defaults' });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">Configure site settings and preferences</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RefreshCw className="w-4 h-4" />
            Reset
          </Button>
          <Button onClick={handleSave} loading={saving}>
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* General Settings */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">General Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Site Name"
              value={settings.siteName}
              onChange={(e) => handleChange('siteName', e.target.value)}
              placeholder="Enter site name"
            />
          </div>
          <div className="md:col-span-2">
            <Textarea
              label="Tagline"
              value={settings.tagline}
              onChange={(e) => handleChange('tagline', e.target.value)}
              placeholder="A short description of your site"
              rows={2}
            />
          </div>
          <div className="md:col-span-2">
            <Textarea
              label="Description"
              value={settings.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Full site description for SEO"
              rows={3}
            />
          </div>
        </div>
      </Card>

      {/* Contact Information */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Phone"
            value={settings.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+880 1234-567890"
          />
          <Input
            label="Email"
            type="email"
            value={settings.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="contact@example.com"
          />
          <div className="md:col-span-2">
            <Textarea
              label="Address"
              value={settings.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Full address"
              rows={2}
            />
          </div>
        </div>
      </Card>

      {/* Social Media */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Social Media</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Facebook"
            value={settings.socialLinks?.facebook || ''}
            onChange={(e) =>
              handleChange('socialLinks', { ...settings.socialLinks, facebook: e.target.value })
            }
            placeholder="https://facebook.com/yourpage"
          />
          <Input
            label="YouTube"
            value={settings.socialLinks?.youtube || ''}
            onChange={(e) =>
              handleChange('socialLinks', { ...settings.socialLinks, youtube: e.target.value })
            }
            placeholder="https://youtube.com/@channel"
          />
        </div>
      </Card>

      {/* Prayer Times (Placeholder) */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Prayer Times</h2>
          <Badge variant="info">Manual Entry</Badge>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((prayer) => (
            <Input
              key={prayer}
              label={prayer}
              value={settings.prayerTimes?.[prayer.toLowerCase() as keyof typeof settings.prayerTimes] || ''}
              onChange={(e) =>
                handleChange('prayerTimes', {
                  ...settings.prayerTimes,
                  [prayer.toLowerCase()]: e.target.value,
                })
              }
              placeholder="00:00"
            />
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-3">
          Enter prayer times in 12-hour format (e.g., 5:30 AM, 1:15 PM)
        </p>
      </Card>

      {/* Branding */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Branding</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
              {settings.logo ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={settings.logo} alt="Logo" className="max-h-24 mx-auto" />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleChange('logo', '')}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <>
                  <Image className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 mb-2">Upload your logo</p>
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4" />
                    Choose File
                  </Button>
                </>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Favicon</label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
              {settings.favicon ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={settings.favicon} alt="Favicon" className="max-h-12 mx-auto" />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleChange('favicon', '')}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <>
                  <Image className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 mb-2">Upload favicon (32x32)</p>
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4" />
                    Choose File
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Display Preferences */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Display Preferences</h2>
        <div className="space-y-4">
          <Checkbox
            label="Show anonymous contributions"
            description="Display contributions marked as anonymous in the public list"
            checked={settings.showAnonymousDonors ?? false}
            onChange={(checked) => handleChange('showAnonymousDonors', checked)}
          />
          <Checkbox
            label="Enable gallery"
            description="Show the gallery section on the public site"
            checked={settings.enableGallery ?? true}
            onChange={(checked) => handleChange('enableGallery', checked)}
          />
          <Checkbox
            label="Maintenance mode"
            description="Put the public site in maintenance mode"
            checked={settings.maintenanceMode ?? false}
            onChange={(checked) => handleChange('maintenanceMode', checked)}
          />
        </div>
      </Card>

      {/* Bottom Actions */}
      <div className="flex justify-end gap-3 pb-8">
        <Button variant="outline" onClick={handleReset}>
          Reset to Defaults
        </Button>
        <Button onClick={handleSave} loading={saving}>
          <Save className="w-4 h-4" />
          Save All Changes
        </Button>
      </div>
    </div>
  );
}

function Badge({ variant, children }: { variant: string; children: React.ReactNode }) {
  const colors = {
    info: 'bg-blue-100 text-blue-700',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[variant as keyof typeof colors] || colors.info}`}>
      {children}
    </span>
  );
}
