import { Button } from "../../components/ui/button";

export function PushControl({ push, copy }) {
  if (push.status === "enabled") return null;
  const explanation = ["unsupported", "denied"].includes(push.status)
    ? copy[push.status]
    : !push.available
      ? copy.unavailable
      : null;
  return (
    <div className="student-notifications__push">
      {explanation ? (
        <p>{explanation}</p>
      ) : (
        <Button
          variant="soft"
          disabled={push.busy || push.status === "loading"}
          onClick={push.toggle}
        >
          {push.busy ? copy.loading : copy.enable}
        </Button>
      )}
      {push.error && (
        <div role="alert">
          <p>{copy.pushError}</p>
          <Button variant="soft" disabled={push.busy} onClick={push.retry}>
            {copy.retry}
          </Button>
        </div>
      )}
    </div>
  );
}
