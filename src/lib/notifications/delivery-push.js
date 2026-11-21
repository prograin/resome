import { sendNotification } from "web-push";
import { z } from "zod";

const environment = z.object({
  VAPID_PUBLIC_KEY: z.string().min(1),
  VAPID_PRIVATE_KEY: z.string().min(1),
  VAPID_SUBJECT: z.string().min(1),
});

export async function sendDeliveryPush({ subscription, payload }) {
  const config = environment.parse(process.env);
  await sendNotification(
    {
      endpoint: subscription.endpoint,
      keys: { p256dh: subscription.p256dh, auth: subscription.auth },
    },
    JSON.stringify(payload),
    {
      TTL: 300,
      timeout: 10_000,
      vapidDetails: {
        subject: config.VAPID_SUBJECT,
        publicKey: config.VAPID_PUBLIC_KEY,
        privateKey: config.VAPID_PRIVATE_KEY,
      },
    },
  );
}
