import type { ElementType, ReactNode } from 'react';

/** Shared bordered surface used by the Install and Support pages. */
export function Panel({
  as,
  className = '',
  children,
  id,
  trackingSection,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  id?: string;
  trackingSection?: string;
}) {
  const Tag = (as ?? 'div') as ElementType;
  return (
    <Tag
      id={id}
      data-umami-section={trackingSection}
      className={`rounded-[24px] border border-line bg-white shadow-[0_16px_42px_rgba(29,32,40,0.06)] ${className}`}
    >
      {children}
    </Tag>
  );
}
