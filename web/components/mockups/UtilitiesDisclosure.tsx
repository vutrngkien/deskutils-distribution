'use client';
import { useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
export function UtilitiesDisclosure({
  names,
  showLabel,
  hideLabel,
  children,
}: {
  names: string[];
  showLabel: string;
  hideLabel: string;
  children: ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="home-utilities-content" data-expanded={expanded}>
      <div className="home-utility-names">
        {names.map((name) => (
          <span key={name}>{name}</span>
        ))}
      </div>
      <div id="home-utility-cards" className="home-utilities-grid" data-testid="utility-grid">
        {children}
      </div>
      <button
        className="home-utility-toggle"
        type="button"
        aria-expanded={expanded}
        aria-controls="home-utility-cards"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? hideLabel : showLabel}
        <ChevronDown size={19} className={expanded ? 'rotate-180' : ''} />
      </button>
    </div>
  );
}
