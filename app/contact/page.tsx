"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, CheckCircle2, Loader2 } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError("Something went wrong. Please try again or call us directly.");
      }
    } catch {
      setError("Something went wrong. Please try again or call us directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <section className="relative pt-20 pb-12 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/3 w-96 h-64 bg-[#00e64d]/8 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-5xl sm:text-6xl font-black mb-4">
            Get In{" "}
            <span
              style={{
                background: "linear-gradient(135deg,#e81ccd,#ff6ef7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Touch
            </span>
          </h1>
          <p className="text-gray-300 text-xl max-w-xl mx-auto">
            Have questions? Ready to book? We&apos;d love to hear from you. We respond same day!
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-black mb-6 text-white">Contact Information</h2>
            <div className="space-y-5 mb-10">
              {[
                {
                  icon: <Phone size={20} className="text-[#00e64d]" />,
                  label: "Phone",
                  value: "(210) 313-2474",
                  href: "tel:+12103132474",
                  color: "#00e64d",
                },
                {
                  icon: <Mail size={20} className="text-[#e81ccd]" />,
                  label: "Email",
                  value: "thefrozenbexar@gmail.com",
                  href: "mailto:thefrozenbexar@gmail.com",
                  color: "#e81ccd",
                },
                {
                  icon: <MapPin size={20} className="text-[#00e64d]" />,
                  label: "Location",
                  value: "San Antonio, Texas",
                  href: null,
                  color: "#00e64d",
                },
                {
                  icon: <Clock size={20} className="text-[#e81ccd]" />,
                  label: "Hours",
                  value: "Mon–Sun: 8AM – 9PM",
                  href: null,
                  color: "#e81ccd",
                },
              ].map((info) => (
                <div key={info.label} className="flex items-start gap-4 card-dark rounded-2xl p-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${info.color}15`, border: `1px solid ${info.color}30` }}
                  >
                    {info.icon}
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-0.5">
                      {info.label}
                    </p>
                    {info.href ? (
                      <a
                        href={info.href}
                        className="text-white font-semibold hover:text-[#e81ccd] transition-colors"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-white font-semibold">{info.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="card-dark rounded-2xl p-6">
              <h3 className="text-[#00e64d] font-bold text-sm uppercase tracking-widest mb-3">
                Service Area
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                We proudly serve San Antonio and all surrounding areas in Bexar County including Leon Valley, Converse, Universal City, Schertz, Helotes, and more. Delivery fees may apply outside the main San Antonio area.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            {submitted ? (
              <div className="card-dark rounded-3xl p-8 flex flex-col items-center justify-center text-center min-h-[400px]">
                <div className="w-16 h-16 rounded-full bg-[#00e64d]/10 border-2 border-[#00e64d] flex items-center justify-center mb-5">
                  <CheckCircle2 size={32} className="text-[#00e64d]" />
                </div>
                <h3 className="text-2xl font-black text-white mb-3">Message Sent!</h3>
                <p className="text-gray-400 leading-relaxed">
                  Thanks for reaching out! We&apos;ll get back to you shortly.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", message: "" }); }}
                  className="mt-6 px-6 py-2 rounded-full text-sm font-bold border border-[#e81ccd] text-[#e81ccd] hover:bg-[#e81ccd]/10 transition-all"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="card-dark rounded-3xl p-8 space-y-5">
                <h2 className="text-2xl font-black text-white mb-2">Send Us a Message</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-1.5">
                      Name <span className="text-[#e81ccd]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your name"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#e81ccd]/60 transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-1.5">Phone</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="(210) 313-2474"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#e81ccd]/60 transition-colors text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1.5">
                    Email <span className="text-[#e81ccd]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#e81ccd]/60 transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1.5">
                    Message <span className="text-[#e81ccd]">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="How can we help you?"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#e81ccd]/60 transition-colors text-sm resize-none"
                  />
                </div>
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                    {error}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl font-bold uppercase tracking-widest text-white transition-all hover:scale-[1.01] disabled:opacity-70 flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg,#e81ccd,#b5109e)" }}
                >
                  {loading ? <><Loader2 size={18} className="animate-spin" /> Sending...</> : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
