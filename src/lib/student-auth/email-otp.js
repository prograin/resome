import { emailOTP } from "better-auth/plugins";
import { sendEmailOTP } from "../email/send-email-otp.js";
import { markEmailDelivered } from "../email/delivery-status.js";

export function profileEmailOTP(sendVerificationOTP = sendEmailOTP) {
  return emailOTP({
    otpLength: 4,
    expiresIn: 300,
    allowedAttempts: 3,
    storeOTP: "hashed",
    disableSignUp: true,
    changeEmail: { enabled: true, verifyCurrentEmail: false },
    async sendVerificationOTP(data, context) {
      await sendVerificationOTP(data, context);
      markEmailDelivered();
    },
  });
}
