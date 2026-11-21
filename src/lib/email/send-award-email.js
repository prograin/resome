import pRetry, { AbortError } from "p-retry";
import { z } from "zod";
import { notificationHref } from "../notifications/targets.js";
import { emailSender } from "./sender.js";

export async function sendAwardEmail({ email, notification, note = "", idempotencyKey }) {
  if (notification.kind !== "award") throw new Error("Unsupported notification email.");
  const { client, from } = emailSender();
  const origin = new URL(z.url().parse(process.env.BETTER_AUTH_URL)).origin;
  const url = new URL(notificationHref(notification), origin);
  const message = {
    from,
    to: [email],
    subject: "Prograin | امتیاز جدید شما ثبت شد",
    // Plain text intentionally avoids interpreting user-controlled course titles as HTML.
    text: [
      "سلام،",
      "امتیاز جدید شما در آکادمی Prograin ثبت شد.",
      `امتیاز شما: ${new Intl.NumberFormat("fa-IR").format(notification.points)} از ۵`,
      notification.courseTitle ? `دوره: ${notification.courseTitle}` : "",
      note.trim() ? `توضیحات استاد:\n${note.trim()}` : "",
      `برای مشاهدهٔ جزئیات این امتیاز و روند پیشرفتتان، به حساب خود سر بزنید:\n${url.href}`,
      "آکادمی Prograin",
    ]
      .filter(Boolean)
      .join("\n\n"),
  };
  await pRetry(
    async () => {
      const { error } = await client.emails.send(message, {
        idempotencyKey,
        signal: AbortSignal.timeout(10_000),
      });
      if (!error) return;
      const status = error.statusCode;
      const transient =
        status === 429 ||
        (status >= 500 && status <= 599) ||
        (status == null && error.name === "application_error");
      // Never propagate provider messages that may contain recipient data.
      if (!transient) throw new AbortError("Award email delivery failed.");
      throw new Error("Award email delivery temporarily unavailable.");
    },
    { retries: 2, minTimeout: 1000, maxTimeout: 2000, maxRetryTime: 35_000 },
  );
}
