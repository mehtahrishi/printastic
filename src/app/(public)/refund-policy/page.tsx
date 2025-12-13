
export default function RefundPolicyPage() {
    return (
      <div className="container py-16 md:py-24 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-primary mb-6">Refund Policy</h1>
        <div className="prose dark:prose-invert max-w-none text-foreground/80">
          <p className="text-lg">
            We want you to be completely satisfied with your purchase. If you are not happy with your art print, you can return it within 30 days of receipt for a full refund or exchange.
          </p>
  
          <h2>Conditions for Return</h2>
          <ul>
            <li>The item must be in its original, unused condition.</li>
            <li>The item must be in its original packaging.</li>
            <li>A receipt or proof of purchase is required.</li>
          </ul>
  
          <h2>Refund Process</h2>
          <p>
            To initiate a return, please contact our customer support team at <a href="mailto:support@printastic.com">support@printastic.com</a> with your order number and the reason for the return. We will provide you with instructions on how to send back your item.
          </p>
          <p>
            Once we receive and inspect your returned item, we will notify you of the approval or rejection of your refund. If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within 7-10 business days.
          </p>
  
          <h2>Damaged Items</h2>
          <p>
            If your order arrives damaged, please contact us immediately with photos of the damaged item and packaging. We will arrange for a replacement to be sent to you at no additional cost.
          </p>
  
          <h2>Non-Refundable Items</h2>
          <ul>
            <li>Gift cards</li>
            <li>Custom or personalized orders</li>
            <li>Final sale items</li>
          </ul>
  
          <h2>Contact Us</h2>
          <p>
            If you have any questions about our refund policy, please don't hesitate to <a href="/contact-us">contact us</a>.
          </p>
        </div>
      </div>
    );
  }
  