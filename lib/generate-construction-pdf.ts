/* eslint-disable @typescript-eslint/no-explicit-any */
import PDFDocument from "pdfkit";
import { addPortfolioPage, addContactPage, getCompressedProjectImages } from "./pdf-shared";

// ── Brand colours ────────────────────────────────────────────────────────────
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
  return "RD" + Date.now().toString(36).toUpperCase().slice(-6);
}

// ── Types ─────────────────────────────────────────────────────────────────────
export interface ConstructionReportData {
  name:       string;
  email:      string;
  area:       number;
  houseType:  "basic" | "standard" | "luxury";
  totalCost:  number;
  civil:      number;
  mep:        number;
  finishing:  number;
}

const HOUSE_NAMES = { basic: "Basic House", standard: "Standard House", luxury: "Luxury House" } as const;
const RATES       = { basic: 2000, standard: 2500, luxury: 3800 } as const;

// ── Main export ───────────────────────────────────────────────────────────────
export async function generateConstructionPDF(data: ConstructionReportData): Promise<Buffer> {
  // Pre-compress project images before creating the PDF
  const imgBuffers = await getCompressedProjectImages();

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
      size:    "A4",
      info: {
        Title:   "Reliable Designs – Construction Cost Estimate Report",
        Author:  "Reliable Designs",
        Subject: "Construction Cost Estimate",
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

    // ── shared helpers ──────────────────────────────────────────────────────
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

    // --- Full-width orange header ---
    doc.rect(0, 0, W, 88).fill(C.primary);
    doc.rect(0, 88, W, 3).fill(C.primaryDk);

    doc.fillColor(C.white).font("Helvetica-Bold").fontSize(21)
       .text("RELIABLE DESIGNS", M, 20, { width: CW });
    doc.fillColor(C.white).font("Helvetica").fontSize(10)
       .text("Experts at Architect  |  Vastu  |  Structural", M, 46, { width: CW });
    doc.fillColor(C.white).font("Helvetica").fontSize(8)
       .text("reliabledesigns9@gmail.com  |  +917014370245  |  Plot no 100, Vaishali Nagar, Jaipur-302021", M, 66, { width: CW });

    let y = 105;

    // --- Report badge ---
    doc.rect(M, y, 240, 22).fill(C.priLight);
    doc.rect(M, y, 3, 22).fill(C.primary);
    doc.fillColor(C.primary).font("Helvetica-Bold").fontSize(9)
       .text("CONSTRUCTION COST ESTIMATE REPORT", M + 10, y + 7, { width: 230 });
    y += 32;

    // --- Title & meta ---
    doc.fillColor(C.dark).font("Helvetica-Bold").fontSize(17)
       .text(`Prepared for: ${data.name}`, M, y, { width: CW });
    y += 24;
    doc.fillColor(C.body).font("Helvetica").fontSize(9)
       .text(`Date: ${fmtDate()}   |   Reference: ${genRef()}`, M, y);
    y += 12;
    doc.rect(M, y, CW, 0.5).fill(C.border);
    y += 16;

    // ── PROJECT OVERVIEW ──────────────────────────────────────────────────
    y = sectionTitle("PROJECT OVERVIEW", y);

    const rate = RATES[data.houseType];
    const overview: [string, string][] = [
      ["Buildup Area",       `${data.area.toLocaleString("en-IN")} sq.ft.`],
      ["House Type",         HOUSE_NAMES[data.houseType]],
      ["Estimated Duration", data.houseType === "luxury" ? "12–18 months" : data.houseType === "standard" ? "10–14 months" : "8–12 months"],
    ];

    overview.forEach(([label, value], i) => {
      const ry = y + i * 22;
      if (i % 2 === 0) doc.rect(M, ry, CW, 20).fill(C.light);
      doc.fillColor(C.body).font("Helvetica").fontSize(9)
         .text(label, M + 8, ry + 6, { width: 190 });
      doc.fillColor(C.dark).font("Helvetica-Bold").fontSize(9)
         .text(value, M + 200, ry + 6, { width: CW - 200 });
    });

    y += overview.length * 22 + 18;

    // ── TOTAL COST HIGHLIGHT ─────────────────────────────────────────────
    y = ensureSpace(88, y);
    doc.rect(M, y, CW, 80).fill(C.primary);

    doc.fillColor(C.white).font("Helvetica").fontSize(8)
       .text("TOTAL ESTIMATED COST  (MATERIAL + LABOUR)", M, y + 12, { width: CW, align: "center" });
    doc.fillColor(C.white).font("Helvetica-Bold").fontSize(27)
       .text(fmtRs(data.totalCost), M, y + 26, { width: CW, align: "center" });
    doc.fillColor(C.white).font("Helvetica").fontSize(12)
       .text(`( ${fmtWords(data.totalCost)} )`, M, y + 57, { width: CW, align: "center" });
    y += 90;

    // ── COST BREAKDOWN TABLE ────────────────────────────────────────────
    y = ensureSpace(140, y);
    y = sectionTitle("COST BREAKDOWN", y);

    // Table header row
    doc.rect(M, y, CW, 24).fill(C.primary);
    doc.fillColor(C.white).font("Helvetica-Bold").fontSize(9)
       .text("Category",   M + 8,   y + 8)
       .text("Components", M + 155, y + 8)
       .text("Amount",     M + 395, y + 8);
    y += 24;

    const breakdown = [
      { cat: "Civil / Structure", comp: "Foundation  ·  RCC  ·  Masonry  ·  Plaster",          amt: data.civil,     color: C.primary },
      { cat: "MEP Services",      comp: "Electrical  ·  Plumbing  ·  Sanitary",                 amt: data.mep,       color: C.blue    },
      { cat: "Finishing",         comp: "Flooring  ·  Doors/Windows  ·  Paint  ·  Kitchen",     amt: data.finishing, color: C.green   },
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

    // Per-sqft summary strip
    doc.rect(M, y, CW, 18).fill("#2D2D2D");
    doc.fillColor(C.white).font("Helvetica").fontSize(8)
       .text(
         `Rate per sq.ft.:  Civil Rs.${Math.round(rate*0.55)}/sqft  |  MEP Rs.${Math.round(rate*0.15)}/sqft  |  Finishing Rs.${Math.round(rate*0.30)}/sqft  |  Total Rs.${rate}/sqft`,
         M + 8, y + 5, { width: CW - 16 }
       );
    y += 28;

    // ════════════════════════════════════════════════
    // PAGE 2 – Phase Details + Room Estimates
    // ════════════════════════════════════════════════
    doc.addPage();
    newPageBanner();
    y = M + 15;

    y = sectionTitle("PHASE-WISE DETAILED BREAKDOWN", y);

    // --- Civil phase ---
    doc.rect(M, y, CW, 22).fill(C.priLight);
    doc.rect(M, y, 4, 22).fill(C.primary);
    doc.fillColor(C.primary).font("Helvetica-Bold").fontSize(10)
       .text(`Civil / Structure  —  ${fmtRs(data.civil)}`, M + 12, y + 7, { width: CW - 12 });
    y += 26;

    const civilItems: [string, number][] = [
      ["Foundation, Excavation & Anti-termite",          Math.round(data.totalCost * 0.10)],
      ["RCC Framework – Columns, Beams & Slabs",         Math.round(data.totalCost * 0.20)],
      ["Brick Masonry – Internal & External Walls",      Math.round(data.totalCost * 0.15)],
      ["Internal & External Plastering",                 Math.round(data.totalCost * 0.10)],
    ];
    civilItems.forEach(([item, amt]) => {
      doc.fillColor(C.body).font("Helvetica").fontSize(9)
         .text(`  –  ${item}`, M + 10, y, { width: 330 });
      doc.fillColor(C.dark).font("Helvetica-Bold").fontSize(9)
         .text(fmtRs(amt), M + 390, y, { width: 105 });
      y += 17;
    });
    y += 10;

    // --- MEP phase ---
    doc.rect(M, y, CW, 22).fill(C.blueLight);
    doc.rect(M, y, 4, 22).fill(C.blue);
    doc.fillColor(C.blue).font("Helvetica-Bold").fontSize(10)
       .text(`MEP Services  —  ${fmtRs(data.mep)}`, M + 12, y + 7, { width: CW - 12 });
    y += 26;

    const mepItems: [string, number][] = [
      ["Electrical Wiring, Conduits & Switchgear",  Math.round(data.mep * 0.42)],
      ["Plumbing, Sanitary Fittings & Fixtures",    Math.round(data.mep * 0.40)],
      ["Water Supply, Drainage & Fire Lines",       Math.round(data.mep * 0.18)],
    ];
    mepItems.forEach(([item, amt]) => {
      doc.fillColor(C.body).font("Helvetica").fontSize(9)
         .text(`  –  ${item}`, M + 10, y, { width: 330 });
      doc.fillColor(C.dark).font("Helvetica-Bold").fontSize(9)
         .text(fmtRs(amt), M + 390, y, { width: 105 });
      y += 17;
    });
    y += 10;

    // --- Finishing phase ---
    doc.rect(M, y, CW, 22).fill(C.greenLight);
    doc.rect(M, y, 4, 22).fill(C.green);
    doc.fillColor(C.green).font("Helvetica-Bold").fontSize(10)
       .text(`Finishing  —  ${fmtRs(data.finishing)}`, M + 12, y + 7, { width: CW - 12 });
    y += 26;

    const finishItems: [string, number][] = [
      ["Flooring – Tiles / Marble / Granite",          Math.round(data.finishing * 0.33)],
      ["Doors, Windows, Frames & Hardware",            Math.round(data.finishing * 0.27)],
      ["Interior & Exterior Paint",                    Math.round(data.finishing * 0.23)],
      ["Modular Kitchen & Miscellaneous",              Math.round(data.finishing * 0.17)],
    ];
    finishItems.forEach(([item, amt]) => {
      doc.fillColor(C.body).font("Helvetica").fontSize(9)
         .text(`  –  ${item}`, M + 10, y, { width: 330 });
      doc.fillColor(C.dark).font("Helvetica-Bold").fontSize(9)
         .text(fmtRs(amt), M + 390, y, { width: 105 });
      y += 17;
    });
    y += 22;

    // ── ROOM-WISE ESTIMATES ─────────────────────────────────────────────
    y = ensureSpace(200, y);
    y = sectionTitle("APPROXIMATE ROOM-WISE ESTIMATES", y);

    doc.fillColor(C.muted).font("Helvetica").fontSize(8)
       .text("Based on a typical house layout. Distribution may vary depending on your floor plan.", M, y);
    y += 14;

    // Table header
    doc.rect(M, y, CW, 24).fill(C.primary);
    doc.fillColor(C.white).font("Helvetica-Bold").fontSize(9)
       .text("Room / Area",   M + 8,   y + 8)
       .text("Approx. Sqft",  M + 290, y + 8)
       .text("Est. Cost",     M + 400, y + 8);
    y += 24;

    const rooms = [
      { name: "Living Room & Dining Area",       sqftPct: 0.25, costPct: 0.15 },
      { name: "Kitchen Area",                    sqftPct: 0.10, costPct: 0.20 },
      { name: "Master Bedroom",                  sqftPct: 0.15, costPct: 0.20 },
      { name: "Bedroom 2 / Additional Bedrooms", sqftPct: 0.12, costPct: 0.15 },
      { name: "Bathrooms (2 Nos.)",              sqftPct: 0.08, costPct: 0.15 },
      { name: "Corridors, Balcony & Misc.",      sqftPct: 0.30, costPct: 0.15 },
    ];

    rooms.forEach((room, i) => {
      const ry = y + i * 24;
      doc.rect(M, ry, CW, 22).fill(i % 2 === 0 ? C.light : C.white);
      doc.fillColor(C.dark).font("Helvetica").fontSize(9)
         .text(room.name, M + 8, ry + 7, { width: 228 });
      doc.fillColor(C.body).font("Helvetica").fontSize(9)
         .text(`~${Math.round(data.area * room.sqftPct)} sq.ft.`, M + 290, ry + 7);
      doc.fillColor(C.primary).font("Helvetica-Bold").fontSize(9)
         .text(fmtRs(Math.round(data.totalCost * room.costPct)), M + 400, ry + 7, { width: 95 });
    });

    y += rooms.length * 24 + 8;

    // Totals row
    doc.rect(M, y, CW, 22).fill(C.dark);
    doc.fillColor(C.white).font("Helvetica-Bold").fontSize(9)
       .text("TOTAL", M + 8, y + 7, { width: 278 })
       .text(`${data.area.toLocaleString("en-IN")} sq.ft.`, M + 290, y + 7)
       .text(fmtRs(data.totalCost),                          M + 400, y + 7, { width: 95 });
    y += 32;

    // ════════════════════════════════════════════════
    // PAGE 3 – Material Specs, Timeline, Tips, CTA
    // ════════════════════════════════════════════════
    doc.addPage();
    newPageBanner();
    y = M + 15;

    // ── MATERIAL SPECIFICATIONS ─────────────────────────────────────────
    y = sectionTitle(`MATERIAL SPECIFICATIONS  (${HOUSE_NAMES[data.houseType]})`, y);

    const matSpecs: Record<string, [string, string][]> = {
      basic: [
        ["Structure",  "Standard RCC, Fe415 TMT steel"],
        ["Flooring",   "Ceramic / vitrified tiles (Rs.40–60/sqft)"],
        ["Paint",      "Economy emulsion (Asian Paints Tractor / similar)"],
        ["Windows",    "Powder-coated aluminium sections"],
        ["Doors",      "Flush doors with standard hardware"],
        ["Sanitary",   "Basic CP fittings & sanitary ware (Cera / local brand)"],
        ["Kitchen",    "Tile countertop with basic stainless-steel sink"],
        ["Waterproof", "Basic waterproofing in bathrooms & terrace"],
      ],
      standard: [
        ["Structure",  "Quality RCC, Fe500D TMT steel"],
        ["Flooring",   "Vitrified / porcelain tiles (Rs.60–100/sqft)"],
        ["Paint",      "Premium emulsion (Asian Paints Royale / Berger Breatheasy)"],
        ["Windows",    "UPVC / powder-coated aluminium"],
        ["Doors",      "Solid wood / pre-laminated flush doors"],
        ["Sanitary",   "Standard CP fittings (Parryware / Jaquar basic)"],
        ["Kitchen",    "Granite countertop with under-mount SS sink"],
        ["Waterproof", "STP / crystalline waterproofing in wet areas"],
      ],
      luxury: [
        ["Structure",  "High-grade RCC, Fe550D TMT steel"],
        ["Flooring",   "Italian marble / granite / large-format tiles (Rs.150+/sqft)"],
        ["Paint",      "Ultra-premium finish (Berger Silk / Dulux Velvet / Nerolac Impression)"],
        ["Windows",    "European UPVC with double glazing / aluminium thermal break"],
        ["Doors",      "Imported solid wood / designer veneer / lacquer doors"],
        ["Sanitary",   "Premium CP fittings (Kohler / Duravit / Grohe)"],
        ["Kitchen",    "Quartz / natural stone countertop with premium composite sink"],
        ["Waterproof", "Polyurea / membrane waterproofing, 10-year warranty"],
      ],
    };

    const specs = matSpecs[data.houseType];
    const halfCW = (CW - 8) / 2;
    specs.forEach(([label, value], i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const rx  = M + col * (halfCW + 8);
      const ry  = y + row * 22;
      if (row % 2 === 0) doc.rect(rx, ry, halfCW, 20).fill(C.light);
      doc.fillColor(C.primary).font("Helvetica-Bold").fontSize(8)
         .text(`${label}:`, rx + 6, ry + 5, { width: 70 });
      doc.fillColor(C.dark).font("Helvetica").fontSize(8)
         .text(value, rx + 78, ry + 5, { width: halfCW - 84 });
    });

    y += Math.ceil(specs.length / 2) * 22 + 20;

    // ── CONSTRUCTION WORK SCHEDULE — Weekly Chart ────────────────────────
    y = ensureSpace(240, y);
    y = sectionTitle("CONSTRUCTION WORK SCHEDULE", y);

    const totalWeeks = data.houseType === "luxury" ? 32 : data.houseType === "standard" ? 24 : 18;
    const totalDur   = data.houseType === "luxury"   ? "32 weeks  (~8 months)"
                     : data.houseType === "standard" ? "24 weeks  (~6 months)"
                     :                                 "18 weeks  (~4–5 months)";

    // [label, barColor, startWeek(1-based), endWeek(1-based)]
    const phases: [string, string, number, number][] =
      data.houseType === "luxury"
        ? [
            ["Site Clearance & Foundation",  C.primary, 1,  6],
            ["RCC Structure",                C.primary, 5,  16],
            ["Masonry & Plastering",         C.primary, 14, 22],
            ["MEP (Electrical & Plumbing)",  C.blue,    18, 26],
            ["Finishing & Flooring",         C.green,   22, 31],
            ["Paint, Fixtures & Handover",   C.primary, 29, 32],
          ]
        : data.houseType === "standard"
        ? [
            ["Site Clearance & Foundation",  C.primary, 1,  4],
            ["RCC Structure",                C.primary, 4,  12],
            ["Masonry & Plastering",         C.primary, 10, 16],
            ["MEP (Electrical & Plumbing)",  C.blue,    13, 19],
            ["Finishing & Flooring",         C.green,   16, 23],
            ["Paint, Fixtures & Handover",   C.primary, 21, 24],
          ]
        : [
            ["Site Clearance & Foundation",  C.primary, 1,  3],
            ["RCC Structure",                C.primary, 3,  8],
            ["Masonry & Plastering",         C.primary, 7,  12],
            ["MEP (Electrical & Plumbing)",  C.blue,    10, 14],
            ["Finishing & Flooring",         C.green,   12, 17],
            ["Paint, Fixtures & Handover",   C.primary, 16, 18],
          ];

    const wLabelW   = 140;
    const wBarAreaW = CW - wLabelW;
    const wColW     = wBarAreaW / totalWeeks;
    const wCircleR  = Math.min(12, Math.max(4, Math.floor(wColW / 2) - 1));
    const wFontS    = wCircleR >= 10 ? 7 : wCircleR >= 7 ? 6 : wCircleR >= 5 ? 5 : 4.5;
    const wHeaderH  = wCircleR * 2 + 12;
    const wRowH     = 26;

    // ─ Dark header with week circles ─
    doc.rect(M, y, CW, wHeaderH).fill(C.dark);
    doc.fillColor(C.white).font("Helvetica-Bold").fontSize(8)
       .text("Work Phase", M + 6, y + (wHeaderH - 8) / 2, { width: wLabelW - 8, lineBreak: false });

    for (let w = 1; w <= totalWeeks; w++) {
      const cx = M + wLabelW + (w - 0.5) * wColW;
      const cy = y + wHeaderH / 2;
      doc.circle(cx, cy, wCircleR).fill(w % 2 === 1 ? "#444444" : "#2A2A2A");
      doc.fillColor(C.white).font("Helvetica-Bold").fontSize(wFontS)
         .text(`W${w}`, cx - wCircleR, cy - wFontS * 0.5, { width: wCircleR * 2, align: "center", lineBreak: false });
    }
    y += wHeaderH;

    // ─ Phase rows ─
    phases.forEach(([label, color, startW, endW], i) => {
      const ry = y + i * wRowH;
      doc.rect(M, ry, CW, wRowH - 1).fill(i % 2 === 0 ? C.light : C.white);

      // Vertical week grid lines
      for (let w = 1; w < totalWeeks; w++) {
        doc.rect(M + wLabelW + w * wColW, ry, 0.5, wRowH - 1).fill("#E0E0E0");
      }

      // Phase label (colored bold)
      doc.fillColor(color).font("Helvetica-Bold").fontSize(8)
         .text(label, M + 6, ry + (wRowH - 8) / 2, { width: wLabelW - 10, lineBreak: false });

      // Bar
      const barX = M + wLabelW + (startW - 1) * wColW;
      const barW = (endW - startW + 1) * wColW;
      const barY = ry + 5;
      const barH = wRowH - 11;
      doc.roundedRect(barX, barY, barW, barH, 2).fill(color);

      // Clipped text inside bar
      doc.save();
      doc.rect(barX, barY, barW, barH).clip();
      doc.fillColor(C.white).font("Helvetica-Bold").fontSize(6.5)
         .text(label, barX + 4, barY + (barH - 6.5) / 2, { width: barW - 8, lineBreak: false });
      doc.restore();
    });

    y += phases.length * wRowH + 4;

    // ─ Total duration footer ─
    doc.rect(M, y, CW, 22).fill(C.dark);
    doc.fillColor(C.white).font("Helvetica-Bold").fontSize(9)
       .text("TOTAL ESTIMATED DURATION:", M + 8, y + 7, { width: 220 })
       .text(totalDur,                    M + 234, y + 7, { width: CW - 242 });
    y += 32;

    // ── COST-SAVING TIPS ────────────────────────────────────────────────
    y = ensureSpace(165, y);
    y = sectionTitle("COST-SAVING TIPS", y);

    const tips = [
      "Fix your floor plan before construction starts – mid-project changes cost 10–20% more.",
      "Procure cement, steel & tiles directly from dealers or manufacturers to save 8–12%.",
      "Monitor day-to-day construction progress to minimise material wastage and rework.",
      "Get at least 3 competitive contractor quotes for all major packages.",
      "Phase your construction smartly – complete structure first, then MEP, then finishing.",
      "Choose standard tile sizes (600×600 mm) to minimise off-cuts and wastage.",
      "Use local stone & aggregates where possible to reduce freight costs significantly.",
    ];

    tips.forEach((tip, i) => {
      const ry = y + i * 19;
      doc.rect(M, ry + 5, 5, 5).fill(C.primary);
      doc.fillColor(C.body).font("Helvetica").fontSize(9)
         .text(tip, M + 13, ry + 4, { width: CW - 13 });
    });

    y += tips.length * 19 + 16;

    // ── DISCLAIMER ──────────────────────────────────────────────────────
    y = ensureSpace(62, y);
    doc.rect(M, y, CW, 54).fill(C.priLight);
    doc.rect(M, y, 3, 54).fill(C.primary);
    doc.fillColor(C.primary).font("Helvetica-Bold").fontSize(8.5)
       .text("IMPORTANT DISCLAIMER", M + 10, y + 8);
    doc.fillColor(C.body).font("Helvetica").fontSize(8)
       .text(
         "This report is an approximate estimate for planning purposes only. Actual construction costs may vary based on soil conditions, local market rates, design complexity, contractor rates, and material price fluctuations. We strongly recommend a detailed site visit before finalising your project budget.",
         M + 10, y + 22, { width: CW - 20 }
       );
    y += 64;

    // ── INLINE PAGE-3 FOOTER ────────────────────────────────────────────
    doc.page.margins.bottom = 0;
    const footerY = H - 35;
    doc.rect(0, footerY, W, 35).fill(C.light);
    doc.rect(0, footerY, W, 1.5).fill(C.border);
    doc.fillColor(C.muted).font("Helvetica").fontSize(7.5)
       .text(
         `© ${new Date().getFullYear()} Reliable Designs. All rights reserved.  |  Report generated on ${fmtDate()}  |  Approximate estimate – costs may vary.`,
         M, footerY + 13, { width: CW, align: "center" }
       );

    // ── PAGE 4 — PORTFOLIO ───────────────────────────────────────────────
    addPortfolioPage(doc, imgBuffers);

    // ── PAGE 5 — CONTACT US ──────────────────────────────────────────────
    addContactPage(doc, "construction");

    doc.end();
  });
}
