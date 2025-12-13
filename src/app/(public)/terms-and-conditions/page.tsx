
export default function TermsAndConditionsPage() {
    return (
      <div className="container py-16 md:py-24 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-primary mb-6">Terms and Conditions</h1>
        <div className="prose dark:prose-invert max-w-none text-foreground/80">
          <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          <p className="text-lg">
            Please read these Terms and Conditions ("Terms", "Terms and Conditions") carefully before using the Printastic website (the "Service") operated by Printastic ("us", "we", or "our").
          </p>
          <p>
            Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the Service.
          </p>
  
          <h2>1. Accounts</h2>
          <p>
            When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
          </p>
  
          <h2>2. Intellectual Property</h2>
          <p>
            The Service and its original content, features, and functionality are and will remain the exclusive property of Printastic and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Printastic.
          </p>
  
          <h2>3. Links to Other Web Sites</h2>
          <p>
            Our Service may contain links to third-party web sites or services that are not owned or controlled by Printastic. Printastic has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third-party web sites or services.
          </p>
  
          <h2>4. Termination</h2>
          <p>
            We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
          </p>
  
          <h2>5. Limitation of Liability</h2>
          <p>
            In no event shall Printastic, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
          </p>
  
          <h2>6. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
          </p>
  
          <h2>7. Changes</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect.
          </p>
  
          <h2>Contact Us</h2>
          <p>
            If you have any questions about these Terms, please <a href="/contact-us">contact us</a>.
          </p>
        </div>
      </div>
    );
  }
  