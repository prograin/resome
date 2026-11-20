import { z } from "zod";
import { formInteger, optionalText } from "./forms.js";

export const goalInput = z.object({
  title: z.string().trim().min(1).max(160),
  description: optionalText(1000),
  priority: formInteger(1, 3),
  percent: formInteger(0, 100),
});
