import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body || {};

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const to = process.env.CONTACT_TO || user;

    if (!host || !user || !pass) {
      return NextResponse.json({ error: "SMTP is not configured" }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
    await transporter.verify();

    const brand = {
      name: process.env.BRAND_NAME || "Printastic",
      url: process.env.BRAND_URL || "https://honestyprinthouse.in/",
      primary: process.env.BRAND_PRIMARY || "#30586b", // hsl(203 39% 29%) - site primary
      accent: process.env.BRAND_ACCENT || "#c39961", // hsl(34 47% 64%) - site accent
      background: "#f1f5f9", // hsl(206 33% 95%) - light background
      text: "#1e293b", // hsl(215 28% 17%) - foreground
      muted: "#64748b", // hsl(215 20% 45%) - muted text
      border: "#cbd5e1", // hsl(215 20% 87%) - border
    };

    const adminHtml = renderAdminEmail({ name, email, subject, message }, brand);
    const userHtml = renderUserEmail({ name, subject }, brand);

    const adminInfo = await transporter.sendMail({
      from: `${brand.name} Contact <${user}>`,
      replyTo: email,
      to,
      subject: `New Contact: ${subject}`,
      text: `New contact on ${brand.name}\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
      html: adminHtml,
    });

    const userInfo = await transporter.sendMail({
      from: `${brand.name} Support <${user}>`,
      to: email,
      subject: `We received your message — ${brand.name}`,
      text: `Hi ${name},\n\nThanks for reaching out about "${subject}". Our team has received your message and will get back to you shortly.\n\nBest,\n${brand.name} Support\n${brand.url}`,
      html: userHtml,
    });

    return NextResponse.json({ ok: true, adminId: adminInfo.messageId, userId: userInfo.messageId });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Unknown error" }, { status: 500 });
  }
}

function renderShell(content: string, brand: { name: string; url: string; primary: string; accent: string; background: string; text: string; muted: string; border: string }) {
  return `
  <div style="background:${brand.background};padding:32px 0;font-family:system-ui,-apple-system,Segoe UI,Arial,sans-serif">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="color:${brand.text}">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:16px;box-shadow:0 2px 12px rgba(30,41,59,0.08);overflow:hidden;border:1px solid ${brand.border}">
            <tr>
              <td style="background:linear-gradient(135deg, ${brand.primary} 0%, ${brand.primary}e6 100%);padding:32px 24px">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td>
                      <div style="display:inline-flex;align-items:center;gap:8px">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08" />
                          <path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z" />
                        </svg>
                        <span style="font-size:22px;font-weight:700;color:#fff;letter-spacing:-0.02em">${brand.name}</span>
                      </div>
                      <div style="font-size:13px;color:rgba(255,255,255,0.85);margin-top:4px">${brand.url.replace(/^https?:\/\//, '')}</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr><td style="padding:32px 24px">${content}</td></tr>
            <tr>
              <td style="padding:20px 24px;border-top:1px solid ${brand.border};background:${brand.background}">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="color:${brand.muted};font-size:12px">
                      © ${new Date().getFullYear()} ${brand.name}. All rights reserved.
                    </td>
                    <td align="right">
                      <a href="${brand.url}" style="color:${brand.primary};text-decoration:none;font-size:12px;font-weight:500">Visit Store</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>`;
}

function renderAdminEmail(data: { name: string; email: string; subject: string; message: string }, brand: any) {
  const body = `
    <h2 style="margin:0 0 8px;font-size:24px;font-weight:700;color:${brand.text}">New Contact Message</h2>
    <p style="margin:0 0 24px;color:${brand.muted};font-size:15px">You received a new contact request via ${brand.name}.</p>
    <table role="presentation" cellspacing="0" cellpadding="0" width="100%" style="border-collapse:collapse;margin-bottom:20px">
      <tr>
        <td style="padding:12px 0;width:120px;color:${brand.muted};font-weight:600;font-size:14px">Name</td>
        <td style="font-size:15px;color:${brand.text}">${escapeHtml(data.name)}</td>
      </tr>
      <tr style="border-top:1px solid ${brand.border}">
        <td style="padding:12px 0;width:120px;color:${brand.muted};font-weight:600;font-size:14px">Email</td>
        <td style="font-size:15px"><a href="mailto:${escapeHtml(data.email)}" style="color:${brand.primary};text-decoration:none">${escapeHtml(data.email)}</a></td>
      </tr>
      <tr style="border-top:1px solid ${brand.border}">
        <td style="padding:12px 0;width:120px;color:${brand.muted};font-weight:600;font-size:14px">Subject</td>
        <td style="font-size:15px;color:${brand.text}">${escapeHtml(data.subject)}</td>
      </tr>
    </table>
    <div style="margin-top:20px;padding:20px;border:1px solid ${brand.border};border-radius:12px;background:${brand.background}">
      <div style="font-weight:600;margin-bottom:12px;color:${brand.text};font-size:14px">Message</div>
      <div style="color:${brand.text};font-size:15px;line-height:1.6">${escapeHtml(data.message).replace(/\n/g, '<br/>')}</div>
    </div>
    <div style="margin-top:24px;padding-top:24px;border-top:1px solid ${brand.border}">
      <a href="mailto:${escapeHtml(data.email)}?subject=Re: ${escapeHtml(data.subject)}" style="display:inline-block;background:${brand.primary};color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-size:14px">Reply to ${escapeHtml(data.name)}</a>
    </div>
  `;
  return renderShell(body, brand);
}

function renderUserEmail(data: { name: string; subject: string }, brand: any) {
  const body = `
    <h2 style="margin:0 0 8px;font-size:24px;font-weight:700;color:${brand.text}">We received your message!</h2>
    <p style="margin:0 0 24px;color:${brand.muted};font-size:15px">Hi ${escapeHtml(data.name)}, thanks for contacting ${brand.name}.</p>
    
    <div style="padding:20px;border-left:3px solid ${brand.accent};background:${brand.background};border-radius:8px;margin-bottom:24px">
      <div style="font-size:13px;color:${brand.muted};font-weight:600;margin-bottom:4px;text-transform:uppercase;letter-spacing:0.5px">Your Subject</div>
      <div style="font-size:16px;font-weight:600;color:${brand.text}">${escapeHtml(data.subject)}</div>
    </div>

    <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:${brand.text}">
      Our team has received your message and will get back to you as soon as possible. We typically respond within 24-48 hours during business days.
    </p>

    <p style="margin:0 0 28px;font-size:14px;color:${brand.muted}">
      If you need to add more details, just reply to this email and we'll see your update.
    </p>

    <a href="${brand.url}" style="display:inline-block;background:${brand.primary};color:#fff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:600;font-size:15px;box-shadow:0 2px 8px rgba(48,88,107,0.2)">Visit ${brand.name}</a>
    
    <div style="margin-top:32px;padding-top:24px;border-top:1px solid ${brand.border}">
      <p style="margin:0;font-size:13px;color:${brand.muted};line-height:1.5">
        <strong style="color:${brand.text}">Need immediate help?</strong><br/>
        Email us at <a href="mailto:${process.env.CONTACT_TO || process.env.SMTP_USER}" style="color:${brand.primary};text-decoration:none">${process.env.CONTACT_TO || process.env.SMTP_USER}</a>
      </p>
    </div>
  `;
  return renderShell(body, brand);
}

function escapeHtml(str: string) {
  return String(str).replace(/[&<>"]+/g, (c) => {
    switch (c) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
}
