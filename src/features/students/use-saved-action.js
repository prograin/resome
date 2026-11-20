import { useActionState, useEffect } from "react";

export function useSavedAction(action, onSaved) {
  const state = useActionState(action, null);
  const [status] = state;
  useEffect(() => {
    if (status === "saved") onSaved?.();
  }, [status, onSaved]);
  return state;
}
