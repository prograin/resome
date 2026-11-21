import { useActionState, useEffect, useRef } from "react";
import { submitFormAction } from "./submit-form-action";

export function useSavedAction(action, onSaved) {
  const result = useRef(null);
  const state = useActionState(async (...args) => {
    result.current = null;
    result.current = await submitFormAction(action, args);
    return result.current;
  }, null);
  const [status] = state;
  useEffect(() => {
    if (status === "saved") onSaved?.();
  }, [status, onSaved]);
  return [
    ...state,
    {
      "aria-busy": state[2],
      onReset(event) {
        if (result.current !== "saved") event.preventDefault();
      },
    },
  ];
}
