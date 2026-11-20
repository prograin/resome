import { profileInput } from "../validation/profile.js";
import { profileLinkFields } from "../profile-links.js";

export const profileFields = Object.fromEntries(
  ["firstName", "lastName", ...profileLinkFields.map(({ name }) => name)].map((field) => [
    field,
    {
      type: "string",
      required: false,
      defaultValue: "",
      validator: { input: profileInput.shape[field] },
    },
  ]),
);
