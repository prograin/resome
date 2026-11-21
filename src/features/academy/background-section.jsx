import { useInView } from "react-intersection-observer";

export function BackgroundSection({ className, children, ...props }) {
  const { ref, inView } = useInView({
    rootMargin: "300px",
    triggerOnce: true,
    fallbackInView: true,
  });
  return (
    <section
      {...props}
      ref={ref}
      data-defer-background
      className={`${className} ${inView ? "is-bg-ready" : ""}`}
    >
      {children}
    </section>
  );
}
