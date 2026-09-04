import React from 'react';
import { 
  Sprout, 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  Truck, 
  Scale, 
  CheckCircle, 
  Award, 
  HeartHandshake, 
  Globe 
} from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      icon: <Scale className="w-8 h-8 text-emerald-600" />,
      title: "Fair Price Transparency",
      description: "Direct price discovery based on real-time market trends without intermediary cuts or opaque pricing structures."
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-emerald-600" />,
      title: "Trust & Quality Assurance",
      description: "Rigorous KYC verification for farmers and grade certification to ensure top-quality produce reaches every doorstep."
    },
    {
      icon: <Truck className="w-8 h-8 text-emerald-600" />,
      title: "Seamless Logistics",
      description: "Integrated cold-chain and micro-fulfillment logistics designed specifically to preserve farm-fresh quality."
    },
    {
      icon: <Users className="w-8 h-8 text-emerald-600" />,
      title: "Empowering Local Farms",
      description: "Enabling smallholder farmers and FPOs to directly command fair earnings for their agricultural yield."
    }
  ];

  const milestones = [
    { year: "2024", title: "Platform Inception", desc: "Launched pilot with 50 local farmers and 500 consumers." },
    { year: "2025", title: "FPO Integration", desc: "Onboarded 40+ Farmer Producer Organizations across 6 states." },
    { year: "2026", title: "National Expansion", desc: "Scaling direct consumer & bulk supply fulfillment to over 50 cities." }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Hero Section */}
      <section className="bg-emerald-800 text-white py-20 px-6 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <span className="inline-block bg-emerald-700/80 text-emerald-200 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide border border-emerald-500/30">
            About KRISHI Digital Marketplace
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Seedhe Kisan Se, Seedhe Ghar Tak
          </h1>
          <p className="text-lg md:text-xl text-emerald-100 max-w-2xl mx-auto font-light leading-relaxed">
            Bridging the gap between agricultural producers and consumers to build a sustainable, fair, and transparent fresh food supply ecosystem.
          </p>
        </div>
        <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-emerald-700/30 rounded-full blur-3xl"></div>
        <div className="absolute -top-10 -left-10 w-96 h-96 bg-emerald-900/50 rounded-full blur-3xl"></div>
      </section>

      {/* Mission Statement */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-slate-200/80 flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-1/2 space-y-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-700 font-bold">
              <Sprout className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Our Core Mission</h2>
            <p className="text-slate-600 leading-relaxed">
              KRISHI was founded to dismantle traditional supply chain inefficiencies that disadvantage both growers and consumers. By bypassing predatory middlemen, we enable farmers to receive up to 30% higher returns on their produce while guaranteeing consumers receive farm-fresh, high-grade produce at honest prices.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Our digital infrastructure integrates verification, quality control, smart inventory management, and logistics to build a direct supply ecosystem.
            </p>
          </div>
          <div className="md:w-1/2 grid grid-cols-2 gap-4">
            <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100 text-center">
              <div className="text-3xl font-black text-emerald-700">10k+</div>
              <div className="text-sm text-slate-600 font-medium mt-1">Verified Farmers</div>
            </div>
            <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100 text-center">
              <div className="text-3xl font-black text-emerald-700">50k+</div>
              <div className="text-sm text-slate-600 font-medium mt-1">Happy Customers</div>
            </div>
            <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100 text-center">
              <div className="text-3xl font-black text-emerald-700">120+</div>
              <div className="text-sm text-slate-600 font-medium mt-1">FPOs Onboarded</div>
            </div>
            <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100 text-center">
              <div className="text-3xl font-black text-emerald-700">98%</div>
              <div className="text-sm text-slate-600 font-medium mt-1">On-Time Fulfillment</div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Values Grid */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200/60">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Why KRISHI Exists</h2>
            <p className="text-slate-600 mt-2">Re-engineering food distribution through direct tech-driven connections.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4 bg-emerald-50 w-14 h-14 rounded-lg flex items-center justify-center">
                  {val.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{val.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{val.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Our Growth Journey</h2>
        <div className="relative border-l-2 border-emerald-500/30 ml-4 md:ml-32 space-y-10">
          {milestones.map((m, idx) => (
            <div key={idx} className="relative pl-8 md:pl-12">
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 bg-emerald-600 rounded-full border-4 border-white shadow-sm"></div>
              <span className="inline-block text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-md mb-2">
                {m.year}
              </span>
              <h3 className="text-xl font-bold text-slate-900">{m.title}</h3>
              <p className="text-slate-600 text-sm mt-1">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}