export const successfulReviewEmailTemplate = (): string => `
  <div style="font-family: Arial, sans-serif; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #000000; padding: 30px; border-radius: 12px; box-shadow: 0 8px 16px rgba(0,0,0,0.1);">
      
      <!-- Logo Section -->
      <div style="position: relative; text-align: center; background-color: #000000; padding: 40px 20px; color: #ffffff;">
        <img src="https://drop-media.s3.eu-central-2.amazonaws.com/images/Limitless%20App%20icon%20(1).png" alt="Limitless Logo" style="max-width: 200px; height: auto; margin-bottom: 20px;"/>
        <h2 style="font-size: 24px; font-weight: bold; margin-bottom: 10px; color:#ffffff">Your profile has been approved!</h2>
        <p style="font-size: 16px; margin-top: 10px;">We are pleased to inform you that your profile has been successfully reviewed and approved. You can now enjoy full access to our services!</p>
      </div>

      <!-- Confirmation Message Section -->
      <div style="text-align: center; margin: 30px 0;">
        <span style="display: inline-block; padding: 15px 30px; font-size: 20px; font-weight: bold; color: #ffffff; background-color: #2f855a; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          Approved
        </span>
      </div>

      <!-- Next Steps Section -->
      <p style="font-size: 16px; color: #ffffff; text-align: center; margin-bottom: 20px;">
        You can now log in and start using Go Limitless. If you have any questions, feel free to reach out to our support team.
      </p>

      <!-- Footer Section -->
      <div style="text-align: center; margin-top: 30px;">
        <p style="font-size: 16px; color: #ffffff; font-weight: bold;">Thank you for choosing Go Limitless!</p>
        <p style="font-size: 16px; color: #ffffff;">The Go Limitless Team</p>
      </div>

      <div style="text-align: center; margin-top: 40px; font-size: 12px; color: #9ca3af;">
        <p>Go Limitless - Car Rental Made Simple</p>
      </div>
    </div>
  </div>
`;
