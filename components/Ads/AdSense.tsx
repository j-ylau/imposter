'use client';

import { useEffect, useRef } from 'react';

// ============================================================================
// CONFIGURE YOUR AD SLOTS HERE
// Go to Google AdSense → Ads → By ad unit → Create new ad unit
// Then paste the slot IDs below.
// ============================================================================
const AD_SLOTS: Record<string, string> = {
  // Home page
  HOME_MID: '',     // Create a "Display ad" unit in AdSense for between CTA and themes
  HOME_BOTTOM: '',  // Create a "Display ad" unit for bottom of home page

  // Game results page
  RESULTS_TOP: '',    // Create a "Display ad" unit for top of results
  RESULTS_BOTTOM: '', // Create a "Display ad" unit for bottom of results

  // Lobby
  LOBBY_BOTTOM: '',   // Create a "Display ad" unit for lobby page

  // Role reveal (interstitial)
  ROLE_INTERSTITIAL: '', // Create a "Display ad" unit for role reveal
};

interface AdSenseProps {
  /** Either a key from AD_SLOTS above, or a raw AdSense slot ID */
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
  responsive?: boolean;
  className?: string;
}

export function AdSense({
  slot,
  format = 'auto',
  responsive = true,
  className = '',
}: AdSenseProps) {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  // Resolve slot: check if it's a named key, otherwise use as raw ID
  const resolvedSlot = AD_SLOTS[slot] || slot;

  // Don't render if slot is empty, a placeholder, or not a numeric string
  const isValidSlot = resolvedSlot && /^\d+$/.test(resolvedSlot);

  useEffect(() => {
    if (!isValidSlot || pushed.current) return;
    try {
      // @ts-expect-error - adsbygoogle is injected by Google Ads
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // Silently fail - ad blockers will cause this
    }
  }, [isValidSlot]);

  // If no valid slot configured, render nothing (no broken ad placeholders)
  if (!isValidSlot) return null;

  return (
    <div className={className}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-4975735342482892"
        data-ad-slot={resolvedSlot}
        data-ad-format={format}
        data-full-width-responsive={responsive.toString()}
      />
    </div>
  );
}
