"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "./button";
import { studentAuthPolicy } from "../../lib/student-auth/config";

export function PasswordInput({ copy, ...props }) {
  const [visible, setVisible] = useState(false);
  const VisibilityIcon = visible ? EyeOff : Eye;
  return (
    <span className="ui-password">
      <input
        {...props}
        type={visible ? "text" : "password"}
        dir="ltr"
        required
        minLength={studentAuthPolicy.password.min}
        maxLength={studentAuthPolicy.password.max}
      />
      <Button
        variant="soft"
        className="ui-password__toggle"
        aria-label={`${visible ? copy.hide : copy.show}: ${props["aria-label"]}`}
        aria-pressed={visible}
        onClick={() => setVisible(!visible)}
      >
        <VisibilityIcon aria-hidden="true" size={20} />
      </Button>
    </span>
  );
}
