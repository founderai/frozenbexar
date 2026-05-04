"use client";

import { useState, useEffect, useCallback } from "react";
import {
  CalendarDays, Mail, MessageSquare, CheckCircle2, XCircle, Clock,
  Trash2, Send, RefreshCw, ChevronLeft, ChevronRight, Eye, EyeOff,
  Users, CalendarCheck, Inbox, AlertCircle, DollarSign, Save
} from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO, addMonths, subMonths } from "date-fns";

interface Booking {
  id: string; name: string; email: string; phone: string;
  eventDate: string; eventType: string; guestCount: string;
  address: string; items: string[]; notes: string;
  status: "pending" | "confirmed" | "cancelled"; createdAt: string;
}

interface Message {
  id: string; name: string; email: string; phone: string;
  message: string; createdAt: string; read: boolean;
}

const SC = {
  pending: { bg: "bg-yellow-500/10", border: "border-yellow-500/30", text: "text-yellow-400", icon: <Clock size={13} /> },
  confirmed: { bg: "bg-green-500/10", border: "border-green-500/30", text: "text-green-400", icon: <CheckCircle2 size={13} /> },
  cancelled: { bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-400", icon: <XCircle size={13} /> },
};

const ADMIN_USER = "thefrozenbexar.com";
const ADMIN_PASS = "Addy2024!";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [un, setUn] = useState("");
  const [pw, setPw] = useState(""); const [pwErr, setPwErr] = useState(""); const [showPw, setShowPw] = useState(false);
  const [tab, setTab] = useState<"calendar" | "bookings" | "messages" | "chat" | "prices">("calendar");
  const [prices, setPrices] = useState<Record<string, { label: string; price: string; unit: string }>>({});
  const [pricesSaving, setPricesSaving] = useState(false);
  const [pricesSaved, setPricesSaved] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [calDate, setCalDate] = useState(new Date());
  const [emailTo, setEmailTo] = useState(""); const [emailSub, setEmailSub] = useState(""); const [emailBody, setEmailBody] = useState("");
  const [emailSending, setEmailSending] = useState(false); const [emailRes, setEmailRes] = useState<"" | "sent" | "error">("");
  const [chatMsgs, setChatMsgs] = useState([
    { role: "visitor" as const, text: "Hi! I want to rent a margarita machine for my daughter's quinceañera!", time: "2:15 PM" },
    { role: "admin" as const, text: "We'd love to help! What date is the event?", time: "2:16 PM" },
  ]);
  const [chatInput, setChatInput] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [bRes, mRes, pRes] = await Promise.all([fetch("/api/booking"), fetch("/api/contact"), fetch("/api/prices")]);
      const bData = await bRes.json(); const mData = await mRes.json(); const pData = await pRes.json();
      setBookings(Array.isArray(bData) ? bData : []);
      setMessages(Array.isArray(mData) ? mData : []);
      if (pData && typeof pData === "object") setPrices(pData);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }, []);

  const savePrices = async () => {
    setPricesSaving(true); setPricesSaved(false);
    try {
      const res = await fetch("/api/prices", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: ADMIN_PASS, prices }) });
      if (res.ok) { setPricesSaved(true); setTimeout(() => setPricesSaved(false), 3000); }
    } catch (e) { console.error(e); } finally { setPricesSaving(false); }
  };

  useEffect(() => { if (authed) fetchData(); }, [authed, fetchData]);

  const updateStatus = async (id: string, status: Booking["status"]) => {
    await fetch(`/api/booking/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    setBookings((p) => p.map((b) => b.id === id ? { ...b, status } : b));
  };

  const deleteBooking = async (id: string) => {
    if (!confirm("Delete this booking?")) return;
    await fetch(`/api/booking/${id}`, { method: "DELETE" });
    setBookings((p) => p.filter((b) => b.id !== id));
  };

  const prefillEmail = (b: Booking) => {
    setEmailTo(b.email);
    setEmailSub(`Your Frozen Bexar Booking – ${b.eventDate}`);
    setEmailBody(`Hi ${b.name},\n\nThank you for choosing Frozen Bexar for your ${b.eventType} on ${b.eventDate}!\n\nRental items: ${b.items.join(", ")}.\n\nPlease reply or call us to finalize.\n\nCheers,\nFrozen Bexar Team`);
    setTab("messages");
  };

  const sendEmail = async () => {
    if (!emailTo || !emailSub || !emailBody) return;
    setEmailSending(true);
    try {
      const res = await fetch("/api/email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ to: emailTo, subject: emailSub, body: emailBody }) });
      setEmailRes(res.ok ? "sent" : "error");
    } catch { setEmailRes("error"); } finally { setEmailSending(false); }
  };

  const sendChat = () => {
    if (!chatInput.trim()) return;
    setChatMsgs((p) => [...p, { role: "admin", text: chatInput.trim(), time: format(new Date(), "h:mm a") }]);
    setChatInput("");
  };

  const daysInMonth = eachDayOfInterval({ start: startOfMonth(calDate), end: endOfMonth(calDate) });
  const startDow = startOfMonth(calDate).getDay();
  const bookingsForDay = (day: Date) => bookings.filter((b) => { try { return isSameDay(parseISO(b.eventDate), day); } catch { return false; } });

  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const confirmedCount = bookings.filter((b) => b.status === "confirmed").length;
  const unreadCount = messages.filter((m) => !m.read).length;

  const tryLogin = () => {
    if (un === ADMIN_USER && pw === ADMIN_PASS) { setAuthed(true); setPwErr(""); }
    else { setPwErr("Incorrect username or password."); }
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="card-dark rounded-3xl p-10 w-full max-w-sm text-center">
          <div className="w-16 h-16 rounded-full bg-[#e81ccd]/10 border-2 border-[#e81ccd]/30 flex items-center justify-center mx-auto mb-6 text-3xl">🔒</div>
          <h1 className="text-2xl font-black text-white mb-2">Admin Access</h1>
          <p className="text-gray-400 text-sm mb-6">Enter your credentials to continue.</p>
          <input type="text" value={un} onChange={(e) => setUn(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") tryLogin(); }}
            placeholder="Username"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#e81ccd]/60 mb-3" />
          <div className="relative mb-4">
            <input type={showPw ? "text" : "password"} value={pw} onChange={(e) => setPw(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") tryLogin(); }}
              placeholder="Password"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#e81ccd]/60 pr-10" />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {pwErr && <p className="text-red-400 text-sm mb-3">{pwErr}</p>}
          <button onClick={tryLogin}
            className="w-full py-3 rounded-xl font-bold uppercase tracking-wide text-white"
            style={{ background: "linear-gradient(135deg,#e81ccd,#b5109e)" }}>
            Enter Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black">Admin <span style={{ background: "linear-gradient(135deg,#e81ccd,#ff6ef7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Dashboard</span></h1>
            <p className="text-gray-400 text-sm mt-1">Frozen Bexar Rental Management</p>
          </div>
          <button onClick={fetchData} disabled={loading} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-gray-400 hover:text-white text-sm">
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Bookings", value: bookings.length, icon: <CalendarCheck size={20} className="text-[#e81ccd]" />, color: "#e81ccd" },
            { label: "Pending", value: pendingCount, icon: <AlertCircle size={20} className="text-yellow-400" />, color: "#f5c542" },
            { label: "Confirmed", value: confirmedCount, icon: <CheckCircle2 size={20} className="text-[#00e64d]" />, color: "#00e64d" },
            { label: "New Messages", value: unreadCount, icon: <Inbox size={20} className="text-[#e81ccd]" />, color: "#e81ccd" },
          ].map((stat) => (
            <div key={stat.label} className="card-dark rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">{stat.icon}
                <span className="text-3xl font-black" style={{ color: stat.color }}>{stat.value}</span>
              </div>
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { key: "calendar", label: "Calendar", icon: <CalendarDays size={15} /> },
            { key: "bookings", label: "Bookings", icon: <Users size={15} />, badge: pendingCount },
            { key: "messages", label: "Email / Messages", icon: <Mail size={15} />, badge: unreadCount },
            { key: "chat", label: "Live Chat", icon: <MessageSquare size={15} /> },
            { key: "prices", label: "Pricing", icon: <DollarSign size={15} /> },
          ].map((t) => (
            <button key={t.key} onClick={() => setTab(t.key as typeof tab)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wide transition-all ${tab === t.key ? "text-white" : "text-gray-400 border border-white/10 hover:text-white"}`}
              style={tab === t.key ? { background: "linear-gradient(135deg,#e81ccd,#b5109e)" } : {}}>
              {t.icon}{t.label}
              {t.badge !== undefined && t.badge > 0 && <span className="w-5 h-5 rounded-full bg-yellow-400 text-black text-xs font-black flex items-center justify-center">{t.badge}</span>}
            </button>
          ))}
        </div>

        {/* Calendar */}
        {tab === "calendar" && (
          <div className="card-dark rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <button onClick={() => setCalDate(subMonths(calDate, 1))} className="p-2 rounded-xl hover:bg-white/5"><ChevronLeft size={20} className="text-gray-400" /></button>
              <h2 className="text-xl font-black text-white">{format(calDate, "MMMM yyyy")}</h2>
              <button onClick={() => setCalDate(addMonths(calDate, 1))} className="p-2 rounded-xl hover:bg-white/5"><ChevronRight size={20} className="text-gray-400" /></button>
            </div>
            <div className="grid grid-cols-7 mb-2">
              {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
                <div key={d} className="text-center text-xs font-bold text-gray-500 uppercase py-2">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: startDow }).map((_, i) => <div key={`e${i}`} />)}
              {daysInMonth.map((day) => {
                const db = bookingsForDay(day);
                const isToday = isSameDay(day, new Date());
                return (
                  <div key={day.toISOString()} className={`min-h-[64px] rounded-xl p-1.5 border ${isToday ? "border-[#e81ccd]/60 bg-[#e81ccd]/5" : db.length > 0 ? "border-[#00e64d]/30 bg-[#00e64d]/5" : "border-white/5"}`}>
                    <span className={`text-xs font-bold block mb-1 ${isToday ? "text-[#e81ccd]" : "text-gray-400"}`}>{format(day, "d")}</span>
                    {db.map((b) => (
                      <div key={b.id} className="text-xs rounded px-1 py-0.5 mb-0.5 truncate font-medium"
                        style={{ background: b.status === "confirmed" ? "#00e64d20" : b.status === "cancelled" ? "#e8202020" : "#e81ccd20", color: b.status === "confirmed" ? "#00e64d" : b.status === "cancelled" ? "#e82020" : "#e81ccd" }}
                        title={`${b.name} – ${b.eventType}`}>
                        {b.name}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
            <div className="flex gap-5 mt-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#e81ccd]" />Pending</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#00e64d]" />Confirmed</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" />Cancelled</span>
            </div>
          </div>
        )}

        {/* Bookings */}
        {tab === "bookings" && (
          <div className="space-y-4">
            {bookings.length === 0 ? (
              <div className="card-dark rounded-2xl p-10 text-center text-gray-500">No bookings yet. They&apos;ll appear here when customers submit the form.</div>
            ) : bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((b) => {
              const sc = SC[b.status];
              return (
                <div key={b.id} className="card-dark rounded-2xl p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-white font-bold text-lg">{b.name}</h3>
                        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${sc.bg} ${sc.border} ${sc.text}`}>{sc.icon}{b.status}</span>
                      </div>
                      <p className="text-gray-400 text-sm">{b.eventType} · {b.eventDate}{b.address && ` · ${b.address}`}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{b.email} · {b.phone}{b.guestCount && ` · ~${b.guestCount} guests`}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => prefillEmail(b)} className="p-2 rounded-lg border border-[#e81ccd]/30 text-[#e81ccd] hover:bg-[#e81ccd]/10 transition-colors" title="Email client"><Mail size={16} /></button>
                      <button onClick={() => deleteBooking(b.id)} className="p-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors" title="Delete"><Trash2 size={16} /></button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {b.items.map((item) => <span key={item} className="text-xs bg-white/5 border border-white/10 rounded-full px-3 py-1 text-gray-300">{item}</span>)}
                  </div>
                  {b.notes && <p className="text-gray-400 text-sm italic border-l-2 border-[#e81ccd]/30 pl-3 mb-4">&quot;{b.notes}&quot;</p>}
                  <div className="flex gap-2 flex-wrap">
                    {(["pending","confirmed","cancelled"] as const).map((s) => (
                      <button key={s} onClick={() => updateStatus(b.id, s)} disabled={b.status === s}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase border transition-all disabled:opacity-40 ${SC[s].bg} ${SC[s].border} ${SC[s].text}`}>
                        Mark {s}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Messages / Email */}
        {tab === "messages" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-black text-white mb-4">Contact Messages {unreadCount > 0 && <span className="ml-2 text-xs bg-yellow-400 text-black rounded-full px-2 py-0.5 font-black">{unreadCount} new</span>}</h2>
              <div className="space-y-3">
                {messages.length === 0 ? (
                  <div className="card-dark rounded-2xl p-8 text-center text-gray-500 text-sm">No messages yet.</div>
                ) : messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((m) => (
                  <div key={m.id} className={`card-dark rounded-2xl p-4 cursor-pointer hover:border-[#e81ccd]/30 transition-all ${!m.read ? "border-[#e81ccd]/30" : ""}`}
                    onClick={() => { setEmailTo(m.email); setEmailSub("Re: Your message to Frozen Bexar"); setEmailBody(`Hi ${m.name},\n\nThank you for reaching out!\n\n`); setMessages((p) => p.map((msg) => msg.id === m.id ? { ...msg, read: true } : msg)); }}>
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-white text-sm">{m.name}</span>
                      <span className="text-xs text-gray-500">{format(new Date(m.createdAt), "MMM d, h:mm a")}</span>
                    </div>
                    <p className="text-gray-400 text-xs mb-1">{m.email}{m.phone && ` · ${m.phone}`}</p>
                    <p className="text-gray-300 text-sm line-clamp-2">{m.message}</p>
                    {!m.read && <span className="text-xs text-[#e81ccd] font-bold mt-1 block">● Unread</span>}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-lg font-black text-white mb-4">Compose Email</h2>
              <div className="card-dark rounded-2xl p-6 space-y-4">
                {[{label:"To",val:emailTo,set:setEmailTo,type:"email",ph:"client@email.com"},{label:"Subject",val:emailSub,set:setEmailSub,type:"text",ph:"Email subject..."}].map((f) => (
                  <div key={f.label}>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{f.label}</label>
                    <input type={f.type} value={f.val} onChange={(e) => f.set(e.target.value)} placeholder={f.ph}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#e81ccd]/60 text-sm" />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Message</label>
                  <textarea rows={7} value={emailBody} onChange={(e) => setEmailBody(e.target.value)} placeholder="Write your message..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#e81ccd]/60 text-sm resize-none" />
                </div>
                {emailRes === "sent" && <div className="flex items-center gap-2 text-green-400 text-sm"><CheckCircle2 size={16} />Email sent!</div>}
                {emailRes === "error" && <div className="flex items-center gap-2 text-red-400 text-sm"><AlertCircle size={16} />Failed. Check SMTP config in .env.local</div>}
                <button onClick={sendEmail} disabled={emailSending || !emailTo || !emailSub || !emailBody}
                  className="w-full py-3 rounded-xl font-bold uppercase tracking-wide text-white flex items-center justify-center gap-2 disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg,#e81ccd,#b5109e)" }}>
                  <Send size={16} />{emailSending ? "Sending..." : "Send Email"}
                </button>
                <p className="text-xs text-gray-600 text-center">Configure SMTP in .env.local to enable real email delivery.</p>
              </div>
            </div>
          </div>
        )}

        {/* Pricing */}
        {tab === "prices" && (
          <div className="card-dark rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-black text-white">Rental <span style={{ color: "#00e64d" }}>Pricing</span></h2>
                <p className="text-gray-500 text-sm mt-1">Prices shown on the Build Package page. Leave blank to hide.</p>
              </div>
              <button onClick={savePrices} disabled={pricesSaving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm uppercase tracking-wide text-white disabled:opacity-50 transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg,#00e64d,#00b33c)" }}>
                {pricesSaving ? <RefreshCw size={14} className="animate-spin" /> : pricesSaved ? <CheckCircle2 size={14} /> : <Save size={14} />}
                {pricesSaving ? "Saving…" : pricesSaved ? "Saved!" : "Save Prices"}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(prices).map(([id, entry]) => (
                <div key={id} className="bg-white/3 border border-white/8 rounded-2xl p-4">
                  <p className="text-white font-bold text-sm mb-3">{entry.label}</p>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">Price ($)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                        <input
                          type="number" min="0" step="1"
                          value={entry.price}
                          onChange={e => setPrices(p => ({ ...p, [id]: { ...p[id], price: e.target.value } }))}
                          placeholder="0"
                          className="w-full bg-white/5 border border-white/10 rounded-xl pl-7 pr-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-[#00e64d]/60 text-sm"
                        />
                      </div>
                    </div>
                    <div className="w-36">
                      <label className="block text-xs text-gray-500 mb-1">Unit label</label>
                      <input
                        type="text"
                        value={entry.unit}
                        onChange={e => setPrices(p => ({ ...p, [id]: { ...p[id], unit: e.target.value } }))}
                        placeholder="per event"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-[#00e64d]/60 text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Live Chat */}
        {tab === "chat" && (
          <div className="card-dark rounded-3xl overflow-hidden flex flex-col" style={{ height: "600px" }}>
            <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-[#00e64d] animate-pulse" />
              <span className="text-white font-bold">Live Chat</span>
              <span className="text-gray-500 text-sm">Admin Panel</span>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {chatMsgs.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "admin" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xs sm:max-w-sm rounded-2xl px-4 py-2.5 ${msg.role === "admin" ? "text-white rounded-br-sm" : "bg-white/5 border border-white/10 text-gray-200 rounded-bl-sm"}`}
                    style={msg.role === "admin" ? { background: "linear-gradient(135deg,#e81ccd,#b5109e)" } : {}}>
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.role === "admin" ? "text-pink-200/70" : "text-gray-500"}`}>{msg.role === "admin" ? "You" : "Visitor"} · {msg.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-white/5 flex gap-3">
              <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") sendChat(); }}
                placeholder="Type a message as admin..." className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#e81ccd]/60 text-sm" />
              <button onClick={sendChat} disabled={!chatInput.trim()}
                className="px-5 py-2.5 rounded-xl font-bold text-white disabled:opacity-40 flex items-center gap-2"
                style={{ background: "linear-gradient(135deg,#e81ccd,#b5109e)" }}>
                <Send size={16} /> Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
