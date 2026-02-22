"use client";

import React, { useState } from "react";
import Footer from "../../components/footer";
import Link from "next/link";

type HouseType = "basic" | "standard" | "luxury";

const RATES: Record<HouseType, number> = {
  basic: 2000,
  standard: 2500,
  luxury: 3800,
};

const HOUSE_OPTIONS: { value: HouseType; label: string; desc: string }[] = [
  {
    value: "basic",
    label: "Basic House",
    desc: "Economy construction with standard materials",
  },
  {
    value: "standard",
    label: "Standard House",
    desc: "Quality construction with good finishes",
  },
  {
    value: "luxury",
    label: "Luxury House",
    desc: "Premium construction with high-end finishes",
  },
];

function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function ConstructionCostCalculator() {
  const [area, setArea] = useState<string>("");
  const [houseType, setHouseType] = useState<HouseType>("standard");
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string>("");

  const handleCalculate = () => {
    const areaNum = parseFloat(area);
    if (!area || isNaN(areaNum) || areaNum <= 0) {
      setError("Please enter a valid buildup area.");
      setResult(null);
      return;
    }
    setError("");
    setResult(areaNum * RATES[houseType]);
  };

  const civil = result ? Math.round(result * 0.55) : 0;
  const mep = result ? Math.round(result * 0.15) : 0;
  const finishing = result ? Math.round(result * 0.30) : 0;

  return (
    <div className="min-h-screen pb-10">
      {/* Page header */}
      <div className="pt-24 pb-6 px-4 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-primary-orange mb-4 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Home
        </Link>
        <h1 className="text-2xl font-bold text-neutral-800 leading-tight">
          Home Construction{" "}
          <span className="text-primary-orange">Cost Calculator</span>
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Get an instant estimate for your dream home
        </p>
      </div>

      {/* Calculator card */}
      <div className="px-4 max-w-lg mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-neutral-100 p-5">
          {/* Buildup area input */}
          <div className="mb-6">
            <label
              htmlFor="area"
              className="block text-sm font-semibold text-neutral-700 mb-2"
            >
              Buildup Area{" "}
              <span className="font-normal text-neutral-400">(in sq. ft.)</span>
            </label>
            <div className="relative">
              <input
                id="area"
                type="number"
                inputMode="numeric"
                min="1"
                placeholder="e.g. 1200"
                value={area}
                onChange={(e) => {
                  setArea(e.target.value);
                  setError("");
                  setResult(null);
                }}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 pr-16 text-base text-neutral-800 placeholder-neutral-300 focus:border-primary-orange focus:outline-none focus:ring-2 focus:ring-primary-orange/20 transition"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-neutral-400 font-medium">
                sq. ft.
              </span>
            </div>
            {error && (
              <p className="mt-2 text-xs text-red-500 font-medium">{error}</p>
            )}
          </div>

          {/* House Type selection */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-neutral-700 mb-3">
              Home Type
            </p>
            <div className="flex flex-col gap-3">
              {HOUSE_OPTIONS.map((option) => {
                const isSelected = houseType === option.value;
                return (
                  <label
                    key={option.value}
                    className={`flex items-start gap-3 rounded-xl border-2 px-4 py-3 cursor-pointer transition-all ${
                      isSelected
                        ? "border-primary-orange bg-orange-50"
                        : "border-neutral-100 bg-neutral-50 hover:border-neutral-300"
                    }`}
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? "border-primary-orange"
                            : "border-neutral-300"
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2.5 h-2.5 rounded-full bg-primary-orange" />
                        )}
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="houseType"
                      value={option.value}
                      checked={isSelected}
                      onChange={() => {
                        setHouseType(option.value);
                        setResult(null);
                      }}
                      className="sr-only"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-sm font-semibold ${
                            isSelected
                              ? "text-primary-orange"
                              : "text-neutral-700"
                          }`}
                        >
                          {option.label}
                        </span>
                        <span className="text-xs font-medium text-neutral-400 whitespace-nowrap">
                          ₹{RATES[option.value].toLocaleString("en-IN")}/sq.ft
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        {option.desc}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Calculate button */}
          <button
            onClick={handleCalculate}
            className="w-full rounded-xl bg-primary-orange py-3.5 text-base font-semibold text-white shadow-md shadow-orange-200 hover:bg-orange-600 active:scale-95 transition-all"
          >
            Calculate Cost
          </button>
        </div>

        {/* Results card */}
        {result !== null && (
          <div className="mt-5 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-neutral-100 overflow-hidden">
            {/* Total cost banner */}
            <div className="bg-primary-orange px-5 py-4 text-center">
              <p className="text-orange-100 text-xs font-medium uppercase tracking-widest mb-1">
                Estimated Construction Cost
              </p>
              <p className="text-white text-3xl font-bold">
                {formatINR(result)}
              </p>
              <p className="text-orange-100 text-xs mt-1">
                {parseFloat(area).toLocaleString("en-IN")} sq.ft ×{" "}
                {formatINR(RATES[houseType])}/sq.ft
              </p>
            </div>

            {/* Breakdown */}
            <div className="px-5 py-4">
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-3">
                Cost Breakdown
              </p>

              {/* Civil / Structure */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <p className="text-sm font-semibold text-neutral-800">
                      Civil / Structure
                    </p>
                    <p className="text-xs text-neutral-400">
                      Foundation · RCC · Masonry · Plaster
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary-orange">
                      {formatINR(civil)}
                    </p>
                    <p className="text-xs text-neutral-400">55%</p>
                  </div>
                </div>
                <div className="h-1.5 w-full rounded-full bg-neutral-100">
                  <div
                    className="h-1.5 rounded-full bg-primary-orange"
                    style={{ width: "55%" }}
                  />
                </div>
              </div>

              {/* MEP */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <p className="text-sm font-semibold text-neutral-800">
                      MEP Services
                    </p>
                    <p className="text-xs text-neutral-400">
                      Electrical · Plumbing · Sanitary
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-blue-500">
                      {formatINR(mep)}
                    </p>
                    <p className="text-xs text-neutral-400">15%</p>
                  </div>
                </div>
                <div className="h-1.5 w-full rounded-full bg-neutral-100">
                  <div
                    className="h-1.5 rounded-full bg-blue-400"
                    style={{ width: "15%" }}
                  />
                </div>
              </div>

              {/* Finishing */}
              <div className="mb-2">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <p className="text-sm font-semibold text-neutral-800">
                      Finishing
                    </p>
                    <p className="text-xs text-neutral-400">
                      Flooring · Doors/Windows · Paint · Kitchen
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-500">
                      {formatINR(finishing)}
                    </p>
                    <p className="text-xs text-neutral-400">30%</p>
                  </div>
                </div>
                <div className="h-1.5 w-full rounded-full bg-neutral-100">
                  <div
                    className="h-1.5 rounded-full bg-emerald-400"
                    style={{ width: "30%" }}
                  />
                </div>
              </div>

              <p className="text-xs text-neutral-400 mt-4 text-center leading-relaxed">
                * This is an approximate estimate. Actual costs may vary based
                on location, design complexity, and material choices.
              </p>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-5 bg-white/80 backdrop-blur-sm rounded-2xl border border-neutral-100 shadow-sm p-5 text-center">
          <p className="text-sm font-semibold text-neutral-700 mb-1">
            Need a detailed quote?
          </p>
          <p className="text-xs text-neutral-400 mb-3">
            Talk to our experts for a precise estimate tailored to your project.
          </p>
          <a
            href="https://wa.me/918107449932?text=Hi,%20I%20would%20like%20a%20detailed%20construction%20cost%20estimate"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-green-200 hover:bg-green-500 active:scale-95 transition-all"
          >
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Chat on WhatsApp
          </a>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-10">
        <Footer />
      </div>
    </div>
  );
}
