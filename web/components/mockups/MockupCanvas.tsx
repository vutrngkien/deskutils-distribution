import type { ReactNode } from 'react';

/** Keep temporary app UI on its original artboard; SVG scales text and geometry together. */
export function MockupCanvas({
  width,
  height,
  children,
  className = '',
}: {
  width: number;
  height: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{ aspectRatio: `${width} / ${height}` }}
      data-mockup-canvas
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="block h-full w-full overflow-visible"
        focusable="false"
      >
        <foreignObject width={width} height={height} style={{ overflow: 'visible' }}>
          <div
            style={{ width, height, fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}
          >
            {children}
          </div>
        </foreignObject>
      </svg>
    </div>
  );
}
