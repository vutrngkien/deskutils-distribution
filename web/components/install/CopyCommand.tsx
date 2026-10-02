'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import type { Locale } from '@/content/locales';
import { translate } from '@/content/i18n';
import { trackUmamiEvent } from '@/lib/umami';

/** Terminal command block with a copy button that never alters the command text. */
export function CopyCommand({ command, locale }: { command: string; locale: Locale }) {
  const t = translate.bind(null, locale);
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      trackUmamiEvent('install_copy', { locale });
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      trackUmamiEvent('install_copy_error', { locale });
      setCopied(false);
    }
  }

  return (
    <div className="flex items-center gap-3 rounded-[12px] border border-line bg-base-200 px-4 py-3.5">
      <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap text-[12.5px] text-[#353b46]">
        {command}
      </code>
      <button
        type="button"
        onClick={copy}
        aria-live="polite"
        className={`flex min-h-[34px] flex-none items-center gap-1.5 rounded-[9px] px-3 text-[12.5px] font-semibold transition-colors ${
          copied ? 'bg-success text-white' : 'bg-white text-primary hover:bg-[#eaf0ff]'
        }`}
      >
        {copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
        {copied ? t('install.verify.copied') : t('install.verify.copy')}
      </button>
    </div>
  );
}
