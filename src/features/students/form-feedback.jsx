export function FormFeedback({ status, copy, hideSaved = false, className, id }) {
  if (!status || (hideSaved && status === "saved")) return null;
  return (
    <p
      id={id}
      className={className}
      data-status={status}
      role={status === "saved" || status === "sent" ? "status" : "alert"}
    >
      {copy[status]}
    </p>
  );
}
