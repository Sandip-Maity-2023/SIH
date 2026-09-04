import React, { useCallback, useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import API, { uploadFile } from '../../services/api';
import { compressImage } from '../../utils/imageCompressor';

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const role = String(user?.role || '').toUpperCase();
  const [activeTab, setActiveTab] = useState('Personal Info');
  const [profile, setProfile] = useState({
    name: user?.name || user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || user?.phoneNumber || '',
    role: user?.role || 'FARMER',
    avatarUrl: user?.avatarUrl || '',
    languagePreference: user?.languagePreference || 'hi',
    address: user?.location?.address?.villageOrCity || '',
    district: user?.location?.address?.district || '',
    state: user?.location?.address?.state || '',
    pincode: user?.location?.address?.pincode || '',
    bankDetails: {
      bankName: user?.bankDetails?.bankName || '',
      accountNumber: user?.bankDetails?.accountNumber || '',
      ifscCode: user?.bankDetails?.ifscCode || '',
      upiId: user?.bankDetails?.upiId || '',
    },
    documents: user?.documents || [],
    kycVerified: user?.kycVerified || false,
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // New document form state
  const [newDoc, setNewDoc] = useState({ documentType: 'Aadhaar Card', documentName: '', documentUrl: '' });

  const fetchProfileData = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/auth/profile');
      const u = data.user || data.data || data;
      setProfile((prev) => ({
        ...prev,
        name: u.name || u.fullName || prev.name,
        email: u.email || prev.email,
        phone: u.phone || u.phoneNumber || prev.phone,
        role: u.role || prev.role,
        avatarUrl: u.avatarUrl || prev.avatarUrl,
        languagePreference: u.languagePreference || prev.languagePreference,
        address: u.location?.address?.villageOrCity || prev.address,
        district: u.location?.address?.district || prev.district,
        state: u.location?.address?.state || prev.state,
        pincode: u.location?.address?.pincode || prev.pincode,
        bankDetails: u.bankDetails || prev.bankDetails,
        documents: u.documents || prev.documents,
        kycVerified: u.kycVerified ?? prev.kycVerified,
      }));
    } catch {
      console.warn('Could not fetch latest database profile');
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

  const handleBankChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      bankDetails: { ...prev.bankDetails, [name]: value },
    }));
  };

  const handleAvatarFile = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const uploadedUrl = await uploadFile(file);
        setProfile((prev) => ({ ...prev, avatarUrl: uploadedUrl }));
      } catch {
        const compressedUrl = await compressImage(file);
        setProfile((prev) => ({ ...prev, avatarUrl: compressedUrl }));
      }
    }
  };

  const handleDocFile = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const uploadedUrl = await uploadFile(file);
        setNewDoc((prev) => ({
          ...prev,
          documentName: file.name,
          documentUrl: uploadedUrl,
        }));
      } catch {
        const compressedUrl = await compressImage(file);
        setNewDoc((prev) => ({
          ...prev,
          documentName: file.name,
          documentUrl: compressedUrl,
        }));
      }
    }
  };

  const handleAddDocument = (e) => {
    e.preventDefault();
    if (!newDoc.documentUrl && !newDoc.documentName) return;

    const docItem = {
      documentType: newDoc.documentType,
      documentName: newDoc.documentName || `${newDoc.documentType}.pdf`,
      documentUrl: newDoc.documentUrl,
      uploadedAt: new Date().toISOString(),
    };

    setProfile((prev) => ({
      ...prev,
      documents: [...prev.documents, docItem],
    }));
    setNewDoc({ documentType: 'Aadhaar Card', documentName: '', documentUrl: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const payload = {
      name: profile.name,
      fullName: profile.name,
      email: profile.email,
      phone: profile.phone,
      languagePreference: profile.languagePreference,
      avatarUrl: profile.avatarUrl,
      bankDetails: profile.bankDetails,
      documents: profile.documents,
      location: {
        type: 'Point',
        coordinates: [88.2325, 22.8122],
        address: {
          villageOrCity: profile.address,
          district: profile.district,
          state: profile.state,
          pincode: profile.pincode,
        },
      },
    };

    try {
      const res = await API.put('/auth/profile', payload);
      const updatedUser = res.data?.user || res.data?.data || res.data;
      if (updateUser && updatedUser) {
        updateUser(updatedUser);
      }
      setMessage({ type: 'success', text: 'Profile & account details saved to MongoDB database successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Database update failed. Please check network connection.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-600">Loading profile...</div>;

  const tabs = ['Personal Info', 'Bank & KYC', 'Documents', 'Security'];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Account Profile</h1>
            <p className="text-sm text-gray-500">Manage contact information, banking details, documents, and credentials.</p>
          </div>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-xs rounded-full w-fit">
            Role: {role || 'USER'}
          </span>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded text-sm ${
            message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        <div className="mb-6 flex flex-wrap gap-2 rounded-lg border border-gray-200 bg-white p-2 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-md px-4 py-2 text-xs font-black transition ${
                activeTab === tab ? 'bg-emerald-800 text-white shadow-sm' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-6">
          {/* TAB 1: PERSONAL INFO */}
          {activeTab === 'Personal Info' && (
            <div className="space-y-5">
              {/* Profile Photo Section */}
              <div className="flex flex-col sm:flex-row items-center gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="relative">
                  {profile.avatarUrl ? (
                    <img src={profile.avatarUrl} alt="Profile Avatar" className="h-20 w-20 rounded-full object-cover border-2 border-emerald-600 shadow-md" />
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-emerald-700 text-white text-2xl font-black flex items-center justify-center border-2 border-emerald-600 shadow-md">
                      {(profile.name || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Profile Picture</span>
                  <div className="flex flex-wrap items-center gap-3">
                    <input type="file" accept="image/*" onChange={handleAvatarFile} className="text-xs text-slate-600" />
                    <input
                      type="text"
                      name="avatarUrl"
                      placeholder="Or paste avatar URL"
                      value={profile.avatarUrl}
                      onChange={handleChange}
                      className="h-8 flex-1 min-w-[200px] rounded-md border border-slate-300 bg-white px-2 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700">Role</label>
                  <input
                    type="text"
                    disabled
                    value={profile.role}
                    className="mt-1 w-full px-3 py-2 border border-gray-200 bg-gray-100 text-gray-600 rounded-md text-sm font-semibold cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700">Village / City / Address</label>
                  <input
                    type="text"
                    name="address"
                    value={profile.address}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700">District</label>
                  <input
                    type="text"
                    name="district"
                    value={profile.district}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700">State</label>
                  <input
                    type="text"
                    name="state"
                    value={profile.state}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BANK & KYC SECURITY */}
          {activeTab === 'Bank & KYC' && (
            <div className="space-y-5">
              <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 flex justify-between items-center">
                <div>
                  <strong className="block text-emerald-950">Direct Farmer Payout Ledger</strong>
                  Bank details & UPI IDs are secured for escrow settlement upon delivery verification.
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${profile.kycVerified ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'}`}>
                  {profile.kycVerified ? '✓ KYC Verified' : '⏳ Verification Pending'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700">Bank Name</label>
                  <input
                    type="text"
                    name="bankName"
                    value={profile.bankDetails.bankName}
                    onChange={handleBankChange}
                    placeholder="e.g. State Bank of India"
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700">Account Number</label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={profile.bankDetails.accountNumber}
                    onChange={handleBankChange}
                    placeholder="11-digit bank account number"
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700">IFSC Code</label>
                  <input
                    type="text"
                    name="ifscCode"
                    value={profile.bankDetails.ifscCode}
                    onChange={handleBankChange}
                    placeholder="SBIN0001234"
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700">UPI VPA Address</label>
                  <input
                    type="text"
                    name="upiId"
                    value={profile.bankDetails.upiId}
                    onChange={handleBankChange}
                    placeholder="farmername@upi / phone@paytm"
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DOCUMENTS */}
          {activeTab === 'Documents' && (
            <div className="space-y-6">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">Upload New Verification Document</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600">Document Type</label>
                    <select
                      value={newDoc.documentType}
                      onChange={(e) => setNewDoc((prev) => ({ ...prev, documentType: e.target.value }))}
                      className="mt-1 h-9 w-full rounded border border-slate-300 bg-white px-2 text-xs"
                    >
                      <option value="Aadhaar Card">Aadhaar Card</option>
                      <option value="PAN Card">PAN Card</option>
                      <option value="Land Ownership Record">Land Ownership Record</option>
                      <option value="FPO Certificate">FPO Registration Certificate</option>
                      <option value="Driver License">Driver License</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600">Choose File</label>
                    <input type="file" onChange={handleDocFile} className="mt-1 text-xs text-slate-600" />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={handleAddDocument}
                      className="h-9 w-full rounded bg-emerald-700 text-xs font-bold text-white hover:bg-emerald-800"
                    >
                      + Save Document
                    </button>
                  </div>
                </div>
              </div>

              {/* Uploaded Documents List */}
              <div>
                <h3 className="text-sm font-bold text-gray-800 mb-3">Stored Account Documents ({profile.documents.length})</h3>
                {profile.documents.length === 0 ? (
                  <div className="text-xs text-gray-500 italic p-4 border border-dashed rounded text-center">
                    No documents uploaded yet. Upload Aadhaar or Land Records to verify your account.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {profile.documents.map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border rounded-md bg-white text-xs">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-emerald-800">{doc.documentType}</span>
                          <span className="text-gray-500 font-mono">{doc.documentName}</span>
                        </div>
                        {doc.documentUrl && (
                          <a
                            href={doc.documentUrl}
                            download={doc.documentName}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1 bg-slate-100 text-slate-700 font-bold rounded hover:bg-slate-200"
                          >
                            View / Download
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: SECURITY */}
          {activeTab === 'Security' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-800">Account Security & Credentials</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700">Registered Phone</label>
                  <input type="text" disabled value={profile.phone} className="mt-1 w-full px-3 py-2 border rounded text-sm bg-gray-100 text-gray-600" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700">Account Role</label>
                  <input type="text" disabled value={profile.role} className="mt-1 w-full px-3 py-2 border rounded text-sm bg-gray-100 text-gray-600" />
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 border-t flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-emerald-700 text-white rounded-md text-sm font-black hover:bg-emerald-800 disabled:opacity-50 shadow-sm"
            >
              {saving ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
