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
    // Use contact-specific SMTP credentials
    const user = process.env.CONTACT_SMTP_USER || process.env.SMTP_USER;
    const pass = process.env.CONTACT_SMTP_PASS || process.env.SMTP_PASS;
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
      name: process.env.BRAND_NAME || "Honesty Print House",
      url: process.env.BRAND_URL || "https://honestyprinthouse.in/",
      primary: "#0545A0",  // hsl(215, 100%, 34%) converted to hex
      accent: "#FF6B35",   // hsl(19, 100%, 51%) converted to hex
      background: "#F7F9FC", // hsl(215, 33%, 98%) converted to hex
      text: "#1E3A5F",     // hsl(215, 40%, 15%) converted to hex
      muted: "#64748B",    // hsl(215, 20%, 50%) converted to hex
      border: "#E1E8F0",   // hsl(215, 20%, 90%) converted to hex
    };

    const adminHtml = renderAdminEmail({ name, email, subject, message }, brand);
    const userHtml = renderUserEmail({ name, subject, message }, brand);

    const adminInfo = await transporter.sendMail({
      from: `${brand.name} <${user}>`,
      replyTo: email,
      to,
      subject: `New Contact from ${name}: ${subject}`,
      text: `New contact on ${brand.name}\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
      html: adminHtml,
    });

    const userInfo = await transporter.sendMail({
      from: `${brand.name} <${user}>`,
      replyTo: to,
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
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  </head>
  <body style="margin:0;padding:0;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;background-color:${brand.background}">
    <div style="background-color:${brand.background};background-image:linear-gradient(to right,rgba(5,69,160,0.08) 1px,transparent 1px),linear-gradient(to bottom,rgba(5,69,160,0.08) 1px,transparent-1px);background-size:40px 40px;padding:40px 20px;min-height:100vh">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td align="center">
            <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(5,69,160,0.1);border:1px solid ${brand.border}">
              <!-- Header -->
              <tr>
                <td style="background:linear-gradient(135deg,${brand.primary} 0%,#003d82 100%);padding:40px 32px;text-align:center">
                  <h1 style="margin:0;font-size:28px;font-weight:700;color:#ffffff;letter-spacing:-0.02em">${brand.name}</h1>
                  <p style="margin:8px 0 0;font-size:14px;color:rgba(255,255,255,0.9)">${brand.url.replace(/^https?:\/\//, '')}</p>
                </td>
              </tr>
              <!-- Content -->
              <tr>
                <td style="padding:40px 32px">
                  ${content}
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="padding:24px 32px;border-top:1px solid ${brand.border};background-color:${brand.background}">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                    <tr>
                      <td style="color:${brand.muted};font-size:13px;line-height:1.6">
                        © ${new Date().getFullYear()} ${brand.name}. All rights reserved.
                      </td>
                      <td align="right">
                        <a href="${brand.url}" style="display:inline-block;color:${brand.primary};text-decoration:none;font-size:13px;font-weight:600;padding:8px 16px;border:1px solid ${brand.primary};border-radius:6px;transition:all 0.2s">Visit Store</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  </body>
  </html>`;
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

function renderUserEmail(data: { name: string; subject: string; message: string }, brand: any) {
  const body = `
    <h2 style="margin:0 0 8px;font-size:24px;font-weight:700;color:${brand.text}">We received your message!</h2>
    <p style="margin:0 0 24px;color:${brand.muted};font-size:15px">Hi ${escapeHtml(data.name)}, thanks for contacting ${brand.name}.</p>

    <div style="padding:20px;border-left:3px solid ${brand.accent};background:${brand.background};border-radius:8px;margin-bottom:24px">
      <div style="font-size:13px;color:${brand.muted};font-weight:600;margin-bottom:4px;text-transform:uppercase;letter-spacing:0.5px">Your Subject</div>
      <div style="font-size:16px;font-weight:600;color:${brand.text}">${escapeHtml(data.subject)}</div>
    </div>

    <div style="padding:20px;border:1px solid ${brand.border};border-radius:8px;margin-bottom:24px">
      <div style="font-size:13px;color:${brand.muted};font-weight:600;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px">Your Message</div>
      <div style="color:${brand.text};font-size:15px;line-height:1.6">${escapeHtml(data.message).replace(/\n/g, '<br/>')}</div>
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
