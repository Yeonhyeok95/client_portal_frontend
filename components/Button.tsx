import Link from "next/link";

type Variant = "filled" | "outline" | "pill";
type Size = "lg" | "md" | "sm";

const sizeClasses: Record<Size, string> = {
  lg: "text-[15px] py-5 px-10",
  md: "text-sm py-4 px-9",
  sm: "text-[13px] py-[13px] px-6",
};

const variantClasses: Record<Variant, string> = {
  filled: "bg-blue text-white hover:bg-[rgb(20,140,210)] rounded-[5px]",
  outline:
    "bg-transparent text-blue border border-blue hover:bg-blue/5 rounded-[5px]",
  pill: "bg-blue text-white hover:bg-[rgb(20,140,210)] rounded-full",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 font-bold tracking-[0.2px] whitespace-nowrap transition-colors duration-200 cursor-pointer select-none";

type ButtonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
};

export default function Button({
  variant = "filled",
  size = "md",
  className = "",
  children,
  href,
  onClick,
  type = "button",
  disabled = false,
}: ButtonProps) {
  const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${
    disabled ? "opacity-50 pointer-events-none" : ""
  } ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick} aria-disabled={disabled}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
