import { unstable_rethrow } from "next/navigation";

// Preserve framework redirects, but keep a failed request inside the current form.
export async function submitFormAction(action, args, failure = "failed") {
  try {
    return await action(...args);
  } catch (error) {
    unstable_rethrow(error);
    return failure;
  }
}
