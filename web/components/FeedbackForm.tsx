'use client';

import { useRef, useState } from 'react';
import { Bug, Lightbulb, MessageCircle, Paperclip, Send } from 'lucide-react';
import { product } from '@/content/product';
import { translate } from '@/content/i18n';
import type { Locale } from '@/content/locales';
import { trackUmamiEvent } from '@/lib/umami';
import s from './FeedbackForm.module.css';

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

function validEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function FeedbackForm({ locale }: { locale: Locale }) {
  const t = translate.bind(null, locale);
  const [kind, setKind] = useState<FeedbackKind>('feedback');
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
      <section className={s.success} aria-labelledby="feedback-success-title" role="status">
        <span className={s.successMark} aria-hidden="true">
          ✓
        </span>
        <h2 id="feedback-success-title">{t('feedback.success.title')}</h2>
        <p>{t('feedback.success.body')}</p>
        <button type="button" className={s.secondaryButton} onClick={resetForm}>
          {t('feedback.success.again')}
        </button>
      </section>
    );
  }

  return (
    <form
      className={s.form}
      onSubmit={submit}
      onFocus={trackStart}
      noValidate
      aria-busy={status === 'sending'}
    >
      <input
        className={s.honeypot}
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <fieldset className={s.kindPicker}>
        <legend className={s.visuallyHidden}>{t('feedback.kind.label')}</legend>
        {feedbackKinds.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className={`${s.kind} ${kind === id ? s.kindActive : ''}`}
            aria-pressed={kind === id}
            onClick={() => setKind(id)}
          >
            <span className={s.keycap} aria-hidden="true">
              <Icon />
            </span>
            <span>{t(label)}</span>
          </button>
        ))}
      </fieldset>

      <div className={s.field}>
        <label htmlFor="feedback-message">{t('feedback.message.label')}</label>
        <textarea
          id="feedback-message"
          name="message"
          value={message}
          onChange={(event) => setMessage(event.target.value.slice(0, maximumMessageLength))}
          maxLength={maximumMessageLength}
          placeholder={t('feedback.message.placeholder')}
          required
          aria-describedby="feedback-message-count"
        />
        <span id="feedback-message-count" className={s.counter}>
          {message.length}/{maximumMessageLength}
        </span>
      </div>

      <div className={s.field}>
        <label htmlFor="feedback-email">{t('feedback.email.label')}</label>
        <input
          id="feedback-email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={t('feedback.email.placeholder')}
          autoComplete="email"
          required
        />
      </div>

      <div className={s.attachment}>
        <input
          ref={attachmentInput}
          id="feedback-attachment"
          className={s.fileInput}
          type="file"
          name="attachment"
          accept="image/*"
          onChange={(event) => changeAttachment(event.target.files?.[0] ?? null)}
        />
        <label className={s.attachButton} htmlFor="feedback-attachment">
          <Paperclip aria-hidden="true" size={16} />
          {attachment ? t('feedback.attachment.change') : t('feedback.attachment.add')}
        </label>
        <span className={s.attachmentHint}>{t('feedback.attachment.hint')}</span>
        {attachment && <span className={s.attachmentName}>{attachment.name}</span>}
        {attachmentError && (
          <p className={s.fieldError} role="alert">
            {attachmentError}
          </p>
        )}
      </div>

      {!formEndpoint && (
        <p className={s.fallback}>
          {t('feedback.unavailable')}{' '}
          <a href={`mailto:${product.supportEmail}`}>{product.supportEmail}</a>.
        </p>
      )}
      {formError && (
        <p className={s.formError} role="alert">
          {formError}
        </p>
      )}

      <div className={s.submitRow}>
        <button className={s.submit} type="submit" disabled={!canSubmit}>
          <Send aria-hidden="true" size={16} />
          {status === 'sending' ? t('feedback.submit.sending') : t('feedback.submit')}
        </button>
        <p>{t('feedback.privacy')}</p>
      </div>
    </form>
  );
}
