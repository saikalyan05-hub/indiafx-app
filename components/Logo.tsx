import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`focus-ring inline-flex items-end leading-none transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] ${className}`} aria-label="IndiaFX home">
      <span className="font-[family-name:var(--font-playfair)] text-[28px] sm:text-[32px] font-black tracking-tight text-[#111]">
        India
      </span>
      <span className="logo-fx font-[family-name:var(--font-playfair)] text-[28px] sm:text-[32px] font-black tracking-tight">
        FX
      </span>
    </Link>
  );
}
