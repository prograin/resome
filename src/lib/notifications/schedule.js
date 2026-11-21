import { after } from "next/server";
import { getStudentRuntime } from "../student-auth/server";
import { drainNotificationDeliveries } from "./drain-deliveries";

export function scheduleNotificationDeliveries() {
  after(async () => {
    try {
      await drainNotificationDeliveries(getStudentRuntime().db);
    } catch (error) {
      console.error(
        "Notification delivery batch failed",
        error.cause?.code ?? error.code ?? "DELIVERY_FAILED",
      );
    }
  });
}
