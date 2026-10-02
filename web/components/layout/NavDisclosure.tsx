'use client';

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react';

const focusableSelector =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Focusable, rendered, and reachable — not nested inside a closed disclosure.
 * A nested <details> can force its content visible with `display`, so DOM/box
 * checks alone are not enough.
 */
function isReachable(node: HTMLElement, root: HTMLElement) {
  const style = getComputedStyle(node);
  if (style.visibility === 'hidden' || style.display === 'none') return false;
  let parent = node.parentElement;
  while (parent && parent !== root) {
    if (parent instanceof HTMLDetailsElement && !parent.open) return false;
    parent = parent.parentElement;
  }
  return true;
}

/**
 * Accessible disclosure built on native <details> so navigation still works
 * without JavaScript. Adds Escape-to-close, optional focus trapping while open,
 * focus restoration to the trigger, aria-expanded/aria-controls, outside-click
 * close and close-on-link-selection.
 */
export function NavDisclosure({
  summary,
  className,
  summaryAriaLabel,
  summaryClassName,
  panelClassName,
  panelLabel,
  trapFocus = false,
  children,
}: {
  summary: ReactNode;
  className?: string;
  summaryAriaLabel?: string;
  summaryClassName: string;
  panelClassName: string;
  panelLabel?: string;
  trapFocus?: boolean;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDetailsElement>(null);
  const [open, setOpen] = useState(false);
  const baseId = useId();
  const triggerId = `${baseId}-trigger`;
  const panelId = `${baseId}-panel`;

  const close = useCallback((restoreFocus: boolean) => {
    const element = ref.current;
    if (!element) return;
    element.open = false;
    setOpen(false);
    if (restoreFocus) element.querySelector('summary')?.focus();
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const onPointerDown = (event: PointerEvent) => {
      if (element.open && !element.contains(event.target as Node)) close(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [close]);

  function handleToggle() {
    setOpen(Boolean(ref.current?.open));
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDetailsElement>) {
    const element = ref.current;
    if (!element?.open) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      close(true);
      return;
    }

    if (event.key === 'Tab' && trapFocus) {
      const summaryNode = element.querySelector<HTMLElement>('summary');
      const panelNodes = Array.from(element.querySelectorAll<HTMLElement>(focusableSelector))
        // Ignore nodes hidden inside nested closed disclosures (e.g. language menu).
        .filter((node) => node !== summaryNode && isReachable(node, element));
      const nodes = summaryNode ? [summaryNode, ...panelNodes] : panelNodes;
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  function handleClick(event: React.MouseEvent<HTMLDetailsElement>) {
    if ((event.target as HTMLElement).closest('a')) close(false);
  }

  return (
    <details
      ref={ref}
      className={className}
      onToggle={handleToggle}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
    >
      <summary
        id={triggerId}
        aria-label={summaryAriaLabel}
        aria-controls={panelId}
        aria-expanded={open}
        className={summaryClassName}
      >
        {summary}
      </summary>
      <div id={panelId} className={panelClassName} aria-label={panelLabel}>
        {children}
      </div>
    </details>
  );
}
