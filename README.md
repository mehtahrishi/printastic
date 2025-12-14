# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Contact Form Email

Configure Hostinger SMTP credentials in an `.env.local` file:

```
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=your_mailbox@yourdomain.com
SMTP_PASS=your_smtp_password
CONTACT_TO=your_mailbox@yourdomain.com
```

Then install dependencies and run dev:

```
npm install
npm run dev
```

The contact form posts to `/api/contact` and sends emails via SMTP.
