import { useEffect, useState } from "react";
import { studentAuthPolicy } from "../../lib/student-auth/config";

export function useEmailCooldown() {
  const [deadline, setDeadline] = useState(0);
  const [remaining, setRemaining] = useState(0);
  useEffect(() => {
    if (!deadline) return;
    const timer = setInterval(() => {
      const seconds = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setRemaining(seconds);
      if (!seconds) clearInterval(timer);
    }, 250);
    return () => clearInterval(timer);
  }, [deadline]);
  return {
    remaining,
    start() {
      setRemaining(studentAuthPolicy.emailResendSeconds);
      setDeadline(Date.now() + studentAuthPolicy.emailResendSeconds * 1000);
    },
  };
}
