import { profileInput } from "../validation/profile.js";

export const profileFields = Object.fromEntries(
  ["firstName", "lastName", "github"].map((field) => [
    field,
    {
      type: "string",
      required: false,
      defaultValue: "",
      validator: { input: profileInput.shape[field] },
    },
  ]),
);
