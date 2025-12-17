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
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  </head>
  <body style="margin:0;padding:0;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;background-color:${brand.background}">
    <div style="background-color:${brand.background};background-image:linear-gradient(to right,rgba(5,69,160,0.08) 1px,transparent 1px),linear-gradient(to bottom,rgba(5,69,160,0.08) 1px,transparent 1px);background-size:40px 40px;padding:40px 20px;min-height:100vh">
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

function renderOtpEmail(otp: string, brand: any) {
  const body = `
      <div style="text-align:center">
        <h2 style="margin:0 0 12px;font-size:26px;font-weight:700;color:${brand.text};letter-spacing:-0.02em">Verify Your Account</h2>
        <p style="margin:0 0 32px;color:${brand.muted};font-size:15px;line-height:1.6">Please enter the verification code below to complete your login</p>
      </div>
      
      <div style="background:linear-gradient(135deg,rgba(5,69,160,0.05) 0%,rgba(5,69,160,0.02) 100%);border-radius:12px;padding:32px;margin:32px 0;text-align:center;border:2px dashed ${brand.primary}">
        <div style="font-size:11px;font-weight:600;color:${brand.primary};text-transform:uppercase;letter-spacing:1px;margin-bottom:12px">Your Verification Code</div>
        <div style="font-size:42px;font-weight:700;letter-spacing:12px;color:${brand.primary};font-family:'Inter',monospace;margin:8px 0">${otp}</div>
        <div style="font-size:13px;color:${brand.muted};margin-top:16px">Valid for <strong style="color:${brand.text}">2 minutes</strong></div>
      </div>
      
      <div style="background-color:rgba(250,204,21,0.1);border-left:4px solid #facc15;padding:16px 20px;border-radius:8px;margin:32px 0">
        <p style="margin:0;font-size:14px;color:${brand.text};line-height:1.6">
          <strong>Security Tip:</strong> Never share this code with anyone. We'll never ask you for your verification code.
        </p>
      </div>
      
      <div style="margin-top:40px;padding-top:24px;border-top:1px solid ${brand.border};text-align:center">
        <p style="margin:0;font-size:13px;color:${brand.muted};line-height:1.6">
          If you didn't request this code, please ignore this email or <a href="${brand.url}" style="color:${brand.primary};text-decoration:none;font-weight:600">contact support</a>.
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
    name: process.env.BRAND_NAME || "Honesty Print House",
    url: process.env.BRAND_URL || "https://honestyprinthouse.in/",
    primary: "#0545A0",  // hsl(215, 100%, 34%) converted to hex
    accent: "#FF6B35",   // hsl(19, 100%, 51%) converted to hex
    background: "#F7F9FC", // hsl(215, 33%, 98%) converted to hex
    text: "#1E3A5F",     // hsl(215, 40%, 15%) converted to hex
    muted: "#64748B",    // hsl(215, 20%, 50%) converted to hex
    border: "#E1E8F0",   // hsl(215, 20%, 90%) converted to hex
  };

  const htmlContent = renderOtpEmail(otp, brand);

  await transporter.sendMail({
    from: `"${brand.name} Security" <noreply@honestyprinthouse.in>`,
    to: email,
    subject: `Your ${brand.name} Verification Code`,
    html: htmlContent,
  });
};
