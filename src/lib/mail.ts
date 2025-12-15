import nodemailer from "nodemailer";

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

function renderOtpEmail(otp: string, brand: any) {
  const body = `
      <h2 style="margin:0 0 8px;font-size:24px;font-weight:700;color:${brand.text}">Verification Code</h2>
      <p style="margin:0 0 24px;color:${brand.muted};font-size:15px">Please use the following OTP to complete your login procedure.</p>
      
      <div style="background-color: ${brand.background}; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: center; border: 1px dashed ${brand.primary}">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: ${brand.primary}; font-family: monospace;">${otp}</span>
      </div>
      
      <p style="margin:0 0 24px;color:${brand.muted};font-size:14px">This code is valid for <strong>2 minutes</strong>.</p>
      
       <div style="margin-top:32px;padding-top:24px;border-top:1px solid ${brand.border}">
         <p style="margin:0;font-size:13px;color:${brand.muted};line-height:1.5">
           If you did not request this code, please ignore this email.
         </p>
       </div>
    `;
  return renderShell(body, brand);
}

export const sendOtpEmail = async (email: string, otp: string) => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.error("SMTP not configured in environment variables");
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  const brand = {
    name: process.env.BRAND_NAME || "Printastic",
    url: process.env.BRAND_URL || "https://honestyprinthouse.in/",
    primary: process.env.BRAND_PRIMARY || "#4F46E5",
    accent: process.env.BRAND_ACCENT || "#c39961",
    background: "#f1f5f9",
    text: "#1e293b",
    muted: "#64748b",
    border: "#cbd5e1",
  };

  const htmlContent = renderOtpEmail(otp, brand);

  await transporter.sendMail({
    from: `"${brand.name} Security" <${user}>`,
    to: email,
    subject: "Your Login Verification Code",
    html: htmlContent,
  });
};
