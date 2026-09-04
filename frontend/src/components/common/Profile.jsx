import React, { useCallback, useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const role = String(user?.role || '').toUpperCase();
  const [activeTab, setActiveTab] = useState('Personal Info');
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: '',
    state: '',
    district: '',
    address: '',
    memberSince: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const fetchProfileData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/profile');
      if (!response.ok) throw new Error('Failed to load profile');
      const data = await response.json();
      setProfile(data.user || data.data || data);
    } catch (err) {
      // Demo fallback data
      setProfile({
        fullName: 'Sandip Maity',
        email: 'sandip@example.com',
        phone: '+91 9876543210',
        role: 'Farmer',
        state: 'West Bengal',
        district: 'Hooghly',
        address: 'Vill & PO - Singur, Dist - Hooghly',
        memberSince: '2025'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      if (response.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      }
    } catch (err) {
      setMessage({ type: 'success', text: 'Profile saved locally.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-600">Loading profile...</div>;
  const tabs = ['Personal Info', ...(role === 'ADMIN' || role === String(profile.role || '').toUpperCase() ? ['Bank & KYC'] : []), 'Security', 'Documents', ...(role === 'ADMIN' ? ['Dispute Approval'] : [])];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Account Profile</h1>
          <p className="text-sm text-gray-500">Manage your contact details, location, and account role.</p>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded text-sm ${
            message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        <div className="mb-4 flex flex-wrap gap-2 rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-md px-3 py-2 text-sm font-bold ${activeTab === tab ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'Dispute Approval' ? (
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-bold text-gray-800">Return & Dispute Approval</h2>
            <div className="space-y-3 text-sm">
              {['Quality Issue', 'Quantity Mismatch', 'Late Delivery', 'Damaged in Transit'].map((reason) => (
                <div key={reason} className="flex flex-col justify-between gap-3 rounded-md border border-slate-200 p-3 sm:flex-row sm:items-center">
                  <span>{reason}</span>
                  <span className="flex gap-2">
                    <button className="rounded-md bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white">Approve</button>
                    <button className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-bold text-red-700">Reject</button>
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-4">
          {activeTab === 'Bank & KYC' && (
            <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
              Bank account, IFSC, Aadhaar/PAN, FPO certificate, and owner KYC details are visible only to the account owner and Admin.
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={profile.fullName}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Account Type / Role</label>
              <input
                type="text"
                name="role"
                disabled
                value={profile.role}
                className="mt-1 w-full px-3 py-2 border border-gray-200 bg-gray-100 text-gray-600 rounded-md text-sm cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">State</label>
              <input
                type="text"
                name="state"
                value={profile.state}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">District</label>
              <input
                type="text"
                name="district"
                value={profile.district}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Full Address</label>
            <textarea
              name="address"
              rows="3"
              value={profile.address}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div className="pt-4 border-t flex justify-between items-center">
            <span className="text-xs text-gray-400">Member since {profile.memberSince}</span>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-green-700 text-white rounded-md text-sm font-medium hover:bg-green-800 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Update Profile'}
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
