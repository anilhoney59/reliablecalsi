"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Footer from "../../components/footer";
import Link from "next/link";
import LeadMagnetModal from "../../components/ui-components/lead-magnet-modal";

type InteriorType = "basic" | "standard" | "luxury";
type Lang = "en" | "hi";

const RATES: Record<InteriorType, number> = {
  basic: 765,
  standard: 1145,
  luxury: 1525,
};

// ── All UI text in both languages ──────────────────────────────────────────
const T = {
  en: {
    backHome: "Back to Home",
    pageTitle: "Home Interior Cost in 2026",
    pageSubtitle: "Get an instant interior estimate for your dream home",
    areaLabel: "Carpet Area",
    areaUnit: "(in sq. ft.)",
    areaPlaceholder: "e.g. 1000 sqft",
    areaUnitSuffix: "sq. ft.",
    areaError: "Please enter a valid carpet area.",
    areaTooltip: "Carpet Area is the usable floor area inside your home where interior work will be done. This is the area measured from inner wall to inner wall, excluding wall thickness.",
    interiorTypeLabel: "Interior Type",
    options: [
      {
        label: "Basic Interior",
        desc: "Wardrobe · Basic Kitchen · Bed · Sofa",
      },
      {
        label: "Standard Interior",
        desc: "Soft-Close Modular Kitchen · TV Unit · False Ceiling & more",
      },
      {
        label: "Luxury Interior",
        desc: "Acrylic Modular Kitchen · Top-Notch Hardware · Wall Panelling · Modern Design",
      },
    ],
    calculateBtn: "Calculate Cost",
    resultBanner: "Estimated Interior Cost",
    breakdown: "Cost Breakdown",
    material: "Material Cost",
    materialSub: "Furniture · Fixtures · Fittings · Hardware",
    labour: "Labour Cost",
    labourSub: "Carpentry · Installation · Civil Work",
    design: "Design Cost",
    designSub: "Interior Design · 3D Visualisation · Project Management",
    materialLabel: "Material + Labour + Design",
    disclaimer:
      "* This is an approximate estimate. Actual costs may vary based on location, design complexity, brand choices and material quality.",
    ctaTitle: "Need a detailed interior quote?",
    ctaDesc: "Talk to our interior experts for a precise estimate tailored to your space.",
    ctaBtn: "Chat on WhatsApp",
  },
  hi: {
    backHome: "Home पर वापस जाएं",
    pageTitle: "2026 में Home Interior Cost",
    pageSubtitle: "अपने सपनों के घर का Interior Estimate तुरंत पाएं",
    areaLabel: "Carpet Area",
    areaUnit: "(sq. ft. में)",
    areaPlaceholder: "जैसे 1000 sqft",
    areaUnitSuffix: "sq. ft.",
    areaError: "कृपया एक सही Carpet Area दर्ज करें।",
    areaTooltip: "Carpet Area वह usable floor area है जहाँ Interior का काम होगा। यह inner wall से inner wall तक measure होता है, wall thickness को छोड़कर।",
    interiorTypeLabel: "Interior का प्रकार",
    options: [
      {
        label: "Basic Interior",
        desc: "Wardrobe · Basic Kitchen · Bed · Sofa",
      },
      {
        label: "Standard Interior",
        desc: "Soft-Close Modular Kitchen · TV Unit · False Ceiling और अधिक",
      },
      {
        label: "Luxury Interior",
        desc: "Acrylic Modular Kitchen · Top-Notch Hardware · Wall Panelling · Modern Design",
      },
    ],
    calculateBtn: "Cost Calculate करें",
    resultBanner: "अनुमानित Interior Cost",
    breakdown: "Cost Breakdown",
    material: "Material Cost",
    materialSub: "Furniture · Fixtures · Fittings · Hardware",
    labour: "Labour Cost",
    labourSub: "Carpentry · Installation · Civil Work",
    design: "Design Cost",
    designSub: "Interior Design · 3D Visualisation · Project Management",
    materialLabel: "Material + Labour + Design",
    disclaimer:
      "* यह एक अनुमानित Estimate है। वास्तविक Cost, Location, Brand और Material Quality के आधार पर अलग हो सकती है।",
    ctaTitle: "Detailed Interior Quote चाहिए?",
    ctaDesc: "अपने Space के लिए सटीक Estimate हेतु हमारे Interior Experts से बात करें।",
    ctaBtn: "WhatsApp पर Chat करें",
  },
};

const INTERIOR_KEYS: InteriorType[] = ["basic", "standard", "luxury"];

function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatWords(amount: number): string {
  if (amount >= 10000000) {
    const cr = amount / 10000000;
    return `${parseFloat(cr.toFixed(2))} Cr`;
  } else if (amount >= 100000) {
    const lac = amount / 100000;
    return `${parseFloat(lac.toFixed(2))} Lac`;
  } else if (amount >= 1000) {
    const k = amount / 1000;
    return `${parseFloat(k.toFixed(1))}K`;
  }
  return amount.toString();
}

// ── Report sneak-peek slider (lazy-loaded, ping-pong) ─────────────────────────
const INTERIOR_REPORT_SLIDES = [
  { src: "/assets/images/c_gif1.webp", label: "Room-wise Costs"    },
  { src: "/assets/images/c_gif2.webp", label: "What's Included"    },
  { src: "/assets/images/c_gif3.webp", label: "Material Guide"     },
  { src: "/assets/images/c_gif4.webp", label: "Timeline & Tips"    },
] as const;

function InteriorReportPreviewSlider() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(false);
  const wrapRef               = useRef<HTMLDivElement>(null);
  const dirRef                = useRef(1); // +1 forward, -1 backward

  // Mount images only when scrolled into view
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Ping-pong auto-advance every 2 s
  useEffect(() => {
    if (!visible) return;
    const id = setInterval(() => {
      setCurrent(prev => {
        let next = prev + dirRef.current;
        if (next >= INTERIOR_REPORT_SLIDES.length)  { dirRef.current = -1; next = INTERIOR_REPORT_SLIDES.length - 2; }
        else if (next < 0)                          { dirRef.current =  1; next = 1; }
        return next;
      });
    }, 2000);
    return () => clearInterval(id);
  }, [visible]);

  return (
    <div ref={wrapRef} className="w-full">
      {visible ? (
        <div
          className="relative mx-auto overflow-hidden rounded-2xl border border-neutral-100 shadow-sm bg-neutral-50"
          style={{ maxWidth: 313 }}
        >
          {/* Crossfade image layer */}
          <div className="relative h-44">
            {INTERIOR_REPORT_SLIDES.map((slide, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={slide.src}
                src={slide.src}
                alt={slide.label}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-contain transition-opacity duration-500"
                style={{ opacity: i === current ? 1 : 0 }}
              />
            ))}
            {/* Bottom gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none rounded-2xl" />
            {/* Caption */}
            <p className="absolute bottom-2 left-3 text-white text-xs font-semibold z-10 drop-shadow-sm">
              {INTERIOR_REPORT_SLIDES[current].label}
            </p>
            {/* Pill dot indicators */}
            <div className="absolute bottom-3 right-3 flex gap-1 z-10">
              {INTERIOR_REPORT_SLIDES.map((_, i) => (
                <span
                  key={i}
                  className="block rounded-full transition-all duration-300"
                  style={{
                    width:           i === current ? 16 : 6,
                    height:          6,
                    backgroundColor: i === current ? "#ffffff" : "rgba(255,255,255,0.45)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Skeleton while off-screen */
        <div
          className="mx-auto rounded-2xl bg-neutral-100 animate-pulse"
          style={{ maxWidth: 272, height: 176 }}
        />
      )}
    </div>
  );
}

export default function InteriorCostCalculator() {
  const [lang, setLang]               = useState<Lang>("en");
  const [area, setArea]               = useState<string>("");
  const [interiorType, setInteriorType] = useState<InteriorType>("standard");
  const [result, setResult]           = useState<number | null>(null);
  const [error, setError]             = useState<string>("");
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [toastEmail, setToastEmail] = useState<string>("");
  const inputRef                      = useRef<HTMLInputElement>(null);
  const tooltipRef                    = useRef<HTMLDivElement>(null);
  const hasShaken                     = useRef(false);
  const [shakeCTA, setShakeCTA]       = useState(false);

  const t = T[lang];

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Shake the CTA button 3 separate times (2-second gap between each) once the
  // result card is visible and the user has scrolled past 80 px.
  useEffect(() => {
    const ANIM_MS = 600;          // slightly > 0.55s CSS duration
    const GAP_MS  = 2000;         // 2s gap between shakes
    const CYCLE   = ANIM_MS + GAP_MS;
    let timers: ReturnType<typeof setTimeout>[] = [];

    const doShakes = () => {
      if (hasShaken.current) return;
      hasShaken.current = true;
      setShakeCTA(true);
      timers = [
        setTimeout(() => setShakeCTA(false), ANIM_MS),
        setTimeout(() => setShakeCTA(true),  CYCLE),
        setTimeout(() => setShakeCTA(false), CYCLE + ANIM_MS),
        setTimeout(() => setShakeCTA(true),  CYCLE * 2),
        setTimeout(() => setShakeCTA(false), CYCLE * 2 + ANIM_MS),
      ];
    };

    const onScroll = () => {
      if (result !== null && window.scrollY > 80) doShakes();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // If result just rendered and page is already scrolled past threshold
    if (result !== null && window.scrollY > 80) setTimeout(doShakes, 300);

    return () => {
      window.removeEventListener("scroll", onScroll);
      timers.forEach(clearTimeout);
    };
  }, [result]);

  const handleCalculate = () => {
    const areaNum = parseFloat(area);
    if (!area || isNaN(areaNum) || areaNum <= 0) {
      setError(t.areaError);
      setResult(null);
      return;
    }
    setError("");
    setResult(areaNum * RATES[interiorType]);
  };

  const toggleLang = () => {
    setLang((l) => (l === "en" ? "hi" : "en"));
    setResult(null);
    setError("");
  };

  // Breakdown: Material 55%, Labour 37%, Design 8%
  const materialCost = result ? Math.round(result * 0.55) : 0;
  const labourCost   = result ? Math.round(result * 0.37) : 0;
  const designCost   = result ? Math.round(result * 0.08) : 0;

  const interiorIndex = INTERIOR_KEYS.indexOf(interiorType);

  return (
    <div className="min-h-screen pb-10">

      {/* ── Hero Image ── */}
      <div className="relative w-full mt-16 overflow-hidden" style={{ maxHeight: "200px" }}>
        <Image
          src="/assets/images/interior_cost_image.webp"
          alt="Home Interior Cost Calculator"
          width={800}
          height={200}
          priority
          className="w-full object-cover"
          style={{ maxHeight: "200px", objectPosition: "center" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent" />
        <div className="absolute top-3 left-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs text-white/90 hover:text-white transition-colors bg-black/20 backdrop-blur-sm rounded-full px-2.5 py-1"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t.backHome}
          </Link>
        </div>
      </div>

      {/* ── Page title below image ── */}
      <div className="px-4 pt-4 pb-1 text-center">
        <h1 className="text-xl font-bold text-neutral-800 leading-tight">
          {lang === "en" ? (
            <>Home Interior Cost <span className="text-theme">in 2026</span></>
          ) : (
            <>2026 में <span className="text-theme">Home Interior Cost</span></>
          )}
        </h1>
        <p className="text-xs text-neutral-500 mt-1">{t.pageSubtitle}</p>
      </div>

      {/* ── Calculator card ── */}
      <div className="px-4 max-w-lg mx-auto mt-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-neutral-100 p-5">

          {/* Language Toggle */}
          <div className="flex items-center justify-between mb-5">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
              {lang === "en" ? "Language" : "भाषा"}
            </span>
            <button
              onClick={toggleLang}
              aria-label="Toggle language"
              className="relative flex items-center h-8 w-[120px] rounded-full bg-neutral-100 border border-neutral-200 p-0.5 transition-all"
            >
              <span
                className={`absolute top-0.5 bottom-0.5 w-[58px] rounded-full bg-theme shadow-sm transition-all duration-300 ${
                  lang === "en" ? "left-0.5" : "left-[59px]"
                }`}
              />
              <span
                className={`relative z-10 w-[60px] text-center text-xs font-semibold transition-colors duration-200 ${
                  lang === "en" ? "text-white" : "text-neutral-500"
                }`}
              >
                English
              </span>
              <span
                className={`relative z-10 w-[60px] text-center text-xs font-semibold transition-colors duration-200 ${
                  lang === "hi" ? "text-white" : "text-neutral-500"
                }`}
              >
                हिंदी
              </span>
            </button>
          </div>

          {/* Carpet area input */}
          <div className="mb-6">
            <div className="flex items-center gap-1.5 mb-2">
              <label htmlFor="area" className="text-sm font-semibold text-neutral-700">
                {t.areaLabel}{" "}
                <span className="font-normal text-neutral-400">{t.areaUnit}</span>
              </label>
              {/* ⓘ Tooltip */}
              <div className="relative flex items-center" ref={tooltipRef}>
                <button
                  type="button"
                  aria-label="What is Carpet Area?"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  onFocus={() => setShowTooltip(true)}
                  onBlur={() => setShowTooltip(false)}
                  onClick={() => setShowTooltip((v) => !v)}
                  className="w-4 h-4 rounded-full bg-neutral-300 hover:bg-theme text-white flex items-center justify-center text-[10px] font-bold leading-none transition-colors focus:outline-none focus:ring-2 ring-theme"
                >
                  i
                </button>
                {showTooltip && (
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-50 w-64 rounded-xl bg-neutral-800 text-white text-xs leading-relaxed p-3 shadow-xl">
                    {t.areaTooltip}
                    <span className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-neutral-800" />
                  </div>
                )}
              </div>
            </div>
            <div className="relative">
              <input
                ref={inputRef}
                id="area"
                type="number"
                inputMode="numeric"
                min="1"
                placeholder={t.areaPlaceholder}
                value={area}
                onChange={(e) => {
                  setArea(e.target.value);
                  setError("");
                  setResult(null);
                }}
                className="w-full rounded-xl border-2 border-theme bg-theme-light px-4 py-3 pr-20 text-base text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 ring-theme transition"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 font-medium whitespace-nowrap">
                {t.areaUnitSuffix}
              </span>
            </div>
            {error && (
              <p className="mt-2 text-xs text-red-500 font-medium">{error}</p>
            )}
          </div>

          {/* Interior Type selection */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-neutral-700 mb-3">
              {t.interiorTypeLabel}
            </p>
            <div className="flex flex-col gap-3">
              {INTERIOR_KEYS.map((key, idx) => {
                const isSelected = interiorType === key;
                const option = t.options[idx];
                return (
                  <label
                    key={key}
                    className={`flex items-start gap-3 rounded-xl border-2 px-4 py-3 cursor-pointer transition-all ${
                      isSelected
                        ? "border-theme bg-theme-light"
                        : "border-neutral-100 bg-neutral-50 hover:border-neutral-300"
                    }`}
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected ? "border-theme" : "border-neutral-300"
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2.5 h-2.5 rounded-full bg-theme" />
                        )}
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="interiorType"
                      value={key}
                      checked={isSelected}
                      onChange={() => {
                        setInteriorType(key);
                        setResult(null);
                      }}
                      className="sr-only"
                    />
                    <div className="flex-1 min-w-0">
                      <span
                        className={`text-sm font-semibold ${
                          isSelected ? "text-theme" : "text-neutral-700"
                        }`}
                      >
                        {option.label}
                      </span>
                      <p className="text-xs text-neutral-400 mt-0.5">{option.desc}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Calculate button */}
          <button
            onClick={handleCalculate}
            className="w-full rounded-xl bg-theme hover-bg-theme py-3.5 text-base font-semibold text-white shadow-md shadow-theme active:scale-95 transition-all"
          >
            {t.calculateBtn}
          </button>
        </div>

        {/* ── Results card ── */}
        {result !== null && (
          <div className="mt-5 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-neutral-100 overflow-hidden">
            {/* Total cost banner */}
            <div className="bg-theme px-5 py-4 text-center">
              <p className="text-white/80 text-xs font-medium uppercase tracking-widest mb-1">
                {t.resultBanner}
              </p>
              <p className="text-white text-3xl font-bold">{formatINR(result)}</p>
              <p className="text-white/80 text-sm font-semibold mt-0.5 tracking-wide">
                ({formatWords(result)})
              </p>
              <p className="text-white/70 text-xs font-medium mt-0.5 tracking-wide">
                {t.materialLabel}
              </p>
              <p className="text-white/80 text-xs mt-1">
                {parseFloat(area).toLocaleString("en-IN")} {t.areaUnitSuffix} ·{" "}
                {t.options[interiorIndex].label}
              </p>
            </div>

            {/* ── Get Detailed Report CTA ── */}
            <div className="border-t border-neutral-100 px-5 pt-4 pb-4 bg-neutral-50/80 text-center">
              {/* Attention-grabbing callout above CTA */}
              <div className="rounded-2xl bg-theme-light border border-theme/25 px-4 py-3 mb-4 text-center">
                <p className="text-sm font-extrabold text-neutral-800 leading-snug">
                  📄{" "}
                  {lang === "en"
                    ? "Want a detailed PDF with room-wise breakdown, material guide & design tips?"
                    : "Room-wise Interior Breakdown, Material Guide और Design Tips के साथ Detailed PDF चाहिए?"}
                </p>
                <p className="text-[11px] text-theme font-semibold mt-1">
                  {lang === "en" ? "✓ Free  ·  ✓ Instant  ·  ✓ Sent to your email" : "✓ मुफ्त  ·  ✓ तुरंत  ·  ✓ Email पर भेजें"}
                </p>
              </div>

              {/* Sneak-peek label */}
              <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest mb-2">
                📋 {lang === "en" ? "Sneak peek inside the report" : "Report की झलक देखें"}
              </p>

              {/* Lazy-loaded ping-pong image slider */}
              <div className="mb-4">
                <InteriorReportPreviewSlider />
              </div>

              <button
                onClick={() => setShowReportModal(true)}
                className={`inline-flex items-center gap-2 rounded-full bg-theme hover-bg-theme px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-theme active:scale-95 transition-all${shakeCTA ? " cta-shake" : ""}`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z" />
                </svg>
                {lang === "en" ? "Get Complete Report — Free" : "Free Detailed Report पाएं"}
              </button>
            </div>
          </div>
        )}

        {/* ── CTA ── */}
        <div className="mt-5 bg-white/80 backdrop-blur-sm rounded-2xl border border-neutral-100 shadow-sm p-5 text-center">
          <p className="text-sm font-semibold text-neutral-700 mb-1">{t.ctaTitle}</p>
          <p className="text-xs text-neutral-400 mb-3">{t.ctaDesc}</p>
          <a
            href="https://wa.me/917014370245?text=Hi,%20I%20would%20like%20a%20detailed%20interior%20cost%20estimate"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-green-200 hover:bg-green-500 active:scale-95 transition-all"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            {t.ctaBtn}
          </a>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-10">
        <Footer />
      </div>

      {/* ── Lead Magnet Modal ── */}
      {showReportModal && result !== null && (
        <LeadMagnetModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          lang={lang}
          calcData={{
            reportType:   "interior",
            area:         parseFloat(area),
            interiorType,
            totalCost:    result,
            materialCost,
            labourCost,
            designCost,
          }}
          onQueued={(queuedEmail) => {
            setToastEmail(queuedEmail);
            setTimeout(() => setToastEmail(""), 9000);
          }}
        />
      )}

      {/* ── Toast notification ── */}
      {toastEmail && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-neutral-900 text-white text-sm font-medium px-5 py-3.5 rounded-2xl shadow-2xl max-w-sm w-[92vw] animate-fade-in-up">
          <div className="w-8 h-8 flex-shrink-0 rounded-full bg-theme flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-white text-xs leading-snug">
              {lang === "hi" ? "Report जल्द भेजी जाएगी!" : "Report will be sent shortly!"}
            </p>
            <p className="text-neutral-400 text-[11px] mt-0.5 truncate">
              {lang === "hi" ? `${toastEmail} पर 5 मिनट में पहुंचेगी` : `Check ${toastEmail} within 5 minutes`}
            </p>
          </div>
          <button
            onClick={() => setToastEmail("")}
            aria-label="Dismiss"
            className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
