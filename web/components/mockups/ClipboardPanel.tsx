import { FileText, File, Image as ImageIcon, Pin, Search } from 'lucide-react';

const filters = [
  { icon: Pin, active: true },
  { icon: FileText, active: false },
  { icon: ImageIcon, active: false },
  { icon: File, active: false },
];

const items = [
  {
    hit: 'Brand',
    pre: '',
    post: ' palette: #1450F5 · #0F2A6B · #F5F7FB',
    app: 'Notes',
    initial: 'N',
    accent: '#e8b400',
    meta: 'Text · 41 characters',
    time: '09:12',
    pin: true,
    selected: false,
    icon: null as null | 'image' | 'pdf',
  },
  {
    hit: 'Brand',
    pre: '',
    post: ' hero — copied image',
    app: 'Design',
    initial: 'D',
    accent: '#f25c9b',
    meta: 'PNG · 1118×788 · 951 KB',
    time: '09:40',
    pin: false,
    selected: true,
    icon: 'image' as const,
  },
  {
    hit: 'brand',
    pre: '',
    post: '-guidelines.pdf',
    app: 'Finder',
    initial: 'F',
    accent: '#1478f5',
    meta: 'File · PDF · 2.4 MB',
    time: 'Yesterday',
    pin: false,
    selected: false,
    icon: 'pdf' as const,
  },
  {
    hit: 'brand',
    pre: 'Updated ',
    post: ' copy for the onboarding screens, ready for review…',
    app: 'Mail',
    initial: 'M',
    accent: '#3b82f6',
    meta: 'Text · 312 characters',
    time: 'Yesterday',
    pin: false,
    selected: false,
    icon: null as null | 'image' | 'pdf',
  },
];

/** Temporary visual: Clipboard history (ported from DUClipboard). */
export function ClipboardPanel({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`relative h-[520px] w-[840px] text-[#0b1a3a] ${className}`}>
      {/* annotate preview card */}
      <div className="absolute left-0 top-[29%] flex h-[48%] w-[40.5%] flex-col gap-2 rounded-[18px] bg-white/55 p-2.5 shadow-[0_0_0_0.5px_rgba(255,255,255,0.6),0_24px_50px_-16px_rgba(5,20,80,0.5)] backdrop-blur-xl">
        <div className="flex items-center justify-between px-1">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-black/10" />
            <span className="h-2.5 w-2.5 rounded-full bg-black/10" />
            <span className="h-2.5 w-2.5 rounded-full bg-black/10" />
          </div>
          <span className="rounded-full bg-white/70 px-2.5 py-1 text-[11px] font-semibold text-[#3a4a6b]">
            Annotate
          </span>
        </div>
        <div
          className="relative flex-1 overflow-hidden rounded-[10px]"
          style={{
            background:
              'radial-gradient(120% 90% at 85% 10%,#5fb1ff 0%,#1f6dff 35%,#2a2fd6 70%,#7a4dff 100%)',
          }}
        >
          <div className="absolute left-[5%] right-[5%] top-[7%] h-[12%] rounded-md bg-white/85" />
          <div className="absolute left-[5%] top-[23%] h-[34%] w-[30%] rounded-md bg-white/70" />
          <div className="absolute left-[39%] right-[5%] top-[23%] h-[34%] rounded-md bg-white/45" />
        </div>
      </div>

      {/* list */}
      <div className="absolute right-0 top-0 flex w-[56%] flex-col gap-3">
        <div className="flex gap-2">
          <div className="flex h-[42px] flex-1 items-center gap-2 rounded-full bg-white/90 px-3.5 shadow-[0_0_0_2px_#4d8bff]">
            <Search className="h-5 w-5 text-[#5a6a8a]" strokeWidth={1.7} />
            <span className="text-[15px]">brand</span>
            <span className="h-[18px] w-[1.5px] bg-[#1450f5]" />
          </div>
          {filters.map((filter, index) => {
            const Icon = filter.icon;
            return (
              <span
                key={index}
                className={`flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full ${
                  filter.active ? 'bg-[#1450f5] text-white' : 'bg-white/85 text-[#3a4a6b]'
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={1.7} />
              </span>
            );
          })}
        </div>

        {items.map((item, index) => (
          <div
            key={index}
            className={`flex flex-col gap-2 rounded-[18px] bg-white/90 px-3.5 py-3 ${
              item.selected ? 'shadow-[0_0_0_2px_#4d8bff]' : 'shadow-[0_0_0_0.5px_rgba(0,0,0,0.06)]'
            }`}
          >
            <div className="flex items-center gap-3">
              {item.icon === 'image' ? (
                <span
                  className="flex h-[46px] w-[68px] shrink-0 items-center justify-center rounded-lg"
                  style={{
                    background:
                      'radial-gradient(120% 90% at 85% 10%,#5fb1ff,#1f6dff 40%,#2a2fd6 75%,#7a4dff)',
                  }}
                />
              ) : item.icon === 'pdf' ? (
                <span className="flex h-[46px] w-[68px] shrink-0 items-center justify-center rounded-lg bg-[#e9eef9] text-[#d93025]">
                  <FileText className="h-6 w-6" strokeWidth={1.7} />
                </span>
              ) : null}
              <span className="flex-1 text-[15px] leading-snug">
                {item.pre}
                <span className="rounded-[3px] bg-[#ffe58a] px-0.5">{item.hit}</span>
                {item.post}
              </span>
              {item.pin ? (
                <Pin className="h-[18px] w-[18px] fill-[#1450f5] text-[#1450f5]" />
              ) : null}
            </div>
            <div className="flex items-center gap-2 text-[12px] text-[#4a5a7a]">
              <span
                className="flex h-4 w-4 items-center justify-center rounded text-[9px] font-bold text-white"
                style={{ background: item.accent }}
              >
                {item.initial}
              </span>
              <b className="font-semibold text-[#0b1a3a]">{item.app}</b>
              <span>· {item.meta}</span>
              <span className="ml-auto">{item.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
