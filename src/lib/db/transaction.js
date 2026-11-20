import pRetry from "p-retry";

const retryable = new Set(["40001", "40P01"]);

export function repeatableTransaction(db, operation, options = {}) {
  return pRetry(
    () => db.transaction(operation, { isolationLevel: "repeatable read", ...options }),
    {
      retries: 2,
      minTimeout: 50,
      maxTimeout: 250,
      randomize: true,
      shouldRetry: ({ error }) => retryable.has(error.cause?.code ?? error.code),
    },
  );
}
