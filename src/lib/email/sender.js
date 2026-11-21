import { Resend } from "resend";
import { z } from "zod";

const emailEnvironment = z.object({
  RESEND_API_KEY: z.string().min(1),
  RESEND_FROM_EMAIL: z.string().min(1),
});

export function emailSender() {
  const config = emailEnvironment.safeParse(process.env);
  if (!config.success) throw new Error("Email service is not configured.");
  return {
    client: new Resend(config.data.RESEND_API_KEY),
    from: config.data.RESEND_FROM_EMAIL,
  };
}
