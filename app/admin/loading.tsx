import PaintLoader from "@/components/browse/PaintLoader";

// Shown inside the admin shell the moment a link is clicked, while the next page's data loads.
export default function Loading() {
  return <PaintLoader label="Loading…" />;
}
