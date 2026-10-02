const windows = [
  {
    name: 'Code — main.swift',
    bg: '#1e2230',
    cols: '1fr 3fr',
    a: '#2b3145',
    b: '#323a52',
    icon: '#5b6cff',
    ink: 'rgba(255,255,255,0.7)',
  },
  {
    name: 'Browser — Docs',
    bg: '#f6f7fb',
    cols: '1fr',
    a: '#dfe5f5',
    b: '#e9edf7',
    icon: '#1478f5',
    ink: '#ffffff',
    selected: true,
  },
  {
    name: 'Design — Landing',
    bg: '#eef0f4',
    cols: '3fr 1fr',
    a: '#c9d4f7',
    b: '#dde2ee',
    icon: '#f25c9b',
    ink: 'rgba(255,255,255,0.7)',
  },
  {
    name: 'Notes',
    bg: '#fffbea',
    cols: '1fr 2fr',
    a: '#f6edc4',
    b: '#fbf4d8',
    icon: '#ffc83d',
    ink: 'rgba(255,255,255,0.7)',
  },
  {
    name: 'Terminal',
    bg: '#14161d',
    cols: '1fr',
    a: '#1f232d',
    b: '#1f232d',
    icon: '#2fb350',
    ink: 'rgba(255,255,255,0.7)',
  },
];

/** Temporary visual: Window Switcher thumbnails (ported from DUWindowSwitcher). */
export function WindowSwitcher({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`flex w-[900px] gap-4 rounded-[24px] bg-[#1e2234]/72 p-5 shadow-[0_0_0_0.5px_rgba(255,255,255,0.18),0_30px_60px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl ${className}`}
    >
      {windows.map((win) => (
        <div key={win.name} className="flex min-w-0 flex-1 flex-col items-center gap-2.5">
          <div
            className={`flex h-[118px] w-full flex-col overflow-hidden rounded-[10px] ${
              win.selected
                ? 'shadow-[0_0_0_3px_#4d8bff]'
                : 'shadow-[0_0_0_0.5px_rgba(255,255,255,0.15)]'
            }`}
            style={{ background: win.bg }}
          >
            <div className="flex h-3.5 items-center gap-1 bg-white/50 px-[7px]">
              <span className="h-[5px] w-[5px] rounded-full bg-[#ff5f57]" />
              <span className="h-[5px] w-[5px] rounded-full bg-[#febc2e]" />
              <span className="h-[5px] w-[5px] rounded-full bg-[#28c840]" />
            </div>
            <div className="grid flex-1 gap-1.5 p-2" style={{ gridTemplateColumns: win.cols }}>
              <span className="rounded" style={{ background: win.a }} />
              <span className="rounded" style={{ background: win.b }} />
            </div>
          </div>
          <div
            className="flex items-center gap-1.5 text-[12px] font-medium"
            style={{ color: win.ink }}
          >
            <span className="h-4 w-4 rounded" style={{ background: win.icon }} />
            <span className="truncate">{win.name}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
