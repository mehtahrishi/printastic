
export default function ShippingPolicyPage() {
    return (
      <div className="container py-16 md:py-24 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-primary mb-6">Shipping Policy</h1>
        <div className="prose dark:prose-invert max-w-none text-foreground/80">
          <p className="text-lg">
            We are committed to getting your new art to you as quickly and safely as possible. Here’s what you need to know about our shipping process.
          </p>
  
          <h2>Processing Time</h2>
          <p>
            All orders are processed within 1-3 business days. Orders are not shipped or delivered on weekends or holidays. If we are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow additional days in transit for delivery. If there will be a significant delay in the shipment of your order, we will contact you via email.
          </p>
  
          <h2>Shipping Rates & Delivery Estimates</h2>
          <p>
            Shipping charges for your order will be calculated and displayed at checkout.
          </p>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">Shipment Method</th>
                  <th className="px-4 py-2 border">Estimated delivery time</th>
                  <th className="px-4 py-2 border">Shipment cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 border">Standard Shipping</td>
                  <td className="px-4 py-2 border">5-7 business days</td>
                  <td className="px-4 py-2 border">$5.99</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border">Expedited Shipping</td>
                  <td className="px-4 py-2 border">2-3 business days</td>
                  <td className="px-4 py-2 border">$15.99</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border">Overnight Shipping</td>
                  <td className="px-4 py-2 border">1-2 business days</td>
                  <td className="px-4 py-2 border">$25.99</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm mt-2">Delivery delays can occasionally occur.</p>
  
          <h2>Shipment Confirmation & Order Tracking</h2>
          <p>
            You will receive a shipment confirmation email once your order has shipped, containing your tracking number(s). The tracking number will be active within 24 hours.
          </p>
  
          <h2>International Shipping</h2>
          <p>
            We currently do not ship outside the United States. We are working on expanding our shipping options to include international destinations in the near future.
          </p>
  
          <h2>Contact Us</h2>
          <p>
            If you have any questions about our shipping policy, please <a href="/contact-us">contact us</a>.
          </p>
        </div>
      </div>
    );
  }
  