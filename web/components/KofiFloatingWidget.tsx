'use client';

import Script from 'next/script';
import { product } from '@/content/product';

declare global {
  interface Window {
    kofiWidgetOverlay?: {
      draw: (handle: string, options: Record<string, string>) => void;
    };
  }
}

let initialized = false;

function initializeWidget() {
  if (initialized || !window.kofiWidgetOverlay) return;
  window.kofiWidgetOverlay.draw(new URL(product.donationURL).pathname.slice(1), {
    type: 'floating-chat',
    'floating-chat.donateButton.text': 'Support me',
    'floating-chat.donateButton.background-color': '#00b9fe',
    'floating-chat.donateButton.text-color': '#fff',
  });
  initialized = true;
}

/** Ko-fi's supplied overlay, initialized once after its script becomes available. */
export function KofiFloatingWidget() {
  return (
    <Script
      id="kofi-overlay"
      src="https://storage.ko-fi.com/cdn/scripts/overlay-widget.js"
      strategy="afterInteractive"
      onReady={initializeWidget}
    />
  );
}
