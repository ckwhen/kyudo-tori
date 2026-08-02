import { ComponentPropsWithoutRef, ReactNode } from "react";

type Props = ComponentPropsWithoutRef<"button"> & {
  children: ReactNode;
};

export default function Button({
  children,
  className = "",
  type = "button",
  ...props
}: Props) {
  return (
    <button
      type={type}
      className={`
        px-3 min-h-9.5 rounded-sm
        bg-white border border-ink/10 text-ink/80 text-sm font-medium shadow-2xs
        transition-all duration-200 cursor-pointer select-none
        hover:border-moss/40 hover:text-moss
        active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
