"use client";

import React, { useState, useEffect, useRef } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface ConstructionData {
  reportType: "construction";
  area: number;
  houseType: "basic" | "standard" | "luxury";
  totalCost: number;
  civil: number;
  mep: number;
  finishing: number;
}

interface InteriorData {
  reportType: "interior";
  area: number;
  interiorType: "basic" | "standard" | "luxury";
  totalCost: number;
  materialCost: number;
  labourCost: number;
  designCost: number;
}

type CalcData = ConstructionData | InteriorData;

interface LeadMagnetModalProps {
  isOpen: boolean;
  onClose: () => void;
  calcData: CalcData;
  lang?: "en" | "hi";
  onQueued?: (email: string) => void;
}

// ── Main component ────────────────────────────────────────────────────────────
export default function LeadMagnetModal({
  isOpen,
  onClose,
  calcData,
  lang = "en",
  onQueued,
}: LeadMagnetModalProps) {
  const [name,   setName]   = useState("");
  const [email,  setEmail]  = useState("");
  const [errMsg, setErrMsg] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);

  // Reset form every time modal opens
  useEffect(() => {
    if (isOpen) {
      setName("");
      setEmail("");
      setErrMsg("");
      setTimeout(() => nameRef.current?.focus(), 80);
    }
  }, [isOpen]);

  // Trap Escape key
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const isConstruction = calcData.reportType === "construction";
  const title    = lang === "hi" ? "अपनी Detailed Report पाएं" : "Get Your Detailed Cost Report";
  const subtitle = lang === "hi"
    ? "नीचे अपना नाम और Email दर्ज करें — हम आपको PDF Report भेजेंगे।"
    : "Enter your details and we'll email you a comprehensive PDF report.";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrMsg(lang === "hi" ? "नाम दर्ज करें।" : "Please enter your name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrMsg(lang === "hi" ? "सही Email दर्ज करें।" : "Please enter a valid email address.");
      return;
    }

    // Close immediately and notify parent
    const submittedEmail = email.trim();
    onClose();
    onQueued?.(submittedEmail);

    // Fire-and-forget — don't await, don't block UI
    const payload = { name: name.trim(), email: submittedEmail, ...calcData };
    fetch("/api/send-report", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(payload),
    }).catch(() => {/* silently ignore — user already dismissed */});
  };

  if (!isOpen) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(3px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal card */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        style={{ maxHeight: "90vh", overflowY: "auto" }}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {/* Orange header */}
        <div className="bg-theme px-6 pt-6 pb-5 text-white">
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Icon */}
          <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z" />
            </svg>
          </div>

          <h2 className="text-lg font-bold leading-snug">{title}</h2>
          <p className="text-white/80 text-xs mt-1 leading-relaxed">{subtitle}</p>
        </div>

        {/* What's inside badges */}
        <div className="px-6 py-3 bg-neutral-50 border-b border-neutral-100">
          <p className="text-xs text-neutral-500 font-medium uppercase tracking-wide mb-2">
            {lang === "hi" ? "Report में शामिल है:" : "Your PDF Report Includes:"}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {(isConstruction
              ? ["Cost Breakdown", "Phase Details", "Room-wise Estimates", "Material Guide", "Timeline & Tips"]
              : ["Cost Breakdown", "Room-wise Interior", "What's Included", "Material Guide", "Timeline & Tips"]
            ).map((item) => (
              <span key={item} className="inline-flex items-center gap-1 text-[10px] font-semibold bg-white border border-neutral-200 text-neutral-600 rounded-full px-2 py-0.5">
                <svg className="w-2.5 h-2.5 text-theme" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="px-6 py-5">
          <form onSubmit={handleSubmit} noValidate>
            {/* Name field */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                {lang === "hi" ? "आपका नाम" : "Your Name"}
                <span className="text-red-500 ml-0.5">*</span>
              </label>
              <input
                ref={nameRef}
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setErrMsg(""); }}
                placeholder={lang === "hi" ? "जैसे — Rahul Sharma" : "e.g. Rahul Sharma"}
                className="w-full rounded-xl border-2 border-neutral-200 focus:border-theme bg-neutral-50 px-4 py-2.5 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 ring-theme transition-all"
              />
            </div>

            {/* Email field */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                {lang === "hi" ? "Email Address" : "Email Address"}
                <span className="text-red-500 ml-0.5">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrMsg(""); }}
                placeholder={lang === "hi" ? "जैसे — rahul@example.com" : "e.g. rahul@example.com"}
                className="w-full rounded-xl border-2 border-neutral-200 focus:border-theme bg-neutral-50 px-4 py-2.5 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 ring-theme transition-all"
              />
            </div>

            {/* Inline validation error */}
            {errMsg && (
              <div className="mb-4 flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">
                <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-xs text-red-600 font-medium">{errMsg}</p>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              className="w-full rounded-xl bg-theme hover-bg-theme py-3 text-sm font-bold text-white shadow-md shadow-theme active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>{lang === "hi" ? "Report Email करें — Free" : "Email Me the Free Report"}</span>
            </button>

            <p className="text-center text-[10px] text-neutral-400 mt-3">
              {lang === "hi"
                ? "हम आपकी जानकारी किसी के साथ share नहीं करते।"
                : "We respect your privacy. No spam, ever."}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
