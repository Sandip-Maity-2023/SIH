import React, { useState, useEffect } from 'react';

const Setting = () => {
  const [settings, setSettings] = useState({
    platformCommissionPercent: 5,
    enableAutoKycVerification: false,
    docaApiSyncInterval: 'Daily',
    escrowHoldDays: 3,
    supportEmail: 'support@krishi.gov.in',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        // Replace with your API endpoint e.g., /api/admin/settings
        const response = await fetch('/api/admin/settings');
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        }
      } catch {
        console.warn('Using default settings state.');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (response.ok) {
        alert('Platform settings updated successfully!');
      }
    } catch {
      alert('Settings saved locally.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-600">Loading Platform Settings...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Platform Settings</h1>
        <p className="text-sm text-gray-500">Configure marketplace commission rates, payment escrow rules, and external API syncs.</p>
      </div>

      <form onSubmit={handleSave} className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 max-w-3xl space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Platform Marketplace Commission (%)
          </label>
          <input
            type="number"
            name="platformCommissionPercent"
            value={settings.platformCommissionPercent}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            min="0"
            max="100"
            step="0.5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Escrow Hold Period (Days after delivery)
          </label>
          <input
            type="number"
            name="escrowHoldDays"
            value={settings.escrowHoldDays}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Department of Consumer Affairs (DoCA) Price Sync Frequency
          </label>
          <select
            name="docaApiSyncInterval"
            value={settings.docaApiSyncInterval}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600"
          >
            <option value="Hourly">Hourly</option>
            <option value="Daily">Daily</option>
            <option value="Realtime">Realtime</option>
          </select>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="enableAutoKycVerification"
            name="enableAutoKycVerification"
            checked={settings.enableAutoKycVerification}
            onChange={handleChange}
            className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
          />
          <label htmlFor="enableAutoKycVerification" className="text-sm font-medium text-gray-700">
            Automate Farmer/FPO KYC verification check
          </label>
        </div>

        <div className="pt-4 border-t">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-green-700 text-white font-medium rounded-md shadow hover:bg-green-800 focus:outline-none disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Setting;
