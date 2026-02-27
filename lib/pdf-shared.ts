/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * pdf-shared.ts
 * Shared "Portfolio" and "Contact Us" pages injected at the end of
 * every Reliable Designs PDF report.
 */

import path   from "path";
import fs     from "fs";
import sharp  from "sharp";

// ── Paths ─────────────────────────────────────────────────────────────────────
const PUBLIC_DIR = path.join(process.cwd(), "public");
const PROJ_DIR   = path.join(PUBLIC_DIR, "projects-imgs");

// ── Brand palette ─────────────────────────────────────────────────────────────
const C = {
  primary:    "#4169E1",
  primaryDk:  "#2952B8",
  dark:       "#1C1C1C",
  charcoal:   "#1A1A2E",
  body:       "#555555",
  muted:      "#999999",
  light:      "#F5F5F5",
  white:      "#FFFFFF",
  border:     "#E5E5E5",
  priLight:   "#E8EDFC",
  gold:       "#F59E0B",
  teal:       "#0EA5E9",
};

// ── Project photo meta ────────────────────────────────────────────────────────
const PROJECTS: { file: string; caption: string; tag: string }[] = [
  { file: "project-1.png", caption: "Residential Villa Construction",   tag: "Construction" },
  { file: "project-2.png", caption: "Premium Interior Design",          tag: "Interior"     },
  { file: "project-3.png", caption: "Modern Home Architecture",         tag: "Architecture" },
  { file: "project-4.png", caption: "Contemporary Living Spaces",       tag: "Interior"     },
  { file: "project-5.png", caption: "Renovation & Finishing",           tag: "Renovation"   },
];

// ── Pre-compress all project images with sharp ────────────────────────────────
// Resize to 800×520 and encode as JPEG at quality 48 (max compression).
// Returns an array of 5 Buffer|null entries.
export async function getCompressedProjectImages(): Promise<(Buffer | null)[]> {
  return Promise.all(
    PROJECTS.map(async ({ file }) => {
      const fp = path.join(PROJ_DIR, file);
      if (!fs.existsSync(fp)) return null;
      try {
        return await sharp(fp)
          .resize(800, 520, { fit: "cover", position: "centre" })
          .jpeg({ quality: 48, mozjpeg: true })
          .toBuffer();
      } catch {
        return null;
      }
    })
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Draw a single photo card with clipped image, overlay label + tag badge */
function drawPhotoCard(
  doc:     any,
  src:     Buffer | null,
  x:       number,
  y:       number,
  w:       number,
  h:       number,
  caption: string,
  tag:     string,
) {
  // ─ card background ─
  doc.roundedRect(x, y, w, h, 5).fill(C.light);

  // ─ clipped photo ─
  if (src) {
    try {
      doc.save();
      doc.roundedRect(x, y, w, h, 5).clip();
      doc.image(src, x, y, { cover: [w, h], align: "center", valign: "center" });
      doc.restore();
    } catch { /* silently use background */ }
  }

  // ─ bottom overlay strip ─
  doc.rect(x, y + h - 30, w, 30).fill(C.charcoal);

  // ─ caption text ─
  doc.fillColor(C.white).font("Helvetica-Bold").fontSize(8)
     .text(caption, x + 8, y + h - 21, { width: w - 50, ellipsis: true });

  // ─ tag pill ─
  const tagW = tag.length * 5.5 + 10;
  doc.roundedRect(x + w - tagW - 6, y + h - 24, tagW, 16, 3)
     .fill(C.primary);
  doc.fillColor(C.white).font("Helvetica-Bold").fontSize(6.5)
     .text(tag, x + w - tagW - 2, y + h - 19, { width: tagW, align: "center" });

  // ─ subtle card border ─
  doc.roundedRect(x, y, w, h, 5).stroke(C.border);
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE 4 — OUR FEATURED PROJECTS
// ══════════════════════════════════════════════════════════════════════════════
export function addPortfolioPage(doc: any, imgBuffers: (Buffer | null)[]) {
  doc.addPage();

  const W  = doc.page.width;
  const M  = 50;
  const CW = W - M * 2;   // 495
  const H  = doc.page.height;

  // ── Full-width orange accent bar ──────────────────────────────────────────
  doc.rect(0, 0, W, 5).fill(C.primary);

  let y = 18;

  // ── Header section (dark) ─────────────────────────────────────────────────
  doc.rect(0, y, W, 95).fill(C.charcoal);

  // Decorative right-side triangle accent
  doc.save();
  doc.moveTo(W - 90, y).lineTo(W, y).lineTo(W, y + 95).closePath().fill(C.primary);
  doc.restore();

  // Orange left accent bar
  doc.rect(0, y, 5, 95).fill(C.primary);

  // Title
  doc.fillColor(C.white).font("Helvetica-Bold").fontSize(22)
     .text("RELIABLE DESIGNS JAIPUR PROJECTS", M + 10, y + 16, { width: CW - 100, characterSpacing: 0.5 });

  // Subtitle
  doc.fillColor(C.white).font("Helvetica").fontSize(10)
     .text(
       "A showcase of completed homes, interiors & renovations by Reliable Designs",
       M + 10, y + 44, { width: CW - 110 }
     );

  // Star decorations (drawn as small squares for simplicity)
  [W - 30, W - 50, W - 70].forEach((sx, i) => {
    doc.rect(sx, y + 10 + i * 22, 6, 6).fill(C.white);
  });

  y += 105;

  // ── Section label strip ───────────────────────────────────────────────────
  doc.rect(M, y, 3, 14).fill(C.primary);
  doc.fillColor(C.primary).font("Helvetica-Bold").fontSize(9)
     .text("PORTFOLIO  -  RELIABLE DESIGNS  -  2015 TO PRESENT", M + 10, y + 3, { width: CW - 10, characterSpacing: 0.8 });
  y += 22;

  // ── Photo grid — Row 1 (project-1 + project-2) ───────────────────────────
  const colW = (CW - 10) / 2;   // ≈ 242.5
  const colH = 155;

  drawPhotoCard(doc, imgBuffers[0], M,             y, colW, colH, PROJECTS[0].caption, PROJECTS[0].tag);
  drawPhotoCard(doc, imgBuffers[1], M + colW + 10, y, colW, colH, PROJECTS[1].caption, PROJECTS[1].tag);
  y += colH + 10;

  // ── Photo grid — Row 2 (project-3 + project-4) ───────────────────────────
  drawPhotoCard(doc, imgBuffers[2], M,             y, colW, colH, PROJECTS[2].caption, PROJECTS[2].tag);
  drawPhotoCard(doc, imgBuffers[3], M + colW + 10, y, colW, colH, PROJECTS[3].caption, PROJECTS[3].tag);
  y += colH + 10;

  // ── Photo grid — Row 3 (project-5 full-width banner) ─────────────────────
  const heroH = 130;
  drawPhotoCard(doc, imgBuffers[4], M, y, CW, heroH, PROJECTS[4].caption, PROJECTS[4].tag);
  y += heroH + 14;

  // ── Stats strip ───────────────────────────────────────────────────────────
  doc.rect(M, y, CW, 52).fill(C.charcoal);
  doc.rect(M, y, CW, 2).fill(C.primary);   // top accent line

  const stats = [
    { num: "500+",  label: "Projects\nCompleted"  },
    { num: "10+",   label: "Years of\nExperience" },
    { num: "1000+", label: "Happy\nFamilies"      },
    { num: "100%",  label: "Transparent\nPricing" },
  ];

  const statW = CW / stats.length;
  stats.forEach(({ num, label }, i) => {
    const sx = M + i * statW;
    if (i > 0) doc.rect(sx, y + 8, 1, 34).fill("#333355");

    doc.fillColor(C.primary).font("Helvetica-Bold").fontSize(17)
       .text(num, sx, y + 8, { width: statW, align: "center" });
    doc.fillColor(C.white).font("Helvetica").fontSize(7.5)
       .text(label, sx, y + 29, { width: statW, align: "center", lineGap: 1 });
  });
  y += 62;

  // ── Footer ────────────────────────────────────────────────────────────────
  doc.page.margins.bottom = 0;
  const footerY = H - 30;
  doc.rect(0, footerY, W, 30).fill(C.light);
  doc.rect(0, footerY, W, 1).fill(C.border);
  doc.fillColor(C.muted).font("Helvetica").fontSize(7.5)
     .text(
       "© " + new Date().getFullYear() + " Reliable Designs  |  All project photos are of actual completed work",
       M, footerY + 11, { width: CW, align: "center" }
     );
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE 5 — CONTACT US / ABOUT
// ══════════════════════════════════════════════════════════════════════════════
export function addContactPage(doc: any, reportType: "construction" | "interior") {
  doc.addPage();

  const W  = doc.page.width;
  const M  = 50;
  const CW = W - M * 2;
  const H  = doc.page.height;

  // ── Top accent ────────────────────────────────────────────────────────────
  doc.rect(0, 0, W, 5).fill(C.primary);

  let y = 18;

  // ── Big company header ────────────────────────────────────────────────────
  doc.rect(0, y, W, 110).fill(C.charcoal);
  doc.save();
  doc.moveTo(W, y).lineTo(W - 120, y).lineTo(W, y + 110).closePath().fill("#22223B");
  doc.restore();
  doc.rect(0, y, 6, 110).fill(C.primary);

  doc.fillColor(C.white).font("Helvetica-Bold").fontSize(24)
     .text("RELIABLE DESIGNS", M + 12, y + 14, { width: CW - 130, characterSpacing: 1 });

  doc.fillColor(C.primary).font("Helvetica-Bold").fontSize(10)
     .text("Construction  -  Interior Design  -  Architecture  -  Renovation", M + 12, y + 44, { width: CW - 130 });

  doc.fillColor(C.white).font("Helvetica").fontSize(9)
     .text("Plot no 100, Vaishali Nagar, Jaipur-302021  |  Pan-India Service", M + 12, y + 62, { width: CW - 130 });

  // Rating box (top-right)
  doc.rect(W - M - 88, y + 14, 88, 60).fill(C.primary);
  doc.fillColor(C.white).font("Helvetica-Bold").fontSize(26)
     .text("4.9", W - M - 88, y + 20, { width: 88, align: "center" });
  doc.fillColor(C.white).font("Helvetica").fontSize(8)
     .text("* * * * *", W - M - 88, y + 50, { width: 88, align: "center" });
  doc.fillColor(C.white).font("Helvetica").fontSize(7)
     .text("Client Rating", W - M - 88, y + 64, { width: 88, align: "center" });

  // Bottom bar in header
  doc.rect(0, y + 95, W, 15).fill(C.primary);
  doc.fillColor(C.white).font("Helvetica-Bold").fontSize(7.5)
     .text("YOUR TRUSTED PARTNER FROM DESIGN TO DELIVERY", 0, y + 99, { width: W, align: "center", characterSpacing: 1.2 });

  y += 124;

  // ── WHY CHOOSE RELIABLE DESIGNS ──────────────────────────────────────────
  doc.rect(M, y, CW, 26).fill(C.primary);
  doc.fillColor(C.white).font("Helvetica-Bold").fontSize(11)
     .text("WHY CHOOSE RELIABLE DESIGNS?", M + 12, y + 8, { width: CW, characterSpacing: 0.5 });
  y += 30;

  const reasons = [
    { text: "10+ years of experience in construction & interior design" },
    { text: "500+ projects delivered across Rajasthan" },
    { text: "In-house team of architects, engineers & designers" },
    { text: "End-to-end management from design to handover" },
    { text: "100% transparent pricing - no hidden costs" },
    { text: "ISO-certified construction processes & quality control" },
  ];

  const halfW = (CW - 12) / 2;
  reasons.forEach(({ text }, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const rx  = M + col * (halfW + 12);
    const ry  = y + row * 26;

    if (row % 2 === 0) doc.rect(rx, ry, halfW, 24).fill(C.priLight);
    else               doc.rect(rx, ry, halfW, 24).fill(C.light);

    doc.rect(rx, ry, 3, 24).fill(C.primary);

    doc.fillColor(C.primary).font("Helvetica-Bold").fontSize(9)
       .text("v", rx + 7, ry + 8);
    doc.fillColor(C.dark).font("Helvetica").fontSize(8.5)
       .text(text, rx + 20, ry + 8, { width: halfW - 24 });
  });

  y += Math.ceil(reasons.length / 2) * 26 + 14;

  // ── OUR SERVICES ─────────────────────────────────────────────────────────
  doc.rect(M, y, CW, 26).fill(C.charcoal);
  doc.fillColor(C.white).font("Helvetica-Bold").fontSize(11)
     .text("OUR SERVICES", M + 12, y + 8, { width: CW, characterSpacing: 0.5 });
  y += 30;

  const services = [
    "Residential Construction",
    "Home Interior Design",
    "Architecture & Planning",
    "Vastu Consultation",
    "Commercial Spaces",
    "Renovation & Remodelling",
    "Project Management",
    "3D Visualisation",
  ];

  const svcW = (CW - 14) / 4;
  const svcH = 28;
  services.forEach((svc, i) => {
    const col = i % 4;
    const row = Math.floor(i / 4);
    const sx  = M + col * (svcW + 4.67);
    const sy  = y + row * (svcH + 5);

    doc.roundedRect(sx, sy, svcW, svcH, 4).fill(i % 2 === 0 ? C.priLight : C.light);
    doc.rect(sx, sy, 3, svcH).fill(C.primary);
    doc.fillColor(C.dark).font("Helvetica-Bold").fontSize(8)
       .text(svc, sx + 9, sy + 10, { width: svcW - 12 });
  });

  y += Math.ceil(services.length / 4) * (svcH + 5) + 16;

  // ── GET IN TOUCH — Big contact box ───────────────────────────────────────
  const contactH = 148;
  doc.rect(M, y, CW, contactH).fill(C.primary);

  // Heading
  doc.fillColor(C.white).font("Helvetica-Bold").fontSize(16)
     .text("GET IN TOUCH TODAY", M + 20, y + 12, { width: CW - 40, align: "center", characterSpacing: 1 });

  // Tagline
  doc.fillColor(C.white).font("Helvetica").fontSize(9)
     .text(
       reportType === "construction"
         ? "Ready to build your dream home? Our experts are here to help."
         : "Let's transform your space! Talk to our interior design team.",
       M + 20, y + 32, { width: CW - 40, align: "center" }
     );

  // Divider line
  doc.rect(M + 60, y + 48, CW - 120, 1).fill("rgba(255,255,255,0.3)");

  // ── Big phone number (centred) ──
  doc.fillColor(C.white).font("Helvetica-Bold").fontSize(24)
     .text("+917014370245", M, y + 54, { width: CW, align: "center" });

  // Phone label
  doc.fillColor(C.white).font("Helvetica").fontSize(7.5)
     .text("PHONE  /  WHATSAPP", M, y + 82, { width: CW, align: "center", characterSpacing: 1 });

  // Divider
  doc.rect(M + 80, y + 94, CW - 160, 0.5).fill("rgba(255,255,255,0.25)");

  // Email
  doc.fillColor(C.white).font("Helvetica-Bold").fontSize(10.5)
     .text("reliabledesigns9@gmail.com", M, y + 100, { width: CW, align: "center" });

  // WhatsApp link
  doc.fillColor(C.white).font("Helvetica").fontSize(9)
     .text("wa.me/917014370245", M, y + 118, { width: CW, align: "center" });

  // Small "Email  |  WhatsApp" labels
  doc.fillColor(C.white).font("Helvetica").fontSize(7)
     .text("EMAIL                                       WHATSAPP", M, y + 131, { width: CW, align: "center", characterSpacing: 0.5 });

  y += contactH + 14;

  // ── Working hours + address strip ─────────────────────────────────────────
  doc.rect(M, y, CW, 44).fill(C.charcoal);
  doc.fillColor(C.muted).font("Helvetica").fontSize(8)
     .text(
       "Monday - Sunday  |  9:00 AM - 7:00 PM",
       M, y + 8, { width: CW, align: "center" }
     );
  doc.fillColor(C.white).font("Helvetica-Bold").fontSize(7.5)
     .text(
       "Plot no 100, Vaishali Nagar, Jaipur - 302021, Rajasthan, India",
       M, y + 23, { width: CW, align: "center" }
     );
  y += 54;

  // ── WhatsApp CTA strip ────────────────────────────────────────────────────
  doc.rect(M, y, CW, 40).fill(C.priLight);
  doc.rect(M, y, 3, 40).fill(C.primary);
  doc.fillColor(C.dark).font("Helvetica-Bold").fontSize(9.5)
     .text(
       "Open WhatsApp:  wa.me/917014370245  -  mention your estimate reference for faster service.",
       M + 12, y + 14, { width: CW - 24 }
     );

  // ── Footer ────────────────────────────────────────────────────────────────
  doc.page.margins.bottom = 0;
  const footerY = H - 30;
  doc.rect(0, footerY, W, 30).fill(C.charcoal);
  doc.fillColor(C.muted).font("Helvetica").fontSize(7.5)
     .text(
       "© " + new Date().getFullYear() + " Reliable Designs. All rights reserved.  |  This report is confidential and prepared exclusively for the recipient.",
       M, footerY + 11, { width: CW, align: "center" }
     );
}
