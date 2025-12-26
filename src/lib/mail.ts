
import nodemailer from "nodemailer";

function escapeHtml(str: string) {
  if (!str) return "";
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
                        <a href="${brand.url}/orders" style="display:inline-block;color:${brand.primary};text-decoration:none;font-size:13px;font-weight:600;padding:8px 16px;border:1px solid ${brand.primary};border-radius:6px;transition:all 0.2s">View Your Orders</a>
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

function renderPasswordResetEmail(resetLink: string, brand: any) {
  const body = `
      <div style="text-align:center">
        <h2 style="margin:0 0 12px;font-size:26px;font-weight:700;color:${brand.text};letter-spacing:-0.02em">Password Reset Request</h2>
        <p style="margin:0 0 32px;color:${brand.muted};font-size:15px;line-height:1.6">You recently requested to reset your password for your ${brand.name} account. Click the button below to reset it.</p>
      </div>
      
      <div style="text-align:center;margin:32px 0;">
        <a href="${resetLink}" style="display:inline-block;background:${brand.primary};color:#ffffff;text-decoration:none;padding:16px 32px;border-radius:8px;font-weight:600;font-size:16px;box-shadow:0 2px 8px rgba(48,88,107,0.2)">Reset Your Password</a>
      </div>
      
      <div style="background-color:rgba(250,204,21,0.1);border-left:4px solid #facc15;padding:16px 20px;border-radius:8px;margin:32px 0">
        <p style="margin:0;font-size:14px;color:${brand.text};line-height:1.6">
          <strong>This link is valid for 1 hour.</strong> If you did not request a password reset, please ignore this email.
        </p>
      </div>
      
      <div style="margin-top:40px;padding-top:24px;border-top:1px solid ${brand.border};text-align:center">
        <p style="margin:0;font-size:13px;color:${brand.muted};line-height:1.6">
          If you're having trouble with the button, copy and paste this URL into your browser:
          <br>
          <a href="${resetLink}" style="color:${brand.primary};text-decoration:none;font-weight:400;word-break:break-all;">${resetLink}</a>
        </p>
      </div>
    `;
  return renderShell(body, brand);
}

const getBrandConfig = () => ({
    name: process.env.BRAND_NAME || "Honesty Print House",
    url: process.env.BRAND_URL || "https://honestyprinthouse.in/",
    primary: "#0545A0",  // hsl(215, 100%, 34%) converted to hex
    accent: "#FF6B35",   // hsl(19, 100%, 51%) converted to hex
    background: "#F7F9FC", // hsl(215, 33%, 98%) converted to hex
    text: "#1E3A5F",     // hsl(215, 40%, 15%) converted to hex
    muted: "#64748B",    // hsl(215, 20%, 50%) converted to hex
    border: "#E1E8F0",   // hsl(215, 20%, 90%) converted to hex
});

function renderOrderConfirmationEmail(order: any, user: any, brand: any) {
  const itemsHtml = order.items.map((item: any) => `
    <tr style="border-bottom:1px solid ${brand.border}">
      <td style="padding:12px 0;font-size:14px;color:${brand.text}">
        ${escapeHtml(item.productName)}
        <div style="font-size:12px;color:${brand.muted}">
          Qty: ${item.quantity}
          ${item.size ? ` | Size: ${item.size}` : ''}
          ${item.color ? ` | Color: ${item.color}` : ''}
        </div>
      </td>
      <td style="padding:12px 0;font-size:14px;color:${brand.text};text-align:right">₹${Number(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('');

  const isCod = order.paymentMethod === 'cod';
  const total = Number(order.total);
  const amountPaid = isCod ? 50.00 : total;
  const amountDue = isCod ? total - 50.00 : 0;

  const paymentDetailsHtml = `
    <tr style="border-top:2px solid ${brand.border};">
      <td style="padding:16px 0 4px;color:${brand.muted};font-size:14px">Total</td>
      <td style="padding:16px 0 4px;color:${brand.muted};font-size:14px;text-align:right">₹${total.toFixed(2)}</td>
    </tr>
    ${isCod ? `
    <tr>
      <td style="padding:4px 0;color:${brand.muted};font-size:14px">Advance Paid</td>
      <td style="padding:4px 0;color:${brand.muted};font-size:14px;text-align:right">₹${amountPaid.toFixed(2)}</td>
    </tr>
    <tr style="border-bottom:2px solid ${brand.border};">
      <td style="padding:4px 0 16px;color:${brand.muted};font-size:14px">Amount Due on Delivery</td>
      <td style="padding:4px 0 16px;color:${brand.muted};font-size:14px;text-align:right">₹${amountDue.toFixed(2)}</td>
    </tr>
    ` : ''}
    <tr style="border-top:2px solid ${brand.border};">
      <td style="padding-top:16px;font-weight:600;color:${brand.text};font-size:16px">Amount Paid</td>
      <td style="padding-top:16px;font-weight:600;color:${brand.text};font-size:16px;text-align:right">₹${amountPaid.toFixed(2)}</td>
    </tr>
  `;

  const body = `
    <h2 style="margin:0 0 12px;font-size:26px;font-weight:700;color:${brand.text};letter-spacing:-0.02em">Your Order is Confirmed!</h2>
    <p style="margin:0 0 24px;color:${brand.muted};font-size:15px;line-height:1.6">Hi ${escapeHtml(user.name)}, thanks for your purchase. We're getting your order ready.</p>
    
    <div style="border:1px solid ${brand.border};border-radius:12px;padding:24px;margin-bottom:24px;">
      <h3 style="margin:0 0 16px;font-size:16px;font-weight:600;color:${brand.text}">Order Summary</h3>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
        ${itemsHtml}
      </table>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin-top:16px;">
        ${paymentDetailsHtml}
      </table>
    </div>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td style="width:50%;vertical-align:top;padding-right:12px">
          <h3 style="margin:0 0 12px;font-size:16px;font-weight:600;color:${brand.text}">Shipping to</h3>
          <p style="margin:0;font-size:14px;color:${brand.muted};line-height:1.6">
            ${escapeHtml(user.name)}<br>
            ${escapeHtml(order.shippingAddress)}
          </p>
        </td>
        <td style="width:50%;vertical-align:top;padding-left:12px">
          <h3 style="margin:0 0 12px;font-size:16px;font-weight:600;color:${brand.text}">Order Details</h3>
          <p style="margin:0;font-size:14px;color:${brand.muted};line-height:1.6">
            <strong>Order ID:</strong> #${order.id}<br>
            <strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}<br>
            <strong>Payment:</strong> ${escapeHtml(order.paymentMethod)}
          </p>
        </td>
      </tr>
    </table>
  `;

  return renderShell(body, brand);
}

const getTransporter = () => {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
        console.error("SMTP not configured in environment variables.");
        throw new Error("SMTP server is not configured.");
    }
    
    return nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
        tls: {
            rejectUnauthorized: false
        }
    });
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const transporter = getTransporter();
    const brand = getBrandConfig();
    const resetLink = `${brand.url}/reset-password?token=${token}`;
    const htmlContent = renderPasswordResetEmail(resetLink, brand);

    try {
        await transporter.sendMail({
            from: `"${brand.name} Support" <noreply@honestyprinthouse.in>`,
            to: email,
            subject: `Reset Your ${brand.name} Password`,
            html: htmlContent,
        });
    } catch (error) {
        console.error("Error sending password reset email:", error);
        throw new Error("Could not send password reset email.");
    }
};

export const sendOrderConfirmationEmail = async (order: any, user: any) => {
    const transporter = getTransporter();
    const brand = getBrandConfig();
    const htmlContent = renderOrderConfirmationEmail(order, user, brand);

    try {
        await transporter.sendMail({
            from: `"${brand.name}" <noreply@honestyprinthouse.in>`,
            to: user.email,
            subject: `Order Confirmation #${order.id} from ${brand.name}`,
            html: htmlContent,
        });
    } catch (error) {
        console.error("Error sending order confirmation email:", error);
        throw new Error("Could not send order confirmation email.");
    }
};
