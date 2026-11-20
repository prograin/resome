"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";

const studentPath = (pathname) => /^\/academy\/students(?:\/|$)/.test(pathname);

export function SiteLink({ href, prefetch = false, children, ...props }) {
  const pathname = usePathname();
  const target = typeof href === "string" ? href.split(/[?#]/)[0] : href.pathname;
  if (studentPath(pathname) !== studentPath(target))
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  return (
    <NextLink href={href} prefetch={prefetch} {...props}>
      {children}
    </NextLink>
  );
}
