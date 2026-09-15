import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#e31c3d]">404</p>
      <h1 className="mt-3 font-[family-name:var(--font-playfair)] text-5xl font-semibold">
        This episode is missing
      </h1>
      <p className="mt-3 text-[#666]">The story you wanted isn’t on this channel. Try another plot.</p>
      <Link href="/" className="mt-6 rounded-full bg-[#111] px-6 py-3 text-sm font-semibold text-white">
        Back home
      </Link>
    </div>
  );
}
