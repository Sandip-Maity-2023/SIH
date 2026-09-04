import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle, 
  MessageSquare, 
  HelpCircle, 
  Clock 
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Consumer',
    subject: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setIsSubmitted(true);
      setFormData({ name: '', email: '', role: 'Consumer', subject: '', message: '' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Get in Touch with KRISHI</h1>
          <p className="text-slate-600 mt-3 text-lg">
            Have questions about onboarding as a farmer, placing bulk orders, or partner logistics? We are here to support you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Details Column */}
          <div className="bg-emerald-800 text-white p-8 rounded-2xl space-y-8 flex flex-col justify-between shadow-lg">
            <div>
              <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
              <p className="text-emerald-100 text-sm leading-relaxed mb-6">
                Reach out directly or send us a message. Our dedicated agricultural support desk is active 6 days a week.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-700/60 rounded-xl text-emerald-200">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-emerald-200 font-medium">Toll-Free Helpline</p>
                    <p className="font-semibold text-white">+91 (800) 555-KRISHI</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-700/60 rounded-xl text-emerald-200">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-emerald-200 font-medium">Email Support</p>
                    <p className="font-semibold text-white">support@krishi-marketplace.in</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-700/60 rounded-xl text-emerald-200">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-emerald-200 font-medium">Head Office</p>
                    <p className="font-semibold text-white text-sm">
                      KRISHI Tech Hub, Sector 62, Green Agrotech Park, Noida, UP - 201301
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-700/60 rounded-xl text-emerald-200">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-emerald-200 font-medium">Working Hours</p>
                    <p className="font-semibold text-white text-sm">Mon - Sat: 8:00 AM - 7:00 PM IST</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-emerald-700/60 text-xs text-emerald-200">
              For emergency crop pickup or cold-chain logistics dispatch, please call the priority hotline.
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm">
            {isSubmitted && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800">
                <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm">Message Sent Successfully!</p>
                  <p className="text-xs text-emerald-700">Thank you for reaching out. A KRISHI representative will respond within 24 hours.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                    User Category
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white"
                  >
                    <option value="Farmer / FPO">Farmer / FPO</option>
                    <option value="Consumer">Consumer</option>
                    <option value="Bulk Buyer">Bulk Buyer / Retailer</option>
                    <option value="Logistics Partner">Logistics Partner</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. Bulk Procurement / KYC Issue"
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                  Message / Inquiry Details *
                </label>
                <textarea
                  name="message"
                  required
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                ></textarea>
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-lg text-sm transition-colors shadow-sm"
              >
                <Send className="w-4 h-4" /> Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
