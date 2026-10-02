export type UmamiEventData = Record<string, string | number | boolean>;

declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: UmamiEventData) => void;
    };
  }
}

const pending: { event: string; data: UmamiEventData; expires: number }[] = [];
let retry: ReturnType<typeof setTimeout> | undefined;

function send(event: string, data: UmamiEventData) {
  if (!window.umami) return false;
  try {
    // Analytics must never interrupt a download, navigation or form submission.
    Promise.resolve(window.umami.track(event, data)).catch(() => {});
    return true;
  } catch {
    return false;
  }
}

export function flushUmamiEvents() {
  if (retry !== undefined) clearTimeout(retry);
  retry = undefined;
  for (let index = 0; index < pending.length;) {
    const item = pending[index];
    if (item.expires < Date.now() || send(item.event, item.data)) pending.splice(index, 1);
    else index++;
  }
  if (pending.length) retry = setTimeout(flushUmamiEvents, 300);
}

/** True means accepted (sent or queued), so view observers can deduplicate. */
export function trackUmamiEvent(event: string, data?: UmamiEventData) {
  if (typeof window === 'undefined') return false;
  const payload = {
    ...data,
    locale: data?.locale ?? document.documentElement.lang,
    path: window.location.pathname,
  };
  if (send(event, payload)) return true;
  // Memory only; bounded lifetime and size when the tracker is blocked.
  if (pending.length >= 100) return false;
  pending.push({ event, data: payload, expires: Date.now() + 30_000 });
  if (retry === undefined) retry = setTimeout(flushUmamiEvents, 300);
  return true;
}
