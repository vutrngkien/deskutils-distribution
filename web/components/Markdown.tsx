import type { ReactNode } from 'react';

/**
 * Dependency-free, safe Markdown renderer for GitHub release notes.
 *
 * It builds React nodes from plain text (so any embedded HTML is escaped by
 * React) and only turns a small, well-understood subset into elements:
 * ATX headings, unordered/ordered lists, paragraphs, `**bold**`, `` `code` ``
 * and links. Link targets must be http(s) or mailto, otherwise the URL is
 * dropped and only the label is shown.
 */

const SAFE_URL = /^(https?:\/\/|mailto:)/i;
const INLINE = /(\*\*([^*\n]+)\*\*)|(`([^`\n]+)`)|(\[([^\]\n]+)\]\(([^)\n]+)\))/g;

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  let index = 0;
  let match: RegExpExecArray | null;
  INLINE.lastIndex = 0;
  while ((match = INLINE.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const key = `${keyPrefix}-i${index++}`;
    if (match[2] !== undefined) {
      nodes.push(
        <strong key={key} className="font-semibold text-base-content">
          {match[2]}
        </strong>,
      );
    } else if (match[4] !== undefined) {
      nodes.push(
        <code key={key} className="rounded bg-base-200 px-1.5 py-0.5 font-mono text-[0.9em]">
          {match[4]}
        </code>,
      );
    } else if (match[6] !== undefined) {
      const url = match[7].trim();
      if (SAFE_URL.test(url)) {
        nodes.push(
          <a
            key={key}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-[3px]"
          >
            {match[6]}
          </a>,
        );
      } else {
        nodes.push(match[6]);
      }
    }
    last = INLINE.lastIndex;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function headingClass(level: number) {
  if (level <= 3) return 'text-[17px] font-semibold mt-6 first:mt-0';
  return 'text-[15px] font-semibold mt-5 first:mt-0';
}

/** Render release-note Markdown into safe React nodes. */
export function Markdown({ text }: { text: string }) {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const blocks: ReactNode[] = [];
  let key = 0;
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i += 1;
      continue;
    }

    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) {
      const level = Math.min(3 + heading[1].length - 1, 6);
      const Tag = `h${level}` as 'h3';
      blocks.push(
        <Tag key={`b${key++}`} className={headingClass(level)}>
          {renderInline(heading[2], `b${key}`)}
        </Tag>,
      );
      i += 1;
      continue;
    }

    // List items may be indented (nested lists). Indentation is flattened into
    // a single list so a nested line can never fail to be consumed.
    const unordered = /^\s*[-*]\s+(.*)$/.exec(line);
    const ordered = /^\s*\d+\.\s+(.*)$/.exec(line);
    if (unordered || ordered) {
      const pattern = unordered ? /^\s*[-*]\s+(.*)$/ : /^\s*\d+\.\s+(.*)$/;
      const items: ReactNode[] = [];
      while (i < lines.length) {
        const item = pattern.exec(lines[i]);
        if (!item) break;
        items.push(<li key={`l${key++}`}>{renderInline(item[1], `l${key}`)}</li>);
        i += 1;
      }
      const List = unordered ? 'ul' : 'ol';
      blocks.push(
        <List
          key={`b${key++}`}
          className={unordered ? 'ml-5 list-disc space-y-1.5' : 'ml-5 list-decimal space-y-1.5'}
        >
          {items}
        </List>,
      );
      continue;
    }

    // Paragraph: gather consecutive plain lines.
    const paragraph: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#{1,6})\s|^\s*[-*]\s|^\s*\d+\.\s/.test(lines[i])
    ) {
      paragraph.push(lines[i].trim());
      i += 1;
    }
    // Guarantee forward progress: an unmatched line is still consumed so the
    // outer loop can never spin forever.
    if (paragraph.length === 0) {
      paragraph.push(line.trim());
      i += 1;
    }
    blocks.push(
      <p key={`b${key++}`} className="leading-[1.6]">
        {renderInline(paragraph.join(' '), `p${key}`)}
      </p>,
    );
  }

  return <div className="flex flex-col gap-3 text-[15px] text-muted">{blocks}</div>;
}
