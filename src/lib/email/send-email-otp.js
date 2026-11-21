import { emailSender } from "./sender.js";

export async function sendEmailOTP({ email, otp, type }) {
  if (type !== "change-email") throw new Error("Unsupported email verification operation.");
  const { client, from } = emailSender();
  const { error } = await client.emails.send({
    from,
    to: [email],
    subject: "Prograin | کد تأیید ایمیل",
    text: `کد تأیید ایمیل شما: ${otp}\nاین کد تا ۵ دقیقه معتبر است. اگر این درخواست از شما نبوده، این ایمیل را نادیده بگیرید.`,
    html: `<div dir="rtl" style="font-family:Arial,sans-serif;line-height:1.8"><h2>Prograin</h2><p>کد تأیید ایمیل شما:</p><p dir="ltr" style="font-size:32px;font-weight:bold;letter-spacing:8px;text-align:center">${otp}</p><p>این کد تا ۵ دقیقه معتبر است.</p><p>اگر این درخواست از شما نبوده، این ایمیل را نادیده بگیرید.</p></div>`,
  });
  if (error) throw new Error("Verification email could not be sent.");
}
