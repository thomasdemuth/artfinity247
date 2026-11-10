// Server-only: the artist's plan for Studio pages.
import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { isProActive } from "@/lib/plans";
import { settleReferralsSoon } from "@/lib/referrals";

// Asked for by the Studio layout and by most pages under it: once per page load (React's request cache).
export const getArtistPlan = cache(async (artistId: string) => {
  // Unlock referral months that came due (throttled; lib/referrals.ts).
  await settleReferralsSoon(artistId);
  const a = await prisma.artist.findUnique({ where: { id: artistId }, select: { plan: true, proUntil: true } });
  return { plan: a?.plan ?? "FREE", proUntil: a?.proUntil ?? null, active: isProActive(a) };
});

export type ArtistPlan = Awaited<ReturnType<typeof getArtistPlan>>;
