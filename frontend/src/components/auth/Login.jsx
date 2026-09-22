// import React, { useState } from 'react';

// const Login = ({ onLoginSuccess, onNavigateToSignUp }) => {
//   const [formData, setFormData] = useState({
//     identifier: '',
//     password: '',
//     rememberMe: false
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);

//     if (!formData.identifier || !formData.password) {
//       setError('Please fill in all required fields.');
//       return;
//     }

//     try {
//       setLoading(true);
//       // Replace with your backend login endpoint e.g., /api/auth/login
//       const response = await fetch('/api/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData)
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Invalid credentials');
//       }

//       const result = await response.json();
//       if (onLoginSuccess) onLoginSuccess(result);
//     } catch {
//       // Demo fallback handling
//       console.warn('Backend unavailable, simulating successful login response');
//       if (onLoginSuccess) {
//         onLoginSuccess({
//           user: { name: 'Demo User', role: 'Farmer' },
//           token: 'demo-jwt-token'
//         });
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <h2 className="text-center text-3xl font-extrabold text-gray-900">Sign in to Krishi Portal</h2>
//         <p className="mt-2 text-center text-sm text-gray-600">
//           Access your agricultural marketplace dashboard
//         </p>
//       </div>

//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="bg-white py-8 px-4 shadow rounded-lg sm:px-10 border border-gray-200">
//           {error && (
//             <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
//               {error}
//             </div>
//           )}

//           <form className="space-y-6" onSubmit={handleSubmit}>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Mobile Number or Email</label>
//               <input
//                 type="text"
//                 name="identifier"
//                 required
//                 value={formData.identifier}
//                 onChange={handleChange}
//                 placeholder="e.g. +91 9876543210 or user@domain.com"
//                 className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">Password</label>
//               <input
//                 type="password"
//                 name="password"
//                 required
//                 value={formData.password}
//                 onChange={handleChange}
//                 className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm"
//               />
//             </div>

//             <div className="flex items-center justify-between text-sm">
//               <label className="flex items-center">
//                 <input
//                   type="checkbox"
//                   name="rememberMe"
//                   checked={formData.rememberMe}
//                   onChange={handleChange}
//                   className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
//                 />
//                 <span className="ml-2 text-gray-600">Remember me</span>
//               </label>

//               <a href="#forgot-password" className="font-medium text-green-600 hover:text-green-500">
//                 Forgot password?
//               </a>
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-700 hover:bg-green-800 focus:outline-none disabled:opacity-50"
//             >
//               {loading ? 'Signing in...' : 'Sign In'}
//             </button>
//           </form>

//           <div className="mt-6 text-center text-sm">
//             <span className="text-gray-600">Don't have an account? </span>
//             <button
//               onClick={onNavigateToSignUp}
//               className="font-medium text-green-600 hover:text-green-500 bg-transparent border-none cursor-pointer"
//             >
//               Register here
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;







import React, { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Leaf,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  ShoppingBasket,
  Sparkles,
  UserRound,
  X,
  Loader2,
} from "lucide-react";

const Login = ({ onLoginSuccess, onNavigateToSignUp }) => {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear the error when the user starts correcting the form.
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const identifier = formData.identifier.trim();
    const password = formData.password;

    if (!identifier || !password) {
      setError("Please enter your mobile number/email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier,
          password,
          rememberMe: formData.rememberMe,
        }),
      });

      let result = {};

      try {
        result = await response.json();
      } catch {
        result = {};
      }

      if (!response.ok) {
        throw new Error(result.message || "Invalid credentials. Please try again.");
      }

      if (onLoginSuccess) {
        onLoginSuccess(result);
      }
    } catch (err) {
      // Never simulate a successful login when the backend fails.
      setError(
        err.message || "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Replace this with your actual forgot-password route/modal.
    window.location.href = "/forgot-password";
  };

  return (
    <main className="min-h-screen bg-[#f7faf8] text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">

        {/* =====================================================
            LEFT BRANDING PANEL — DESKTOP
        ====================================================== */}
        <section className="relative hidden overflow-hidden bg-[#064e3b] lg:flex lg:flex-col lg:justify-between">
          {/* Decorative Background */}
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 h-[28rem] w-[28rem] rounded-full bg-lime-400/10 blur-3xl" />

          {/* Decorative Grid */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:48px_48px]" />

          <div className="relative z-10 p-10 xl:p-14">

            {/* Logo */}
            <a href="/" className="inline-flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400 text-2xl font-black text-slate-950 shadow-lg shadow-black/10">
                K
              </span>

              <div className="leading-none">
                <div className="text-2xl font-black tracking-tight text-white">
                  Kisan <span className="text-emerald-400">SetuAI</span>
                </div>
                <div className="mt-1 text-[10px] font-black uppercase tracking-[0.25em] text-emerald-200">
                  Seedhe Kisan Se
                </div>
              </div>
            </a>

            {/* Main Message */}
            <div className="mt-24 max-w-xl xl:mt-32">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-bold text-emerald-300">
                <Sparkles className="h-3.5 w-3.5" />
                India's digital agriculture marketplace
              </div>

              <h1 className="text-4xl font-black leading-[1.1] tracking-tight text-white xl:text-6xl">
                Fresh produce.
                <br />
                <span className="text-emerald-400">Direct from farms.</span>
              </h1>

              <p className="mt-6 max-w-md text-base leading-8 text-emerald-100/75">
                Connect with farmers, FPOs, bulk buyers, and logistics partners
                through one trusted agricultural marketplace.
              </p>

              {/* Benefits */}
              <div className="mt-10 space-y-4">
                {[
                  "Direct farmer-to-buyer connections",
                  "Quality-verified agricultural produce",
                  "Secure orders and transparent payouts",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm font-semibold text-emerald-50"
                  >
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Trust Bar */}
          <div className="relative z-10 border-t border-emerald-800/70 bg-emerald-950/30 px-10 py-6 xl:px-14">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-xs font-semibold text-emerald-200/70">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Secure platform
              </span>

              <span className="flex items-center gap-2">
                <ShoppingBasket className="h-4 w-4 text-emerald-400" />
                Farm-fresh produce
              </span>

              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-400" />
                Singur, West Bengal
              </span>
            </div>
          </div>
        </section>

        {/* =====================================================
            RIGHT LOGIN PANEL
        ====================================================== */}
        <section className="flex min-h-screen flex-col justify-center px-4 py-8 sm:px-8 lg:px-12 xl:px-20">

          {/* Mobile Logo */}
          <div className="mb-10 flex justify-center lg:hidden">
            <a href="/" className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-xl font-black text-white shadow-lg shadow-emerald-600/20">
                K
              </span>

              <div className="leading-none">
                <div className="text-xl font-black tracking-tight text-slate-900">
                  Kisan <span className="text-emerald-600">SetuAI</span>
                </div>
                <div className="mt-1 text-[9px] font-black uppercase tracking-[0.2em] text-emerald-700">
                  Seedhe Kisan Se
                </div>
              </div>
            </a>
          </div>

          <div className="mx-auto w-full max-w-md">

            {/* Heading */}
            <div className="mb-8">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <Leaf className="h-6 w-6" />
              </div>

              <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Welcome back
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Sign in to continue to your Kisan SetuAI account.
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div
                role="alert"
                className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                <X className="mt-0.5 h-4 w-4 shrink-0" />
                <span className="leading-5">{error}</span>
              </div>
            )}

            {/* Login Card */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8">

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Identifier */}
                <div>
                  <label
                    htmlFor="identifier"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Mobile number or email
                  </label>

                  <div className="relative">
                    <UserRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      id="identifier"
                      type="text"
                      name="identifier"
                      required
                      autoComplete="username"
                      value={formData.identifier}
                      onChange={handleChange}
                      placeholder="Enter mobile number or email"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-10 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-bold text-slate-700"
                    >
                      Password
                    </label>

                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-xs font-bold text-emerald-600 transition hover:text-emerald-700 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      required
                      autoComplete="current-password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-10 pr-12 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-emerald-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between">
                  <label className="flex cursor-pointer items-center gap-2.5">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-slate-300 text-emerald-600 accent-emerald-600 focus:ring-emerald-500"
                    />

                    <span className="text-xs font-semibold text-slate-500">
                      Remember me
                    </span>
                  </label>

                  <span className="text-[11px] font-medium text-slate-400">
                    Secure login
                  </span>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-sm font-black text-white shadow-lg shadow-emerald-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-600/20 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="my-7 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  New to Kisan SetuAI?
                </span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              {/* Register */}
              <button
                type="button"
                onClick={onNavigateToSignUp}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 text-sm font-black text-emerald-700 transition-all duration-200 hover:border-emerald-400 hover:bg-emerald-100 active:scale-[0.99]"
              >
                Create an account
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Support */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                Secure authentication
              </span>

              <a
                href="mailto:support@krishi-agri.org"
                className="flex items-center gap-1.5 transition hover:text-emerald-600"
              >
                <Mail className="h-3.5 w-3.5" />
                Need help?
              </a>
            </div>

            <p className="mt-6 text-center text-[11px] leading-5 text-slate-400">
              By continuing, you agree to our{" "}
              <a
                href="/terms"
                className="font-semibold text-emerald-600 hover:underline"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="/privacy"
                className="font-semibold text-emerald-600 hover:underline"
              >
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Login;
