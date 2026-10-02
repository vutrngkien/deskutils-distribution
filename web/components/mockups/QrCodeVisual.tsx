import Image from 'next/image';

/** Supplied QR code and its decoded text. */
export function QrCodeVisual() {
  return (
    <div className="flex items-center justify-center gap-6">
      <div className="rounded-[12px] bg-white p-3 shadow-[0_16px_40px_-20px_rgba(10,30,110,0.4)]">
        <Image
          src="/images/capture-text-qr.png"
          alt="QR: http://deskutils.app/"
          width={500}
          height={500}
          className="h-[152px] w-[152px]"
        />
      </div>
      <span className="text-[24px] text-primary" aria-hidden="true">
        →
      </span>
      <div className="flex w-[190px] flex-col gap-2 rounded-[14px] bg-white p-4 shadow-[0_16px_40px_-20px_rgba(10,30,110,0.4)]">
        <span className="text-[12px] font-semibold text-[#1a7f37]">QR code read</span>
        <span className="rounded-[8px] bg-[#f3f6ff] p-2 font-mono text-[12px] text-[#2b3550]">
          http://deskutils.app/
        </span>
        <span className="text-[11px] text-muted">Copied as text, not opened</span>
      </div>
    </div>
  );
}
