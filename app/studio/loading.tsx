import PaintLoader from "@/components/browse/PaintLoader";

// Shown inside the Studio shell the moment a link is clicked, while the next page's data loads. Without it the old
// page sat there, looking frozen, until the new one was completely ready.
export default function Loading() {
  return <PaintLoader label="Loading…" />;
}
