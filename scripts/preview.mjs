import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import handler from "serve-handler";

const output = fileURLToPath(new URL("../out/", import.meta.url));
const port = Number(process.env.PORT || 4173);
createServer((request, response) => {
  handler(request, response, {
    public: output,
    directoryListing: false,
    trailingSlash: true,
  }).catch((error) => {
    console.error(error.message);
    response.writeHead(500).end("Unable to serve the build.");
  });
}).listen(port, "127.0.0.1", () =>
  console.log(`Next.js export available at http://127.0.0.1:${port}`),
);
