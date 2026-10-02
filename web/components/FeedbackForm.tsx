'use client';

import { useRef, useState } from 'react';
import {
  AlertTriangle,
  Bug,
  Check,
  ImagePlus,
  Lightbulb,
  MessageCircle,
  Send,
  X,
} from 'lucide-react';
import { product } from '@/content/product';
import { translate, type MessageKey } from '@/content/i18n';
import type { Locale } from '@/content/locales';
import { trackUmamiEvent } from '@/lib/umami';

const maximumMessageLength = 4000;
const maximumAttachmentSize = 3 * 1024 * 1024;
const formEndpoint = process.env.NEXT_PUBLIC_DESKUTILS_FEEDBACK_FORM_ENDPOINT?.trim();

type FeedbackKind = 'bug' | 'feedback' | 'idea';
type FormStatus = 'idle' | 'validating' | 'sending' | 'success' | 'error';

const feedbackKinds = [
  { id: 'bug', label: 'feedback.kind.bug', icon: Bug },
  { id: 'feedback', label: 'feedback.kind.feedback', icon: MessageCircle },
  { id: 'idea', label: 'feedback.kind.idea', icon: Lightbulb },
] as const;

const messageLabels: Record<FeedbackKind, MessageKey> = {
  bug: 'feedback.message.label.bug',
  feedback: 'feedback.message.label',
  idea: 'feedback.message.label.idea',
};

function validEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function FeedbackForm({
  locale,
  onKindChange,
}: {
  locale: Locale;
  onKindChange?: (kind: FeedbackKind) => void;
}) {
  const t = translate.bind(null, locale);
  const [kind, setKind] = useState<FeedbackKind>('feedback');

  function selectKind(next: FeedbackKind) {
    setKind(next);
    onKindChange?.(next);
  }
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentError, setAttachmentError] = useState('');
  const [formError, setFormError] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const started = useRef(false);
  const attachmentInput = useRef<HTMLInputElement>(null);

  const canSubmit = Boolean(formEndpoint) && !attachmentError && status !== 'sending';

  function trackStart() {
    if (started.current) return;
    started.current = true;
    trackUmamiEvent('feedback_start', { locale });
  }

  function resetForm() {
    setKind('feedback');
    setMessage('');
    setEmail('');
    setAttachment(null);
    setAttachmentError('');
    setFormError('');
    setStatus('idle');
    started.current = false;
    onKindChange?.('feedback');
    if (attachmentInput.current) attachmentInput.current.value = '';
  }

  function changeAttachment(file: File | null) {
    setAttachment(null);
    setAttachmentError('');
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setAttachmentError(t('feedback.error.imageType'));
      return;
    }
    if (file.size > maximumAttachmentSize) {
      setAttachmentError(t('feedback.error.imageSize'));
      return;
    }
    setAttachment(file);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError('');
    setStatus('validating');

    const form = new FormData(event.currentTarget);
    if (String(form.get('website') ?? '').trim()) {
      setStatus('success');
      return;
    }
    if (!formEndpoint) {
      setFormError(t('feedback.error.unavailable'));
      setStatus('error');
      return;
    }
    if (!message.trim()) {
      setFormError(t('feedback.error.message'));
      setStatus('error');
      return;
    }
    if (!validEmail(email.trim())) {
      setFormError(t('feedback.error.email'));
      setStatus('error');
      return;
    }
    if (attachmentError) {
      setStatus('error');
      return;
    }

    form.set('feedback_type', kind);
    form.set('message', message.trim());
    form.set('email', email.trim());
    form.set('locale', locale);
    form.set('source', 'DeskUtils website');
    setStatus('sending');
    trackUmamiEvent('feedback_submit', { kind, locale });

    try {
      const response = await fetch(formEndpoint, {
        method: 'POST',
        body: form,
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error('Feedback submission failed');
      setStatus('success');
      trackUmamiEvent('feedback_success', { kind, locale });
    } catch {
      setStatus('error');
      setFormError(t('feedback.error.submit'));
      trackUmamiEvent('feedback_error', { kind, locale });
    }
  }

  if (status === 'success') {
    return (
      <section
        className="flex flex-col items-start gap-4 rounded-[28px] bg-white p-10 shadow-[0_0_0_1px_#e6eaf2,0_30px_60px_-30px_rgba(10,30,110,0.25)]"
        role="status"
      >
        <span className="grid h-14 w-14 place-items-center rounded-full bg-[#eaf7ee] text-success">
          <Check size={30} aria-hidden="true" />
        </span>
        <h2 className="text-[28px] font-bold">{t('feedback.success.title')}</h2>
        <p className="text-[16px] leading-[1.55] text-muted">{t('feedback.success.body')}</p>
        <button
          type="button"
          onClick={resetForm}
          className="min-h-[44px] text-[15.5px] font-semibold text-primary hover:text-[#0b3bc0]"
        >
          {t('feedback.success.again')}
        </button>
      </section>
    );
  }

  return (
    <form
      onSubmit={submit}
      onFocus={trackStart}
      noValidate
      aria-busy={status === 'sending'}
      className="flex flex-col gap-7 rounded-[28px] bg-white p-8 shadow-[0_0_0_1px_#e6eaf2,0_30px_60px_-30px_rgba(10,30,110,0.25)] dt:p-10"
    >
      <input
        className="absolute h-px w-px overflow-hidden [clip-path:inset(50%)]"
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-3 text-[15px] font-semibold">{t('feedback.kind.label')}</legend>
        <div role="group" className="flex gap-3">
          {feedbackKinds.map(({ id, label, icon: Icon }) => {
            const active = kind === id;
            return (
              <button
                key={id}
                type="button"
                aria-pressed={active}
                className={`flex h-[82px] flex-1 flex-col items-center justify-center gap-1 rounded-[16px] text-[15.5px] font-semibold transition-all ${
                  active
                    ? 'translate-y-[3px] bg-primary text-white shadow-[0_2px_0_#0b3bc0,0_10px_20px_-8px_rgba(20,80,245,0.6)]'
                    : 'bg-white text-base-content shadow-[0_0_0_1px_#dfe4ee,0_4px_0_#dfe4ee] hover:shadow-[0_0_0_1px_#cfdcff,0_4px_0_#cfdcff]'
                }`}
                onClick={() => selectKind(id)}
              >
                <Icon size={24} strokeWidth={1.8} aria-hidden="true" />
                <span>{t(label)}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between">
          <label htmlFor="feedback-message" className="text-[15px] font-semibold">
            {t(messageLabels[kind])}
          </label>
          <span className="text-[13px] text-muted">
            {message.length}/{maximumMessageLength}
          </span>
        </div>
        <textarea
          id="feedback-message"
          name="message"
          value={message}
          onChange={(event) => setMessage(event.target.value.slice(0, maximumMessageLength))}
          maxLength={maximumMessageLength}
          placeholder={t('feedback.message.placeholder')}
          required
          aria-describedby="feedback-message-count"
          className="min-h-[180px] resize-y rounded-[14px] border-[1.5px] border-[#d6dce8] p-4 text-[16px] leading-[1.5] outline-none focus:border-primary focus:shadow-[0_0_0_4px_rgba(20,80,245,0.15)]"
        />
        <span id="feedback-message-count" className="sr-only">
          {message.length}/{maximumMessageLength}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-5 dt:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="feedback-email" className="text-[15px] font-semibold">
            {t('feedback.email.label')}
          </label>
          <input
            id="feedback-email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
            className="h-[50px] rounded-[12px] border-[1.5px] border-[#d6dce8] px-3.5 text-[16px] outline-none focus:border-primary focus:shadow-[0_0_0_4px_rgba(20,80,245,0.15)]"
          />
          <span className="text-[13.5px] leading-[1.45] text-muted">
            {t('feedback.email.note')}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-[15px] font-semibold">{t('feedback.attachment.add')}</span>
          <input
            ref={attachmentInput}
            id="feedback-attachment"
            className="sr-only"
            type="file"
            name="attachment"
            accept="image/*"
            onChange={(event) => changeAttachment(event.target.files?.[0] ?? null)}
          />
          <label
            htmlFor="feedback-attachment"
            className={`flex h-[50px] cursor-pointer items-center gap-2.5 rounded-[12px] border-[1.5px] border-dashed px-3.5 text-[14.5px] ${
              attachment
                ? 'border-primary bg-[#f3f6ff] text-base-content'
                : 'border-[#c3cde0] text-muted'
            }`}
          >
            <ImagePlus size={20} aria-hidden="true" className="text-primary" />
            <span className="flex-1 truncate">
              {attachment ? attachment.name : t('feedback.attachment.choose')}
            </span>
            {attachment && (
              <button
                type="button"
                className="flex items-center gap-1 text-[13px] font-semibold text-primary"
                onClick={(event) => {
                  event.preventDefault();
                  changeAttachment(null);
                  if (attachmentInput.current) attachmentInput.current.value = '';
                }}
              >
                <X size={14} aria-hidden="true" />
                {t('feedback.attachment.remove')}
              </button>
            )}
          </label>
          <span className="text-[13.5px] leading-[1.45] text-muted">
            {t('feedback.attachment.dropHint')}
          </span>
        </div>
      </div>

      {attachmentError && (
        <p role="alert" className="text-[14px] text-error">
          {attachmentError}
        </p>
      )}

      {!formEndpoint && (
        <p className="text-sm text-muted">
          {t('feedback.unavailable')}{' '}
          <a
            href={`mailto:${product.supportEmail}`}
            className="text-primary underline underline-offset-[3px]"
          >
            {product.supportEmail}
          </a>
          .
        </p>
      )}

      {formError && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-[14px] bg-[#fdecec] px-4 py-3.5 text-[14.5px] leading-[1.5] text-[#8a1c1c]"
        >
          <AlertTriangle size={20} aria-hidden="true" className="mt-0.5 flex-none" />
          <span>
            {formError}{' '}
            <a href={`mailto:${product.supportEmail}`} className="underline">
              {product.supportEmail}
            </a>
          </span>
        </div>
      )}

      <div className="flex flex-col gap-4 dt:flex-row dt:items-center">
        <button
          type="submit"
          disabled={!canSubmit}
          className="flex h-[54px] items-center justify-center gap-2.5 rounded-[13px] bg-primary px-7 text-[17px] font-semibold text-white shadow-[0_10px_24px_-8px_rgba(20,80,245,0.6)] transition-colors hover:bg-[#0b3bc0] disabled:cursor-not-allowed disabled:bg-[#6b8ef7]"
        >
          {status === 'sending' && (
            <span
              className="h-[18px] w-[18px] animate-spin rounded-full border-[2.5px] border-white/40 border-t-white"
              aria-hidden="true"
            />
          )}
          {status !== 'sending' && <Send size={17} aria-hidden="true" />}
          {status === 'sending' ? t('feedback.submit.sending') : t('feedback.submit')}
        </button>
        <span className="flex-1 text-[14px] text-muted">{t('feedback.privacy')}</span>
      </div>
    </form>
  );
}
