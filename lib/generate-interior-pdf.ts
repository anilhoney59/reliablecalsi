/* eslint-disable @typescript-eslint/no-explicit-any */
import PDFDocument from "pdfkit";
import { addPortfolioPage, addContactPage, getCompressedProjectImages } from "./pdf-shared";

// ── Brand colours ─────────────────────────────────────────────────────────────
const C = {
  primary:    "#4169E1",
  primaryDk:  "#2952B8",
  dark:       "#1C1C1C",
  body:       "#555555",
  muted:      "#999999",
  light:      "#F8F8F8",
  white:      "#FFFFFF",
  border:     "#E5E5E5",
  priLight:   "#E8EDFC",
  blue:       "#3B82F6",
  blueLight:  "#EFF6FF",
  green:      "#10B981",
  greenLight: "#ECFDF5",
  purple:     "#8B5CF6",
  purpleLight:"#F5F3FF",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmtRs(amount: number): string {
  return "Rs. " + Math.round(amount).toLocaleString("en-IN");
}
function fmtWords(amount: number): string {
  if (amount >= 10_000_000) return `${parseFloat((amount / 10_000_000).toFixed(2))} Cr`;
  if (amount >= 100_000)    return `${parseFloat((amount / 100_000).toFixed(2))} Lac`;
  if (amount >= 1_000)      return `${parseFloat((amount / 1_000).toFixed(1))}K`;
  return amount.toLocaleString("en-IN");
}
function fmtDate(): string {
  return new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
}
function genRef(): string {
  return "RD-INT-" + Date.now().toString(36).toUpperCase().slice(-6);
}

// ── Types ─────────────────────────────────────────────────────────────────────
export interface InteriorReportData {
  name:         string;
  email:        string;
  area:         number;
  interiorType: "basic" | "standard" | "luxury";
  totalCost:    number;
  materialCost: number;
  labourCost:   number;
  designCost:   number;
}

const INTERIOR_NAMES = { basic: "Basic Interior", standard: "Standard Interior", luxury: "Luxury Interior" } as const;
const RATES           = { basic: 765, standard: 1145, luxury: 1525 } as const;

// ── Main export ───────────────────────────────────────────────────────────────
export async function generateInteriorPDF(data: InteriorReportData): Promise<Buffer> {
  // Pre-compress project images before creating the PDF
  const imgBuffers = await getCompressedProjectImages();

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
      size:    "A4",
      info: {
        Title:   "Reliable Designs – Home Interior Cost Estimate Report",
        Author:  "Reliable Designs",
        Subject: "Interior Cost Estimate",
      },
    });

    const chunks: Buffer[] = [];
    doc.on("data", (c: Buffer) => chunks.push(c));
    doc.on("end",  () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const W  = doc.page.width;
    const H  = doc.page.height;
    const M  = 50;
    const CW = W - M * 2;

    function newPageBanner() {
      doc.rect(0, 0, W, 5).fill(C.primary);
    }
    function sectionTitle(title: string, y: number): number {
      doc.fillColor(C.primary).font("Helvetica-Bold").fontSize(11)
         .text(title, M, y, { width: CW });
      y += 18;
      doc.rect(M, y, CW, 1.5).fill(C.primary);
      return y + 10;
    }
    function ensureSpace(need: number, y: number): number {
      if (y + need > H - 60) {
        doc.addPage();
        newPageBanner();
        return M + 15;
      }
      return y;
    }

    // ════════════════════════════════════════════════
    // PAGE 1
    // ════════════════════════════════════════════════

    // Full-width orange header
    doc.rect(0, 0, W, 88).fill(C.primary);
    doc.rect(0, 88, W, 3).fill(C.primaryDk);

    doc.fillColor(C.white).font("Helvetica-Bold").fontSize(21)
       .text("RELIABLE DESIGNS", M, 20, { width: CW });
    doc.fillColor(C.white).font("Helvetica").fontSize(10)
       .text("Experts at Architect  |  Vastu  |  Structural", M, 46, { width: CW });
    doc.fillColor(C.white).font("Helvetica").fontSize(8)
       .text("reliabledesigns9@gmail.com  |  +917014370245  |  Plot no 100, Vaishali Nagar, Jaipur-302021", M, 66, { width: CW });

    let y = 105;

    // Report badge
    doc.rect(M, y, 220, 22).fill(C.priLight);
    doc.rect(M, y, 3, 22).fill(C.primary);
    doc.fillColor(C.primary).font("Helvetica-Bold").fontSize(9)
       .text("HOME INTERIOR COST ESTIMATE REPORT", M + 10, y + 7, { width: 210 });
    y += 32;

    // Title & meta
    doc.fillColor(C.dark).font("Helvetica-Bold").fontSize(17)
       .text(`Prepared for: ${data.name}`, M, y, { width: CW });
    y += 24;
    doc.fillColor(C.body).font("Helvetica").fontSize(9)
       .text(`Date: ${fmtDate()}   |   Reference: ${genRef()}`, M, y);
    y += 12;
    doc.rect(M, y, CW, 0.5).fill(C.border);
    y += 16;

    // ── PROJECT OVERVIEW ─────────────────────────────────────────────
    y = sectionTitle("PROJECT OVERVIEW", y);

    const rate = RATES[data.interiorType];
    const overview: [string, string][] = [
      ["Carpet Area",           `${data.area.toLocaleString("en-IN")} sq.ft.`],
      ["Interior Package",      INTERIOR_NAMES[data.interiorType]],
      ["Estimated Completion",  data.interiorType === "luxury" ? "12–16 weeks" : data.interiorType === "standard" ? "8–12 weeks" : "6–8 weeks"],
    ];

    overview.forEach(([label, value], i) => {
      const ry = y + i * 22;
      if (i % 2 === 0) doc.rect(M, ry, CW, 20).fill(C.light);
      doc.fillColor(C.body).font("Helvetica").fontSize(9)
         .text(label, M + 8, ry + 6, { width: 200 });
      doc.fillColor(C.dark).font("Helvetica-Bold").fontSize(9)
         .text(value, M + 210, ry + 6, { width: CW - 210 });
    });

    y += overview.length * 22 + 18;

    // ── TOTAL COST HIGHLIGHT ──────────────────────────────────────────
    y = ensureSpace(88, y);
    doc.rect(M, y, CW, 80).fill(C.primary);
    doc.fillColor(C.white).font("Helvetica").fontSize(8)
       .text("TOTAL ESTIMATED INTERIOR COST  (MATERIAL + LABOUR + DESIGN)", M, y + 12, { width: CW, align: "center" });
    doc.fillColor(C.white).font("Helvetica-Bold").fontSize(27)
       .text(fmtRs(data.totalCost), M, y + 26, { width: CW, align: "center" });
    doc.fillColor(C.white).font("Helvetica").fontSize(12)
       .text(`( ${fmtWords(data.totalCost)} )`, M, y + 57, { width: CW, align: "center" });
    y += 90;

    // ── COST BREAKDOWN TABLE ──────────────────────────────────────────
    y = ensureSpace(140, y);
    y = sectionTitle("COST BREAKDOWN", y);

    doc.rect(M, y, CW, 24).fill(C.primary);
    doc.fillColor(C.white).font("Helvetica-Bold").fontSize(9)
       .text("Category",    M + 8,   y + 8)
       .text("Includes",    M + 155, y + 8)
       .text("Amount",      M + 395, y + 8);
    y += 24;

    const breakdown = [
      { cat: "Material Cost",  comp: "Furniture  ·  Fixtures  ·  Fittings  ·  Hardware",   amt: data.materialCost, color: C.primary },
      { cat: "Labour Cost",    comp: "Carpentry  ·  Installation  ·  Civil Work",            amt: data.labourCost,   color: C.blue    },
      { cat: "Design Cost",    comp: "Interior Design  ·  3D Visualisation  ·  Management", amt: data.designCost,   color: C.purple  },
    ];

    breakdown.forEach((row, i) => {
      const ry = y + i * 32;
      doc.rect(M, ry, CW, 30).fill(i % 2 === 0 ? C.light : C.white);
      doc.rect(M, ry, 4, 30).fill(row.color);
      doc.fillColor(row.color).font("Helvetica-Bold").fontSize(9)
         .text(row.cat, M + 12, ry + 5, { width: 140 });
      doc.fillColor(C.muted).font("Helvetica").fontSize(8)
         .text(row.comp, M + 12, ry + 18, { width: 200 });
      doc.fillColor(row.color).font("Helvetica-Bold").fontSize(9)
         .text(fmtRs(row.amt), M + 392, ry + 10, { width: 103 });
    });

    y += breakdown.length * 32 + 6;

    // Per-sqft strip
    doc.rect(M, y, CW, 18).fill("#2D2D2D");
    doc.fillColor(C.white).font("Helvetica").fontSize(8)
       .text(
         `Rate per sq.ft.:  Material Rs.${Math.round(rate*0.55)}/sqft  |  Labour Rs.${Math.round(rate*0.37)}/sqft  |  Design Rs.${Math.round(rate*0.08)}/sqft  |  Total Rs.${rate}/sqft`,
         M + 8, y + 5, { width: CW - 16 }
       );
    y += 28;

    // ════════════════════════════════════════════════
    // PAGE 2 – Room breakdown + What's included
    // ════════════════════════════════════════════════
    doc.addPage();
    newPageBanner();
    y = M + 15;

    // ── ROOM-WISE INTERIOR BREAKDOWN ──────────────────────────────────
    y = sectionTitle("ROOM-WISE INTERIOR COST BREAKDOWN", y);

    doc.fillColor(C.muted).font("Helvetica").fontSize(8)
       .text("Approximate distribution based on a standard home layout. Actual distribution varies by design.", M, y);
    y += 14;

    doc.rect(M, y, CW, 24).fill(C.primary);
    doc.fillColor(C.white).font("Helvetica-Bold").fontSize(9)
       .text("Room / Space",       M + 8,   y + 8)
       .text("Approx. Sqft",       M + 290, y + 8)
       .text("Est. Cost",          M + 400, y + 8);
    y += 24;

    const rooms = [
      { name: "Modular Kitchen",                   sqftPct: 0.10, costPct: 0.28 },
      { name: "Living Room & Dining Area",          sqftPct: 0.22, costPct: 0.22 },
      { name: "Master Bedroom",                     sqftPct: 0.14, costPct: 0.20 },
      { name: "Bedroom 2 / Additional Bedrooms",    sqftPct: 0.12, costPct: 0.15 },
      { name: "Bathrooms / Toilets (2 Nos.)",       sqftPct: 0.08, costPct: 0.10 },
      { name: "Pooja / Study / Utility Room",       sqftPct: 0.09, costPct: 0.05 },
    ];

    rooms.forEach((room, i) => {
      const ry = y + i * 24;
      doc.rect(M, ry, CW, 22).fill(i % 2 === 0 ? C.light : C.white);
      doc.fillColor(C.dark).font("Helvetica").fontSize(9)
         .text(room.name, M + 8, ry + 7, { width: 268 });
      doc.fillColor(C.body).font("Helvetica").fontSize(9)
         .text(`~${Math.round(data.area * room.sqftPct)} sq.ft.`, M + 290, ry + 7);
      doc.fillColor(C.primary).font("Helvetica-Bold").fontSize(9)
         .text(fmtRs(Math.round(data.totalCost * room.costPct)), M + 400, ry + 7, { width: 95 });
    });

    y += rooms.length * 24 + 8;
    doc.rect(M, y, CW, 22).fill(C.dark);
    doc.fillColor(C.white).font("Helvetica-Bold").fontSize(9)
       .text("TOTAL", M + 8, y + 7, { width: 278 })
       .text(`${data.area.toLocaleString("en-IN")} sq.ft.`, M + 290, y + 7)
       .text(fmtRs(data.totalCost),                          M + 400, y + 7, { width: 95 });
    y += 32;

    // ── WHAT'S INCLUDED ───────────────────────────────────────────────
    y = ensureSpace(220, y);
    y = sectionTitle(`WHAT'S INCLUDED  –  ${INTERIOR_NAMES[data.interiorType].toUpperCase()}`, y);

    const inclusions: Record<string, { title: string; items: string[] }[]> = {
      basic: [
        { title: "Living Room",    items: ["Basic sofa set (3+1+1)", "Center table", "TV unit – basic laminate finish", "Basic curtain tracks"] },
        { title: "Kitchen",        items: ["L-shaped modular kitchen – plain laminates", "Overhead shutters", "Basic SS sink (single bowl)", "Standard hinges & handles"] },
        { title: "Bedroom",        items: ["Wardrobe with basic laminate shutters", "Bed frame with headboard", "Side tables (2 Nos.)", "Basic dresser"] },
        { title: "False Ceiling",  items: ["POP false ceiling in living room", "Basic LED downlights"] },
        { title: "Flooring & Walls", items: ["Existing floor polish / basic tile cleaning", "Basic wall paint (economy range)"] },
      ],
      standard: [
        { title: "Living Room",    items: ["Premium sofa set with fabric / leatherette", "Designer TV unit with back panel", "Center + side tables", "False ceiling with cove LED lighting", "Decorative wall texture / accent wall"] },
        { title: "Kitchen",        items: ["Soft-close modular kitchen (laminate shutters)", "Overhead lofts + drawers", "Pull-out accessories (basket, dustbin)", "Granite countertop + SS under-mount sink", "Standard chimney & hob provision"] },
        { title: "Bedroom",        items: ["Soft-close sliding wardrobes with laminates", "Upholstered bed with box storage", "Dresser with mirror", "Study table & chair", "False ceiling with cove lighting"] },
        { title: "Bathrooms",      items: ["Designer mirror with LED frame", "CP fittings upgrade (Jaquar / Parryware)", "Vanity unit with storage", "Shower enclosure"] },
        { title: "Flooring & Walls", items: ["Vitrified tile polishing / maintenance", "Premium wall paint + texture", "Wallpaper accent feature"] },
      ],
      luxury: [
        { title: "Living Room",    items: ["Designer custom sofa – imported fabric", "Lacquer / acrylic feature wall panel", "Coffered / PU false ceiling with smart LEDs", "Designer light fixtures (chandelier / pendants)", "Home automation provision (curtains, lights)"] },
        { title: "Kitchen",        items: ["Acrylic / PU modular kitchen", "Blum / Häfele imported soft-close hardware", "Quartz / granite countertop", "Built-in appliance pockets (microwave, oven)", "Designer glass splashback + premium chimney"] },
        { title: "Bedroom",        items: ["Custom wardrobe with mirrors & lacquer shutters", "Upholstered king-size bed with premium mattress", "Walk-in wardrobe provision", "Smart lighting & window treatment", "Premium wall panelling (fabric / veneer)"] },
        { title: "Bathrooms",      items: ["Kohler / Duravit / Grohe CP fittings", "Floor-to-ceiling tile cladding", "Frameless glass enclosure", "Concealed flushing system (Geberit)", "Heated towel rail provision"] },
        { title: "Flooring & Walls", items: ["Italian marble / large-format tile installation", "Wall panelling – veneer / MDF lacquer", "Smart home integration (lighting, ACs, curtains)"] },
      ],
    };

    const sections = inclusions[data.interiorType];
    const halfCW = (CW - 8) / 2;

    sections.forEach((section, si) => {
      // Two columns
      const col = si % 2;
      const row = Math.floor(si / 2);

      if (col === 0 && si > 0) {
        // Start a new row pair
        y += (sections[si - 2]?.items.length ?? 0) > 0
          ? 0
          : 0;
      }

      // Flat layout (single column for clarity)
      y = ensureSpace(20 + section.items.length * 15, y);

      doc.rect(M, y, CW, 20).fill(C.priLight);
      doc.rect(M, y, 4, 20).fill(C.primary);
      doc.fillColor(C.primary).font("Helvetica-Bold").fontSize(9.5)
         .text(section.title, M + 12, y + 6, { width: CW - 12 });
      y += 24;

      section.items.forEach((item) => {
        doc.rect(M, y + 3, 4, 4).fill(C.muted);
        doc.fillColor(C.body).font("Helvetica").fontSize(9)
           .text(item, M + 12, y + 2, { width: CW - 12 });
        y += 15;
      });
      y += 6;
    });

    // ════════════════════════════════════════════════
    // PAGE 3 – Material Guide, Timeline, Tips, CTA
    // ════════════════════════════════════════════════
    doc.addPage();
    newPageBanner();
    y = M + 15;

    // ── MATERIAL RECOMMENDATIONS ──────────────────────────────────────
    y = sectionTitle("MATERIAL RECOMMENDATIONS", y);

    const matGuide: [string, string, string, string][] = [
      // [Category, Basic, Standard, Luxury]
      ["Laminates",     "Greenlam / Merino (Rs.90–120/sqft)",        "Centuryply / Greenply (Rs.120–180/sqft)",    "Duratex / Egger / Imported (Rs.200+/sqft)"],
      ["Hardware",      "Local / Indian brand",                       "Hettich (Germany)",                           "Blum / Häfele (Austria)"],
      ["Paint (Interior)", "Tractor Emulsion / economy",              "Asian Royale / Berger Breatheasy",            "Berger Silk / Dulux Velvet / Nippon Matex"],
      ["Kitchen Top",   "Tile / granite basic",                       "Granite / engineered stone",                  "Quartz / Calacatta / natural stone"],
      ["Flooring",      "Ceramic tile polish / vinyl",                "Vitrified tile (600x600mm)",                  "Italian marble / large-format imported"],
      ["CP Fittings",   "Basic (Cera / local brand)",                 "Jaquar / Parryware",                          "Kohler / Grohe / Duravit"],
      ["Beds",          "Basic teak / engineered wood frame",         "Sheesham / teak with fabric headboard",       "Custom upholstered / imported wood"],
    ];

    // Table header
    doc.rect(M, y, CW, 24).fill(C.primary);
    const colW3 = [140, 110, 120, 125];
    let cx = M;
    ["Category", "Basic", "Standard", "Luxury"].forEach((h, i) => {
      doc.fillColor(C.white).font("Helvetica-Bold").fontSize(8.5)
         .text(h, cx + 6, y + 8, { width: colW3[i] - 6 });
      cx += colW3[i];
    });
    y += 24;

    matGuide.forEach((row, i) => {
      const ry = y + i * 26;
      doc.rect(M, ry, CW, 24).fill(i % 2 === 0 ? C.light : C.white);
      let colX = M;
      row.forEach((cell, ci) => {
        doc.fillColor(ci === 0 ? C.primary : C.dark)
           .font(ci === 0 ? "Helvetica-Bold" : "Helvetica")
           .fontSize(8)
           .text(cell, colX + 6, ry + 7, { width: colW3[ci] - 12 });
        colX += colW3[ci];
      });
    });

    y += matGuide.length * 26 + 20;

    // ── INTERIOR WORK SCHEDULE — Weekly Chart ────────────────────────
    const iTotalWeeks = data.interiorType === "luxury" ? 16 : data.interiorType === "standard" ? 12 : 8;
    const iTotalDur   = data.interiorType === "luxury"   ? "16 weeks  (~4 months)"
                      : data.interiorType === "standard" ? "12 weeks  (~3 months)"
                      :                                    "8 weeks  (~2 months)";

    // [label, barColor, startWeek(1-based), endWeek(1-based)]
    const iPhases: [string, string, number, number][] =
      data.interiorType === "luxury"
        ? [
            ["Site Measurement & 3D Design",   C.primary, 1,  3],
            ["Civil Work & Tiling",             C.primary, 3,  6],
            ["Electrical & False Ceiling",      C.blue,    5,  8],
            ["Carpentry (Kitchen, Wardrobes)",  C.green,   6,  13],
            ["Paint, Wallpaper & Texture",      C.purple,  11, 15],
            ["Furnishings & Final Styling",     C.primary, 14, 16],
          ]
        : data.interiorType === "standard"
        ? [
            ["Site Measurement & 3D Design",   C.primary, 1,  2],
            ["Civil Work & Tiling",             C.primary, 2,  4],
            ["Electrical & False Ceiling",      C.blue,    3,  6],
            ["Carpentry (Kitchen, Wardrobes)",  C.green,   4,  9],
            ["Paint, Wallpaper & Texture",      C.purple,  8,  11],
            ["Furnishings & Final Styling",     C.primary, 10, 12],
          ]
        : [
            ["Site Measurement & 3D Design",   C.primary, 1,  2],
            ["Civil Work & Tiling",             C.primary, 2,  3],
            ["Electrical & False Ceiling",      C.blue,    3,  5],
            ["Carpentry (Kitchen, Wardrobes)",  C.green,   3,  7],
            ["Paint, Wallpaper & Texture",      C.purple,  6,  8],
            ["Furnishings & Final Styling",     C.primary, 7,  8],
          ];

    const iLabelW   = 155;
    const iBarAreaW = CW - iLabelW;
    const iColW     = iBarAreaW / iTotalWeeks;
    const iCircleR  = Math.min(12, Math.max(4, Math.floor(iColW / 2) - 1));
    const iFontS    = iCircleR >= 10 ? 7 : iCircleR >= 7 ? 6 : iCircleR >= 5 ? 5 : 4.5;
    const iHeaderH  = iCircleR * 2 + 12;
    const iRowH     = 26;
    const iChartH   = iHeaderH + iPhases.length * iRowH + 4 + 22 + 32;

    y = ensureSpace(iChartH + 28, y);
    y = sectionTitle("INTERIOR WORK SCHEDULE", y);

    // ─ Dark header with week circles ─
    doc.rect(M, y, CW, iHeaderH).fill(C.dark);
    doc.fillColor(C.white).font("Helvetica-Bold").fontSize(8)
       .text("Work Phase", M + 6, y + (iHeaderH - 8) / 2, { width: iLabelW - 8, lineBreak: false });

    for (let w = 1; w <= iTotalWeeks; w++) {
      const cx = M + iLabelW + (w - 0.5) * iColW;
      const cy = y + iHeaderH / 2;
      doc.circle(cx, cy, iCircleR).fill(w % 2 === 1 ? "#444444" : "#2A2A2A");
      doc.fillColor(C.white).font("Helvetica-Bold").fontSize(iFontS)
         .text(`W${w}`, cx - iCircleR, cy - iFontS * 0.5, { width: iCircleR * 2, align: "center", lineBreak: false });
    }
    y += iHeaderH;

    // ─ Phase rows ─
    iPhases.forEach(([label, color, startW, endW], i) => {
      const ry = y + i * iRowH;
      doc.rect(M, ry, CW, iRowH - 1).fill(i % 2 === 0 ? C.light : C.white);

      // Vertical week grid lines
      for (let w = 1; w < iTotalWeeks; w++) {
        doc.rect(M + iLabelW + w * iColW, ry, 0.5, iRowH - 1).fill("#E0E0E0");
      }

      // Phase label (colored bold)
      doc.fillColor(color).font("Helvetica-Bold").fontSize(8)
         .text(label, M + 6, ry + (iRowH - 8) / 2, { width: iLabelW - 10, lineBreak: false });

      // Bar
      const barX = M + iLabelW + (startW - 1) * iColW;
      const barW = (endW - startW + 1) * iColW;
      const barY = ry + 5;
      const barH = iRowH - 11;
      doc.roundedRect(barX, barY, barW, barH, 2).fill(color);

      // Clipped text inside bar
      doc.save();
      doc.rect(barX, barY, barW, barH).clip();
      doc.fillColor(C.white).font("Helvetica-Bold").fontSize(6.5)
         .text(label, barX + 4, barY + (barH - 6.5) / 2, { width: barW - 8, lineBreak: false });
      doc.restore();
    });

    y += iPhases.length * iRowH + 4;

    // ─ Total duration footer ─
    doc.rect(M, y, CW, 22).fill(C.dark);
    doc.fillColor(C.white).font("Helvetica-Bold").fontSize(9)
       .text("TOTAL ESTIMATED DURATION:", M + 8, y + 7, { width: 220 })
       .text(iTotalDur,                   M + 234, y + 7, { width: 261 });
    y += 32;

    // ── INTERIOR TIPS ─────────────────────────────────────────────────
    y = ensureSpace(165, y);
    y = sectionTitle("INTERIOR DESIGN TIPS", y);

    const tips = [
      "Fix your complete design (3D views, material selections) before work starts – changes mid-project are costly.",
      "Choose all materials from 1–2 showrooms for consistency in colour, tone & finish.",
      "Modular kitchen should always be installed after flooring is complete.",
      "Invest in quality hardware (hinges, channels) – it determines the longevity of carpentry work.",
      "Keep a contingency budget of 10–15% for surprises or last-minute upgrades.",
      "Opt for false ceilings with concealed LED cove lighting – it transforms any room affordably.",
      "Lighter wall colours make compact spaces feel larger and brighter.",
    ];

    tips.forEach((tip, i) => {
      const ry = y + i * 19;
      doc.rect(M, ry + 5, 5, 5).fill(C.primary);
      doc.fillColor(C.body).font("Helvetica").fontSize(9)
         .text(tip, M + 13, ry + 4, { width: CW - 13 });
    });

    y += tips.length * 19 + 16;

    // ── DISCLAIMER ────────────────────────────────────────────────────
    y = ensureSpace(62, y);
    doc.rect(M, y, CW, 54).fill(C.priLight);
    doc.rect(M, y, 3, 54).fill(C.primary);
    doc.fillColor(C.primary).font("Helvetica-Bold").fontSize(8.5)
       .text("IMPORTANT DISCLAIMER", M + 10, y + 8);
    doc.fillColor(C.body).font("Helvetica").fontSize(8)
       .text(
         "This report is an approximate estimate for planning purposes only. Actual interior costs may vary based on brand choices, design complexity, site conditions, and material quality. Prices are indicative and subject to market fluctuations. We recommend a detailed site visit and final quotation before project commencement.",
         M + 10, y + 22, { width: CW - 20 }
       );
    y += 64;

    // ── INLINE PAGE-3 FOOTER ─────────────────────────────────────────
    doc.page.margins.bottom = 0;
    const footerY = H - 35;
    doc.rect(0, footerY, W, 35).fill(C.light);
    doc.rect(0, footerY, W, 1.5).fill(C.border);
    doc.fillColor(C.muted).font("Helvetica").fontSize(7.5)
       .text(
         `© ${new Date().getFullYear()} Reliable Designs. All rights reserved.  |  Report generated on ${fmtDate()}  |  Approximate estimate – costs may vary.`,
         M, footerY + 13, { width: CW, align: "center" }
       );

    // ── PAGE 4 — PORTFOLIO ────────────────────────────────────────────
    addPortfolioPage(doc, imgBuffers);

    // ── PAGE 5 — CONTACT US ───────────────────────────────────────────
    addContactPage(doc, "interior");

    doc.end();
  });
}
