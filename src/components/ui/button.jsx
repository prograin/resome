import { cva } from "class-variance-authority";

const variants = cva("ui-button", {
  variants: {
    variant: {
      primary: "ui-button--primary",
      outline: "ui-button--outline",
      soft: "ui-button--soft",
      raised: "ui-button--raised",
    },
  },
  defaultVariants: { variant: "outline" },
});

export function Button({ as: Element = "button", variant, className, ...props }) {
  return (
    <Element
      type={Element === "button" ? "button" : undefined}
      className={variants({ variant, className })}
      {...props}
    />
  );
}
