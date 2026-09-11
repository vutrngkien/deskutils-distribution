export type UmamiEventData = Record<string, string | number | boolean>;

declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: UmamiEventData) => void;
    };
  }
}

export function trackUmamiEvent(event: string, data?: UmamiEventData) {
  if (typeof window === 'undefined' || !window.umami) return false;
  window.umami.track(event, data);
  return true;
}
