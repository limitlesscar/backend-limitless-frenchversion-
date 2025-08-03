export const RefundTemplate = (name: string, receipt_url: string): string => `
  <div style="font-family: Arial, sans-serif; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #000000; padding: 30px; border-radius: 12px; box-shadow: 0 8px 16px rgba(0,0,0,0.1);">
      
      <!-- Logo and Header Section -->
      <div style="position: relative; text-align: center; background-color: #000000; padding: 40px 20px; color: #ffffff;">
        <img src="https://drop-media.s3.eu-central-2.amazonaws.com/images/Limitless%20App%20icon%20(1).png" alt="Limitless Logo" style="max-width: 200px; height: auto; margin-bottom: 20px;"/>
        <h2 style="font-size: 24px; font-weight: bold; margin-bottom: 10px; color: #ffffff">Refund Confirmation</h2>
      </div>
  
      <!-- Receipt Details Section -->
      <div style="text-align: center; margin: 30px 0; color: #ffffff;">
        <p style="font-size: 16px; color: #ffffff;">Dear ${name},</p>
        
        <p style="font-size: 16px; color: #ffffff;">Your refund has been processed successfully. You can view the refund receipt by clicking the button below.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${receipt_url}" style="display: inline-block; padding: 15px 30px; font-size: 16px; font-weight: bold; color: #ffffff; background-color: #2f855a; border-radius: 8px; text-decoration: none; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            View Refund Receipt
          </a>
        </div>
        
        <p style="font-size: 16px; color: #ffffff;">The refunded amount should appear in your account within 5-10 business days, depending on your bank's processing time.</p>
        
        <p style="font-size: 16px; color: #ffffff;">If you have any questions about this refund, please don't hesitate to contact our support team.</p>
      </div>
  
      <!-- Footer Section -->
      <div style="text-align: center; margin-top: 30px;">
        <p style="font-size: 16px; color: #ffffff; font-weight: bold;">Thank you for choosing Go Limitless!</p>
        <p style="font-size: 14px; color: #9ca3af;">This refund receipt was sent from Go Limitless</p>
      </div>
  
      <div style="text-align: center; margin-top: 40px; font-size: 12px; color: #9ca3af;">
        <p>Go Limitless - Car Rental Made Simple</p>
      </div>
    </div>
  </div>
  `;

export default RefundTemplate;
