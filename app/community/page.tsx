import { PageShell } from "@/components/PageShell";
import { CommunitySection } from "@/components/CommunitySection";

export default function CommunityPage() {
  return (
    <PageShell
      eyebrow="Community"
      title="Join the drama"
      subtitle="2.4 million viewers arguing about plot twists, favorite CEOs, and whether he deserved her."
    >
      <div className="mb-8 flex -space-x-3">
        {[
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
        ].map((src) => (
          <img key={src} src={src} alt="" className="h-12 w-12 rounded-full object-cover ring-2 ring-white" />
        ))}
        <span className="grid h-12 w-12 place-items-center rounded-full bg-[#111] text-xs font-semibold text-white ring-2 ring-white">
          2.4M
        </span>
      </div>
      <CommunitySection flush />
    </PageShell>
  );
}
