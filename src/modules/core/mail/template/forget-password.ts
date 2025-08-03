export const forgotPasswordOtpTemplate = (code: number): string => `
  <div style="font-family: Arial, sans-serif; padding: 20px; 
  ">
    <div style="max-width: 600px; margin: auto; background-color: #000000; padding: 30px; border-radius: 12px; box-shadow: 0 8px 16px rgba(0,0,0,0.1);">
      <!-- Logo Section with Gradient Background -->
      <div style="position: relative; text-align: center; background-color: #000000; padding: 40px 20px; color: #ffffff;">
        <img src="https://drop-media.s3.eu-central-2.amazonaws.com/images/Limitless%20App%20icon%20(1).png" alt="Limitless Logo" style="max-width: 200px; height: auto; margin-bottom: 20px;"/>
        <h2 style="font-size: 24px; font-weight: bold; margin-bottom: 10px; color:#ffffff">Mot de passe oublié ?</h2>
        <p style="font-size: 16px; margin-top: 10px;">Nous avons reçu une demande de réinitialisation du mot de passe pour votre compte Limitless. Pour continuer, veuillez utiliser le code de vérification ci-dessous :</p>
      </div>
      <!-- Verification Code Section -->
      <div style="text-align: center; margin: 30px 0;">
        <span style="display: inline-block; padding: 15px 30px; font-size: 32px; font-weight: bold; color: #ffffff; background-color: #2f855a;
; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          ${code}
        </span>
      </div>
      <!-- Instructions Section -->
      <p style="font-size: 16px; color: #ffffff; text-align: center; margin-bottom: 20px;">Veuillez saisir ce code dans l'application pour réinitialiser votre mot de passe et retrouver l’accès à votre compte Go Limitless.</p>
      <p style="font-size: 14px; color: #9ca3af; text-align: center;">Si vous n'avez pas demandé de réinitialisation, vous pouvez ignorer cet email. Votre compte est sécurisé.</p>
      <!-- Footer Section -->
      <div style="text-align: center; margin-top: 30px;">
        <p style="font-size: 16px; color: #ffffff; font-weight: bold;">Merci d’avoir choisi Go Limitless !</p>
        <p style="font-size: 16px; color: #ffffff;">L'équipe Go Limitless</p>
      </div>
      <div style="text-align: center; margin-top: 40px; font-size: 12px; color: #9ca3af;">
        <p>Go Limitless - La location de voiture simplifiée</p>
      </div>
    </div>
  </div>
`;
