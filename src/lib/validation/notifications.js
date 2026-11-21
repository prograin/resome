import { z } from "zod";
import { databaseId, studentIdInput } from "./forms.js";

export const notificationReadInput = z.union([
  z.strictObject({ id: databaseId }),
  z.strictObject({ through: databaseId }),
]);
export const notificationQueryInput = z.strictObject({
  before: z
    .string()
    .regex(/^[1-9]\d*$/)
    .pipe(z.coerce.number())
    .pipe(databaseId)
    .optional(),
});

export const pushEndpointInput = z
  .url({ protocol: /^https$/ })
  .max(2048)
  .refine((value) => {
    const url = new URL(value);
    const hosts = ["fcm.googleapis.com", "updates.push.services.mozilla.com"];
    return (
      !url.port &&
      !url.username &&
      !url.password &&
      !url.hash &&
      (hosts.includes(url.hostname) ||
        url.hostname.endsWith(".push.apple.com") ||
        url.hostname.endsWith(".notify.windows.com"))
    );
  });
const key = (bytes) =>
  z
    .string()
    .regex(/^[a-zA-Z0-9_-]+={0,2}$/)
    .max(120)
    .refine((value) => Buffer.from(value, "base64url").length === bytes);
export const pushSubscriptionInput = z.strictObject({
  endpoint: pushEndpointInput,
  expirationTime: z.number().nonnegative().nullable().optional(),
  keys: z.strictObject({
    p256dh: key(65).refine((value) => Buffer.from(value, "base64url")[0] === 4),
    auth: key(16),
  }),
});
export const pushUnsubscribeInput = z.strictObject({ endpoint: pushEndpointInput });
export const pushRegistrationInput = pushSubscriptionInput.extend({
  studentId: studentIdInput.optional(),
});
