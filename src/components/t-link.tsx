"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { usePageTransition } from "@/components/providers/transition-provider";

type TLinkProps = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

/** Link internal yang menjalankan urutan transisi halaman. */
export function TLink({ href, onClick, target, ...props }: TLinkProps) {
  const { navigate } = usePageTransition();
  return (
    <Link
      href={href}
      target={target}
      {...props}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented || event.button !== 0 || target || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        navigate(href);
      }}
    />
  );
}
