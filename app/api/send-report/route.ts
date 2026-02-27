import { NextRequest, NextResponse } from "next/server";
import { generateConstructionPDF, ConstructionReportData } from "../../../lib/generate-construction-pdf";
import { generateInteriorPDF, InteriorReportData } from "../../../lib/generate-interior-pdf";

const SENDER_EMAIL  = process.env.GMAIL_USER    ?? "reliabledesigns9@gmail.com";
const BREVO_API_KEY = process.env.BREVO_API_KEY ?? "";

// ── INR formatter ─────────────────────────────────────────────────────────────
function fmtRs(amount: number): string {
  if (amount >= 10_000_000) return `Rs. ${parseFloat((amount / 10_000_000).toFixed(2))} Cr`;
  if (amount >= 100_000)    return `Rs. ${parseFloat((amount / 100_000).toFixed(2))} Lac`;
  return `Rs. ${Math.round(amount).toLocaleString("en-IN")}`;
}

// ══════════════════════════════════════════════════════════════════════════════
// PLAIN-TEXT BODIES (fallback for email clients that don't support HTML)
// ══════════════════════════════════════════════════════════════════════════════
function constructionEmailText(name: string, area: number, houseType: string, totalCost: number): string {
  const houseName = { basic: "Basic House", standard: "Standard House", luxury: "Luxury House" }[houseType] ?? houseType;
  return [
    `Hi ${name},`,
    ``,
    `Thank you for using the Reliable Designs, Jaipur Construction Cost Calculator.`,
    `Your estimate report (PDF) is attached to this email.`,
    ``,
    `--- Estimate Summary ---`,
    `Buildup Area   : ${area.toLocaleString("en-IN")} sq.ft.`,
    `House Type     : ${houseName}`,
    `Total Estimate : ${fmtRs(totalCost)}`,
    ``,
    `The PDF includes:`,
    `- Complete cost breakdown (Civil, MEP, Finishing)`,
    `- Phase-wise estimates`,
    `- Room-wise approximate costs`,
    `- Material specifications`,
    `- Construction timeline and tips`,
    ``,
    `To discuss your project, reach us at:`,
    `Email     : ${SENDER_EMAIL}`,
    `Phone     : +917014370245`,
    `WhatsApp  : +917014370245`,
    `Address   : Plot no 100, Vaishali Nagar, Jaipur-302021`,
    ``,
    `Note: This is an approximate estimate. Actual costs may vary.`,
    ``,
    `Regards,`,
    `Reliable Designs`,
    ``,
    `To unsubscribe reply with subject: Unsubscribe`,
  ].join("\n");
}

function interiorEmailText(name: string, area: number, interiorType: string, totalCost: number): string {
  const typeName = { basic: "Basic Interior", standard: "Standard Interior", luxury: "Luxury Interior" }[interiorType] ?? interiorType;
  return [
    `Hi ${name},`,
    ``,
    `Thank you for using the Reliable Designs, Jaipur Home Interior Cost Calculator.`,
    `Your interior estimate report (PDF) is attached to this email.`,
    ``,
    `--- Estimate Summary ---`,
    `Carpet Area      : ${area.toLocaleString("en-IN")} sq.ft.`,
    `Interior Package : ${typeName}`,
    `Total Estimate   : ${fmtRs(totalCost)}`,
    ``,
    `The PDF includes:`,
    `- Complete cost breakdown (Material, Labour, Design)`,
    `- Room-wise interior costs`,
    `- What is included in your package`,
    `- Material recommendations`,
    `- Project timeline and tips`,
    ``,
    `To discuss your project, reach us at:`,
    `Email     : ${SENDER_EMAIL}`,
    `Phone     : +917014370245`,
    `WhatsApp  : +917014370245`,
    `Address   : Plot no 100, Vaishali Nagar, Jaipur-302021`,
    ``,
    `Note: This is an approximate estimate. Actual costs may vary.`,
    ``,
    `Regards,`,
    `Reliable Designs`,
    ``,
    `To unsubscribe reply with subject: Unsubscribe`,
  ].join("\n");
}

// ══════════════════════════════════════════════════════════════════════════════
// HTML EMAIL BODIES
// ══════════════════════════════════════════════════════════════════════════════

/** Wraps inner table rows in a full responsive email shell */
function emailShell(bodyRows: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>Reliable Designs - Estimate Report</title>
</head>
<body style="margin:0;padding:0;background-color:#EFF6FF;font-family:Arial,Helvetica,sans-serif;-webkit-text-size-adjust:100%;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#EFF6FF">
  <tr>
    <td align="center" style="padding:28px 12px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"
             style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(30,58,138,0.10);">
${bodyRows}
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

// ─── Construction HTML email ──────────────────────────────────────────────────
function constructionEmailHtml(
  name:      string,
  area:      number,
  houseType: string,
  totalCost: number,
  civil:     number,
  mep:       number,
  finishing: number,
): string {
  const houseName = (({ basic: "Basic House", standard: "Standard House", luxury: "Luxury House" }) as Record<string, string>)[houseType] ?? houseType;
  const totalFmt  = fmtRs(totalCost);
  const civilFmt  = fmtRs(civil);
  const mepFmt    = fmtRs(mep);
  const finFmt    = fmtRs(finishing);
  const areaFmt   = area.toLocaleString("en-IN");
  const year      = new Date().getFullYear();

  const pdfItems1 = [
    "Complete Cost Breakdown (Civil, MEP, Finishing)",
    "Phase-wise Detailed Estimates",
    "Room-wise Approximate Costs",
  ];
  const pdfItems2 = [
    "Material Specifications by House Type",
    "Construction Timeline (Gantt Chart)",
    "Cost-Saving Tips &amp; Disclaimer",
  ];

  const checkItems = (items: string[]) =>
    items.map(item =>
      `<p style="color:#374151;font-size:13px;margin:0 0 9px 0;font-family:Arial,sans-serif;line-height:1.4;">` +
      `<span style="color:#4169E1;font-weight:bold;margin-right:6px;">&#10003;</span>${item}</p>`
    ).join("\n                  ");

  const bodyRows = `
        <!-- ── HEADER ── -->
        <tr>
          <td bgcolor="#2952B8" style="padding:36px 40px 28px;text-align:center;">
            <p style="color:#93C5FD;font-size:10px;letter-spacing:3px;margin:0 0 10px 0;font-family:Arial,sans-serif;font-weight:bold;text-transform:uppercase;">Construction Estimate Report</p>
            <h1 style="color:#FFFFFF;font-size:26px;margin:0 0 6px 0;font-family:Arial,sans-serif;font-weight:bold;letter-spacing:1px;">RELIABLE DESIGNS</h1>
            <p style="color:#BFDBFE;font-size:12px;margin:0;font-family:Arial,sans-serif;">Experts at Architecture &nbsp;&bull;&nbsp; Vastu &nbsp;&bull;&nbsp; Structural &nbsp;&bull;&nbsp; Jaipur</p>
          </td>
        </tr>

        <!-- ── ACCENT STRIP ── -->
        <tr>
          <td bgcolor="#4169E1" style="padding:7px 40px;text-align:center;">
            <p style="color:#E8EDFC;font-size:10px;margin:0;font-family:Arial,sans-serif;letter-spacing:1px;">&#128196; YOUR CONSTRUCTION ESTIMATE PDF IS ATTACHED TO THIS EMAIL</p>
          </td>
        </tr>

        <!-- ── GREETING ── -->
        <tr>
          <td style="padding:28px 40px 12px;">
            <p style="color:#1C1C1C;font-size:16px;margin:0 0 10px 0;font-family:Arial,sans-serif;">Hi <strong style="color:#2952B8;">${name}</strong>,</p>
            <p style="color:#555555;font-size:14px;line-height:1.65;margin:0;font-family:Arial,sans-serif;">
              Thank you for using the <strong>Reliable Designs Construction Cost Calculator</strong>.
              Your personalised estimate report has been generated and is <strong>attached as a PDF</strong> to this email.
            </p>
          </td>
        </tr>

        <!-- ── COST HIGHLIGHT CARD ── -->
        <tr>
          <td style="padding:0 40px 24px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                   style="background-color:#2952B8;border-radius:10px;overflow:hidden;">
              <tr>
                <td style="padding:28px 20px;text-align:center;">
                  <p style="color:#BFDBFE;font-size:10px;letter-spacing:2px;margin:0 0 8px 0;font-family:Arial,sans-serif;text-transform:uppercase;">Total Estimated Cost &nbsp;&middot;&nbsp; Material + Labour</p>
                  <p style="color:#FFFFFF;font-size:32px;font-weight:bold;margin:0 0 6px 0;font-family:Arial,sans-serif;">${totalFmt}</p>
                  <p style="color:#93C5FD;font-size:13px;margin:0 0 20px 0;font-family:Arial,sans-serif;">${areaFmt}&nbsp;sq.ft. &nbsp;&middot;&nbsp; ${houseName}</p>
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="4" border="0">
                    <tr>
                      <td width="33%" style="padding:10px 6px;text-align:center;background-color:#3A5EC5;border-radius:6px;">
                        <p style="color:#FFFFFF;font-size:13px;font-weight:bold;margin:0 0 3px 0;font-family:Arial,sans-serif;">${civilFmt}</p>
                        <p style="color:#93C5FD;font-size:9px;margin:0;font-family:Arial,sans-serif;">Civil (55%)</p>
                      </td>
                      <td width="33%" style="padding:10px 6px;text-align:center;background-color:#3A5EC5;border-radius:6px;">
                        <p style="color:#FFFFFF;font-size:13px;font-weight:bold;margin:0 0 3px 0;font-family:Arial,sans-serif;">${mepFmt}</p>
                        <p style="color:#93C5FD;font-size:9px;margin:0;font-family:Arial,sans-serif;">MEP (15%)</p>
                      </td>
                      <td width="33%" style="padding:10px 6px;text-align:center;background-color:#3A5EC5;border-radius:6px;">
                        <p style="color:#FFFFFF;font-size:13px;font-weight:bold;margin:0 0 3px 0;font-family:Arial,sans-serif;">${finFmt}</p>
                        <p style="color:#93C5FD;font-size:9px;margin:0;font-family:Arial,sans-serif;">Finishing (30%)</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ── PDF INCLUDES ── -->
        <tr>
          <td style="padding:4px 40px 24px;">
            <p style="color:#2952B8;font-size:11px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;margin:0 0 12px 0;font-family:Arial,sans-serif;border-bottom:2px solid #E8EDFC;padding-bottom:8px;">Your PDF Report Includes</p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td width="50%" valign="top" style="padding-right:10px;">
                  ${checkItems(pdfItems1)}
                </td>
                <td width="50%" valign="top">
                  ${checkItems(pdfItems2)}
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ── CONTACT STRIP ── -->
        <tr>
          <td bgcolor="#E8EDFC" style="padding:20px 40px;">
            <p style="color:#2952B8;font-size:11px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;margin:0 0 14px 0;font-family:Arial,sans-serif;">Discuss Your Project With Us</p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td width="50%" valign="top">
                  <p style="color:#374151;font-size:13px;margin:0 0 8px 0;font-family:Arial,sans-serif;">&#128222;&nbsp; <strong>+91 70143 70245</strong></p>
                  <p style="color:#374151;font-size:13px;margin:0;font-family:Arial,sans-serif;">&#9993;&nbsp; <strong>${SENDER_EMAIL}</strong></p>
                </td>
                <td width="50%" valign="top">
                  <p style="color:#374151;font-size:13px;margin:0 0 8px 0;font-family:Arial,sans-serif;">&#128172;&nbsp; <strong>WhatsApp: +917014370245</strong></p>
                  <p style="color:#374151;font-size:13px;margin:0;font-family:Arial,sans-serif;">&#128205;&nbsp; Plot no 100, Vaishali Nagar, Jaipur</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ── DISCLAIMER ── -->
        <tr>
          <td style="padding:18px 40px 14px;">
            <p style="color:#9CA3AF;font-size:11px;line-height:1.6;margin:0;font-family:Arial,sans-serif;font-style:italic;">
              This is an approximate estimate for planning purposes only. Actual construction costs may vary based on site conditions, local market rates, design complexity, and material price fluctuations. We recommend a detailed site visit before finalising your budget.
            </p>
          </td>
        </tr>

        <!-- ── FOOTER ── -->
        <tr>
          <td bgcolor="#2952B8" style="padding:20px 40px;text-align:center;">
            <p style="color:#93C5FD;font-size:12px;margin:0 0 4px 0;font-family:Arial,sans-serif;font-weight:bold;letter-spacing:1px;">RELIABLE DESIGNS</p>
            <p style="color:#BFDBFE;font-size:10px;margin:0 0 8px 0;font-family:Arial,sans-serif;">&#169; ${year} Reliable Designs. All rights reserved.</p>
            <p style="color:#93C5FD;font-size:9px;margin:0;font-family:Arial,sans-serif;line-height:1.5;">
              We respect your privacy. No spam, ever. &nbsp;|&nbsp; To unsubscribe, reply with subject: Unsubscribe
            </p>
          </td>
        </tr>`;

  return emailShell(bodyRows);
}

// ─── Interior HTML email ──────────────────────────────────────────────────────
function interiorEmailHtml(
  name:         string,
  area:         number,
  interiorType: string,
  totalCost:    number,
  materialCost: number,
  labourCost:   number,
  designCost:   number,
): string {
  const typeName = (({ basic: "Basic Interior", standard: "Standard Interior", luxury: "Luxury Interior" }) as Record<string, string>)[interiorType] ?? interiorType;
  const totalFmt = fmtRs(totalCost);
  const matFmt   = fmtRs(materialCost);
  const labFmt   = fmtRs(labourCost);
  const desFmt   = fmtRs(designCost);
  const areaFmt  = area.toLocaleString("en-IN");
  const year     = new Date().getFullYear();

  const pdfItems1 = [
    "Complete Cost Breakdown (Material, Labour, Design)",
    "Room-wise Interior Cost Estimates",
    "What's Included in Your Package",
  ];
  const pdfItems2 = [
    "Material Recommendations by Package",
    "Interior Work Schedule (Gantt Chart)",
    "Interior Design Tips &amp; Disclaimer",
  ];

  const checkItems = (items: string[]) =>
    items.map(item =>
      `<p style="color:#374151;font-size:13px;margin:0 0 9px 0;font-family:Arial,sans-serif;line-height:1.4;">` +
      `<span style="color:#4169E1;font-weight:bold;margin-right:6px;">&#10003;</span>${item}</p>`
    ).join("\n                  ");

  const bodyRows = `
        <!-- ── HEADER ── -->
        <tr>
          <td bgcolor="#2952B8" style="padding:36px 40px 28px;text-align:center;">
            <p style="color:#93C5FD;font-size:10px;letter-spacing:3px;margin:0 0 10px 0;font-family:Arial,sans-serif;font-weight:bold;text-transform:uppercase;">Home Interior Estimate Report</p>
            <h1 style="color:#FFFFFF;font-size:26px;margin:0 0 6px 0;font-family:Arial,sans-serif;font-weight:bold;letter-spacing:1px;">RELIABLE DESIGNS</h1>
            <p style="color:#BFDBFE;font-size:12px;margin:0;font-family:Arial,sans-serif;">Experts at Architecture &nbsp;&bull;&nbsp; Vastu &nbsp;&bull;&nbsp; Structural &nbsp;&bull;&nbsp; Jaipur</p>
          </td>
        </tr>

        <!-- ── ACCENT STRIP ── -->
        <tr>
          <td bgcolor="#4169E1" style="padding:7px 40px;text-align:center;">
            <p style="color:#E8EDFC;font-size:10px;margin:0;font-family:Arial,sans-serif;letter-spacing:1px;">&#128196; YOUR INTERIOR ESTIMATE PDF IS ATTACHED TO THIS EMAIL</p>
          </td>
        </tr>

        <!-- ── GREETING ── -->
        <tr>
          <td style="padding:28px 40px 12px;">
            <p style="color:#1C1C1C;font-size:16px;margin:0 0 10px 0;font-family:Arial,sans-serif;">Hi <strong style="color:#2952B8;">${name}</strong>,</p>
            <p style="color:#555555;font-size:14px;line-height:1.65;margin:0;font-family:Arial,sans-serif;">
              Thank you for using the <strong>Reliable Designs Home Interior Cost Calculator</strong>.
              Your personalised interior estimate report has been generated and is <strong>attached as a PDF</strong> to this email.
            </p>
          </td>
        </tr>

        <!-- ── COST HIGHLIGHT CARD ── -->
        <tr>
          <td style="padding:0 40px 24px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                   style="background-color:#2952B8;border-radius:10px;overflow:hidden;">
              <tr>
                <td style="padding:28px 20px;text-align:center;">
                  <p style="color:#BFDBFE;font-size:10px;letter-spacing:2px;margin:0 0 8px 0;font-family:Arial,sans-serif;text-transform:uppercase;">Total Estimated Interior Cost &nbsp;&middot;&nbsp; Material + Labour + Design</p>
                  <p style="color:#FFFFFF;font-size:32px;font-weight:bold;margin:0 0 6px 0;font-family:Arial,sans-serif;">${totalFmt}</p>
                  <p style="color:#93C5FD;font-size:13px;margin:0 0 20px 0;font-family:Arial,sans-serif;">${areaFmt}&nbsp;sq.ft. &nbsp;&middot;&nbsp; ${typeName}</p>
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="4" border="0">
                    <tr>
                      <td width="33%" style="padding:10px 6px;text-align:center;background-color:#3A5EC5;border-radius:6px;">
                        <p style="color:#FFFFFF;font-size:13px;font-weight:bold;margin:0 0 3px 0;font-family:Arial,sans-serif;">${matFmt}</p>
                        <p style="color:#93C5FD;font-size:9px;margin:0;font-family:Arial,sans-serif;">Material (55%)</p>
                      </td>
                      <td width="33%" style="padding:10px 6px;text-align:center;background-color:#3A5EC5;border-radius:6px;">
                        <p style="color:#FFFFFF;font-size:13px;font-weight:bold;margin:0 0 3px 0;font-family:Arial,sans-serif;">${labFmt}</p>
                        <p style="color:#93C5FD;font-size:9px;margin:0;font-family:Arial,sans-serif;">Labour (37%)</p>
                      </td>
                      <td width="33%" style="padding:10px 6px;text-align:center;background-color:#3A5EC5;border-radius:6px;">
                        <p style="color:#FFFFFF;font-size:13px;font-weight:bold;margin:0 0 3px 0;font-family:Arial,sans-serif;">${desFmt}</p>
                        <p style="color:#93C5FD;font-size:9px;margin:0;font-family:Arial,sans-serif;">Design (8%)</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ── PDF INCLUDES ── -->
        <tr>
          <td style="padding:4px 40px 24px;">
            <p style="color:#2952B8;font-size:11px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;margin:0 0 12px 0;font-family:Arial,sans-serif;border-bottom:2px solid #E8EDFC;padding-bottom:8px;">Your PDF Report Includes</p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td width="50%" valign="top" style="padding-right:10px;">
                  ${checkItems(pdfItems1)}
                </td>
                <td width="50%" valign="top">
                  ${checkItems(pdfItems2)}
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ── CONTACT STRIP ── -->
        <tr>
          <td bgcolor="#E8EDFC" style="padding:20px 40px;">
            <p style="color:#2952B8;font-size:11px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;margin:0 0 14px 0;font-family:Arial,sans-serif;">Discuss Your Interior Project With Us</p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td width="50%" valign="top">
                  <p style="color:#374151;font-size:13px;margin:0 0 8px 0;font-family:Arial,sans-serif;">&#128222;&nbsp; <strong>+91 70143 70245</strong></p>
                  <p style="color:#374151;font-size:13px;margin:0;font-family:Arial,sans-serif;">&#9993;&nbsp; <strong>${SENDER_EMAIL}</strong></p>
                </td>
                <td width="50%" valign="top">
                  <p style="color:#374151;font-size:13px;margin:0 0 8px 0;font-family:Arial,sans-serif;">&#128172;&nbsp; <strong>WhatsApp: +917014370245</strong></p>
                  <p style="color:#374151;font-size:13px;margin:0;font-family:Arial,sans-serif;">&#128205;&nbsp; Plot no 100, Vaishali Nagar, Jaipur</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ── DISCLAIMER ── -->
        <tr>
          <td style="padding:18px 40px 14px;">
            <p style="color:#9CA3AF;font-size:11px;line-height:1.6;margin:0;font-family:Arial,sans-serif;font-style:italic;">
              This is an approximate estimate for planning purposes only. Actual costs may vary based on brand choices, design complexity, site conditions, and material quality. We recommend a detailed site visit before project commencement.
            </p>
          </td>
        </tr>

        <!-- ── FOOTER ── -->
        <tr>
          <td bgcolor="#2952B8" style="padding:20px 40px;text-align:center;">
            <p style="color:#93C5FD;font-size:12px;margin:0 0 4px 0;font-family:Arial,sans-serif;font-weight:bold;letter-spacing:1px;">RELIABLE DESIGNS</p>
            <p style="color:#BFDBFE;font-size:10px;margin:0 0 8px 0;font-family:Arial,sans-serif;">&#169; ${year} Reliable Designs. All rights reserved.</p>
            <p style="color:#93C5FD;font-size:9px;margin:0;font-family:Arial,sans-serif;line-height:1.5;">
              We respect your privacy. No spam, ever. &nbsp;|&nbsp; To unsubscribe, reply with subject: Unsubscribe
            </p>
          </td>
        </tr>`;

  return emailShell(bodyRows);
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN HANDLER
// ══════════════════════════════════════════════════════════════════════════════
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, reportType } = body;

    if (!name?.trim() || !email?.trim() || !reportType) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    // ── Generate PDF ──────────────────────────────────────────────────────────
    let pdfBuffer:   Buffer;
    let pdfFilename: string;
    let subject:     string;
    let textBody:    string;
    let htmlBody:    string;

    if (reportType === "construction") {
      const { area, houseType, totalCost, civil, mep, finishing } = body;
      if (!area || !houseType || !totalCost) {
        return NextResponse.json({ error: "Missing construction data." }, { status: 400 });
      }
      const pdfData: ConstructionReportData = {
        name:      name.trim(),
        email:     email.trim(),
        area:      Number(area),
        houseType,
        totalCost: Number(totalCost),
        civil:     Number(civil),
        mep:       Number(mep),
        finishing: Number(finishing),
      };
      pdfBuffer   = await generateConstructionPDF(pdfData);
      pdfFilename = "Reliable_Designs_Construction_Estimate.pdf";
      subject     = `Your Construction Report is Ready – ${name.trim()}`;
      textBody    = constructionEmailText(name.trim(), Number(area), houseType, Number(totalCost));
      htmlBody    = constructionEmailHtml(
        name.trim(), Number(area), houseType, Number(totalCost),
        Number(civil), Number(mep), Number(finishing),
      );

    } else if (reportType === "interior") {
      const { area, interiorType, totalCost, materialCost, labourCost, designCost } = body;
      if (!area || !interiorType || !totalCost) {
        return NextResponse.json({ error: "Missing interior data." }, { status: 400 });
      }
      const pdfData: InteriorReportData = {
        name:         name.trim(),
        email:        email.trim(),
        area:         Number(area),
        interiorType,
        totalCost:    Number(totalCost),
        materialCost: Number(materialCost),
        labourCost:   Number(labourCost),
        designCost:   Number(designCost),
      };
      pdfBuffer   = await generateInteriorPDF(pdfData);
      pdfFilename = "Reliable_Designs_Interior_Estimate.pdf";
      subject     = `Your Interior Design Report is Ready – ${name.trim()}`;
      textBody    = interiorEmailText(name.trim(), Number(area), interiorType, Number(totalCost));
      htmlBody    = interiorEmailHtml(
        name.trim(), Number(area), interiorType, Number(totalCost),
        Number(materialCost), Number(labourCost), Number(designCost),
      );

    } else {
      return NextResponse.json({ error: "Invalid reportType." }, { status: 400 });
    }

    // ── Send via Brevo Transactional Email API ────────────────────────────────
    const brevoRes = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept":       "application/json",
        "api-key":      BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender:      { name: "Reliable Designs", email: SENDER_EMAIL },
        to:          [{ email: email.trim(), name: name.trim() }],
        replyTo:     { email: SENDER_EMAIL },
        subject,
        textContent: textBody,
        htmlContent: htmlBody,
        attachment:  [
          {
            content: pdfBuffer.toString("base64"),
            name:    pdfFilename,
          },
        ],
        headers: {
          "List-Unsubscribe": `<mailto:${SENDER_EMAIL}?subject=Unsubscribe>`,
        },
      }),
    });

    if (!brevoRes.ok) {
      const errBody = await brevoRes.json().catch(() => ({}));
      throw new Error(`Brevo API error ${brevoRes.status}: ${JSON.stringify(errBody)}`);
    }

    return NextResponse.json({ success: true });

  } catch (err: unknown) {
    console.error("[send-report] Error:", err);
    const message = err instanceof Error ? err.message : "Internal server error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
