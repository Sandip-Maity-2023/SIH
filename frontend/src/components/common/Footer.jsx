
import React from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Truck,
  Zap,
  Award,
  Phone,
  Mail,
  MapPin,
  Bot,
  ExternalLink,
  ArrowUp,
  ChevronRight,
  Leaf,
  ShoppingBasket,
  Wheat,
  Milk,
} from "lucide-react";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const trustFeatures = [
    {
      icon: Zap,
      title: "15-Min Farm Dispatch",
      description: "Fast mandi-to-door delivery",
      color: "from-emerald-500 to-green-600",
    },
    {
      icon: ShieldCheck,
      title: "Secure Transactions",
      description: "Protected farmer payouts",
      color: "from-teal-500 to-emerald-600",
    },
    {
      icon: Award,
      title: "AI Grade Inspection",
      description: "Verified A/B/C quality lots",
      color: "from-lime-500 to-green-600",
    },
    {
      icon: Truck,
      title: "Cold-Chain Fleet",
      description: "Real-time delivery tracking",
      color: "from-green-500 to-teal-600",
    },
  ];

  const categories = [
    { icon: Leaf, label: "Fresh Vegetables", path: "/marketplace" },
    { icon: ShoppingBasket, label: "Farm Fresh Fruits", path: "/marketplace" },
    { icon: Wheat, label: "Grains & Cereals", path: "/marketplace" },
    { icon: Milk, label: "Dairy & Allied Produce", path: "/marketplace" },
    { icon: ShoppingBasket, label: "Bulk Mandi Lots", path: "/marketplace" },
  ];

  const platformLinks = [
    { label: "Buyer Marketplace", path: "/marketplace" },
    { label: "FPO Aggregation Portal", path: "/fpo-dashboard" },
    { label: "Driver Trip Tracking", path: "/logistics" },
    { label: "Farmer Escrow Payouts", path: "/payouts" },
    { label: "Dispatch Route Scheduler", path: "/schedule" },
  ];

  const socialLinks = [
    {
      icon: FaFacebook,
      label: "Facebook",
      href: "https://www.facebook.com/",
    },
    {
      icon: FaTwitter,
      label: "Twitter",
      href: "https://twitter.com/",
    },
    {
      icon: FaInstagram,
      label: "Instagram",
      href: "https://www.instagram.com/",
    },
    {
      icon: FaLinkedin,
      label: "LinkedIn",
      href: "https://www.linkedin.com/",
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative overflow-hidden border-t border-emerald-900/60 bg-slate-950 text-slate-300">
      {/* Decorative Background */}
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-emerald-500/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-green-500/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
        {/* Trust Features */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trustFeatures.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group flex items-center gap-4 rounded-2xl border border-emerald-900/50 bg-slate-900/70 p-5 shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50 hover:bg-slate-900"
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon className="h-5 w-5" strokeWidth={2.5} />
                </div>

                <div>
                  <h3 className="text-sm font-extrabold text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-10 border-b border-slate-800/80 py-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-5">
            <Link to="/" className="group inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 text-xl font-black text-slate-950 shadow-lg shadow-emerald-500/20 transition-transform duration-300 group-hover:rotate-6">
                K
              </span>

              <span className="text-xl font-black tracking-tight text-white">
                KRISHI{" "}
                <span className="text-emerald-400">AGRI</span>
              </span>
            </Link>

            <p className="max-w-xs text-sm leading-7 text-slate-400">
              India's digital agriculture marketplace connecting farmers, FPOs,
              bulk buyers, and cold-chain partners.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit our ${social.label} page`}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-400"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-5 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-white">
              <span className="h-5 w-1 rounded-full bg-emerald-500" />
              Agri Categories
            </h3>

            <ul className="space-y-3">
              {categories.map((category) => {
                const Icon = category.icon;

                return (
                  <li key={category.label}>
                    <Link
                      to={category.path}
                      className="group flex items-center gap-3 text-sm text-slate-400 transition-colors duration-200 hover:text-emerald-400"
                    >
                      <Icon className="h-4 w-4 text-emerald-500 transition-transform duration-200 group-hover:scale-110" />
                      <span>{category.label}</span>
                      <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="mb-5 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-white">
              <span className="h-5 w-1 rounded-full bg-emerald-500" />
              Platform Portals
            </h3>

            <ul className="space-y-3">
              {platformLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="group flex items-center gap-2 text-sm text-slate-400 transition-colors duration-200 hover:text-emerald-400"
                  >
                    <ChevronRight className="h-3.5 w-3.5 text-emerald-500 transition-transform duration-200 group-hover:translate-x-1" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & AI */}
          <div>
            <h3 className="mb-5 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-white">
              <span className="h-5 w-1 rounded-full bg-emerald-500" />
              Support & Mandi Hub
            </h3>

            <div className="space-y-4 text-sm text-slate-400">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                <span>Singur Agri Hub, Hooghly, West Bengal</span>
              </div>

              <a
                href="tel:+9118001235744"
                className="flex items-center gap-3 transition-colors hover:text-emerald-400"
              >
                <Phone className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>1800-123-5744</span>
              </a>

              <a
                href="mailto:support@krishi-agri.org"
                className="flex items-center gap-3 break-all transition-colors hover:text-emerald-400"
              >
                <Mail className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>support@krishi-agri.org</span>
              </a>

              <div className="flex items-center gap-2 pt-1 text-xs font-bold text-emerald-400">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </span>
                Platform services available
              </div>
            </div>

            {/* ResearchMind Button */}
            <a
              href="https://advanceddevelopment-5yzkdbhpswjca4zvggebhn.streamlit.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 px-4 py-3 text-xs font-extrabold text-emerald-300 shadow-lg shadow-emerald-950/20 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-400/60 hover:from-emerald-600/30 hover:to-teal-600/30 hover:text-emerald-200"
            >
              <Bot className="h-4 w-4 shrink-0" />
              <span>ResearchMind AI System</span>
              <ExternalLink className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col gap-5 py-6 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
          <p className="text-center md:text-left">
            © {currentYear} KRISHI AGRI Platform. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <Link
              to="/privacy"
              className="transition-colors hover:text-emerald-400"
            >
              Privacy Policy
            </Link>

            <Link
              to="/terms"
              className="transition-colors hover:text-emerald-400"
            >
              Terms of Service
            </Link>

            <Link
              to="/compliance"
              className="transition-colors hover:text-emerald-400"
            >
              DoCA Compliance
            </Link>
          </div>

          {/* Scroll To Top */}
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="group mx-auto flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-400 md:mx-0"
          >
            <ArrowUp className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;