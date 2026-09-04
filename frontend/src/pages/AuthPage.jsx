import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BadgeCheck, FileUp, Landmark, LockKeyhole, Phone } from 'lucide-react';
import { compressImage } from '../utils/imageCompressor';
import { uploadFile } from '../services/api';
import SplashScreen from '../components/common/SplashScreen';

const roles = [
  ['FARMER', 'Farmer / FPO'],
  ['BUYER', 'Consumer'],
  ['BULK_BUYER', 'Bulk Buyer'],
  ['DRIVER', 'Logistics Partner'],
];

const AuthPage = ({ mode = 'login' }) => {
  const [showSplash, setShowSplash] = useState(true);
  const [isLogin, setIsLogin] = useState(mode !== 'register');
  const [role, setRole] = useState('FARMER');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    kycNumber: '',
    bankAccount: '',
    location: { villageOrCity: '', district: '', state: '' },
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [kycDocument, setKycDocument] = useState(null);
  const kycFileInputRef = React.useRef(null);

  const handleKycFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const fileUrl = await uploadFile(file);
        setKycDocument({
          documentType: 'Aadhaar / KYC Document',
          documentName: file.name,
          documentUrl: fileUrl,
          uploadedAt: new Date().toISOString(),
        });
      } catch (err) {
        const compressedUrl = await compressImage(file);
        setKycDocument({
          documentType: 'Aadhaar / KYC Document',
          documentName: file.name,
          documentUrl: compressedUrl,
          uploadedAt: new Date().toISOString(),
        });
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (['villageOrCity', 'district', 'state'].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, [name]: value },
      }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const redirectUser = (userRole) => {
    switch (String(userRole).toUpperCase()) {
      case 'BUYER':
      case 'BULK_BUYER':
        navigate('/marketplace');
        break;
      case 'FPO':
        navigate('/fpo-dashboard');
        break;
      case 'DRIVER':
      case 'LOGISTICS':
      case 'LOGISTICS_PARTNER':
        navigate('/logistics');
        break;
      default:
        navigate('/dashboard');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const response = await login({
          phone: formData.phone,
          password: formData.password,
        });
        const user = response.data?.user || response.data || response.user || response;
        redirectUser(user.role);
      } else {
        const response = await register({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          password: formData.password,
          role,
          kycNumber: formData.kycNumber,
          bankAccount: formData.bankAccount,
          location: formData.location,
          documents: kycDocument ? [kycDocument] : [],
          kycDocument: kycDocument || undefined,
        });
        const user = response.data?.user || response.data || response.user || response;
        redirectUser(user.role);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-900">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <aside className="flex min-h-[520px] flex-col justify-between rounded-lg border border-emerald-800 bg-emerald-900 p-6 text-white">
          <div>
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500 text-xl font-black text-emerald-950">
                K
              </div>
              <div>
                <h1 className="text-3xl font-black">KRISHI</h1>
                <p className="text-sm text-emerald-100">Seedhe Kisan Se, Seedhe Ghar Tak</p>
              </div>
            </div>
            <h2 className="text-3xl font-black leading-tight">
              One verified account for marketplace, logistics, and payouts.
            </h2>
            <p className="mt-4 text-sm leading-6 text-emerald-50">
              Farmers and FPOs enter KYC and bank details for approval. Buyers
              compare produce directly. Logistics partners receive grouped
              route schedules.
            </p>
          </div>
          <div className="grid gap-3 text-sm">
            {[
              [BadgeCheck, 'Pending Admin/DoCA verification before selling'],
              [Landmark, 'Bank account captured for direct farmer payouts'],
              [FileUp, 'KYC document upload slot included in onboarding'],
            ].map(([Icon, text]) => (
              <div key={text} className="flex items-center gap-3 rounded-md border border-emerald-700 bg-emerald-950/40 p-3">
                <Icon className="h-5 w-5 text-emerald-300" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </aside>

        <main className="rounded-lg border border-slate-200 bg-white p-6 shadow-2xl">
          <div className="mb-6 flex rounded-lg bg-slate-100 p-1">
            <button
              className={`flex-1 rounded-md py-2 text-sm font-bold ${isLogin ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600'}`}
              onClick={() => setIsLogin(true)}
              type="button"
            >
              Login
            </button>
            <button
              className={`flex-1 rounded-md py-2 text-sm font-bold ${!isLogin ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600'}`}
              onClick={() => setIsLogin(false)}
              type="button"
            >
              Create Account
            </button>
          </div>

          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
              {isLogin ? 'Splash & Login' : 'Sign Up - Farmer / FPO Onboarding'}
            </p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">
              {isLogin ? 'Access role-based dashboard' : 'Create verified marketplace account'}
            </h2>
          </div>

          {error && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid gap-4">
            {!isLogin && (
              <>
                <div>
                  <p className="mb-2 text-xs font-bold uppercase text-slate-500">Choose account type</p>
                  <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
                    {roles.map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setRole(value)}
                        className={`rounded-md border px-3 py-2 text-left text-xs font-bold ${
                          role === value
                            ? 'border-emerald-700 bg-emerald-50 text-emerald-800'
                            : 'border-slate-200 bg-white text-slate-600'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="text-xs font-bold uppercase text-slate-600">Full Name / FPO Name</span>
                    <input name="name" required value={formData.name} onChange={handleInputChange} className="mt-1 h-11 w-full rounded-md border border-slate-300 px-3 text-sm" />
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold uppercase text-slate-600">Email ID</span>
                    <input name="email" type="email" required value={formData.email} onChange={handleInputChange} className="mt-1 h-11 w-full rounded-md border border-slate-300 px-3 text-sm" />
                  </label>
                </div>
              </>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="block">
                <span className="flex items-center gap-1 text-xs font-bold uppercase text-slate-600">
                  <Phone className="h-3.5 w-3.5" /> Mobile Number
                </span>
                <input name="phone" type="tel" required value={formData.phone} onChange={handleInputChange} className="mt-1 h-11 w-full rounded-md border border-slate-300 px-3 text-sm" />
              </label>
              <label className="block">
                <span className="flex items-center gap-1 text-xs font-bold uppercase text-slate-600">
                  <LockKeyhole className="h-3.5 w-3.5" /> Password
                </span>
                <input name="password" type="password" required value={formData.password} onChange={handleInputChange} className="mt-1 h-11 w-full rounded-md border border-slate-300 px-3 text-sm" />
              </label>
            </div>

            {!isLogin && (
              <>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <label className="block">
                    <span className="text-xs font-bold uppercase text-slate-600">Village / City</span>
                    <input name="villageOrCity" value={formData.location.villageOrCity} onChange={handleInputChange} className="mt-1 h-11 w-full rounded-md border border-slate-300 px-3 text-sm" />
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold uppercase text-slate-600">District</span>
                    <input name="district" value={formData.location.district} onChange={handleInputChange} className="mt-1 h-11 w-full rounded-md border border-slate-300 px-3 text-sm" />
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold uppercase text-slate-600">State</span>
                    <input name="state" value={formData.location.state} onChange={handleInputChange} className="mt-1 h-11 w-full rounded-md border border-slate-300 px-3 text-sm" />
                  </label>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <label className="block">
                    <span className="text-xs font-bold uppercase text-slate-600">Aadhaar / FPO Reg. No.</span>
                    <input name="kycNumber" value={formData.kycNumber} onChange={handleInputChange} className="mt-1 h-11 w-full rounded-md border border-slate-300 px-3 text-sm" />
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold uppercase text-slate-600">Bank Account</span>
                    <input name="bankAccount" value={formData.bankAccount} onChange={handleInputChange} className="mt-1 h-11 w-full rounded-md border border-slate-300 px-3 text-sm" />
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold uppercase text-slate-600">Confirm Password</span>
                    <input name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleInputChange} className="mt-1 h-11 w-full rounded-md border border-slate-300 px-3 text-sm" />
                  </label>
                </div>

                <input
                  type="file"
                  ref={kycFileInputRef}
                  onChange={handleKycFileChange}
                  accept="image/*,.pdf"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => kycFileInputRef.current?.click()}
                  className={`flex h-12 items-center justify-center gap-2 rounded-md border border-dashed text-sm font-bold transition ${
                    kycDocument
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm'
                      : 'border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <FileUp className="h-4 w-4" />
                  {kycDocument ? `✓ Attached: ${kycDocument.documentName}` : 'Upload KYC Document (Aadhaar / Land Certificate)'}
                </button>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 h-12 rounded-md bg-emerald-700 text-sm font-black text-white transition hover:bg-emerald-800 disabled:opacity-60"
            >
              {loading ? 'Processing...' : isLogin ? 'Login' : 'Register'}
            </button>

            {!isLogin && (
              <p className="rounded-md bg-amber-50 p-3 text-sm font-medium text-amber-800">
                Pending Admin/DoCA verification. Farmer/FPO ID will be generated on approval.
              </p>
            )}
          </form>
        </main>
      </div>
    </div>
  </>
);
};

export default AuthPage;
