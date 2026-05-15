import { cn } from "@/lib/utils";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary";
};

export function ButtonLink({ children, className, variant = "primary", ...props }: ButtonLinkProps) {
  return (
    <a
      className={cn(
        "inline-flex h-12 items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold transition duration-300 focus:outline-none focus:ring-2 focus:ring-plasma-cyan focus:ring-offset-2 focus:ring-offset-ink",
        variant === "primary"
          ? "bg-plasma-cyan text-ink shadow-glow hover:bg-plasma-mint"
          : "border border-line bg-white/[0.04] text-white hover:border-plasma-mint/60 hover:bg-white/[0.08]",
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
}
