import { createDatabase } from "../src/lib/db/client.js";
import { drainNotificationDeliveries } from "../src/lib/notifications/drain-deliveries.js";

const { db, pool } = createDatabase();
try {
  console.log(JSON.stringify(await drainNotificationDeliveries(db)));
} catch (error) {
  console.error(
    "Notification delivery failed",
    error.cause?.code ?? error.code ?? "DELIVERY_FAILED",
  );
  process.exitCode = 1;
} finally {
  await pool.end();
}
