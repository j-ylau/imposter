'use client';

import { useState, useSyncExternalStore } from 'react';

const BANNER_KEY = 'imposter_banner_dismissed';
const BANNER_VERSION = 'v2-new-themes'; // bump this to show a new banner

function subscribe() {
  return () => {};
}

function getSnapshot() {
  const dismissed = localStorage.getItem(BANNER_KEY);
  return dismissed !== BANNER_VERSION;
}

function getServerSnapshot() {
  return false;
}

export function UpdateBanner() {
  const shouldShow = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [visible, setVisible] = useState(true);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(BANNER_KEY, BANNER_VERSION);
  };

  if (!shouldShow || !visible) return null;

  return (
    <div className="relative z-[60] w-full bg-primary text-primary-fg text-center text-sm font-medium py-2 px-4">
      <span className="mr-1">🎉</span>
      <span className="font-bold">New update:</span>{' '}
      12 fresh themes — Fortnite, Valorant, Marvel, K-Pop, Disney & more!
      <button
        onClick={dismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-fg/70 hover:text-primary-fg transition-colors text-lg leading-none"
        aria-label="Dismiss banner"
      >
        ✕
      </button>
    </div>
  );
}
