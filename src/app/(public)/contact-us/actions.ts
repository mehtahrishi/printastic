'use server';

import * as z from 'zod';

const contactFormSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    subject: z.string(),
    message: z.string(),
});

export async function handleContactForm(formData: unknown) {
  const parsedData = contactFormSchema.safeParse(formData);

  if (!parsedData.success) {
    return { success: false, error: 'Invalid form data.' };
  }

  const { name, email, subject, message } = parsedData.data;

  // In a real application, you would use an email service like Resend, SendGrid, or Nodemailer.
  // For this example, we'll just log the data to the console to simulate sending an email.
  console.log('--- New Contact Form Submission ---');
  console.log(`To: contact@honestyprinthouse.in`);
  console.log(`From: ${name} <${email}>`);
  console.log(`Subject: ${subject}`);
  console.log('---');
  console.log(message);
  console.log('---------------------------------');

  // Simulate a delay for the email sending process
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Always return success in this simulation
  return { success: true };
}
