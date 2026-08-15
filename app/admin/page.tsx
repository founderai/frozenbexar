"use client";

import { useState, useEffect, useCallback } from "react";
import {
  CalendarDays, Mail, MessageSquare, CheckCircle2, XCircle, Clock,
  Trash2, Send, RefreshCw, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Eye, EyeOff,
  Users, CalendarCheck, Inbox, AlertCircle, DollarSign, Save, Sparkles, Truck, Package
} from "lucide-react";
import DispatchTab from "./DispatchTab";
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

interface CatalogItem {
  id: string; name: string; sub: string; priceKey?: string;
  color: string; icon: string; image?: string; visible: boolean;
}
interface BundleItem {
  id: string; name: string; items: string; note: string;
  priceKey: string; color: string; icon: string; badge: string; visible: boolean;
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
  const [tab, setTab] = useState<"calendar" | "bookings" | "messages" | "chat" | "products" | "specials" | "dispatch">("calendar");
  const [specials, setSpecials] = useState<{ id: string; title: string; description: string; imageUrl: string; badge: string; expires: string }[]>([]);
  const [specialsSaving, setSpecialsSaving] = useState(false);
  const [specialsSaved, setSpecialsSaved] = useState(false);
  const [specialsSaveErr, setSpecialsSaveErr] = useState("");
  const [prices, setPrices] = useState<Record<string, { label: string; price: string; unit: string; discountNote?: string }>>({});
  const [pricesSaving, setPricesSaving] = useState(false);
  const [pricesSaved, setPricesSaved] = useState(false);
  const [pricesSaveErr, setPricesSaveErr] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [calDate, setCalDate] = useState(new Date());
  const [emailTo, setEmailTo] = useState(""); const [emailSub, setEmailSub] = useState(""); const [emailBody, setEmailBody] = useState("");
  const [emailSending, setEmailSending] = useState(false); const [emailRes, setEmailRes] = useState<"" | "sent" | "error">(""); const [emailErr, setEmailErr] = useState("");
  const [selectedMsg, setSelectedMsg] = useState<Message | null>(null);
  const [replyBody, setReplyBody] = useState(""); const [replySending, setReplySending] = useState(false); const [replyRes, setReplyRes] = useState<"" | "sent" | "error">(""); const [replyErr, setReplyErr] = useState("");
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [catalogSaving, setCatalogSaving] = useState(false); const [catalogSaved, setCatalogSaved] = useState(false); const [catalogSaveErr, setCatalogSaveErr] = useState("");
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const [savingAll, setSavingAll] = useState(false); const [savedAll, setSavedAll] = useState(false); const [saveAllErr, setSaveAllErr] = useState("");
  const [bundles, setBundles] = useState<BundleItem[]>([]);
  const [chatMsgs, setChatMsgs] = useState([
    { role: "visitor" as const, text: "Hi! I want to rent a margarita machine for my daughter's quinceañera!", time: "2:15 PM" },
    { role: "admin" as const, text: "We'd love to help! What date is the event?", time: "2:16 PM" },
  ]);
  const [chatInput, setChatInput] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [bRes, mRes, pRes, cRes, buRes] = await Promise.all([fetch("/api/booking"), fetch("/api/contact"), fetch("/api/prices"), fetch("/api/catalog"), fetch("/api/bundles")]);
      const bData = await bRes.json(); const mData = await mRes.json(); const pData = await pRes.json(); const cData = await cRes.json(); const buData = await buRes.json();
      setBookings(Array.isArray(bData) ? bData : []);
      setMessages(Array.isArray(mData) ? mData : []);
      if (pData && typeof pData === "object") setPrices(pData);
      if (Array.isArray(cData)) setCatalog(cData);
      if (Array.isArray(buData)) setBundles(buData);
      const sRes = await fetch("/api/specials"); const sData = await sRes.json();
      if (Array.isArray(sData)) setSpecials(sData);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }, []);

  const saveCatalog = async () => {
    setCatalogSaving(true); setCatalogSaved(false); setCatalogSaveErr("");
    try {
      const res = await fetch("/api/catalog", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: ADMIN_PASS, catalog }) });
      if (res.ok) { setCatalogSaved(true); setTimeout(() => setCatalogSaved(false), 3000); }
      else { const b = await res.json().catch(() => ({})); setCatalogSaveErr(`Failed: ${b?.error ?? "unknown"}`); }
    } catch { setCatalogSaveErr("Network error"); } finally { setCatalogSaving(false); }
  };

  const moveCatalogItem = (idx: number, dir: -1 | 1) => {
    setCatalog(p => { const a = [...p]; const bi = idx + dir; if (bi < 0 || bi >= a.length) return p; [a[idx], a[bi]] = [a[bi], a[idx]]; return a; });
  };

  const updateCatalogItem = (idx: number, key: string, value: unknown) => {
    setCatalog(p => p.map((item, i) => i === idx ? { ...item, [key]: value } : item));
  };

  const removeCatalogItem = (idx: number) => {
    if (!confirm("Remove this product from the quote page?")) return;
    setCatalog(p => p.filter((_, i) => i !== idx));
  };

  const addCatalogItem = () => {
    setCatalog(p => [...p, { id: "new-product", name: "New Product", sub: "Description", color: "#00e64d", icon: "Armchair", visible: true }]);
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Delete this message permanently?")) return;
    await fetch("/api/contact", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setMessages(p => p.filter(m => m.id !== id));
    if (selectedMsg?.id === id) setSelectedMsg(null);
  };

  const handleImageUpload = async (idx: number, file: File) => {
    setUploadingIdx(idx);
    try {
      const fd = new FormData(); fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (json.url) { updateCatalogItem(idx, "image", json.url); }
      else { alert(`Upload failed: ${json.error ?? "unknown error"}`); }
    } catch { alert("Upload failed — network error"); }
    finally { setUploadingIdx(null); }
  };

  const saveAll = async () => {
    setSavingAll(true); setSavedAll(false); setSaveAllErr("");
    try {
      const [cRes, pRes, buRes] = await Promise.all([
        fetch("/api/catalog", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: ADMIN_PASS, catalog }) }),
        fetch("/api/prices", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: ADMIN_PASS, prices }) }),
        fetch("/api/bundles", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: ADMIN_PASS, bundles }) }),
      ]);
      if (cRes.ok && pRes.ok && buRes.ok) { setSavedAll(true); setTimeout(() => setSavedAll(false), 3000); }
      else {
        const errs: string[] = [];
        if (!cRes.ok) { const b = await cRes.json().catch(() => ({})); errs.push(`Products: ${b?.error ?? cRes.status}`); }
        if (!pRes.ok) { const b = await pRes.json().catch(() => ({})); errs.push(`Prices: ${b?.error ?? pRes.status}`); }
        if (!buRes.ok) { const b = await buRes.json().catch(() => ({})); errs.push(`Bundles: ${b?.error ?? buRes.status}`); }
        setSaveAllErr(errs.join(" · "));
      }
    } catch { setSaveAllErr("Network error"); } finally { setSavingAll(false); }
  };

  const moveBundleItem = (idx: number, dir: -1 | 1) => {
    setBundles(p => { const a = [...p]; const bi = idx + dir; if (bi < 0 || bi >= a.length) return p; [a[idx], a[bi]] = [a[bi], a[idx]]; return a; });
  };
  const updateBundleItem = (idx: number, key: string, value: unknown) => {
    setBundles(p => p.map((item, i) => i === idx ? { ...item, [key]: value } : item));
  };
  const removeBundleItem = (idx: number) => {
    if (!confirm("Remove this bundle?")) return;
    setBundles(p => p.filter((_, i) => i !== idx));
  };
  const addBundleItem = () => {
    setBundles(p => [...p, { id: "new-bundle", name: "New Bundle", items: "Item 1 · Item 2", note: "Delivery included", priceKey: "new-bundle", color: "#00e64d", icon: "Sparkles", badge: "", visible: true }]);
  };

  const savePrices = async () => {
    setPricesSaving(true); setPricesSaved(false); setPricesSaveErr("");
    try {
      const res = await fetch("/api/prices", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: ADMIN_PASS, prices }) });
      if (res.ok) {
        setPricesSaved(true);
        setTimeout(() => setPricesSaved(false), 3000);
      } else {
        const body = await res.json().catch(() => ({}));
        setPricesSaveErr(`Save failed (${res.status}): ${body?.error ?? "unknown error"}`);
      }
    } catch (e) {
      setPricesSaveErr("Network error — could not reach the server.");
      console.error(e);
    } finally { setPricesSaving(false); }
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
    setEmailSending(true); setEmailErr("");
    try {
      const res = await fetch("/api/email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ to: emailTo, subject: emailSub, body: emailBody }) });
      if (res.ok) { setEmailRes("sent"); } else { const d = await res.json().catch(() => ({})); setEmailRes("error"); setEmailErr(d?.error ?? "Unknown error"); }
    } catch { setEmailRes("error"); setEmailErr("Network error"); } finally { setEmailSending(false); }
  };

  const sendReply = async () => {
    if (!selectedMsg || !replyBody.trim()) return;
    setReplySending(true); setReplyErr("");
    const subject = `Re: Your message to Frozen Bexar`;
    const body = `Hi ${selectedMsg.name},\n\n${replyBody}\n\n— Frozen Bexar Team`;
    try {
      const res = await fetch("/api/email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ to: selectedMsg.email, subject, body }) });
      if (res.ok) { setReplyRes("sent"); setReplyBody(""); setTimeout(() => setReplyRes(""), 4000); }
      else { const d = await res.json().catch(() => ({})); setReplyRes("error"); setReplyErr(d?.error ?? "Unknown error"); }
    } catch { setReplyRes("error"); setReplyErr("Network error"); } finally { setReplySending(false); }
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
            { key: "products", label: "Products & Pricing", icon: <Package size={15} /> },
            { key: "specials", label: "Specials", icon: <Sparkles size={15} /> },
            { key: "dispatch", label: "Dispatch", icon: <Truck size={15} /> },
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
            {/* LEFT — Message list */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-black text-white">
                  Contact Messages {unreadCount > 0 && <span className="ml-2 text-xs bg-yellow-400 text-black rounded-full px-2 py-0.5 font-black">{unreadCount} new</span>}
                </h2>
                <button onClick={() => { setSelectedMsg(null); setEmailTo(""); setEmailSub(""); setEmailBody(""); setEmailRes(""); }}
                  className="text-xs px-3 py-1.5 rounded-lg border border-[#e81ccd]/30 text-[#e81ccd] hover:bg-[#e81ccd]/10 transition-all flex items-center gap-1.5">
                  <Mail size={12} /> New Email
                </button>
              </div>
              <div className="space-y-2">
                {messages.length === 0 ? (
                  <div className="card-dark rounded-2xl p-8 text-center text-gray-500 text-sm">No messages yet.</div>
                ) : messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((m) => (
                  <div key={m.id}
                    className={`card-dark rounded-2xl p-4 cursor-pointer transition-all hover:border-[#e81ccd]/50 ${selectedMsg?.id === m.id ? "border-[#e81ccd]/60 bg-[#e81ccd]/5" : !m.read ? "border-[#e81ccd]/30" : "border-white/5"}`}
                    onClick={() => {
                      setSelectedMsg(m);
                      setReplyBody(""); setReplyRes(""); setReplyErr("");
                      setMessages((p) => p.map((msg) => msg.id === m.id ? { ...msg, read: true } : msg));
                    }}>
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-white text-sm">{m.name}</span>
                      <span className="text-xs text-gray-500">{format(new Date(m.createdAt), "MMM d, h:mm a")}</span>
                    </div>
                    <p className="text-gray-400 text-xs mb-1">{m.email}{m.phone && ` · ${m.phone}`}</p>
                    <p className="text-gray-400 text-sm line-clamp-2">{m.message}</p>
                    <div className="flex items-center justify-between mt-1">
                      {!m.read && <span className="text-xs text-[#e81ccd] font-bold">● Unread</span>}
                      <button onClick={e => { e.stopPropagation(); deleteMessage(m.id); }} className="ml-auto p-1 text-gray-600 hover:text-red-400 transition-colors rounded"><Trash2 size={12} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — Message detail + reply OR compose */}
            <div>
              {selectedMsg ? (
                <div>
                  {/* Message detail */}
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-black text-white">Message</h2>
                    <button onClick={() => setSelectedMsg(null)} className="text-gray-500 hover:text-gray-300 text-xs">✕ Close</button>
                  </div>
                  <div className="card-dark rounded-2xl p-5 mb-4 border border-white/10">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-black text-white">{selectedMsg.name}</p>
                        <p className="text-[#e81ccd] text-xs">{selectedMsg.email}{selectedMsg.phone && ` · ${selectedMsg.phone}`}</p>
                      </div>
                      <span className="text-xs text-gray-500 shrink-0">{format(new Date(selectedMsg.createdAt), "MMM d, yyyy h:mm a")}</span>
                    </div>
                    <div className="bg-white/3 rounded-xl p-4 text-gray-200 text-sm leading-relaxed whitespace-pre-wrap border border-white/5">
                      {selectedMsg.message}
                    </div>
                  </div>

                  {/* Reply form */}
                  <div className="card-dark rounded-2xl p-5 border border-[#e81ccd]/20 space-y-3">
                    <p className="text-xs font-bold text-[#e81ccd] uppercase tracking-wider flex items-center gap-1.5"><Send size={11} /> Reply to {selectedMsg.name}</p>
                    <textarea
                      rows={6}
                      value={replyBody}
                      onChange={(e) => setReplyBody(e.target.value)}
                      placeholder={`Write your reply to ${selectedMsg.name}...`}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#e81ccd]/60 text-sm resize-none"
                    />
                    {replyRes === "sent" && <div className="flex items-center gap-2 text-green-400 text-sm"><CheckCircle2 size={15} />Reply sent to {selectedMsg.email}!</div>}
                    {replyRes === "error" && <div className="text-red-400 text-xs"><AlertCircle size={13} className="inline mr-1" />{replyErr || "Failed to send reply."}</div>}
                    <button onClick={sendReply} disabled={replySending || !replyBody.trim()}
                      className="w-full py-2.5 rounded-xl font-bold uppercase tracking-wide text-white flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:scale-[1.01]"
                      style={{ background: "linear-gradient(135deg,#e81ccd,#b5109e)" }}>
                      <Send size={14} />{replySending ? "Sending..." : "Send Reply"}
                    </button>
                  </div>
                </div>
              ) : (
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
                    {emailRes === "error" && <div className="text-red-400 text-xs"><AlertCircle size={13} className="inline mr-1" />{emailErr || "Failed to send."}</div>}
                    <button onClick={sendEmail} disabled={emailSending || !emailTo || !emailSub || !emailBody}
                      className="w-full py-3 rounded-xl font-bold uppercase tracking-wide text-white flex items-center justify-center gap-2 disabled:opacity-50"
                      style={{ background: "linear-gradient(135deg,#e81ccd,#b5109e)" }}>
                      <Send size={16} />{emailSending ? "Sending..." : "Send Email"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Products & Pricing */}
        {tab === "products" && (
          <div className="space-y-8">

            {/* ── Main Rental Products ── */}
            <div className="card-dark rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-black text-white">Products <span style={{ color: "#00e64d" }}>&amp; Pricing</span></h2>
                  <p className="text-gray-500 text-sm mt-1">Reorder with arrows · click photo to upload · set price inline. One save updates everything.</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={addCatalogItem} className="px-4 py-2 rounded-xl font-bold text-sm text-white border border-white/20 hover:border-[#00e64d]/60 transition-all">
                    + Add Product
                  </button>
                  <button onClick={saveAll} disabled={savingAll}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm uppercase tracking-wide text-white disabled:opacity-50 transition-all hover:scale-105"
                    style={{ background: "linear-gradient(135deg,#00e64d,#00b33c)" }}>
                    {savingAll ? <RefreshCw size={14} className="animate-spin" /> : savedAll ? <CheckCircle2 size={14} /> : <Save size={14} />}
                    {savingAll ? "Saving…" : savedAll ? "Saved!" : "Save All"}
                  </button>
                </div>
              </div>
              {saveAllErr && <p className="text-xs text-red-400 mb-3 text-right">{saveAllErr}</p>}

              {catalog.length === 0 ? (
                <p className="text-gray-600 text-center py-10">Loading… or click &quot;+ Add Product&quot;.</p>
              ) : (
                <div className="space-y-2">
                  {catalog.map((item, idx) => (
                    <div key={`${item.id}-${idx}`}
                      className={`bg-white/3 border rounded-2xl p-3 flex flex-wrap xl:flex-nowrap items-center gap-3 transition-all ${item.visible ? "border-white/8" : "border-white/3 opacity-50"}`}>

                      {/* Reorder */}
                      <div className="flex flex-col gap-0.5 shrink-0">
                        <button onClick={() => moveCatalogItem(idx, -1)} disabled={idx === 0} className="p-1 text-gray-500 hover:text-white disabled:opacity-20 transition-colors rounded"><ChevronUp size={13} /></button>
                        <button onClick={() => moveCatalogItem(idx, 1)} disabled={idx === catalog.length - 1} className="p-1 text-gray-500 hover:text-white disabled:opacity-20 transition-colors rounded"><ChevronDown size={13} /></button>
                      </div>

                      {/* Photo upload */}
                      <div className="relative shrink-0 group cursor-pointer"
                        onClick={() => (document.getElementById(`upload-${idx}`) as HTMLInputElement)?.click()}>
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 flex items-center justify-center bg-white/5">
                          {uploadingIdx === idx
                            ? <RefreshCw size={14} className="animate-spin text-gray-400" />
                            : item.image
                              ? <img src={item.image} alt="" className="w-full h-full object-cover" />
                              : <div className="w-4 h-4 rounded-full" style={{ background: item.color }} />}
                        </div>
                        <div className="absolute inset-0 rounded-xl bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <span className="text-white text-[10px] font-black">📷</span>
                        </div>
                        <input type="file" id={`upload-${idx}`} accept="image/*" className="hidden"
                          onChange={e => { if (e.target.files?.[0]) handleImageUpload(idx, e.target.files[0]); e.target.value = ""; }} />
                      </div>

                      {/* Name / Sub / Price key */}
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2 min-w-0">
                        <input value={item.name} onChange={e => updateCatalogItem(idx, "name", e.target.value)} placeholder="Display name"
                          className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-white text-sm focus:outline-none focus:border-[#00e64d]/60" />
                        <input value={item.sub} onChange={e => updateCatalogItem(idx, "sub", e.target.value)} placeholder="Subtitle"
                          className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-white text-sm focus:outline-none focus:border-[#00e64d]/60" />
                        <input value={item.id} onChange={e => updateCatalogItem(idx, "id", e.target.value)} placeholder="Price key (e.g. chair)"
                          className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-gray-400 text-sm font-mono focus:outline-none focus:border-[#00e64d]/60" />
                      </div>

                      {/* Inline price */}
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-gray-500 text-xs font-bold">$</span>
                        <input type="number" min="0" step="any"
                          value={prices[item.id]?.price ?? ""}
                          onChange={e => setPrices(p => ({ ...p, [item.id]: { ...(p[item.id] ?? { label: item.name, unit: "each" }), price: e.target.value } }))}
                          placeholder="—"
                          className="w-16 bg-white/5 border border-white/10 rounded-xl px-2 py-1.5 text-white text-sm text-center focus:outline-none focus:border-[#00e64d]/60" />
                      </div>

                      {/* Color */}
                      <select value={item.color} onChange={e => updateCatalogItem(idx, "color", e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-2 py-1.5 text-white text-xs focus:outline-none shrink-0">
                        <option value="#00e64d">Green</option>
                        <option value="#e81ccd">Pink</option>
                        <option value="#f5e642">Yellow</option>
                      </select>

                      {/* Icon */}
                      <select value={item.icon} onChange={e => updateCatalogItem(idx, "icon", e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-2 py-1.5 text-white text-xs focus:outline-none shrink-0">
                        {["Armchair","Table2","Umbrella","Tent","Snowflake","Wind","Trophy","Sparkles","UtensilsCrossed","Package"].map(ic => (
                          <option key={ic} value={ic}>{ic}</option>
                        ))}
                      </select>

                      {/* Visible */}
                      <button onClick={() => updateCatalogItem(idx, "visible", !item.visible)}
                        className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${item.visible ? "border-[#00e64d]/40 text-[#00e64d] bg-[#00e64d]/10" : "border-white/10 text-gray-500 bg-white/3"}`}>
                        {item.visible ? "Visible" : "Hidden"}
                      </button>

                      {/* Delete */}
                      <button onClick={() => removeCatalogItem(idx)} className="shrink-0 p-2 text-red-400/50 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Add-On & Bundle Pricing ── */}
            <div className="card-dark rounded-3xl p-6">
              <h2 className="text-xl font-black text-white mb-1">Add-On <span style={{ color: "#e81ccd" }}>Prices</span></h2>
              <p className="text-gray-500 text-sm mb-5">Fans, lights, upgraded bar, yard games, and bundle specials. Hit <strong className="text-white">Save All</strong> above to apply.</p>
              {(() => {
                const ADDON_IDS  = ["upgraded-bar","fan-1","fan-2","lights","walls","linens","cornhole","giant-connect-four","yard-games"];
                const BUNDLE_IDS = ["spring-special","canopy-13x26-bundle","margarita-special"];

                const PriceCard = (id: string, entry: typeof prices[string]) => (
                  <div key={id} className="bg-white/3 border border-white/8 rounded-2xl p-4">
                    <p className="text-white font-bold text-sm mb-3">{entry.label}</p>
                    <div className="flex gap-3 mb-3">
                      <div className="flex-1">
                        <label className="block text-xs text-gray-500 mb-1">Price ($)</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                          <input type="number" min="0" step="any" value={entry.price}
                            onChange={e => setPrices(p => ({ ...p, [id]: { ...p[id], price: e.target.value } }))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-7 pr-3 py-2 text-white focus:outline-none focus:border-[#00e64d]/60 text-sm" />
                        </div>
                      </div>
                      <div className="w-32">
                        <label className="block text-xs text-gray-500 mb-1">Unit</label>
                        <input type="text" value={entry.unit}
                          onChange={e => setPrices(p => ({ ...p, [id]: { ...p[id], unit: e.target.value } }))}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00e64d]/60 text-sm" />
                      </div>
                    </div>
                    <input type="text" value={entry.discountNote ?? ""}
                      onChange={e => setPrices(p => ({ ...p, [id]: { ...p[id], discountNote: e.target.value } }))}
                      placeholder='Discount note — e.g. "2 fans = $115"'
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-[#e81ccd]/60 text-sm" />
                  </div>
                );

                const SL = (label: string, accent: string) => (
                  <p className="text-xs font-black uppercase tracking-widest mb-3 mt-5 first:mt-0" style={{ color: accent }}>{label}</p>
                );

                return (
                  <div>
                    {SL("Add-Ons", "#e81ccd")}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {ADDON_IDS.filter(id => prices[id]).map(id => PriceCard(id, prices[id]))}
                    </div>
                    {SL("Special Bundles", "#f5e642")}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {BUNDLE_IDS.filter(id => prices[id]).map(id => PriceCard(id, prices[id]))}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* ── Special Bundles ── */}
            <div className="card-dark rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-black text-white">Special <span style={{ color: "#f5e642" }}>Bundles</span></h2>
                  <p className="text-gray-500 text-sm mt-1">Shown on the quote page as pre-built packages. Price key must exist in the Pricing section above.</p>
                </div>
                <button onClick={addBundleItem} className="px-4 py-2 rounded-xl font-bold text-sm text-white border border-white/20 hover:border-[#f5e642]/60 transition-all">
                  + Add Bundle
                </button>
              </div>
              {bundles.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No bundles yet. Click &quot;+ Add Bundle&quot; to create one.</p>
              ) : (
                <div className="space-y-2">
                  {bundles.map((b, idx) => (
                    <div key={`${b.id}-${idx}`}
                      className={`bg-white/3 border rounded-2xl p-3 flex flex-wrap xl:flex-nowrap items-center gap-3 transition-all ${b.visible ? "border-white/8" : "border-white/3 opacity-50"}`}>
                      {/* Reorder */}
                      <div className="flex flex-col gap-0.5 shrink-0">
                        <button onClick={() => moveBundleItem(idx, -1)} disabled={idx === 0} className="p-1 text-gray-500 hover:text-white disabled:opacity-20 transition-colors rounded"><ChevronUp size={13} /></button>
                        <button onClick={() => moveBundleItem(idx, 1)} disabled={idx === bundles.length - 1} className="p-1 text-gray-500 hover:text-white disabled:opacity-20 transition-colors rounded"><ChevronDown size={13} /></button>
                      </div>
                      {/* Color swatch */}
                      <div className="w-2.5 h-10 rounded-full shrink-0" style={{ background: b.color }} />
                      {/* Fields */}
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 min-w-0">
                        <input value={b.name} onChange={e => updateBundleItem(idx, "name", e.target.value)} placeholder="Bundle name"
                          className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-white text-sm focus:outline-none focus:border-[#f5e642]/60" />
                        <input value={b.items} onChange={e => updateBundleItem(idx, "items", e.target.value)} placeholder="Items (e.g. Tent · 4 T&C Sets)"
                          className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-white text-sm focus:outline-none focus:border-[#f5e642]/60" />
                        <input value={b.note} onChange={e => updateBundleItem(idx, "note", e.target.value)} placeholder="Note shown to customer"
                          className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-white text-sm focus:outline-none focus:border-[#f5e642]/60" />
                        <input value={b.priceKey} onChange={e => updateBundleItem(idx, "priceKey", e.target.value)} placeholder="Price key"
                          className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-gray-400 text-sm font-mono focus:outline-none focus:border-[#f5e642]/60" />
                      </div>
                      {/* Badge */}
                      <input value={b.badge} onChange={e => updateBundleItem(idx, "badge", e.target.value)} placeholder="Badge (optional)"
                        className="w-28 bg-white/5 border border-white/10 rounded-xl px-2 py-1.5 text-white text-xs focus:outline-none shrink-0" />
                      {/* Color */}
                      <select value={b.color} onChange={e => updateBundleItem(idx, "color", e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-2 py-1.5 text-white text-xs focus:outline-none shrink-0">
                        <option value="#f5e642">Yellow</option>
                        <option value="#e81ccd">Pink</option>
                        <option value="#00e64d">Green</option>
                      </select>
                      {/* Icon */}
                      <select value={b.icon} onChange={e => updateBundleItem(idx, "icon", e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-2 py-1.5 text-white text-xs focus:outline-none shrink-0">
                        {["Sparkles","Umbrella","Tent","Snowflake","Armchair","Table2","Wind","Trophy","Package"].map(ic => (
                          <option key={ic} value={ic}>{ic}</option>
                        ))}
                      </select>
                      {/* Visible */}
                      <button onClick={() => updateBundleItem(idx, "visible", !b.visible)}
                        className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${b.visible ? "border-[#00e64d]/40 text-[#00e64d] bg-[#00e64d]/10" : "border-white/10 text-gray-500 bg-white/3"}`}>
                        {b.visible ? "Visible" : "Hidden"}
                      </button>
                      {/* Delete */}
                      <button onClick={() => removeBundleItem(idx)} className="shrink-0 p-2 text-red-400/50 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* Specials */}
        {tab === "specials" && (
          <div className="card-dark rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-black text-white">Seasonal <span style={{ color: "#f5e642" }}>Specials</span></h2>
                <p className="text-gray-500 text-sm mt-1">Shown on the /specials page. Add image URLs from any hosting service.</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setSpecials(p => [...p, { id: Date.now().toString(), title: "", description: "", imageUrl: "", badge: "", expires: "" }])}
                  className="px-4 py-2 rounded-xl font-bold text-sm text-white border border-white/20 hover:border-[#f5e642]/60 transition-all">
                  + Add Special
                </button>
                <button onClick={async () => {
                  setSpecialsSaving(true); setSpecialsSaved(false); setSpecialsSaveErr("");
                  try {
                    const res = await fetch("/api/specials", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: ADMIN_PASS, specials }) });
                    if (res.ok) { setSpecialsSaved(true); setTimeout(() => setSpecialsSaved(false), 3000); }
                    else { const b = await res.json().catch(() => ({})); setSpecialsSaveErr(`Failed: ${b?.error ?? "unknown"}`); }
                  } catch { setSpecialsSaveErr("Network error"); } finally { setSpecialsSaving(false); }
                }} disabled={specialsSaving}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm uppercase tracking-wide text-white disabled:opacity-50 transition-all hover:scale-105"
                  style={{ background: "linear-gradient(135deg,#f5e642,#ffb700)", color: "#000" }}>
                  {specialsSaving ? <RefreshCw size={14} className="animate-spin" /> : specialsSaved ? <CheckCircle2 size={14} /> : <Save size={14} />}
                  {specialsSaving ? "Saving…" : specialsSaved ? "Saved!" : "Save"}
                </button>
              </div>
            </div>
            {specialsSaveErr && <p className="text-xs text-red-400 mb-4 text-right">{specialsSaveErr}</p>}
            {specials.length === 0 ? (
              <p className="text-gray-600 text-center py-10">No specials yet. Click &ldquo;+ Add Special&rdquo; to create one.</p>
            ) : (
              <div className="space-y-4">
                {specials.map((s, i) => (
                  <div key={s.id} className="bg-white/3 border border-white/8 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Title</label>
                      <input type="text" value={s.title} onChange={e => setSpecials(p => p.map((x, j) => j===i ? {...x, title: e.target.value} : x))} placeholder="e.g. Summer Bundle Deal" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-[#f5e642]/60 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Badge <span className="text-gray-600">(e.g. &ldquo;Hot Deal&rdquo;)</span></label>
                      <input type="text" value={s.badge} onChange={e => setSpecials(p => p.map((x, j) => j===i ? {...x, badge: e.target.value} : x))} placeholder="Optional" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-[#f5e642]/60 text-sm" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-gray-500 mb-1">Description</label>
                      <textarea value={s.description} onChange={e => setSpecials(p => p.map((x, j) => j===i ? {...x, description: e.target.value} : x))} placeholder="Describe the special or promotion…" rows={2} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-[#f5e642]/60 text-sm resize-none" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Image URL</label>
                      <input type="text" value={s.imageUrl} onChange={e => setSpecials(p => p.map((x, j) => j===i ? {...x, imageUrl: e.target.value} : x))} placeholder="https://…" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-[#f5e642]/60 text-sm" />
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="block text-xs text-gray-500 mb-1">Expires</label>
                        <input type="text" value={s.expires} onChange={e => setSpecials(p => p.map((x, j) => j===i ? {...x, expires: e.target.value} : x))} placeholder="e.g. June 30, 2025" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-[#f5e642]/60 text-sm" />
                      </div>
                      <div className="flex items-end">
                        <button onClick={() => setSpecials(p => p.filter((_, j) => j !== i))} className="px-3 py-2 rounded-xl text-red-400 hover:bg-red-400/10 border border-red-400/20 transition-all">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Dispatch */}
        {tab === "dispatch" && <DispatchTab />}

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
