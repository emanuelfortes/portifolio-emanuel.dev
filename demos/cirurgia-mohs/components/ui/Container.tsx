import type { ElementType, HTMLAttributes, ReactNode } from "react";

/** Largura máxima 1200px; 64px de respiro lateral no desktop, 24px no celular (docs/HANDOFF.md §6). */
export default function Container({
  children,
  className = "",
  as: Tag = "div",
  ...rest
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
} & HTMLAttributes<HTMLElement>) {
  return (
    <Tag className={`mx-auto w-full max-w-[1200px] px-6 md:px-16 ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
