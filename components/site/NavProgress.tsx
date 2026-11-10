"use client";

// A thin bar across the top of the window from the moment a link is clicked until the new page shows.
// Pages here load their data on the server, so without it a click gives no sign that anything is happening.
// It only draws the bar: it doesn't change how pages load, redirect or answer search engines.
import { Suspense, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function Bar() {
  const pathname = usePathname();
  const search = useSearchParams();
  const [on, setOn] = useState(false);
  const giveUp = useRef<ReturnType<typeof setTimeout>>();

  // the new page is on screen
  useEffect(() => {
    setOn(false);
    clearTimeout(giveUp.current);
  }, [pathname, search]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      let to: URL;
      try {
        to = new URL(a.href, location.href);
      } catch {
        return;
      }
      if (to.origin !== location.origin) return;
      // same page (or only the #hash differs): nothing loads
      if (to.pathname === location.pathname && to.search === location.search) return;
      setOn(true);
      clearTimeout(giveUp.current);
      giveUp.current = setTimeout(() => setOn(false), 12000);
    };
    // after React's own handlers, so a link that cancelled the click isn't counted
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      clearTimeout(giveUp.current);
    };
  }, []);

  if (!on) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[200] h-[3px] overflow-hidden">
      <style>{`@keyframes af-nav{0%{transform:translateX(-100%)}60%{transform:translateX(-25%)}100%{transform:translateX(-8%)}}@media (prefers-reduced-motion:reduce){.af-nav-bar{animation:none!important;transform:translateX(-30%)!important}}`}</style>
      <div className="af-nav-bar h-full w-full bg-[var(--af-scan)]" style={{ animation: "af-nav 4s cubic-bezier(.1,.7,.2,1) forwards" }} />
    </div>
  );
}

export default function NavProgress() {
  return (
    <Suspense fallback={null}>
      <Bar />
    </Suspense>
  );
}
