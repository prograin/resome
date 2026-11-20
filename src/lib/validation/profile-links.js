import { z } from "zod";
import { secureUrl } from "./urls.js";
import { formatGithubProfile } from "../github-profile.js";

const optionalLink = (schema) =>
  z
    .string()
    .trim()
    .pipe(z.union([z.literal(""), schema]))
    .default("");
const platformLink = (hosts, path) =>
  secureUrl.refine((value) => {
    const url = new URL(value);
    return (
      hosts.includes(url.hostname) &&
      !url.port &&
      !url.search &&
      !url.hash &&
      path.test(url.pathname)
    );
  });

export const profileLinksInput = z.object({
  github: z
    .string()
    .trim()
    .max(59)
    .regex(/^$|^https:\/\/github\.com\/(?=[a-z0-9-]{1,39}\/?$)[a-z0-9]+(?:-[a-z0-9]+)*\/?$/i)
    .transform(formatGithubProfile)
    .default(""),
  telegram: optionalLink(platformLink(["t.me"], /^\/[a-z0-9_]+\/?$/i)),
  linkedin: optionalLink(platformLink(["linkedin.com", "www.linkedin.com"], /^\/in\/[^/]+\/?$/)),
  website: optionalLink(secureUrl),
});
