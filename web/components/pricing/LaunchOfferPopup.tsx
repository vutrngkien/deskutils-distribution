'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, CreditCard, Tag, Laptop, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { translate } from '@/content/i18n';
import type { Locale } from '@/content/locales';
import { launchOffer, product } from '@/content/product';
import { trackUmamiEvent } from '@/lib/umami';

export const offerPopupSessionKey = 'deskutils:launch-offer:seen';
// Keep the same document from reopening the popup when storage is unavailable.
let seenInDocument = false;

export function LaunchOfferPopup({ locale }: { locale: Locale }) {
  const [visible, setVisible] = useState(false);
  const viewTracked = useRef(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const t = translate.bind(null, locale);
  const savingPercent = Math.round(
    (1 - Number(product.pricing.amount) / Number(launchOffer.regularAmount)) * 100,
  );

  useEffect(() => {
    if (!launchOffer.enabled || seenInDocument) return;
    try {
      if (sessionStorage.getItem(offerPopupSessionKey)) return;
    } catch {
      // Browser privacy settings may disable session storage.
    }

    const quickRing = document.getElementById('quickring');
    if (!quickRing) return;

    let ready = false;
    let opened = false;
    function openWhenVisible() {
      if (!ready || opened || document.visibilityState !== 'visible') return;
      opened = true;
      observer.disconnect();
      setVisible(true);
    }
    // Open once the reader reaches the Quick Ring section, rather than on a timer.
    const observer = new IntersectionObserver(
      (entries) => {
        ready = entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.1);
        openWhenVisible();
      },
      { threshold: 0.1 },
    );
    observer.observe(quickRing);
    document.addEventListener('visibilitychange', openWhenVisible);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', openWhenVisible);
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!visible || !dialog) return;
    const previousFocus = document.activeElement;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;

    dialog.showModal();
    dialog.querySelector<HTMLButtonElement>('.offer-popup-close')?.focus({ preventScroll: true });
    root.style.overflow = 'hidden';
    seenInDocument = true;
    try {
      sessionStorage.setItem(offerPopupSessionKey, 'true');
    } catch {
      // The document-level flag still prevents repeat impressions.
    }
    if (!viewTracked.current) {
      viewTracked.current = true;
      trackUmamiEvent('offer_popup_view', { locale, placement: 'offer_popup' });
    }

    return () => {
      dialog.close();
      root.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected)
        previousFocus.focus({ preventScroll: true });
    };
  }, [visible, locale]);

  function dismiss(reason: 'close' | 'later' | 'escape' | 'backdrop') {
    if (!dialogRef.current?.open) return;
    trackUmamiEvent('offer_popup_dismiss', { locale, placement: 'offer_popup', reason });
    dialogRef.current.close();
    setVisible(false);
  }

  if (!launchOffer.enabled || !visible) return null;

  return (
    <dialog
      ref={dialogRef}
      className="modal modal-middle offer-popup motion-reduce:transition-none"
      aria-labelledby="launch-offer-title"
      aria-describedby="launch-offer-description"
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return;
        const controls = event.currentTarget.querySelectorAll<HTMLElement>(
          '.modal-box button, .modal-box a[href]',
        );
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }}
      onCancel={(event) => {
        event.preventDefault();
        dismiss('escape');
      }}
    >
      <div className="modal-box offer-popup-box motion-reduce:transition-none">
        <button
          type="button"
          className="btn btn-ghost btn-circle offer-popup-close"
          aria-label={t('offerPopup.close')}
          onClick={() => dismiss('close')}
          autoFocus
        >
          <X size={20} aria-hidden="true" />
        </button>
        <div className="offer-popup-hero">
          <div className="offer-popup-copy">
            <div className="badge badge-secondary offer-popup-badge">
              <Tag size={17} aria-hidden="true" />
              {t('offerPopup.badge')}
            </div>
            <h2 id="launch-offer-title" className="offer-popup-title">
              {t('offerPopup.title')}
            </h2>
            <div className="offer-popup-price-row">
              <strong className="offer-popup-price">${product.pricing.amount}</strong>
              <div className="offer-popup-price-detail">
                <del>${launchOffer.regularAmount}</del>
                <span className="badge offer-popup-saving">
                  {t('offerPopup.saving', { percent: savingPercent })}
                </span>
              </div>
            </div>
            <p id="launch-offer-description" className="offer-popup-description">
              {t('offerPopup.description')}
            </p>
          </div>
          <img
            src="/assets/images/deskutils-pro-offer.webp"
            width={768}
            height={768}
            alt=""
            aria-hidden="true"
            className="offer-popup-art"
          />
        </div>
        <div className="offer-popup-benefits">
          <div className="card offer-popup-benefit offer-popup-benefit-payment">
            <span className="offer-popup-benefit-icon" aria-hidden="true">
              <CreditCard size={28} strokeWidth={2.2} />
            </span>
            <div>
              <h3>{t('offerPopup.lifetimeTitle')}</h3>
              <p>{t('pricing.oneTime')}</p>
            </div>
          </div>
          <div className="card offer-popup-benefit offer-popup-benefit-devices">
            <span className="offer-popup-benefit-icon" aria-hidden="true">
              <Laptop size={28} strokeWidth={2.2} />
            </span>
            <div>
              <h3>{t('offerPopup.devicesTitle', { count: product.pricing.macs })}</h3>
              <p>{t('offerPopup.devicesDescription')}</p>
            </div>
          </div>
        </div>
        <div className="offer-popup-purchase">
          <Button
            href={product.pricing.purchaseURL}
            locale={locale}
            placement="offer_popup"
            size="lg"
            className="offer-popup-cta"
          >
            {t('offerPopup.cta', { amount: product.pricing.amount })}
            <ArrowRight size={22} className="shrink-0" aria-hidden="true" />
          </Button>
          <p className="offer-popup-eligibility">
            {t('offerPopup.priceNote', { customers: launchOffer.customerLimit })}
          </p>
        </div>
        <form
          method="dialog"
          className="offer-popup-later"
          onSubmit={(event) => event.preventDefault()}
        >
          <button className="btn btn-ghost" onClick={() => dismiss('later')}>
            {t('offerPopup.later')}
          </button>
        </form>
      </div>
      <form
        method="dialog"
        className="modal-backdrop bg-neutral/50 backdrop-blur-sm"
        onSubmit={(event) => event.preventDefault()}
      >
        <button
          aria-label={t('offerPopup.close')}
          tabIndex={-1}
          onClick={() => dismiss('backdrop')}
        />
      </form>
    </dialog>
  );
}
