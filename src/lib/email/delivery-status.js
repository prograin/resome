import { AsyncLocalStorage } from "node:async_hooks";

// Cached auth callbacks and refreshed server actions must share the same context.
const deliveryContext = Symbol.for("prograin.email.delivery-context");
const deliveries = (globalThis[deliveryContext] ??= new AsyncLocalStorage());

// Better Auth catches transport errors. Track delivery within this request,
// so the profile never reports a successful send when the provider failed.
export async function confirmEmailDelivery(request) {
  const status = { delivered: false };
  return deliveries.run(status, async () => {
    await request();
    return status.delivered;
  });
}

export function markEmailDelivered() {
  const status = deliveries.getStore();
  if (status) status.delivered = true;
}
