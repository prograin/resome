import { z } from "zod";
import { difficultyLevels } from "../course-options.js";
import { secureUrl } from "./urls.js";

const optionalUrl = z.preprocess(
  (value) => (value == null || (typeof value === "string" && !value.trim()) ? null : value),
  secureUrl.nullable(),
);

export const courseInput = z.object({
  title: z.string().trim().min(1).max(100),
  difficulty: z.preprocess(
    (value) => (value === "" || value == null ? null : value),
    z.enum(difficultyLevels).nullable(),
  ),
  github: optionalUrl,
  playlist: optionalUrl,
  syllabus: z
    .string()
    .max(8000)
    .default("")
    .transform((value) =>
      value
        .split(/\r?\n/)
        .map((topic) => topic.trim())
        .filter(Boolean),
    )
    .pipe(z.array(z.string().max(160)).max(40)),
});

export const videoInput = z.object({
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().min(1).max(1000),
  url: secureUrl,
});
